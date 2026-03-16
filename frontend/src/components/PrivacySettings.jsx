import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';

export default function PrivacySettings({ profile, onUpdateProfile }) {
    const [profileVisible, setProfileVisible] = useState(profile?.profileVisible ?? true);
    const [allowAiAnalysis, setAllowAiAnalysis] = useState(profile?.allowAiAnalysis ?? true);
    const [commentNotifications, setCommentNotifications] = useState(profile?.commentNotifications ?? true);

    const [newAlias, setNewAlias] = useState(profile?.alias || '');
    const [aliasError, setAliasError] = useState('');
    const [aliasSuccess, setAliasSuccess] = useState('');

    const handleChangeAlias = async () => {
        setAliasError(''); setAliasSuccess('');
        const oldAlias = localStorage.getItem('userAlias');
        try {
            const res = await fetch(`/api/users/${oldAlias}/alias?newAlias=${encodeURIComponent(newAlias)}`, {
                method: 'PUT'
            });
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('userAlias', data.alias);
                setAliasSuccess('Username changed successfully! All your data has been migrated.');
                // In a wider app, we'd trigger a global state update or page reload to refresh feed data
                setTimeout(() => window.location.reload(), 1500); 
            } else {
                setAliasError('Username is already taken or invalid.');
            }
        } catch (e) {
            setAliasError('Failed to update username.');
        }
    };

    const handleSave = () => {
        onUpdateProfile({ profileVisible, allowAiAnalysis, commentNotifications });
    };

    return (
        <Card>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Privacy Settings</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Change Username</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Updates your unique alias across all past posts and comments seamlessly.</div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input 
                            type="text" 
                            value={newAlias}
                            onChange={(e) => setNewAlias(e.target.value)}
                            style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
                        />
                        <Button onClick={handleChangeAlias} variant="primary">Update</Button>
                    </div>
                    {aliasError && <div style={{ color: 'var(--red-accent)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{aliasError}</div>}
                    {aliasSuccess && <div style={{ color: 'var(--green-accent)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{aliasSuccess}</div>}
                </div>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                    <div>
                        <div style={{ fontWeight: '500' }}>Profile Visibility</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Allow others to view your aggregate stats (always anonymous).</div>
                    </div>
                    <input
                        type="checkbox"
                        checked={profileVisible}
                        onChange={(e) => setProfileVisible(e.target.checked)}
                        style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)' }}
                    />
                </label>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                    <div>
                        <div style={{ fontWeight: '500' }}>AI Analysis Permissions</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Allow AI to analyze your posts for emotional patterns and tags.</div>
                    </div>
                    <input
                        type="checkbox"
                        checked={allowAiAnalysis}
                        onChange={(e) => setAllowAiAnalysis(e.target.checked)}
                        style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)' }}
                    />
                </label>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                    <div>
                        <div style={{ fontWeight: '500' }}>Comment Notifications</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Receive alerts when users comment on your posts.</div>
                    </div>
                    <input
                        type="checkbox"
                        checked={commentNotifications}
                        onChange={(e) => setCommentNotifications(e.target.checked)}
                        style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)' }}
                    />
                </label>
            </div>

            <Button onClick={handleSave} variant="secondary">Save Privacy Settings</Button>
        </Card>
    );
}
