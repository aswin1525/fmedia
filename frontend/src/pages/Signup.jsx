import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Signup = () => {
    const [alias, setAlias] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ alias, password }),
            });
            const data = await response.json();
            if (response.ok) {
                login(data);
                navigate('/profile');
            } else {
                setError(data.message || data.error || typeof data === 'string' ? data : 'Signup failed');
            }
        } catch (err) {
            setError('Network error');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-panel">
                <h1 className="auth-title">Join Us</h1>
                <p className="auth-subtitle">Create an account to share your knowledge</p>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label>Choose Alias / Username</label>
                        <input 
                            type="text" 
                            value={alias} 
                            onChange={(e) => setAlias(e.target.value)} 
                            placeholder="Unique username"
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Secure password"
                            required 
                        />
                    </div>
                    <button type="submit" className="primary-btn glow-btn">Sign Up</button>
                </form>
                <div className="auth-footer">
                    <span>Already have an account? </span>
                    <Link to="/login" className="auth-link">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
