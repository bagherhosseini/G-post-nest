import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneSlash, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import Peer from 'simple-peer';
import { toast } from 'react-toastify';

import { stopCam } from '../stopCam/stopCam';
import { socket } from '../../../../../services/lib/stocket';

import {
  userId,
  outGoingCall,
  myStream,
  stream,
  inCommingCall,
  callAccepted,
  callerSignal,
  userStream,
  isVideoCall,
  myId,
  activePeers,
  myName,
  callerName,
  friendName,
} from '../../../signals/signals';

export default function InCommingCall() {
  // const activePeers = useRef();
  const setupWebcam = async () => {
    if (myStream.value) {
      stopCam(myStream.value);
    }
    const streamVar = await navigator.mediaDevices.getUserMedia({ video: isVideoCall.value, audio: true });
    myStream.value = streamVar;
    stream.value = streamVar;
    handleAcceptCall(streamVar);
  };

  const handleAcceptCall = (stream) => {
    try {
      inCommingCall.value = false;
      callAccepted.value = true;

      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
      });

      peer.on("signal", (data) => {
        if (data) {
          socket.emit("acceptCall", {
            from: myId.value,
            to: userId.value,
            name: myName.value,
            signalData: data,
          });
        }
      });

      peer.on("stream", (stream) => {
        userStream.value = stream;
      });

      peer.signal(callerSignal.value);
      activePeers.value = [
        ...activePeers.value,
        peer,
      ];
    } catch (err) {
      toast.error(err,
        {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
    }
  };

  const handleRejectCall = () => {
    inCommingCall.value = false;
    socket.emit('rejectCall', {
      from: myId.value,
      name: myName.value,
      to: userId.value,
      isVideoCall: isVideoCall.value,
    });

    if (userStream.value) {
      stopCam(userStream.value);
    }
    if (myStream.value) {
      stopCam(myStream.value);
    }
  };

  return (
    <div className='incommingCall'>
      <div className='userInfoContainer'>
        <div className='imgContainer'>
          <img className='profilePic' src="https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png" alt="" />
        </div>

        <div className='nameContainer'>
          {callerName.value ? <p className='name'>{callerName.value}</p> : <h1>{friendName.value}</h1>}
          <p>Incomming Call...</p>
        </div>
      </div>

      <div className='BtnContainer'>
        <button className='endCallBtn' onClick={handleRejectCall}>
          <FontAwesomeIcon icon={faPhoneSlash} />
        </button>
        <button className='acceptCallBtn' onClick={setupWebcam}>
          <FontAwesomeIcon icon={faPhoneVolume} />
        </button>
      </div>
    </div>
  );
}