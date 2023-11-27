import React, { useRef } from 'react'
import { useSignalEffect } from '@preact/signals-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneVolume, faVideo } from '@fortawesome/free-solid-svg-icons';
import Peer from 'simple-peer';

import {
    userStatus,
    myStream,
    userStream,
} from '../../../signals/signals';

export default function ChatHeader({handleCall}) {
    useSignalEffect(() => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: myStream.value,
        });

        peer.on("stream", (stream) => {
            userStream.value = stream;
        });
    } , []);

    return (
        <header>
            <p>Name</p>
            <span className='userStatus' style={{backgroundColor: userStatus.value === 'online' ? 'green': 'red'}} />
            <div className='call'>
                <button onClick={ ()=>{handleCall(false)} }>
                    <FontAwesomeIcon icon={faPhoneVolume} />
                </button>
                <button onClick={ ()=>{handleCall(true)} }>
                    <FontAwesomeIcon icon={faVideo} />
                </button>
            </div>
        </header>
    )
}
