import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const users = JSON.parse(localStorage.getItem('users')) || [];

        const foundUser = users.find(
            (user) => user.email === email && user.password === password
        );

        if (foundUser) {
            // SUCCESS: We found the user. Log them in with their registered role.
            localStorage.setItem('user_role', foundUser.role);
            localStorage.setItem('auth_token', 'dummy_authenticated_token');
            navigate('/dashboard');
        } else {
            // If no user is found with those credentials, show an error.
            setError('Invalid email or password. Please try again or register.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Welcome Back!</h1>
                <p className="auth-subtitle">Log in to continue your journey.</p>
                <form onSubmit={handleSubmit}>
                    {error && <p className="auth-error">{error}</p>}
                    <div className="input-group">
                        <Mail className="input-icon" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <Lock className="input-icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength="8"
                            required
                        />
                    </div>
                    {/* The role selector has been removed */}
                    <button type="submit" className="auth-button">
                        Log In
                    </button>
                </form>
                <p className="auth-footer-text">
                    Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;

