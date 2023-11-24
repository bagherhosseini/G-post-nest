import React from 'react';

import SendMessage from './sendMessage';
import { myId, messages, filePreviewURL } from '../../signals/signals';

export default function Messages() {
    return (
        <>
            {myId}
            <div className='messages'>
                {messages.value.map((msg, index) => (
                    <div className='messageInfo' key={index}>
                        <img className='profilePic' src="https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png" alt="" />
                        <div className='NameMsg'>
                            <div className='timeName'>
                                <p className='name'>{msg.from}</p>
                                <p className='time'>Today at 22:02</p>
                            </div>
                            {msg.type === 'text' && <span className='message'>{msg.message}</span>}
                            {msg.type === 'file' && <img className='fileImg' src={`${process.env.REACT_APP_API_URL}/${msg.message}`} alt='file' />}
                        </div>
                    </div>
                ))}
                {filePreviewURL.value && <img className='filePreview' src={filePreviewURL.value} alt="File Preview" />}
            </div>

            <SendMessage />
        </>
    )
}
