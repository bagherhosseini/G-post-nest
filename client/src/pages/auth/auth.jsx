import React, { useState } from 'react';
import './auth.scss';
import {Register, Login, Overlay} from '../../features/auth';

export default function Auth() {
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);

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
