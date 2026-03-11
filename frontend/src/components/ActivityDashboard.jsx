import React from 'react';
import Card from './Card';

export default function ActivityDashboard({ stats }) {
    if (!stats) return null;

    const { totalPosts, totalUpvotes, totalReposts, commonTags } = stats;

    return (
        <Card style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Activity Dashboard</h3>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{totalPosts}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Posts</div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{totalUpvotes}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Upvotes Received</div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{totalReposts}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Reposts</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--text)' }}>Most Common Tags</h4>
                    {commonTags && Object.keys(commonTags).length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {Object.entries(commonTags).map(([tag, count]) => (
                                <span key={tag} style={{
                                    padding: '0.25rem 0.75rem',
                                    backgroundColor: 'rgba(20, 184, 166, 0.2)',
                                    color: 'var(--primary)',
                                    borderRadius: '16px',
                                    fontSize: '0.875rem'
                                }}>
                                    #{tag} ({count})
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No tags yet. Share a post to see them here.</p>
                    )}
                </div>

                <div>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--text)' }}>Failures by Category</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Not enough data to categorize yet.</p>
                </div>
            </div>

            <div>
                <h4 style={{ marginBottom: '1rem', color: 'var(--text)' }}>AI-Detected Emotional Patterns</h4>
                <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic' }}>
                        "Your recent posts suggest a focus on technical perseverance with underlying themes of frustration turning into methodical problem-solving."
                    </p>
                </div>
            </div>
        </Card>
    );
}
