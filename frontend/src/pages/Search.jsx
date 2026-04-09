import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, TrendingUp, Hash, Users, FileText } from 'lucide-react';

export default function Search() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('trending');
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Initial load: trending
    useEffect(() => {
        if (activeTab === 'trending' && !query) {
            fetchTrending();
        } else if (query) {
            handleSearch();
        }
    }, [activeTab]);

    // Debounced Suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.trim().length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                const res = await fetch(`/api/search/suggestions?keyword=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data);
                }
            } catch (e) {
                console.error("Error fetching suggestions:", e);
            }
        };

        const timer = setTimeout(() => {
            if (query) fetchSuggestions();
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const fetchTrending = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/feed/trending');
            if (res.ok) {
                const data = await res.json();
                setResults(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (forcedQuery) => {
        const searchTerm = forcedQuery || query;
        if (!searchTerm && activeTab === 'trending') return fetchTrending();
        if (!searchTerm) return setResults([]);

        setLoading(true);
        setShowSuggestions(false);
        try {
            let res;
            if (activeTab === 'users') {
                res = await fetch(`/api/search/users?keyword=${encodeURIComponent(searchTerm)}`);
            } else if (activeTab === 'tags') {
                const tagsList = searchTerm.split(',').map(t => t.trim()).filter(t => t !== '');
                const params = new URLSearchParams();
                tagsList.forEach(tag => params.append('tags', tag));
                res = await fetch(`/api/search/posts/tags?${params.toString()}`);
            } else {
                res = await fetch(`/api/search/posts/keyword?keyword=${encodeURIComponent(searchTerm)}`);
            }
            if (res.ok) {
                const data = await res.json();
                setResults(data);
            }
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

    const selectSuggestion = (suggestion) => {
        setQuery(suggestion);
        handleSearch(suggestion);
    };

    return (
        <div className="animate-enter" style={{ paddingBottom: '4rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-main)', fontSize: '2.5rem', fontWeight: '800' }}>Discover</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem' }}>Search for stories, tags, or fellow troubleshooters</p>
            
            <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', transition: 'all 0.3s' }}>
                    <SearchIcon size={20} style={{ marginLeft: '1rem', color: 'var(--text-muted)' }} />
                    <input 
                        type="text" 
                        placeholder="Search for users, failures, or hashtags..." 
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onKeyDown={handleKeyDown}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        onFocus={() => {if(query.length >= 2) setShowSuggestions(true)}}
                        style={{ flex: 1, padding: '0.8rem 0', background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '1.1rem' }}
                    />
                    <button onClick={() => handleSearch()} className="primary-btn" style={{ padding: '0.6rem 1.5rem', borderRadius: '20px', fontWeight: '600', marginRight: '0.2rem' }}>Search</button>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, background: 'var(--surface-color)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', marginTop: '0.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
                        {suggestions.map((s, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => selectSuggestion(s)}
                                style={{ padding: '0.8rem 1.5rem', cursor: 'pointer', borderBottom: idx === suggestions.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)', color: 'var(--text-main)', transition: 'background 0.2s' }}
                                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                            >
                                <span style={{ color: 'var(--primary)', marginRight: '0.8rem' }}>@</span>
                                {s}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '2.5rem', padding: '0.4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                {[
                    {id: 'trending', label: 'Trending', icon: <TrendingUp size={16}/>},
                    {id: 'posts', label: 'Stories', icon: <FileText size={16}/>},
                    {id: 'tags', label: 'Hashtags', icon: <Hash size={16}/>},
                    {id: 'users', label: 'People', icon: <Users size={16}/>}
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{ 
                            flex: '1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            background: activeTab === tab.id ? 'var(--primary)' : 'transparent', 
                            border: 'none', 
                            color: activeTab === tab.id ? 'white' : 'var(--text-secondary)', 
                            padding: '0.7rem', 
                            borderRadius: '12px', 
                            fontWeight: '600', 
                            fontSize: '0.9rem',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                        }}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                    <p style={{ color: 'var(--text-muted)' }}>Searching the abyss...</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {results.length === 0 && query && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No results found for "{query}".</p>}
                    
                    {activeTab === 'users' ? (
                        results.map(userItem => (
                            <Card key={userItem.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                        {userItem.alias.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{userItem.alias}</h3>
                                        <p style={{ margin: '0.2rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{userItem.bio || 'No status shared yet.'}</p>
                                    </div>
                                </div>
                                <Link to={`/profile/${userItem.alias}`} className="glass-btn glow-btn" style={{ padding: '0.6rem 1.2rem', textDecoration: 'none', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 'bold' }}>View Profile</Link>
                            </Card>
                        ))
                    ) : (
                        results.map(post => (
                            <Card key={post.id} style={{ padding: '1.8rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                        <Link to={`/profile/${post.userAlias}`} style={{ fontWeight: '700', color: 'var(--text-main)', textDecoration: 'none', fontSize: '1rem' }}>@{post.userAlias}</Link>
                                        <span style={{ height: '4px', width: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></span>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{post.status}</span>
                                </div>
                                <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-main)' }}>{post.whatHappened}</p>
                                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                                    {(post.tags || []).map(tag => (
                                        <span key={tag} style={{ background: 'rgba(20, 184, 166, 0.1)', color: 'var(--primary)', padding: '0.3rem 0.8rem', borderRadius: '16px', fontSize: '0.85rem', fontWeight: '500' }}>#{tag}</span>
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
