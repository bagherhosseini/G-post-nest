import React from 'react';
import { FaVideo } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";

import SendMessage from './sendMessage';
import { messages, filePreviewURL, myName, friendName, userId } from '../../signals/signals';
import ProfilePic from '../profilePic/profilePic';

export default function Messages() {
    return (
        <>
            <div className='messages'>
                {messages.value && !messages.value.length && (
                    <div className='noMessages'>
                        <p>No messages yet</p>
                    </div>
                )}
                {messages.value.map((msg, index) => (
                    <div className='messageInfo' key={index}>
                        {
                            msg.type === 'voiceCall' || msg.type === 'videoCall' ?( 
                                <span className='callText'>
                                    {msg.type === 'voiceCall' ? <IoIosCall /> : <FaVideo />}
                                    {msg.senderId === userId.value ? (
                                        <span>{friendName.value} called you at {msg.date}</span>
                                    ) : (
                                        <span>You called {friendName.value} at {msg.date}</span>
                                    )}
                                    
                                </span>
                            ):(
                                <>
                                    {msg.name ? (<ProfilePic username={msg.name} />) : (<ProfilePic username={myName.value} />)}
                                    <div className='NameMsg'>
                                        <div className='timeName'>
                                            {msg.name ? (
                                                <p className='name'>{msg.name}</p>
                                            ) : (
                                                <p className='name'>{myName.value}</p>
                                            )}
                                            <p className='time'>Today at 22:02</p>
                                        </div>
                                        {msg.type === 'text' && <span className='message'>{msg.message}</span>}
                                        {msg.type === 'file' && <img className='fileImg' src={`${process.env.REACT_APP_API_URL}/${msg.message}`} alt='file' />}
                                    </div>
                                </>
                            )

                        }
                    </div>
                ))}
                {filePreviewURL.value && <img className='filePreview' src={filePreviewURL.value} alt="File Preview" />}
            </div>

            <SendMessage />
        </>
    )
}
