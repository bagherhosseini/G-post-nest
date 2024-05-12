import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApiService } from "../../../../services/index";
import { myName } from "../../../chatB/signals/signals";
import { toast } from 'react-toastify';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isValid = emailRegex.test(email);
            if (!isValid) {
                toast.error('Please enter a valid email address',
                    {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                );
                return;
            }
            const response = await authApiService.signIn(email, password);
            if (response.status === 200) {
                localStorage.setItem("id", response.data.user.id);
                myName.value = response.data.user.userName;
                navigate("/chat/friends");
            } else {
                toast.error(response.data.message,
                    {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                );
            }
            return;
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message,
                {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
            return;
        }
    };

    return (
        <div className="form-container sign-in-container">
            <form className="form" onSubmit={handleSubmit}>
                <h1>Sign In</h1>

                <label htmlFor="emailLogin" className="userInfoLabel">
                    <input id="emailLogin" className="userInfo" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" autoComplete="current-email" required />
                </label>

                <label htmlFor="passwordLogin" className="userInfoLabel">
                    <input type="password" id="passwordLogin" className="userInfo" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoComplete="current-password" required minLength="5" />
                </label>

                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}
