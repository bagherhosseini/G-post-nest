import React, { useState } from 'react';
import './auth.scss';
import { Register, Login, Overlay } from '../../features/auth';
import Cookies from "js-cookie"

export default function Auth() {
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const authToken = Cookies.get("authToken");

    const handleSignUpClick = () => {
        setIsRightPanelActive(true);
    };

    const handleSignInClick = () => {
        setIsRightPanelActive(false);
    };

    return (
        authToken !== "undefined" && authToken !== undefined && authToken !== null && authToken !== "" ? (
            <p style={{
                position: 'absolute',
                fontSize: '3rem',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontFamily: 'sans-serif',
            }}>
                Loading<span style={{ color: "white", marginLeft: "5px" }}>&#9679; &#9679; &#9679;</span>
            </p>
        ) : (
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
    )
}
