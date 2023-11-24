import { useSignalEffect } from '@preact/signals-react';

import './style.scss';

import {
    PageContent,
    socketListener,
    call
} from '../../features/chatB/index.jsx'

const ChatB = () => {
    useSignalEffect(() => {
        socketListener();
    });

    const handleVideoCall = async (isVideoCallPram) => {
        call(isVideoCallPram);
    }

    return (
        <div className='chat'>
            <PageContent handleCall={handleVideoCall} />
        </div>
    )
};

export default ChatB;