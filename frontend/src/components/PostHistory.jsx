import React from 'react';
import Card from './Card';
import { Trash2 } from 'lucide-react';

export default function PostHistory({ posts, isOwnProfile, onDelete }) {
    if (!posts || posts.length === 0) {
        return (
            <Card style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)' }}>
                <p style={{ color: 'var(--text-muted)' }}>No stories shared yet.</p>
            </Card>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Post History</h3>
            {posts.map(post => (
                <Card key={post.id} style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <span style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '1rem' }}>{post.userAlias}</span>
                                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {post.status}
                                </span>
                            </div>
                        {isOwnProfile && (
                            <button onClick={() => onDelete(post.id)} title="Delete Post" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', opacity: 0.6 }}>
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>

                    <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.3rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>The Failure</h4>
                    <p style={{ marginBottom: '1.2rem', fontSize: '1rem', lineHeight: '1.6' }}>{post.whatHappened}</p>

                    <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.3rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>The Lesson</h4>
                    <p style={{ marginBottom: '1.5rem', fontSize: '1rem', lineHeight: '1.6', color: 'var(--accent)' }}>{post.whatLearned}</p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                             {post.tags && post.tags.map(tag => (
                                <span key={tag} style={{ color: 'var(--text-muted)', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '6px' }}>#{tag}</span>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            <span>↑ {post.upvotes}</span>
                            <span>↻ {post.reposts}</span>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
