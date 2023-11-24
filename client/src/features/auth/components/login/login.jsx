import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleAuth } from "../../index";
import { authApiService } from "../../../../services/index";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isValid = emailRegex.test(email);
            if (!isValid) {
                setError(false);
                setMessage("Please enter a valid email address");
                return;
            }
            const response = await authApiService.signIn(email, password);
            const data = await response.json();
            setError(response.ok);
            if (response.ok) {
                navigate("/home/", { state: { email } });
            }
            setError(response.ok);
            setMessage(data);
            return;

        } catch (error) {
            setError(false);
            setMessage(error.message)
            return;
        }
    };


    return (
        <div className="form-container sign-in-container">
            <form className="form" onSubmit={handleSubmit}>
                <h1>Sign In</h1>

                <label htmlFor="email" className="userInfoLabel">
                    <input id="email" className="userInfo" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                </label>

                <label htmlFor="password" className="userInfoLabel">
                    <input type="password" id="password" className="userInfo" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 3 charaters long" />
                </label>

                <button type="submit">Sign In</button>
                <GoogleAuth BtnText = {"Sign in with Google 🚀"}></GoogleAuth>
                
                {!error ? 
                    <div className="error">
                        <p>{message}</p>
                    </div>
                :
                    <></>
                }
            </form>
        </div>
    );
}
