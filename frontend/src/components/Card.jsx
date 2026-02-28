import React from 'react';
import './Card.css';

export default function Card({ children, className = '', ...props }) {
    return (
        <div className={`card glass-panel ${className}`} {...props}>
            {children}
        </div>
    );
}
