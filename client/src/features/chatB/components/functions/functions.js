import io from 'socket.io-client';
import Peer from 'simple-peer';

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
} from '../../signals/signals';

const socket = io(process.env.REACT_APP_SOCKET_URL);

const generateRandomId = () => {
    return Math.floor(Math.random() * 1000000);
};

export function socketListener() {
    // receiveMessage message
    socket.on('receiveMessage', (data) => {
        userId.value = parseInt(data.from);
        messages.value = [
            ...messages.value,
            data,
        ];
    });

    socket.on('inCommingCall', (data) => {
        inCommingCall.value = true;
        userId.value = parseInt(data.from);
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
        console.log('callEnded');
        stopCam(userStream.value);
        stopCam(myStream.value);
        callAccepted.value = false;
        inCommingCall.value = false;
        outGoingCall.value = false;
        userStream.value = null;
        myStream.value = null;
        console.log(' userStream.value', userStream.value);
        console.log(' myStream.value', myStream.value);
        // activePeers.value.destroy();
        window.location.reload();
    });

    // giving users id and log them in
    const randomId = generateRandomId();
    myId.value = randomId;

    // Emit the generated random ID to the server as the 'onlineUser' event
    socket.emit('onlineUser', randomId);

    // Listen for the 'loggedIn' event from the server, which will send the user ID back to the client
    socket.on('loggedIn', (userIdFromServer) => {
        myId.value = userIdFromServer;
    });

    console.log('myId', myId.value);

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
                console.log('outGoingCall in signal');
                socket.emit("outGoingCall", {
                    from: myId.value,
                    name: "test",
                    to: parseInt(userId.value),
                    isVideoCall: isVideoCallPram,
                    signalData: data,
                });
                console.log('outGoingCall after socket');
            });

            peer.on("stream", (stream) => {
                userStream.value = stream;
            });

            socket.on("callAccepted", (data) => {
                inCommingCall.value = false;
                callAccepted.value = true;
                peer.signal(data.signal);
            });
            activePeers.value = peer;
            // activePeers.current = peer;
        } else {
            alert('Please Enter Recipient ID call');
        }
    } catch (err) {
        console.log(err);
    }
}