import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import ProfileOverview from '../components/ProfileOverview';
import ActivityDashboard from '../components/ActivityDashboard';
import PostHistory from '../components/PostHistory';
import PrivacySettings from '../components/PrivacySettings';

export default function Profile() {
    const { alias: routeAlias } = useParams();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const targetAlias = routeAlias || user?.alias;
    const isOwnProfile = !routeAlias || routeAlias === user?.alias;

    const [profileData, setProfileData] = useState(null);
    const [stats, setStats] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followCounts, setFollowCounts] = useState({ followers: 0, following: 0 });

    useEffect(() => {
        if (!targetAlias) {
            setLoading(false);
            return;
        }
        fetchProfileData(targetAlias);
        if (user?.alias) {
            fetchFollowStatus(targetAlias);
        }
        fetchFollowCounts(targetAlias);
    }, [targetAlias, user]);

    const fetchFollowStatus = async (target) => {
        try {
            const res = await fetch(`/api/follows/${target}/status?currentUserAlias=${user.alias}`);
            if (res.ok) {
                const data = await res.json();
                setIsFollowing(data.following);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchFollowCounts = async (target) => {
        try {
            const res = await fetch(`/api/follows/${target}/counts`);
            if (res.ok) {
                const data = await res.json();
                setFollowCounts(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const toggleFollow = async () => {
        if (!user) return navigate('/login');
        try {
            const res = await fetch(`/api/follows/${targetAlias}?currentUserAlias=${user.alias}`, { method: 'POST' });
            if (res.ok) {
                const data = await res.json();
                setIsFollowing(data.following);
                fetchFollowCounts(targetAlias);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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

    if (!targetAlias) return <div className="animate-enter" style={{ textAlign: 'center', marginTop: '2rem' }}>Please <a href="/login">login</a> to view your profile!</div>;

    return (
        <div className="animate-enter" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>{isOwnProfile ? 'Your Profile' : `${targetAlias}'s Profile`}</h2>
                {isOwnProfile ? (
                    <button onClick={handleLogout} className="glass-btn" style={{ padding: '0.5rem 1rem', background: 'rgba(231, 76, 60, 0.2)', color: '#e74c3c' }}>Logout</button>
                ) : (
                    <button onClick={toggleFollow} className={`glass-btn ${isFollowing ? '' : 'primary-btn'}`} style={{ padding: '0.5rem 1.5rem', borderRadius: '12px' }}>
                        {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}><strong style={{ fontSize: '1.5rem' }}>{followCounts.followers}</strong><div style={{ color: 'var(--text-secondary)' }}>Followers</div></div>
                <div style={{ textAlign: 'center' }}><strong style={{ fontSize: '1.5rem' }}>{followCounts.following}</strong><div style={{ color: 'var(--text-secondary)' }}>Following</div></div>
            </div>

            <ProfileOverview profile={profileData} onUpdateProfile={isOwnProfile ? handleUpdateProfile : undefined} />

            <ActivityDashboard stats={stats} />

            {isOwnProfile && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginBottom: '2rem' }}>
                    <PrivacySettings profile={profileData} onUpdateProfile={handleUpdateProfile} />
                </div>
            )}

            <PostHistory posts={posts} />
        </div>
    );
}
