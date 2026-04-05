import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { generateTagsAndInsights } from '../utils/ai';
import { useAuth } from '../context/AuthContext';

export default function SubmitProblem() {
    const navigate = useNavigate();
    const { user } = useAuth(); // ADDED AuthContext hooked into form submission
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        whatHappened: '',
        whatTried: '',
        whatWentWrong: '',
        whatLearned: '',
        status: 'ONGOING'
    });
    const [aiResult, setAiResult] = useState(null);

    const handleSubmit = async () => {
        setLoading(true);
        // 1. Generate AI Insights and Tags
        const { tags, insights } = await generateTagsAndInsights(formData);

        setAiResult({ tags, insights });

        // 2. Save Post
        const alias = user?.alias || 'Anonymous';
        const payload = { ...formData, userAlias: alias, tags };

        try {
            await axios.post('http://localhost:8080/api/posts', payload);
            setStep(3); // Show AI Path Finder Insights
        } catch (e) {
            console.error(e);
            // Move to step 3 anyway for demo purposes if backend fails
            setStep(3);
        }
        setLoading(false);
    };

    return (
        <div className="animate-enter">
            <h2 style={{ marginBottom: '1.5rem' }}>Share Your Experience</h2>

            {step === 1 && (
                <Card>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)', fontWeight: '400' }}>Context</h3>
                    <Input
                        label="What happened?"
                        type="textarea"
                        placeholder="I was trying to deploy..."
                        value={formData.whatHappened}
                        onChange={(e) => setFormData({ ...formData, whatHappened: e.target.value })}
                    />
                    <Input
                        label="What did you try?"
                        type="textarea"
                        value={formData.whatTried}
                        onChange={(e) => setFormData({ ...formData, whatTried: e.target.value })}
                    />
                    <Button onClick={() => setStep(2)}>Next Step</Button>
                </Card>
            )}

            {step === 2 && (
                <Card className="animate-enter">
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)', fontWeight: '400' }}>The Failure & Lesson</h3>
                    <Input
                        label="What actually went wrong?"
                        type="textarea"
                        value={formData.whatWentWrong}
                        onChange={(e) => setFormData({ ...formData, whatWentWrong: e.target.value })}
                    />
                    <Input
                        label="What did you learn?"
                        type="textarea"
                        value={formData.whatLearned}
                        onChange={(e) => setFormData({ ...formData, whatLearned: e.target.value })}
                    />
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        style={{ width: '100%', padding: '1rem', borderRadius: '16px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.08)', outline: 'none', transition: 'all 0.3s', fontSize: '1rem', marginBottom: '1.5rem' }}
                        onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = 'rgba(20, 184, 166, 0.05)'; }}
                        onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(0,0,0,0.2)'; }}
                    >
                        <option value="ONGOING" style={{ background: '#0a0f1c' }}>Ongoing</option>
                        <option value="SOLVED" style={{ background: '#0a0f1c' }}>Solved</option>
                        <option value="GIVEN_UP" style={{ background: '#0a0f1c' }}>Given Up</option>
                    </select>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                        <Button onClick={handleSubmit}>{loading ? 'Analyzing via AI...' : 'Submit & Get AI Insights'}</Button>
                    </div>
                </Card>
            )}

            {step === 3 && aiResult && (
                <Card className="animate-enter" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)', fontWeight: '400' }}>AI Path Finder Insights</h3>
                    <p style={{ lineHeight: '1.6', marginBottom: '1rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>"{aiResult.insights}"</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        {aiResult.tags.map(t => (
                            <span key={t} style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>#{t}</span>
                        ))}
                    </div>
                    <Button onClick={() => navigate('/')}>View in Home Feed</Button>
                </Card>
            )}
        </div>
    );
}
