import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, Brain, Sparkles, ChevronDown, CheckCircle2, TrendingUp, Users, Github, Twitter, Mail } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Landing = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [alias, setAlias] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const { scrollYProgress } = useScroll();
    // Parallax transforms
    const yHero = useTransform(scrollYProgress, [0, 1], [0, 400]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scrollIconOp = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

    const yBg1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
    const yBg2 = useTransform(scrollYProgress, [0, 1], [0, -400]);

    if (user && !user.isAnonymous) {
        return <Navigate to="/feed" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
            const response = await fetch(`http://localhost:8080${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ alias, password }),
            });
            const data = await response.json();
            if (response.ok) {
                login(data);
                navigate('/feed');
            } else {
                setError(data.message || data.error || typeof data === 'string' ? data : (isLogin ? 'Login failed' : 'Signup failed'));
            }
        } catch (err) {
            setError('Network error');
        }
    };

    return (
        <div style={{ overflowX: 'hidden', position: 'relative' }}>
            {/* Ambient Background Glows */}
            <motion.div style={{ position: 'fixed', top: '5%', left: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, transparent 60%)', filter: 'blur(40px)', y: yBg1, zIndex: -1 }} />
            <motion.div style={{ position: 'fixed', bottom: '10%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 60%)', filter: 'blur(60px)', y: yBg2, zIndex: -1 }} />

            {/* Section 1: Hero */}
            <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '4rem 1rem 2rem', maxWidth: '1200px', margin: '0 auto', position: 'relative', justifyContent: 'center' }}>
                <motion.div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(2rem, 5vw, 4rem)', alignItems: 'center', justifyContent: 'center', y: yHero, opacity: opacityHero, zIndex: 10 }}>
                    
                    {/* Hero Text */}
                    <div style={{ flex: '1 1 400px', maxWidth: '600px', textAlign: 'left' }}>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                            style={{ display: 'inline-flex', alignItems: 'center', padding: '0.5rem 1rem', background: 'rgba(20, 184, 166, 0.1)', border: '1px solid rgba(20, 184, 166, 0.2)', borderRadius: '30px', color: 'var(--primary)', marginBottom: '1.5rem', fontWeight: '600', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }} className="animate-float">
                            <Sparkles size={16} style={{ marginRight: '8px' }} /> Redefining Social Media
                        </motion.div>
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', marginBottom: '1.2rem', lineHeight: '1.1', fontWeight: '700' }}>
                            Share Failures.<br/>
                            <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Learn & Grow.</span>
                        </motion.h1>
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                            A beautiful, distraction-free platform dedicated to turning your hardest moments into milestones. Join a community that values authenticity over perfection.
                        </motion.p>
                        
                        {/* Highlights Row */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontSize: '0.9rem' }}><CheckCircle2 size={16} color="var(--primary)" /> Ad-free</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontSize: '0.9rem' }}><CheckCircle2 size={16} color="var(--primary)" /> Anonymous options</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontSize: '0.9rem' }}><CheckCircle2 size={16} color="var(--primary)" /> Developer focused</div>
                        </motion.div>
                    </div>

                    {/* Auth Card */}
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="glass-panel" style={{ flex: '1 1 300px', padding: 'clamp(2rem, 5vw, 3rem) clamp(1.5rem, 5vw, 2.5rem)', maxWidth: '440px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--primary), var(--accent))' }} />
                        <h2 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>{isLogin ? 'Welcome Back' : 'Join Us'}</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>{isLogin ? 'Log in to access your feed and track your journey.' : 'Create an account to start sharing your journey.'}</p>
                        
                        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--red-accent)', padding: '0.75rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}
                        
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Alias / Username</label>
                                <input 
                                    type="text" value={alias} onChange={(e) => setAlias(e.target.value)} placeholder={isLogin ? "Enter your alias" : "Choose a unique alias"} required 
                                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', padding: '1rem', borderRadius: '16px', outline: 'none', transition: 'all 0.3s', fontSize: '1rem' }}
                                    onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = 'rgba(20, 184, 166, 0.05)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(0,0,0,0.2)'; }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Password</label>
                                <input 
                                    type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isLogin ? "Enter your password" : "Create a password"} required 
                                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', padding: '1rem', borderRadius: '16px', outline: 'none', transition: 'all 0.3s', fontSize: '1rem' }}
                                    onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = 'rgba(20, 184, 166, 0.05)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(0,0,0,0.2)'; }}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1.1rem', fontSize: '1.05rem', borderRadius: '16px', letterSpacing: '0.5px' }}>
                                {isLogin ? 'Login & Continue' : 'Create Account'}
                            </button>
                        </form>
                        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                            {isLogin ? "Don't have an account?" : "Already have an account?"} 
                            <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', marginLeft: '5px', cursor: 'pointer', outline: 'none', fontSize: '0.95rem' }}>
                                {isLogin ? 'Sign up' : 'Log in'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div style={{ position: 'absolute', bottom: '2rem', left: '50%', x: '-50%', opacity: scrollIconOp, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    <span style={{ opacity: 0.6 }}>Scroll</span>
                    <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
                        <ChevronDown size={20} color="var(--primary)" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Section 2: Features (Dynamic scrolling content) */}
            <section style={{ minHeight: '100vh', padding: '8rem 1rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Built for <span style={{ color: 'var(--accent)' }}>Growth</span></h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                        Every feature is designed to separate the signal from the noise, helping you extract the maximum value from the community's experiences.
                    </p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%' }}>
                    {/* Feature 1 */}
                    <motion.div className="glass-panel" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.1 }}
                         style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}
                         whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                        <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '1.2rem', borderRadius: '20px', color: 'var(--accent)', alignSelf: 'flex-start' }}>
                            <Brain size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.4rem' }}>Extract Lessons</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>Every post mandates a strict "What Happened" and "What I Learned" format, so you don't scroll aimlessly.</p>
                    </motion.div>

                    {/* Feature 2 */}
                    <motion.div className="glass-panel" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.2 }}
                         style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}
                         whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                        <div style={{ background: 'rgba(20, 184, 166, 0.1)', padding: '1.2rem', borderRadius: '20px', color: 'var(--primary)', alignSelf: 'flex-start' }}>
                            <TrendingUp size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.4rem' }}>Trending Mistakes</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>A custom algorithm prioritizes authentic discussion and highly-upvoted problem breakdowns rather than superficial content.</p>
                    </motion.div>

                    {/* Feature 3 */}
                    <motion.div className="glass-panel" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.3 }}
                         style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}
                         whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1.2rem', borderRadius: '20px', color: 'var(--red-accent)', alignSelf: 'flex-start' }}>
                            <Users size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.4rem' }}>Threaded Discourse</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>Nested comments allow the community to dissect problems and offer tactical solutions without cluttering the main feed.</p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: 'rgba(0, 0, 0, 0.6)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '4rem 1rem 2rem', backdropFilter: 'blur(20px)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem', justifyContent: 'space-between' }}>
                    <div style={{ flex: '1 1 300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '1.5rem', fontWeight: 'bold', fontSize: '1.5rem' }}>
                            <MessageCircle size={28} /> ProblemShare
                        </div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem', maxWidth: '400px' }}>
                            We believe that a culture of transparency around failures creates stronger, more resilient engineers and creatives. 
                        </p>
                    </div>
                    
                    <div style={{ flex: '1 1 200px', display: 'flex', gap: '3rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '0.5rem' }}>Platform</h4>
                            <Link to="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>About Us</Link>
                            <Link to="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Community Guidelines</Link>
                            <Link to="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>Privacy Policy</Link>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '0.5rem' }}>Connect</h4>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <a href="#" style={{ color: 'var(--text-muted)' }}><Github size={20} /></a>
                                <a href="#" style={{ color: 'var(--text-muted)' }}><Twitter size={20} /></a>
                                <a href="#" style={{ color: 'var(--text-muted)' }}><Mail size={20} /></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ maxWidth: '1200px', margin: '3rem auto 0', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
                    <span>© {new Date().getFullYear()} ProblemShare Platform. All rights reserved.</span>
                    <span>Designed for Resilience.</span>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
