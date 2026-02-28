import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import Button from '../components/Button';
import { ThumbsUp, Share2, MessageCircle } from 'lucide-react';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const alias = localStorage.getItem('userAlias') || 'Anonymous';

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/posts');
            setPosts(res.data);
        } catch (e) {
            console.error(e);
            // Fallback mockup
            setPosts([
                {
                    id: 1, userAlias: 'Anon-x82', whatHappened: 'I dropped the production database',
                    whatLearned: 'Always verify the DB connection string before running drop scripts.',
                    status: 'SOLVED', tags: ['database', 'fail'], upvotes: 12, reposts: 1
                }
            ]);
        }
    };

    const handleInteract = async (id, type) => {
        try {
            await axios.post(`http://localhost:8080/api/posts/${id}/interact?alias=${alias}&type=${type}`);
            fetchPosts();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="animate-enter">
            <h2 style={{ marginBottom: '1.5rem' }}>Community Failures & Learnings</h2>
            {posts.map(post => (
                <Card key={post.id} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{post.userAlias}</span>
                        <span style={{ background: 'var(--surface-color-light)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>
                            {post.status}
                        </span>
                    </div>
                    <h4 style={{ color: 'var(--red-accent)', marginBottom: '0.2rem' }}>The Failure</h4>
                    <p style={{ marginBottom: '1rem' }}>{post.whatHappened}</p>

                    <h4 style={{ color: 'var(--green-accent)', marginBottom: '0.2rem' }}>The Lesson</h4>
                    <p style={{ marginBottom: '1rem' }}>{post.whatLearned}</p>

                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        {post.tags?.map(t => (
                            <span key={t} style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>#{t}</span>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                        <button className="btn-ghost" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => handleInteract(post.id, 'UPVOTE')}>
                            <ThumbsUp size={18} /> {post.upvotes}
                        </button>
                        <button className="btn-ghost" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => handleInteract(post.id, 'REPOST')}>
                            <Share2 size={18} /> {post.reposts}
                        </button>
                    </div>
                </Card>
            ))}
            {posts.length === 0 && <p style={{ textAlign: 'center', marginTop: '2rem' }}>No stories shared yet. Be the first!</p>}
        </div>
    );
}
