import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

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
    callAccepted,
    myName,
    userId,
    friendName,
    messages,
} from '../../signals/signals';
import { apiService } from '../../../../services';

export default function Chat({handleCall}) {
    let { id } = useParams();
    userId.value = id;

    useEffect(() => {
        async function getFriendInfo() {
            if(id){
                const friendInfo = await apiService.getUserInfo(id);
                friendName.value = friendInfo.data.user.userName;
                
                const getMessages = await apiService.getMessages(id);
                messages.value = getMessages.data;
            }
        }

        getFriendInfo();
    }, [id]);

    return (
        <div className='messageContainer'>
            <ChatHeader handleCall={handleCall} />
            <Messages />
        </div>
    )
}
