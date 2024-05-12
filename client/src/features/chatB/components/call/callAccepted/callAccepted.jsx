import React, { useLayoutEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneSlash } from '@fortawesome/free-solid-svg-icons';

import { stopCam } from '../stopCam/stopCam';
import { socket } from '../../../../../services/lib/stocket';

import {
    userId,
    callAccepted,
    userStream,
    myStream,
    isVideoCall,
    myId,
    friendName,
    myName,
    callerName,
} from '../../../signals/signals';

export default function CallAccepted() {
    const userStreamRef = useRef(null);
    const myStreamRef = useRef(null);

    const handleEndCall = () => {
        socket.emit('endCall', {
            from: myId.value,
            to: userId.value,
            name: myName.value,
            isVideoCall: isVideoCall.value,
        });
        callAccepted.value = false;

        if (userStream.value) {
            stopCam(userStream.value);
            userStream.value = null;
            userStreamRef.current = null;
        }
        if (myStream.value) {
            stopCam(myStream.value);
            myStream.value = null;
            myStreamRef.current = null;
        }

        // activePeers.value[0].destroy();
        window.location.reload();
    }

    useLayoutEffect(() => {
        if (myStream.value && userStream.value) {
            userStreamRef.current.srcObject = userStream.value;
            myStreamRef.current.srcObject = myStream.value;
        }
    }, [userStream.value, myStream.value])

    return (
        <section className='outGoingVoiceCall'>
            <div className='nameContainer'>
                {callerName.value ? <h1>{callerName.value}</h1> : <h1>{friendName.value}</h1>}
            </div>

            {isVideoCall.value ? (
                <div className='video'>
                    {myStreamRef && (
                        <video
                            id='userVideo'
                            className="myVideo"
                            ref={myStreamRef}
                            autoPlay
                            muted
                            playsInline
                        />
                    )}

                    {userStreamRef && (
                        <video
                            id='userVideo'
                            className="userVideo"
                            ref={userStreamRef}
                            autoPlay
                            playsInline
                        />
                    )}
                </div>

            ) : (
                <div className='audio'>
                    <audio ref={myStreamRef} autoPlay muted playsInline />
                    <audio ref={userStreamRef} autoPlay playsInline />
                </div>
            )}

            {/* <div className='imgContainer'>
                <img className='profilePic' src="https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png" alt="" />
            </div> */}
            <button className='endCallBtn' onClick={handleEndCall}><FontAwesomeIcon icon={faPhoneSlash} /></button>
        </section>
    )
}
