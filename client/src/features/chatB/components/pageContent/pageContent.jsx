import React from 'react'

import {
  Messages,
  ChatHeader,
  OutGoingCall as OutGoingCallUI,
  InCommingCall as InCommingCallUI,
  CallAccepted as CallAcceptedUI,
} from '../../index';

import { 
  outGoingCall,
  inCommingCall,
  callAccepted
} from '../../signals/signals';

export default function PageContent({handleCall}) {

  return (
    <section className='content'>

      <div className='messageContainer'>
        <ChatHeader handleCall={handleCall}/>
        <Messages />

        {outGoingCall.value && <OutGoingCallUI />}
        {inCommingCall.value && <InCommingCallUI />}
        {callAccepted.value && <CallAcceptedUI />} 
      </div>
    </section>
  )
}
