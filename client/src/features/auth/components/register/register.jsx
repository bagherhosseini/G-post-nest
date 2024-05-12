import { useState, useEffect } from "react";
import { authApiService } from "../../../../services/index";
import { toast } from 'react-toastify';

export default function Register() {
    const [name, setname] = useState('');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isButtonDisabled, setButtonDisabled] = useState(false);
    const [countdown, setCountdown] = useState(10);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isValid = emailRegex.test(userEmail);
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
            const response = await authApiService.signUp(userName, name, userEmail, password);
            if (response.status === 200) {
                toast.success('Registration successful 🚀',
                    {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                );
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
            toast.error(error.response.data.message,
                {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
        }

        setButtonDisabled(true);

        setTimeout(() => {
            setButtonDisabled(false);
        }, 10000);
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
            setCountdown(10);
        }
    }, [countdown]);

    return (
        <div className="form-container sign-up-container">
            <form className="form" onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                <label htmlFor="username" className="userInfoLabel">
                    <input type="text" id="username" className="userInfo" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Name" autoComplete="current-name" required />
                </label>

                <label htmlFor="name" className="userInfoLabel">
                    <input id="name" className="userInfo" value={name} onChange={(e) => setname(e.target.value)} placeholder="Username" required />
                </label>

                <label htmlFor="email" className="userInfoLabel">
                    <input id="email" className="userInfo" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="Email" autoComplete="current-email" required />
                </label>

                <label htmlFor="password" className="userInfoLabel">
                    <input type="password" id="password" className="userInfo" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoComplete="current-password" required minLength="5" />
                </label>

                <div className="rowContainer">
                    <button type="submit" disabled={isButtonDisabled}>Sign Up</button>
                    {isButtonDisabled && (
                        <div className="countDown">{countdown}</div>
                    )}
                </div>
            </form>
        </div>
    );
}
