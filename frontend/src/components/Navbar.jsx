import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, BarChart2, User, LogIn, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
    const { user } = useAuth();
    return (
        <nav className="bottom-nav glass-panel">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <Home size={24} />
                <span className="nav-label">Home</span>
            </NavLink>
            <NavLink to="/submit" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <PlusCircle size={28} className="nav-add-icon" />
                <span className="nav-label">Share Fail</span>
            </NavLink>
            <NavLink to="/search" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <Search size={24} />
                <span className="nav-label">Search</span>
            </NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <BarChart2 size={24} />
                <span className="nav-label">Dashboard</span>
            </NavLink>
            {user ? (
                <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <User size={24} />
                    <span className="nav-label">Profile</span>
                </NavLink>
            ) : (
                <NavLink to="/login" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <LogIn size={24} />
                    <span className="nav-label">Login</span>
                </NavLink>
            )}
        </nav>
    );
}
