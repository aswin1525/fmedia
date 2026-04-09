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
    const [manualTags, setManualTags] = useState('');
    const [tagLoading, setTagLoading] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const [listeningField, setListeningField] = useState(null);
    const recognitionRef = React.useRef(null);
    const initialTextRef = React.useRef("");

    const startDictation = (field) => {
        // If already listening, stop it.
        if (listeningField === field && recognitionRef.current) {
            recognitionRef.current.stop();
            setListeningField(null);
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Your browser does not support Voice Recognition.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = true; // Instantly type as you speak
        recognition.maxAlternatives = 1;
        
        recognitionRef.current = recognition;
        initialTextRef.current = formData[field] || "";

        recognition.onstart = () => {
            setListeningField(field);
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            const currentSpoken = finalTranscript + interimTranscript;
            const prependedText = initialTextRef.current ? initialTextRef.current + ' ' : '';
            
            setFormData(prev => ({
                ...prev,
                [field]: prependedText + currentSpoken
            }));
            
            // If it's final, update the initialTextRef so subsequent clauses append correctly!
            if (finalTranscript) {
                initialTextRef.current = prependedText + finalTranscript;
            }
        };

        recognition.onerror = (event) => {
            console.error(event.error);
            setListeningField(null);
        };

        recognition.onend = () => {
            setListeningField(null);
        };

        recognition.start();
    };

    const handleGenerateTags = async () => {
        setTagLoading(true);
        try {
            const res = await axios.post('/api/ai/tags', { description: formData.whatHappened });
            if (res.data && res.data.length > 0) {
                 setManualTags(res.data.join(', '));
            }
        } catch (e) {
            console.error(e);
        }
        setTagLoading(false);
    };

    const handleSubmit = async (useAiSummary) => {
        setLoading(true);
        let finalTags = manualTags.split(',').map(t => t.trim()).filter(t => t);
        
        if (useAiSummary) {
            const { tags, insights } = await generateTagsAndInsights(formData);
            finalTags = finalTags.length > 0 ? Array.from(new Set([...finalTags, ...tags])) : tags;
            setAiResult({ tags: finalTags, insights });
        }

        // 2. Save Post
        const alias = user?.alias || 'Anonymous';
        const payload = { ...formData, userAlias: alias, tags: finalTags };

        try {
            await axios.post('/api/posts', payload);
            if (useAiSummary) {
                setStep(3); // Show AI Path Finder Insights
            } else {
                navigate('/'); // Just skip to feed
            }
        } catch (e) {
            console.error(e);
            if (useAiSummary) setStep(3);
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
                        onMicClick={() => startDictation('whatHappened')}
                        isListening={listeningField === 'whatHappened'}
                    />
                    <Input
                        label="What did you try?"
                        type="textarea"
                        value={formData.whatTried}
                        onChange={(e) => setFormData({ ...formData, whatTried: e.target.value })}
                        onMicClick={() => startDictation('whatTried')}
                        isListening={listeningField === 'whatTried'}
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
                        onMicClick={() => startDictation('whatWentWrong')}
                        isListening={listeningField === 'whatWentWrong'}
                    />
                    <Input
                        label="What did you learn?"
                        type="textarea"
                        value={formData.whatLearned}
                        onChange={(e) => setFormData({ ...formData, whatLearned: e.target.value })}
                        onMicClick={() => startDictation('whatLearned')}
                        isListening={listeningField === 'whatLearned'}
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

                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '0.5rem' }}>
                            <div style={{ width: '100%' }}>
                                <Input
                                    label="Tags (comma separated)"
                                    type="text"
                                    value={manualTags}
                                    onChange={(e) => setManualTags(e.target.value)}
                                    placeholder="e.g. react, css, deployment"
                                />
                            </div>
                            <Button onClick={handleGenerateTags} disabled={tagLoading} variant="secondary" style={{ width: '100%', height: '48px' }}>
                                {tagLoading ? 'Loading...' : 'Auto-generate Tags'}
                            </Button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                        <Button onClick={() => handleSubmit(false)} disabled={loading} style={{ background: 'var(--bg-panel)', color: 'var(--text-main)', border: '1px solid rgba(255,255,255,0.2)' }}>
                            {loading ? 'Posting...' : 'Post Without AI Summary'}
                        </Button>
                        <Button onClick={() => handleSubmit(true)} disabled={loading}>
                            {loading ? 'Analyzing via AI...' : 'Submit & Get AI Summary'}
                        </Button>
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
