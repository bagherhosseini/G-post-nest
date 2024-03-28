import React from 'react';
import login from '../../../../assets/img/login.jpg';
import register from '../../../../assets/img/register.jpg';

export default function Overlay({ onSignUpClick, onSignInClick }) {
    return (
        <div className="overlay-container">
            <div className="overlay">
                <div className="overlay-panel overlay-left">
                <img src={login} alt="" />
                    <h1>Welcome to G-Post!</h1>
                    <p>
                        To connect with your friends please sign in
                    </p>
                    <button className="ghost" id="signIn" onClick={onSignInClick}>
                        Sign In
                    </button>
                </div>
                <div className="overlay-panel overlay-right">
                <img className='rightImg' src={register} alt="" />
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
