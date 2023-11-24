import React, { useLayoutEffect, useRef } from 'react'

import {
    userStream,
    myStream
} from '../../../signals/signals';

export default function UsersVideo() {
    const userVideoRef = useRef(null);
    const myVideoRef = useRef(null);

    useLayoutEffect(() => {
        if (myStream.value && userStream.value) {
            userVideoRef.current.srcObject = userStream.value;
            myVideoRef.current.srcObject = myStream.value;
        }
    }, [userStream.value])

    return (
        <div className='video'>
            {myVideoRef && (
                <video
                    id='userVideo'
                    className="rounded-full"
                    ref={myVideoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{
                        width: '300px',
                        position: 'absolute',
                        top: '300px',
                        left: '0',
                        zIndex: '10000',
                        backgroundColor: 'blue',
                    }}
                />
            )}

            {userVideoRef && (
                <video
                    id='userVideo'
                    className="rounded-full"
                    ref={userVideoRef}
                    autoPlay
                    playsInline
                    style={{
                        width: '300px',
                        position: 'absolute',
                        top: '300px',
                        right: '0',
                        zIndex: '10000',
                        backgroundColor: 'red',
                    }}
                />
            )}
        </div>
    )
}
