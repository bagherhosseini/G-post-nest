import Peer from 'simple-peer';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

import { stopCam } from '../call/stopCam/stopCam.js';

import {
    myId,
    userId,
    messages,
    inCommingCall,
    callerSignal,
    outGoingCall,
    callAccepted,
    userStream,
    myStream,
    isVideoCall,
    activePeers,
    myName,
    callerName,
} from '../../signals/signals';

import { socket } from '../../../../services/lib/stocket.js';
import { apiService } from '../../../../services/index.jsx';

export function socketListener() {
    // receiveMessage message
    socket.on('receiveMessage', (data) => {
        if (data.from === userId.value) {
            messages.value = [
                ...messages.value,
                data,
            ];
        }
    });

    socket.on('inCommingCall', (data) => {
        callerName.value = data.name;
        inCommingCall.value = true;
        userId.value = data.from;
        callerSignal.value = data.signal;
        isVideoCall.value = data.isVideoCall;
    });

    socket.on("callAccepted", (data) => {
        callAccepted.value = true;
        outGoingCall.value = false;
        inCommingCall.value = false;
    });

    socket.on('callRejected', (data) => {
        stopCam(userStream.value);
        stopCam(myStream.value);
        inCommingCall.value = false;
        outGoingCall.value = false;
    });

    socket.on('callEnded', (data) => {
        stopCam(userStream.value);
        stopCam(myStream.value);
        callAccepted.value = false;
        inCommingCall.value = false;
        outGoingCall.value = false;
        userStream.value = null;
        myStream.value = null;

        window.location.reload();
    });

    const id = localStorage.getItem('id');
    myId.value = id;

    socket.emit('onlineUser', id);

    socket.on('loggedIn', (userIdFromServer) => {
        myId.value = userIdFromServer;
    });

    return () => {
        socket.off('loggedIn');
    };
}

export async function call(isVideoCallPram) {
    try {
        if (userId.value) {
            if (myStream.value) {
                stopCam(myStream.value);
            }
            isVideoCall.value = isVideoCallPram;
            const videoConstraints = isVideoCallPram ? { width: { ideal: 640 }, height: { ideal: 480 } } : false;
            const stream = await navigator.mediaDevices.getUserMedia({ video: isVideoCallPram, audio: true });
            myStream.value = stream;
            outGoingCall.value = true;

            const peer = new Peer({
                initiator: true,
                trickle: false,
                stream: stream,
            });

            peer.on("signal", (data) => {
                socket.emit("outGoingCall", {
                    from: myId.value,
                    name: myName.value,
                    to: userId.value,
                    isVideoCall: isVideoCallPram,
                    signalData: data,
                });
            });

            peer.on("stream", (stream) => {
                userStream.value = stream;
            });

            activePeers.value = [
                ...activePeers.value,
                peer,
            ];

            socket.on("callAccepted", (data) => {
                inCommingCall.value = false;
                callAccepted.value = true;
                peer.signal(data.signal);
            });

            const date = new Date();

            if (isVideoCallPram) {
                await apiService.sendMessage(userId, 'videoCall', format(date, 'yyyy-MM-dd HH:mm'), 'videoCall');
            } else {
                await apiService.sendMessage(userId, 'voiceCall', format(date, 'yyyy-MM-dd HH:mm'), 'voiceCall');
            }

        } else {
            alert('Please Enter Recipient ID call');
        }
    } catch (err) {
        toast.error('Something went wrong, please try again',
            {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            }
        );
    }
}