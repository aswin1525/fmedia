import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';

export default function PrivacySettings({ profile, onUpdateProfile }) {
    const [profileVisible, setProfileVisible] = useState(profile?.profileVisible ?? true);
    const [allowAiAnalysis, setAllowAiAnalysis] = useState(profile?.allowAiAnalysis ?? true);
    const [commentNotifications, setCommentNotifications] = useState(profile?.commentNotifications ?? true);

    const handleSave = () => {
        onUpdateProfile({ profileVisible, allowAiAnalysis, commentNotifications });
    };

    return (
        <Card>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Privacy Settings</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
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

            <Button onClick={handleSave} variant="outline">Save Privacy Settings</Button>
        </Card>
    );
}
