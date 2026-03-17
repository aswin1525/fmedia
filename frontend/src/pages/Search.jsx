import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Search() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('trending');
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 'trending' && !query) {
            fetchTrending();
        } else if (query) {
            handleSearch();
        }
    }, [activeTab]);

    const fetchTrending = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/feed/trending');
            const data = await res.json();
            setResults(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!query && activeTab === 'trending') return fetchTrending();
        if (!query) return setResults([]);

        setLoading(true);
        try {
            let res;
            if (activeTab === 'users') {
                res = await fetch(`/api/search/users?keyword=${query}`);
            } else if (activeTab === 'tags') {
                // simple split by comma
                const tags = query.split(',').map(t => t.trim()).join(',');
                res = await fetch(`/api/search/posts/tags?tags=${tags}`);
            } else {
                res = await fetch(`/api/search/posts/keyword?keyword=${query}`);
            }
            const data = await res.json();
            setResults(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="animate-enter" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Search Discover</h2>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input 
                    type="text" 
                    placeholder="Search query..." 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}
                />
                <button onClick={handleSearch} className="primary-btn glow-btn" style={{ padding: '0 1.5rem', borderRadius: '12px' }}>Search</button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                {['trending', 'posts', 'tags', 'users'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`glass-btn ${activeTab === tab ? 'active-tab' : ''}`}
                        style={{ background: activeTab === tab ? 'var(--primary)' : 'transparent', border: 'none', color: activeTab === tab ? 'white' : 'var(--text-secondary)' }}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? <p style={{ textAlign: 'center' }}>Loading...</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {results.length === 0 ? <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No results found.</p> : null}
                    {activeTab === 'users' ? (
                        results.map(userItem => (
                            <Card key={userItem.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>{userItem.alias}</h3>
                                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>{userItem.bio || 'No bio'}</p>
                                </div>
                                <Link to={`/profile/${userItem.alias}`} className="glass-btn glow-btn" style={{ padding: '0.5rem 1rem', textDecoration: 'none' }}>View</Link>
                            </Card>
                        ))
                    ) : (
                        results.map(post => (
                            <Card key={post.id}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <Link to={`/profile/${post.userAlias}`} style={{ fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'none' }}>@{post.userAlias}</Link>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h3 style={{ marginBottom: '0.5rem' }}>The Issue</h3>
                                <p style={{ marginBottom: '1rem' }}>{post.whatHappened}</p>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {(post.tags || []).map(tag => (
                                        <span key={tag} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem' }}>#{tag}</span>
                                    ))}
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
