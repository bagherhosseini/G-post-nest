import { useSignalEffect } from '@preact/signals-react';
import { useParams } from 'react-router-dom';

import './style.scss';

import {
    PageContent,
    socketListener,
    call
} from '../../features/chatB/index.jsx'
import { socket } from '../../services/lib/stocket.js';
import { userStatus } from '../../features/chatB/signals/signals.jsx';

const ChatB = () => {
    const { idPram } = useParams();

    useSignalEffect(() => {
        socketListener();
    });

    const handleVideoCall = async (isVideoCallPram) => {
        call(isVideoCallPram);
    }

    useSignalEffect(() => {
        socket.on('userStatus', (data) => {
            userStatus.value = data.status;
        });
    });

    return (
        <div className='chat'>
            <PageContent handleCall={handleVideoCall} />
        </div>
    )
};

export default ChatB;