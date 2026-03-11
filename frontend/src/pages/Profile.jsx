import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import ProfileOverview from '../components/ProfileOverview';
import ActivityDashboard from '../components/ActivityDashboard';
import PostHistory from '../components/PostHistory';
import PrivacySettings from '../components/PrivacySettings';

export default function Profile() {
    const [alias, setAlias] = useState('');
    const [profileData, setProfileData] = useState(null);
    const [stats, setStats] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedAlias = localStorage.getItem('userAlias') || '';
        setAlias(storedAlias);

        if (storedAlias) {
            fetchProfileData(storedAlias);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchProfileData = async (userAlias) => {
        setLoading(true);
        try {
            const [profileRes, postsRes] = await Promise.all([
                fetch(`/api/users/${userAlias}/profile`),
                fetch(`/api/users/${userAlias}/posts`)
            ]);

            if (profileRes.ok) {
                const data = await profileRes.json();
                setProfileData(data.user);
                setStats({
                    totalPosts: data.totalPosts,
                    totalUpvotes: data.totalUpvotes,
                    totalReposts: data.totalReposts,
                    commonTags: data.commonTags
                });
            } else {
                console.error("Failed to fetch profile. Status:", profileRes.status);
            }

            if (postsRes.ok) {
                const postsData = await postsRes.json();
                setPosts(postsData);
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (updates) => {
        try {
            const res = await fetch(`/api/users/${alias}/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            if (res.ok) {
                const updatedUser = await res.json();
                setProfileData(updatedUser);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    if (loading) return <div className="animate-enter" style={{ textAlign: 'center', marginTop: '2rem' }}>Loading Profile...</div>;

    if (!alias) return <div className="animate-enter" style={{ textAlign: 'center', marginTop: '2rem' }}>You must be assigned an alias first. Create a post to initialize your profile!</div>;

    return (
        <div className="animate-enter" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Your Anonymous Profile</h2>

            <ProfileOverview profile={profileData} onUpdateProfile={handleUpdateProfile} />

            <ActivityDashboard stats={stats} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginBottom: '2rem' }}>
                <PrivacySettings profile={profileData} onUpdateProfile={handleUpdateProfile} />
            </div>

            <PostHistory posts={posts} />
        </div>
    );
}
