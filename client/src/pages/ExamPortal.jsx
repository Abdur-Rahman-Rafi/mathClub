import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ShieldAlert, Upload, Link, CheckCircle2, AlertTriangle } from 'lucide-react';
import API_BASE_URL from '../apiConfig';

const ExamPortal = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [tabSwitches, setTabSwitches] = useState(0);
    const [isTerminated, setIsTerminated] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({ submission_file_url: '', submission_link: '' });
    const [uploading, setUploading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const timerRef = useRef(null);

    useEffect(() => {
        if (!user.id) { navigate('/login'); return; }
        fetchExam();

        // Cheat Protection: Tab Tracking
        const handleVisibilityChange = () => {
            if (document.hidden && !isSubmitted && !isTerminated) {
                setTabSwitches(prev => {
                    const next = prev + 1;
                    updateTracking(next, false);
                    if (next >= 1) { // Immediate termination on first switch as per "strict" requirement
                        terminateExam();
                    }
                    return next;
                });
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.onblur = handleVisibilityChange;

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            clearInterval(timerRef.current);
            window.onblur = null;
        };
    }, []);

    const fetchExam = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/exams/${id}`);
            const data = await res.json();
            if (data) {
                setExam(data);
                setTimeLeft(data.duration_minutes * 60);
                startTimer();
                // Initialize submission entry
                registerEntry();
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const registerEntry = async () => {
        try {
            await fetch(`${API_BASE_URL}/submissions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ exam_id: id, user_id: user.id, is_terminated: 0, tab_switches: 0 })
            });
        } catch (err) { console.error('Entry registration failed'); }
    };

    const updateTracking = async (switches, terminated) => {
        try {
            await fetch(`${API_BASE_URL}/submissions`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ exam_id: id, user_id: user.id, inc_switches: 1, is_terminated: terminated ? 1 : 0 })
            });
        } catch (err) { console.error('Tracking update failed'); }
    };

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    submitExam();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const terminateExam = () => {
        setIsTerminated(true);
        clearInterval(timerRef.current);
        updateTracking(tabSwitches + 1, true);
        alert('EXAM TERMINATED: Unauthorized tab switching detected. Your submission has been closed.');
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const fd = new FormData();
        fd.append('file', file);
        try {
            const res = await fetch(`${API_BASE_URL}/upload`, { method: 'POST', body: fd });
            const data = await res.json();
            if (data.success) {
                setFormData({ ...formData, submission_file_url: data.url });
            }
        } catch (err) { alert('Upload failed'); }
        finally { setUploading(false); }
    };

    const submitExam = async (e) => {
        if (e) e.preventDefault();
        clearInterval(timerRef.current);
        try {
            const res = await fetch(`${API_BASE_URL}/submissions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    exam_id: id, user_id: user.id,
                    submission_file_url: formData.submission_file_url,
                    submission_link: formData.submission_link,
                    is_terminated: 0, tab_switches: tabSwitches
                })
            });
            if (res.ok) {
                setIsSubmitted(true);
            }
        } catch (err) { alert('Error submitting exam'); }
    };

    if (loading) return <div>Loading exam portal...</div>;
    if (!exam) return <div>Exam not found.</div>;

    if (isTerminated) {
        return (
            <div className="page-container" style={{ textAlign: 'center', padding: '10rem 5%' }}>
                <ShieldAlert size={80} color="#ef4444" style={{ marginBottom: '2rem' }} />
                <h1 style={{ color: '#ef4444', fontSize: '2.5rem', fontWeight: '900' }}>EXAM TERMINATED</h1>
                <p style={{ color: '#64748b', fontSize: '1.2rem', maxWidth: '600px', margin: '1.5rem auto' }}>
                    Access to this exam was revoked due to a security violation (tab switching/window focus loss).
                    Your activity has been logged for review by admins.
                </p>
                <button onClick={() => navigate('/exams')} style={{ padding: '12px 30px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Return to Exams</button>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="page-container" style={{ textAlign: 'center', padding: '10rem 5%' }}>
                <CheckCircle2 size={80} color="#10b981" style={{ marginBottom: '2rem' }} />
                <h1 style={{ color: '#1e293b', fontSize: '2.5rem', fontWeight: '900' }}>SUBMISSION SUCCESSFUL</h1>
                <p style={{ color: '#64748b', fontSize: '1.2rem', maxWidth: '600px', margin: '1.5rem auto' }}>
                    Congratulations! Your answers for <strong>{exam.title}</strong> have been successfully submitted.
                    Results will be announced soon on the achievements page.
                </p>
                <button onClick={() => navigate('/exams')} style={{ padding: '12px 30px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Back to Portal</button>
            </div>
        );
    }

    return (
        <div className="page-container" style={{ background: '#f8fafc', minHeight: '100vh', padding: '2rem 5%' }}>
            {/* Header / Timer Bar */}
            <div style={{ position: 'sticky', top: '80px', zIndex: 100, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', padding: '1rem 2rem', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#1e293b' }}>{exam.title}</h2>
                    <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: '700' }}><ShieldAlert size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> CHEAT PROTECTION ACTIVE</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: timeLeft < 300 ? '#fee2e2' : '#f1f5f9', padding: '8px 20px', borderRadius: '12px', transition: 'background 0.3s' }}>
                    <Clock size={20} color={timeLeft < 300 ? '#ef4444' : '#3b82f6'} />
                    <span style={{ fontSize: '1.2rem', fontWeight: '900', color: timeLeft < 300 ? '#ef4444' : '#1e293b' }}>{formatTime(timeLeft)}</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', alignItems: 'start' }}>
                {/* Question Area */}
                <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>Questions</h3>
                    {exam.question_file_url ? (
                        <iframe src={exam.question_file_url} style={{ width: '100%', height: '800px', border: 'none', borderRadius: '12px' }} title="Exam Question" />
                    ) : (
                        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#f8fafc', borderRadius: '16px' }}>
                            <AlertTriangle size={48} color="#f59e0b" style={{ marginBottom: '1rem' }} />
                            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Questions are available at the following link:</p>
                            <a href={exam.question_link} target="_blank" rel="noreferrer" style={{ fontSize: '1.2rem', color: '#3b82f6', fontWeight: '700', textDecoration: 'underline' }}>CLICK HERE TO VIEW QUESTIONS</a>
                            <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#94a3b8' }}>Don't forget: Your camera and tab switching are being monitored.</p>
                        </div>
                    )}
                </div>

                {/* Submission Area */}
                <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', position: 'sticky', top: '180px' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Your Submission</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>Upload your solution as a PDF or high-quality JPG. Ensure all steps are clearly visible.</p>

                    <form onSubmit={submitExam}>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '150px', border: '2px dashed #cbd5e1', borderRadius: '16px', cursor: 'pointer', background: formData.submission_file_url ? '#f0fdf4' : '#f8fafc', transition: 'all 0.3s' }}>
                                <Upload size={32} color={formData.submission_file_url ? '#10b981' : '#64748b'} />
                                <span style={{ marginTop: '10px', fontSize: '0.9rem', fontWeight: '600', color: formData.submission_file_url ? '#10b981' : '#475569' }}>
                                    {uploading ? 'Uploading...' : (formData.submission_file_url ? 'File Captured!' : 'Click to Upload Answer')}
                                </span>
                                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} style={{ display: 'none' }} />
                            </label>
                        </div>

                        <div style={{ marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                <Link size={16} color="#64748b" />
                                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Or Submit via Link (Google Drive/Dropbox)</span>
                            </div>
                            <input
                                type="url"
                                placeholder="https://..."
                                style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                                value={formData.submission_link}
                                onChange={e => setFormData({ ...formData, submission_link: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!formData.submission_file_url && !formData.submission_link}
                            style={{
                                width: '100%', padding: '15px', borderRadius: '16px', border: 'none',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white', fontSize: '1.1rem', fontWeight: '800', cursor: 'pointer',
                                opacity: (!formData.submission_file_url && !formData.submission_link) ? 0.6 : 1
                            }}
                        >
                            FINISH & SUBMIT EXAM
                        </button>
                    </form>

                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fffbeb', borderRadius: '16px', border: '1px solid #fde68a' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <AlertTriangle color="#d97706" size={20} />
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#92400e', lineHeight: '1.4' }}>
                                <strong>WARNING:</strong> Switching tabs or minimizing the browser will result in <strong>IMMEDIATE TERMINATION</strong> of your exam session. Ensure you have a stable connection.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamPortal;
