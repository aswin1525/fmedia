import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import { ThumbsUp, Share2, MessageCircle, Trash2, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeComments, setActiveComments] = useState({}); // postId -> boolean
    const [commentInputs, setCommentInputs] = useState({}); // postId -> string
    const [postComments, setPostComments] = useState({}); // postId -> []
    // Track interactions ideally from backend, but for immediate UI feedback we can track locally
    const [userInteractions, setUserInteractions] = useState({ upvotes: new Set(), reposts: new Set() });
    const { user } = useAuth();
    const alias = user?.alias || 'Anonymous';

    useEffect(() => {
        fetchPosts();
        // A complete robust implementation would fetch the user's past interactions here too.
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const endpoint = user ? `/api/feed/personalized?userAlias=${user.alias}` : '/api/feed/trending';
            const res = await axios.get(`http://localhost:8080${endpoint}`);
            setPosts(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleInteract = async (id, type) => {
        try {
            await axios.post(`http://localhost:8080/api/posts/${id}/interact?alias=${alias}&type=${type}`);
            
            // Optimistic UI Update for toggle
            setPosts(posts.map(post => {
                if (post.id === id) {
                    const isUpvote = type === 'UPVOTE';
                    const interactionSet = isUpvote ? userInteractions.upvotes : userInteractions.reposts;
                    const countField = isUpvote ? 'upvotes' : 'reposts';
                    
                    const newSet = new Set(interactionSet);
                    let newCount = post[countField];

                    if (newSet.has(id)) {
                        newSet.delete(id);
                        newCount = Math.max(0, newCount - 1);
                    } else {
                        newSet.add(id);
                        newCount++;
                    }

                    setUserInteractions({
                        ...userInteractions,
                        [isUpvote ? 'upvotes' : 'reposts']: newSet
                    });

                    return { ...post, [countField]: newCount };
                }
                return post;
            }));
            
            fetchPosts(); // sync with backend
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/posts/${id}?alias=${alias}`);
            setPosts(posts.filter(p => p.id !== id));
        } catch (e) {
            console.error("Failed to delete post", e);
            alert("Could not delete post.");
        }
    };

    const toggleComments = async (id) => {
        const isOpening = !activeComments[id];
        setActiveComments({ ...activeComments, [id]: isOpening });
        
        if (isOpening && !postComments[id]) {
            try {
                const res = await axios.get(`http://localhost:8080/api/posts/${id}/comments`);
                setPostComments({ ...postComments, [id]: res.data });
            } catch(e) { console.error(e); }
        }
    };

    const submitComment = async (id, parentId = null) => {
        const inputKey = parentId ? `${id}-${parentId}` : id;
        const content = commentInputs[inputKey]?.trim();
        if (!content) return;
        try {
            const res = await axios.post(`http://localhost:8080/api/posts/${id}/comments?alias=${alias}`, { 
                content: content,
                parentId: parentId
            });
            setPostComments({
                ...postComments,
                [id]: [...(postComments[id] || []), res.data]
            });
            setCommentInputs({ ...commentInputs, [inputKey]: '' });
        } catch(e) { console.error(e); }
    };

    return (
        <div className="animate-enter">
            <h2 style={{ marginBottom: '1.5rem', fontWeight: '300', letterSpacing: '1px' }}>FEED</h2>
            
            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    Loading feed...
                </div>
            ) : (
                <>
                    {posts.map(post => {
                const isOwner = post.userAlias === alias;
                const hasUpvoted = userInteractions.upvotes.has(post.id);
                const hasReposted = userInteractions.reposts.has(post.id);

                return (
                    <Card key={post.id} style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <span style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '1.1rem' }}>{post.userAlias}</span>
                                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {post.status}
                                </span>
                            </div>
                            {isOwner && (
                                <button onClick={() => handleDelete(post.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', opacity: 0.6 }}>
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                        
                        <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.3rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>The Failure</h4>
                        <p style={{ marginBottom: '1.2rem', fontSize: '1.05rem', lineHeight: '1.6' }}>{post.whatHappened}</p>

                        <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.3rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>The Lesson</h4>
                        <p style={{ marginBottom: '1.5rem', fontSize: '1.05rem', lineHeight: '1.6', color: 'var(--accent)' }}>{post.whatLearned}</p>

                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                            {post.tags?.map(t => (
                                <span key={t} style={{ color: 'var(--text-muted)', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '8px' }}>#{t}</span>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                            <button className="btn-ghost" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: hasUpvoted ? 'var(--text-main)' : 'var(--text-muted)', transition: '0.2s' }} onClick={() => handleInteract(post.id, 'UPVOTE')}>
                                <ThumbsUp size={18} fill={hasUpvoted ? "currentColor" : "none"} /> <span style={{ fontWeight: hasUpvoted ? '600' : '400'}}>{post.upvotes}</span>
                            </button>
                            <button className="btn-ghost" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: hasReposted ? 'var(--text-main)' : 'var(--text-muted)', transition: '0.2s' }} onClick={() => handleInteract(post.id, 'REPOST')}>
                                <Share2 size={18} fill={hasReposted ? "currentColor" : "none"} /> <span style={{ fontWeight: hasReposted ? '600' : '400'}}>{post.reposts}</span>
                            </button>
                            <button className="btn-ghost" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => toggleComments(post.id)}>
                                <MessageCircle size={18} /> <span style={{ fontWeight: '400'}}>{post.commentCount || 0}</span>
                            </button>
                        </div>

                        {/* Comments Section */}
                        {activeComments[post.id] && (
                            <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                    {postComments[post.id]?.length > 0 ? (
                                        (() => {
                                            // Helper to build comment tree
                                            const comments = postComments[post.id];
                                            const commentMap = {};
                                            const roots = [];
                                            comments.forEach(c => {
                                                commentMap[c.id] = { ...c, children: [] };
                                            });
                                            comments.forEach(c => {
                                                if (c.parentId) {
                                                    if (commentMap[c.parentId]) {
                                                        commentMap[c.parentId].children.push(commentMap[c.id]);
                                                    }
                                                } else {
                                                    roots.push(commentMap[c.id]);
                                                }
                                            });

                                            const renderComments = (nodes, depth = 0) => {
                                                return nodes.map(node => (
                                                    <div key={node.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: depth > 0 ? '1.5rem' : '0', marginTop: depth > 0 ? '0.5rem' : '0', borderLeft: depth > 0 ? '2px solid rgba(255,255,255,0.1)' : 'none', paddingLeft: depth > 0 ? '1rem' : '0' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '600' }}>{node.userAlias}</span>
                                                            <button 
                                                                onClick={() => {
                                                                    setCommentInputs({...commentInputs, [`${post.id}-reply`]: node.id});
                                                                }}
                                                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}
                                                            >
                                                                Reply
                                                            </button>
                                                        </div>
                                                        <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', margin: 0 }}>{node.content}</p>
                                                        
                                                        {/* Reply Input for this specific node */}
                                                        {commentInputs[`${post.id}-reply`] === node.id && (
                                                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                                                <input 
                                                                    autoFocus
                                                                    type="text" 
                                                                    value={commentInputs[`${post.id}-${node.id}`] || ''}
                                                                    onChange={(e) => setCommentInputs({...commentInputs, [`${post.id}-${node.id}`]: e.target.value})}
                                                                    placeholder="Write a reply..."
                                                                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.5rem 1rem', borderRadius: '12px', outline: 'none', fontSize: '0.85rem' }}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') {
                                                                            submitComment(post.id, node.id);
                                                                            setCommentInputs({...commentInputs, [`${post.id}-reply`]: null});
                                                                        }
                                                                    }}
                                                                />
                                                                <button 
                                                                    onClick={() => {
                                                                        submitComment(post.id, node.id);
                                                                        setCommentInputs({...commentInputs, [`${post.id}-reply`]: null});
                                                                    }} 
                                                                    style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                                >
                                                                    Reply
                                                                </button>
                                                            </div>
                                                        )}

                                                        {node.children.length > 0 && (
                                                            <div style={{ marginTop: '0.5rem' }}>
                                                                {renderComments(node.children, depth + 1)}
                                                            </div>
                                                        )}
                                                    </div>
                                                ));
                                            };

                                            return renderComments(roots);
                                        })()
                                    ) : (
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>No comments yet. Start the conversation!</p>
                                    )}
                                </div>
                                
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <input 
                                        type="text" 
                                        value={commentInputs[post.id] || ''}
                                        onChange={(e) => setCommentInputs({...commentInputs, [post.id]: e.target.value})}
                                        placeholder="Add a comment to the post..."
                                        style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', padding: '0.75rem 1.25rem', borderRadius: '24px', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem' }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                        onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                                        onKeyDown={(e) => e.key === 'Enter' && submitComment(post.id)}
                                    />
                                    <button onClick={() => submitComment(post.id)} style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 12px rgba(20, 184, 166, 0.4)' }}
                                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </Card>
                );
            })}
            {posts.length === 0 && !loading && <p style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)' }}>No stories shared yet. Be the first.</p>}
            </>
            )}
        </div>
    );
}
