import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [alias, setAlias] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ alias, password }),
            });
            const data = await response.json();
            if (response.ok) {
                login(data);
                navigate('/dashboard');
            } else {
                setError(data.message || data.error || typeof data === 'string' ? data : 'Login failed');
            }
        } catch (err) {
            setError('Network error');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-panel">
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Login to track your problem solving journey</p>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label>Alias / Username</label>
                        <input 
                            type="text" 
                            value={alias} 
                            onChange={(e) => setAlias(e.target.value)} 
                            placeholder="Enter your alias"
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Enter your password"
                            required 
                        />
                    </div>
                    <button type="submit" className="primary-btn glow-btn">Login</button>
                </form>
                <div className="auth-footer">
                    <span>Don't have an account? </span>
                    <Link to="/signup" className="auth-link">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
