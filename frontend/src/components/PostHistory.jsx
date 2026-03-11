import React from 'react';
import Card from './Card';

export default function PostHistory({ posts }) {
    if (!posts || posts.length === 0) {
        return (
            <Card>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No posts yet.</p>
            </Card>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--accent)' }}>Post History</h3>
            {posts.map(post => (
                <Card key={post.id} style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span>{post.status && `Status: ${post.status}`}</span>
                    </div>

                    <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>What Happened</h4>
                    <p style={{ marginBottom: '1rem', lineHeight: 1.5 }}>{post.whatHappened}</p>

                    <h4 style={{ marginBottom: '0.5rem', color: 'var(--text)' }}>Lesson Learned</h4>
                    <p style={{ marginBottom: '1rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>{post.whatLearned}</p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {post.tags && post.tags.map(tag => (
                                <span key={tag} style={{ color: 'var(--accent)', fontSize: '0.75rem' }}>#{tag}</span>
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
