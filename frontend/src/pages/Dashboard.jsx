import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const [stats, setStats] = useState({ totalPosts: 0, totalSolved: 0, tagCounts: {} });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user?.alias && !user.isAnonymous) {
            fetchStats(user.alias);
        } else if (user?.isAnonymous) {
            // we can still fetch stats for anonymous if they have an alias but maybe they shouldn't?
            fetchStats(user.alias);
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchStats = async (alias) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/analytics?userAlias=${alias}`);
            setStats(res.data);
        } catch (e) {
            console.error(e);
            setStats({
                totalPosts: 0, totalSolved: 0,
                tagCounts: {}
            });
        }
        setLoading(false);
    };

    const COLORS = ['#3b82f6', '#8b5cf6', '#ef4444', '#10b981', '#f59e0b'];

    const pieData = Object.keys(stats.tagCounts).map((key) => ({
        name: key,
        value: stats.tagCounts[key]
    }));

    if (loading) return <div className="animate-enter" style={{ textAlign: 'center', marginTop: '2rem' }}>Loading Dashboard...</div>;
    
    // We expect user?.alias to exist (even for anonymous), but if completely absent:
    if (!user?.alias) return <div className="animate-enter" style={{ textAlign: 'center', marginTop: '2rem' }}>Please <a href="/login" style={{ color: 'var(--primary)' }}>login</a> to view your personalized dashboard!</div>;

    return (
        <div className="animate-enter">
            <h2 style={{ marginBottom: '1.5rem' }}>Personalized Analytics</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <Card style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2rem', color: 'var(--primary)' }}>{stats.totalPosts}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Stories</p>
                </Card>
                <Card style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2rem', color: 'var(--green-accent)' }}>{stats.totalSolved}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Solved</p>
                </Card>
            </div>

            <Card>
                <h3 style={{ marginBottom: '1rem' }}>Trending Topics</h3>
                {pieData.length > 0 ? (
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-color)', border: 'none', borderRadius: '8px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No data yet</p>
                )}
            </Card>
        </div>
    );
}
