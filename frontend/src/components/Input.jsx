import React from 'react';
import './Input.css';

export default function Input({ label, type = 'text', ...props }) {
    return (
        <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                {label && <label className="input-label" style={{ marginBottom: 0 }}>{label}</label>}
                {props.onMicClick && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {props.isListening ? (
                            <span style={{ fontSize: '0.75rem', color: '#ef4444', animation: 'pulse 1.5s infinite' }}>Listening...</span>
                        ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Muted</span>
                        )}
                        <button type="button" onClick={props.onMicClick} style={{ background: 'none', border: 'none', cursor: 'pointer', color: props.isListening ? '#ef4444' : 'var(--text-muted)', display: 'flex', alignItems: 'center' }} title={props.isListening ? "Stop Dictation" : "Start Dictation"}>
                            {props.isListening ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic-off"><line x1="2" x2="22" y1="2" y2="22"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/><path d="M5 10v2a7 7 0 0 0 12 5"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                            )}
                        </button>
                    </div>
                )}
            </div>
            {type === 'textarea' ? (
                <textarea className="input-field textarea" {...props} />
            ) : (
                <input type={type} className="input-field" {...props} />
            )}
        </div>
    );
}
