import React from 'react';
import './Input.css';

export default function Input({ label, type = 'text', ...props }) {
    return (
        <div className="input-group">
            {label && <label className="input-label">{label}</label>}
            {type === 'textarea' ? (
                <textarea className="input-field textarea" {...props} />
            ) : (
                <input type={type} className="input-field" {...props} />
            )}
        </div>
    );
}
