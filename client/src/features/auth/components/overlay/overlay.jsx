import React from 'react';

export default function Overlay({ onSignUpClick, onSignInClick }) {
    return (
        <div className="overlay-container">
            <div className="overlay">
                <div className="overlay-panel overlay-left">
                <img src="https://cdn.discordapp.com/attachments/1074053506954186792/1098585647717027890/output_1.png" alt="" />
                    <h1>Welcome to G-Post!</h1>
                    <p>
                        To connect with your friends please sign in
                    </p>
                    <button className="ghost" id="signIn" onClick={onSignInClick}>
                        Sign In
                    </button>
                </div>
                <div className="overlay-panel overlay-right">
                <img className='rightImg' src="https://cdn.discordapp.com/attachments/1074053506954186792/1098575736094343188/Lovepik_com-402425950-3d-cartoon-style-plush-yellow-flower-model-element.png" alt="" />
                    <h1>Welcome to G-Post!</h1>
                    <p>
                        Create your account and start your journey with us
                    </p>
                    <button className="ghost" id="signUp" onClick={onSignUpClick}>
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}
