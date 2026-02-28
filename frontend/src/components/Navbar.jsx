import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, BarChart2, User } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
    return (
        <nav className="bottom-nav glass-panel">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <Home size={24} />
            </NavLink>
            <NavLink to="/submit" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <PlusCircle size={28} className="nav-add-icon" />
            </NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <BarChart2 size={24} />
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <User size={24} />
            </NavLink>
        </nav>
    );
}
