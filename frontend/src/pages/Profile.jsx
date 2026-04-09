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
    const { user, login, logout, loading: authLoading } = useAuth();
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
        if (authLoading) return;
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
        if (!user) return navigate('/');
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
        navigate('/');
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
                    totalPosts: data.totalPosts || 0,
                    totalUpvotes: data.totalUpvotes || 0,
                    totalReposts: data.totalReposts || 0,
                    commonTags: data.commonTags || [],
                    joinDate: data.user?.createdAt
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
            // Scroll to top when profile data is loaded
            window.scrollTo(0, 0);
        }
    };

    const handleUpdateProfile = async (updates, targetAlias = user.alias) => {
        try {
            const res = await fetch(`/api/users/${targetAlias}/profile?currentUserAlias=${user.alias}`, {
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

    const handleUpdateAlias = async (newAlias) => {
        try {
            const res = await fetch(`/api/users/${user.alias}/alias?newAlias=${newAlias}&currentUserAlias=${user.alias}`, {
                method: 'PUT'
            });
            if (res.ok) {
                const updatedUser = await res.json();
                login({ ...user, alias: updatedUser.alias });
                if (routeAlias) {
                    navigate(`/profile/${updatedUser.alias}`, { replace: true });
                }
                return true;
            } else {
                alert("Failed to update username. It might be taken.");
                return false;
            }
        } catch (error) {
            console.error("Error updating alias:", error);
            return false;
        }
    };

    const handleDeletePost = async (id) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            const res = await fetch(`/api/posts/${id}?alias=${user.alias}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setPosts(posts.filter(p => p.id !== id));
            } else {
                alert("Failed to delete post.");
            }
        } catch (e) {
            console.error("Failed to delete post", e);
        }
    };

    if (authLoading || loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column', gap: '1rem' }}>
            <div className="animate-float" style={{ fontSize: '2rem' }}>FailShare</div>
            <div style={{ color: 'var(--text-muted)' }}>Loading Profile...</div>
        </div>
    );

    if (!targetAlias && !authLoading) return (
        <div className="animate-enter glass-panel" style={{ textAlign: 'center', padding: '3rem', marginTop: '2rem' }}>
            <h3>Profile not found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Please login to view your profile or check the URL.</p>
            <button onClick={() => navigate('/')} className="primary-btn" style={{ padding: '0.5rem 2rem', borderRadius: '12px' }}>Go Home</button>
        </div>
    );

    return (
        <div className="animate-enter" style={{ paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>{isOwnProfile ? 'Your Profile' : `${targetAlias}'s Profile`}</h2>
                {isOwnProfile ? (
                    <button onClick={handleLogout} className="glass-btn" style={{ padding: '0.4rem 1rem', background: 'transparent', color: '#e74c3c', border: '1px solid rgba(231, 76, 60, 0.5)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: '500' }}>Logout</button>
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

            <ProfileOverview 
                profile={profileData} 
                stats={stats}
                onUpdateProfile={isOwnProfile ? handleUpdateProfile : undefined} 
                onUpdateAlias={isOwnProfile ? handleUpdateAlias : undefined}
            />

            <ActivityDashboard stats={stats} />

            {isOwnProfile && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginBottom: '2rem' }}>
                    <PrivacySettings profile={profileData} onUpdateProfile={handleUpdateProfile} />
                </div>
            )}

            <PostHistory posts={posts} isOwnProfile={isOwnProfile} onDelete={handleDeletePost} />
        </div>
    );
}
