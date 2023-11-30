import React, { useState } from 'react';
import './auth.scss';
import {Register, Login, Overlay} from '../../features/auth';
import useCookie from '../../hooks/useCookie';

export default function Auth() {
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const [authToken, updateAuthToken, removeAuthToken] = useCookie("authToken");

    if(authToken !== "undefined" && authToken !== undefined && authToken !== null && authToken !== ""){
        return null;
    }  

    const handleSignUpClick = () => {
        setIsRightPanelActive(true);
    };

    const handleSignInClick = () => {
        setIsRightPanelActive(false);
    };

    return (
        <section className='auth'>
            <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`} id='container'>
                <Register></Register>
                <Login></Login>
                <Overlay
                    onSignUpClick={handleSignUpClick}
                    onSignInClick={handleSignInClick}
                ></Overlay>
            </div>
        </section>
    )
}
