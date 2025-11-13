import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import { Mail, Lock, User } from 'lucide-react';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('client');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // --- Create a user object ---
        const newUser = { email, password, role };

        // --- Save the new user to localStorage ---
        // This simulates saving a user to a database.
        // In a real app, you would have multiple users, so we store them in an array.
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        console.log('User registered and saved to localStorage:', newUser);

        // After successfully registering, redirect to the login page
        navigate('/login');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Create Your Account</h1>
                <p className="auth-subtitle">Join our community of freelancers and clients.</p>
                <form onSubmit={handleSubmit}>
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
                            placeholder="Minimum 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength="8"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <User className="input-icon" />
                        <select value={role} onChange={(e) => setRole(e.target.value)} required>
                            <option value="client">Register as a... Client (I want to hire)</option>
                            <option value="freelancer">Register as a... Freelancer (I want to work)</option>
                        </select>
                    </div>
                    <button type="submit" className="auth-button">
                        Create Account
                    </button>
                </form>
                <p className="auth-footer-text">
                    Already have an account? <Link to="/login" className="auth-link">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

