import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneSlash } from '@fortawesome/free-solid-svg-icons';

import { stopCam } from '../stopCam/stopCam';
import { socket } from '../../../../../services/lib/stocket';

import {
  userId,
  outGoingCall,
  myStream,
  myId,
  isVideoCall,
  friendName,
  myName,
  callerName
} from '../../../signals/signals';
import ProfilePic from '../../profilePic/profilePic';

export default function OutGoingCall() {
  const handleOutGoingCall = () => {
    stopCam(myStream.value);
    outGoingCall.value = false;
    ;
    socket.emit('rejectCall', {
      from: myId.value,
      name: myName.value,
      to: userId.value,
      isVideoCall: isVideoCall.value
    });
  };

  return (
    <section className='outGoingVoiceCall'>
      <div className='nameContainer'>
        {callerName.value ? <h1>{callerName.value}</h1> : <h1>{friendName.value}</h1>}
      </div>
      <div className='imgContainerCall'>
        <ProfilePic username={friendName.value} />
      </div>
      <button className='endCallBtn' onClick={handleOutGoingCall}><FontAwesomeIcon icon={faPhoneSlash} /></button>
    </section>
  );
}