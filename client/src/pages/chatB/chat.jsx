import { useSignalEffect } from '@preact/signals-react';
import { useParams } from 'react-router-dom';

import './style.scss';

import {
    PageContent,
    call
} from '../../features/chatB/index.jsx'
import { socket } from '../../services/lib/stocket.js';
import { userId, userStatus } from '../../features/chatB/signals/signals.jsx';

const ChatB = () => {
    const { friendId } = useParams("userId");

    if (friendId) {
        userId.value = friendId;
        socket.emit('userStatus', { userId: friendId });
    }

    const handleCall = async (isVideoCallPram) => {
        call(isVideoCallPram);
    }

    useSignalEffect(() => {
        socket.on('userStatus', (data) => {
            userStatus.value = data.status;
        });
    });

    return (
        <div className='chat'>
            <PageContent handleCall={handleCall} />
        </div>
    )
};

export default ChatB;