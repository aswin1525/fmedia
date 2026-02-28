import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Profile() {
    const [alias, setAlias] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [apiModel, setApiModel] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setAlias(localStorage.getItem('userAlias') || '');
        setApiKey(localStorage.getItem('aiApiKey') || '');
        setApiEndpoint(localStorage.getItem('aiApiEndpoint') || 'https://api.openai.com/v1/chat/completions');
        setApiModel(localStorage.getItem('aiApiModel') || 'gpt-3.5-turbo');
    }, []);

    const handleSave = () => {
        localStorage.setItem('aiApiKey', apiKey);
        localStorage.setItem('aiApiEndpoint', apiEndpoint);
        localStorage.setItem('aiApiModel', apiModel);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="animate-enter">
            <h2 style={{ marginBottom: '1rem' }}>Your Anonymous Profile</h2>
            <Card style={{ marginBottom: '2rem' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>User Alias</p>
                <h3 style={{ color: 'var(--primary)' }}>{alias}</h3>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.8 }}>
                    Keep sharing securely. No personal data is attached to this alias.
                </p>
            </Card>

            <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>AI Configuration</h3>
            <Card>
                <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Configure your Provider / API Key here for the AI Path Finder. Keys are stored locally.</p>

                <Input
                    label="API Key (Bearer Token)"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                />
                <Input
                    label="Custom Endpoint URL"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    placeholder="https://api.openai.com/v1/chat/completions"
                />
                <Input
                    label="Model Name"
                    value={apiModel}
                    onChange={(e) => setApiModel(e.target.value)}
                    placeholder="gpt-3.5-turbo"
                />

                <Button onClick={handleSave} style={{ marginTop: '1rem' }}>
                    {saved ? "Saved Configuration!" : "Save Keys"}
                </Button>
            </Card>
        </div>
    );
}
