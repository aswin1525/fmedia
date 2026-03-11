import React, { useState } from 'react';
import Card from './Card';
import Input from './Input';
import Button from './Button';

export default function ProfileOverview({ profile, onUpdateProfile }) {
    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState(profile?.bio || '');

    const handleSave = () => {
        onUpdateProfile({ bio });
        setIsEditing(false);
    };

    if (!profile) return <div>Loading Profile...</div>;

    const joinedDate = new Date(profile.createdAt).toLocaleDateString();

    return (
        <Card style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>{profile.alias}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>Joined: {joinedDate}</p>
                </div>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="small">Edit Bio</Button>
                )}
            </div>

            {isEditing ? (
                <div style={{ marginTop: '1rem' }}>
                    <Input
                        label="Short Bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Share your interests or experiences..."
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <Button onClick={handleSave} size="small">Save</Button>
                        <Button onClick={() => setIsEditing(false)} variant="ghost" size="small">Cancel</Button>
                    </div>
                </div>
            ) : (
                <p style={{ marginTop: '0.5rem', fontStyle: profile.bio ? 'normal' : 'italic', color: profile.bio ? 'var(--text)' : 'var(--text-muted)' }}>
                    {profile.bio || 'No bio provided.'}
                </p>
            )}
        </Card>
    );
}
