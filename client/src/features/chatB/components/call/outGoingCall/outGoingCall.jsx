import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneSlash } from '@fortawesome/free-solid-svg-icons';

import { stopCam } from '../stopCam/stopCam';
import { socket } from '../../../../../services/lib/stocket';

import {  
  userId, 
  outGoingCall,
  userStream,
  myStream,
  myId,
  isVideoCall
} from '../../../signals/signals';

export default function OutGoingCall() {
  const handleOutGoingCall = () => {
    stopCam(myStream.value);
    outGoingCall.value = false;
    ;
    socket.emit('rejectCall', {
      from: myId.value,
      name: 'test',
      to: userId.value,
      isVideoCall: isVideoCall.value
    });
  };

  return (
    <section className='outGoingVoiceCall'>
      <div className='nameContainer'>
        <h1>Name</h1>
        <p>Calling</p>
      </div>
      <div className='imgContainer'>
        <img className='profilePic' src="https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png" alt="" />
      </div>
      <button className='endCallBtn' onClick={handleOutGoingCall}><FontAwesomeIcon icon={faPhoneSlash} /></button>
    </section>
  );
}