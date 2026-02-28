import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import Card from '../components/Card';

export default function Dashboard() {
    const [stats, setStats] = useState({ totalPosts: 0, totalSolved: 0, tagCounts: {} });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/analytics');
            setStats(res.data);
        } catch (e) {
            console.error(e);
            setStats({
                totalPosts: 5, totalSolved: 3,
                tagCounts: { failure: 4, react: 2, database: 3 }
            });
        }
        setLoading(false);
    };

    const COLORS = ['#3b82f6', '#8b5cf6', '#ef4444', '#10b981', '#f59e0b'];

    const pieData = Object.keys(stats.tagCounts).map((key) => ({
        name: key,
        value: stats.tagCounts[key]
    }));

    return (
        <div className="animate-enter">
            <h2 style={{ marginBottom: '1.5rem' }}>Analytics Dashboard</h2>

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
