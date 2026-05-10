import React, { useEffect, useState } from 'react';
import { CheckSquare } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Signup = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const error = params.get('error');

        if (error === 'user_exists') {
            toast.error('Your data already exists in our system. Please sign in.', {
                id: 'user-exists-error'
            });
            navigate('/signup', { replace: true });
        }
    }, [location.search, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signup(form);
            toast.success('Account created!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Signup failed');
        } finally { setLoading(false); }
    };

    return (
        <div style={{
            minHeight:'100dvh',
            background:'#0f172a',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            padding:20,
            boxSizing:'border-box',
            overflowY:'auto',
            overflowX:'hidden',
            position:'relative'
        }}>
            <div style={{
                position:'fixed',
                top:24,
                right: window.innerWidth <= 768 ? '50%' : 72,
                transform: window.innerWidth <= 768 ? 'translateX(50%)' : 'none',
                zIndex:10,
                display:'flex',
                gap:10,
                padding:6,
                background:'rgba(30,41,59,0.75)',
                border:'1px solid #334155',
                borderRadius:16,
                backdropFilter:'blur(12px)'
            }}>
                {['MEMBER', 'ADMIN'].map(role => (
                    <button
                        key={role}
                        type="button"
                        onClick={() => setForm({ ...form, role })}
                        style={{
                            minWidth:96,
                            padding:'10px 18px',
                            borderRadius:12,
                            border:'none',
                            background: form.role === role ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
                            color: form.role === role ? '#ffffff' : '#94a3b8',
                            fontSize:14,
                            fontWeight:700,
                            cursor:'pointer',
                            boxShadow: form.role === role ? '0 10px 28px rgba(99,102,241,0.30)' : 'none'
                        }}
                    >
                        {role === 'MEMBER' ? 'Member' : 'Admin'}
                    </button>
                ))}
            </div>
            <div style={{ width:'100%', maxWidth:450 }}>
                <div style={{ textAlign:'center', marginBottom:32 }}>
                    <div
                        style={{
                            position:'relative',
                            width:80,
                            height:80,
                            margin:'0 auto 20px',
                        }}
                    >
                        <div
                            style={{
                                position:'absolute',
                                inset:0,
                                borderRadius:24,
                                background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                boxShadow:'0 20px 50px rgba(99,102,241,0.45)',
                                transform:'rotate(-6deg)',
                                opacity:0.9
                            }}
                        />

                        <div
                            style={{
                                position:'absolute',
                                inset:0,
                                borderRadius:22,
                                background:'rgba(30,41,59,0.92)',
                                border:'1px solid rgba(255,255,255,0.08)',
                                backdropFilter:'blur(12px)',
                                display:'flex',
                                alignItems:'center',
                                justifyContent:'center',
                                transform:'rotate(0deg)',
                            }}
                        >
                            <CheckSquare
                                size={38}
                                color="#8b5cf6"
                                strokeWidth={2.5}
                            />
                        </div>
                    </div>
                    <h1 style={{ color:'#f1f5f9', fontSize:28, fontWeight:700, margin:0, letterSpacing:'-0.6px' }}>Create account</h1>
                    <p style={{ color:'#64748b', marginTop:8, fontSize:14 }}>Join TaskFlow to manage your projects</p>
                </div>

                <div style={{ background:'#1e293b', borderRadius:16, padding:32, border:'1px solid #334155' }}>
                    <form onSubmit={handleSubmit}>
                        {[
                            { label:'Full Name', type:'text', key:'name', placeholder:'John Doe' },
                            { label:'Email', type:'email', key:'email', placeholder:'you@example.com' },
                            { label:'Password', type:'password', key:'password', placeholder:'Min 6 characters' },
                        ].map(({ label, type, key, placeholder }) => (
                            <div key={key} style={{ marginBottom:20 }}>
                                <label style={{ display:'block', color:'#94a3b8', fontSize:13, fontWeight:500, marginBottom:6 }}>{label}</label>
                                <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                                       placeholder={placeholder} required minLength={key === 'password' ? 6 : undefined}
                                       style={{ width:'100%', padding:'12px 14px', background:'#0f172a', border:'1px solid #334155', borderRadius:8, color:'#f1f5f9', fontSize:14, outline:'none', boxSizing:'border-box' }}
                                       onFocus={e => e.target.style.borderColor='#6366f1'} onBlur={e => e.target.style.borderColor='#334155'} />
                            </div>
                        ))}

                        <button type="submit" disabled={loading} style={{ width:'100%', padding:'14px', background:'#238636', border:'none', borderRadius:8, color:'white', fontSize:16, fontWeight:700, cursor:'pointer', opacity: loading ? 0.7 : 1 }}>
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>

                        <div style={{
                            display:'flex',
                            alignItems:'center',
                            gap:14,
                            margin:'26px 0 20px'
                        }}>
                            <div style={{ flex:1, height:1, background:'#334155' }} />
                            <span style={{ color:'#f1f5f9', fontSize:16, fontWeight:600 }}>or</span>
                            <div style={{ flex:1, height:1, background:'#334155' }} />
                        </div>

                    </form>

                    <div style={{
                        display:'flex',
                        justifyContent:'center',
                        alignItems:'center',
                        gap:18,
                        marginTop:14
                    }}>
                        <button
                            type="button"
                            onClick={() => {
                                document.cookie = `TF_ROLE=${form.role}; path=/`;
                                document.cookie = `TF_AUTH_MODE=SIGNUP; path=/`;
                                window.location.href =
                                    `${process.env.REACT_APP_API_URL || ''}/oauth2/authorization/google`;
                            }}
                            title="Continue with Google"
                            style={{
                                width:52,
                                height:52,
                                borderRadius:'50%',
                                border:'1px solid #334155',
                                background:'#0f172a',
                                display:'flex',
                                alignItems:'center',
                                justifyContent:'center',
                                cursor:'pointer'
                            }}
                        >
                            <img
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="Google"
                                style={{ width:24, height:24 }}
                            />
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                document.cookie = `TF_ROLE=${form.role}; path=/`;
                                document.cookie = `TF_AUTH_MODE=SIGNUP; path=/`;
                                window.location.href =
                                    `${process.env.REACT_APP_API_URL || ''}/oauth2/authorization/github`;
                            }}
                            title="Continue with GitHub"
                            style={{
                                width:52,
                                height:52,
                                borderRadius:'50%',
                                border:'1px solid #334155',
                                background:'#0f172a',
                                display:'flex',
                                alignItems:'center',
                                justifyContent:'center',
                                cursor:'pointer'
                            }}
                        >
                            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                                <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 5.02 3.26 9.27 7.79 10.78.57.1.78-.25.78-.55v-2.15c-3.17.69-3.84-1.35-3.84-1.35-.52-1.3-1.26-1.65-1.26-1.65-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.53-.29-5.19-1.27-5.19-5.64 0-1.24.44-2.25 1.16-3.04-.12-.28-.5-1.44.11-3 0 0 .95-.3 3.12 1.16a10.8 10.8 0 0 1 5.68 0c2.17-1.46 3.12-1.16 3.12-1.16.61 1.56.23 2.72.11 3 .72.79 1.16 1.8 1.16 3.04 0 4.38-2.67 5.35-5.21 5.63.41.35.77 1.03.77 2.08v3.09c0 .3.2.66.79.55 4.52-1.51 7.78-5.76 7.78-10.78C23.25 5.48 18.27.5 12 .5z"/>
                            </svg>
                        </button>
                    </div>

                    <div style={{ marginTop:20, textAlign:'center' }}>
                        <p style={{ color:'#64748b', fontSize:13 }}>Already have an account?{' '}
                            <Link to="/login" style={{ color:'#818cf8', textDecoration:'none', fontWeight:500 }}>Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;