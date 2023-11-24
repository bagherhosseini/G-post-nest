import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleAuth } from "../../index";
import { authApiService } from "../../../../services/index";

export default function Register() {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    const [countdown, setCountdown] = useState(30);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isValid = emailRegex.test(userEmail);
            if (!isValid) {
                setError(false);
                setMessage("Please enter a valid email address");
                return;
            }
            const response = await authApiService.signUp(userName, userEmail, password);
            const data = await response.json();
            setError(response.ok);
            setMessage(data);

        } catch (error) {
            setError(false);
            setMessage(error.message)   
        }

        setButtonDisabled(true);

        setTimeout(() => {
        setButtonDisabled(false);
        }, 30000); // 30 seconds
    };

    useEffect(() => {
        if (isButtonDisabled) {
          const timer = setInterval(() => {
            setCountdown(prevCountdown => prevCountdown - 1);
          }, 1000);
    
          return () => {
            clearInterval(timer);
          };
        }
    }, [isButtonDisabled]);
    
    useEffect(() => {
        if (countdown === 0) {
            setButtonDisabled(false);
            setCountdown(30);
        }
    }, [countdown]);

    return (
        <div className="form-container sign-up-container">
            <form className="form" onSubmit={handleSubmit}>
                <h1>Sign Up</h1>

                <label htmlFor="username" className="userInfoLabel">
                    <input type="text" id="username" className="userInfo" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Name" />
                </label>

                <label htmlFor="email" className="userInfoLabel">
                    <input id="email" className="userInfo" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="Email" />
                </label>

                <label htmlFor="password" className="userInfoLabel">
                    <input type="password" id="password" className="userInfo" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 3 charaters long" />
                </label>

                <div className="rowContainer">
                    <button type="submit" disabled={isButtonDisabled}>Sign Up</button>
                    {isButtonDisabled && (
                        <div className="countDown">{countdown}</div>
                    )}
                </div>
                <GoogleAuth BtnText = {"Sign up with Google 🚀"}></GoogleAuth>
                
                <div className={error ? "regSuccess" : "regError"}>
                    <p>{message}</p>
                </div>
            </form>
        </div>

        
    );
}
