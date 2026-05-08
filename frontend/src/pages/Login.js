import React, { useState } from 'react';
import { CheckSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100dvh', background:'#0f172a', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ width:'100%', maxWidth:420 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div
              style={{
                position:'relative',
                width:72,
                height:72,
                margin:'0 auto 20px',
              }}
          >
            <div
                style={{
                  position:'absolute',
                  inset:0,
                  borderRadius:22,
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
                  size={34}
                  color="#8b5cf6"
                  strokeWidth={2.5}
              />
            </div>
          </div>
          <h1 style={{ color:'#f1f5f9', fontSize:26, fontWeight:700, margin:0, letterSpacing:'-0.5px' }}>Welcome back</h1>
          <p style={{ color:'#64748b', marginTop:8, fontSize:14 }}>Sign in to your TaskFlow account</p>
        </div>

        <div style={{ background:'#1e293b', borderRadius:16, padding:32, border:'1px solid #334155' }}>
          <form onSubmit={handleSubmit}>
            {[
              { label:'Email', type:'email', key:'email', placeholder:'you@example.com' },
              { label:'Password', type:'password', key:'password', placeholder:'••••••••' },
            ].map(({ label, type, key, placeholder }) => (
              <div key={key} style={{ marginBottom:20 }}>
                <label style={{ display:'block', color:'#94a3b8', fontSize:13, fontWeight:500, marginBottom:6 }}>{label}</label>
                <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder} required
                  style={{ width:'100%', padding:'10px 12px', background:'#0f172a', border:'1px solid #334155', borderRadius:8, color:'#f1f5f9', fontSize:14, outline:'none', boxSizing:'border-box', transition:'border-color 0.15s' }}
                  onFocus={e => e.target.style.borderColor='#6366f1'} onBlur={e => e.target.style.borderColor='#334155'} />
              </div>
            ))}
            <button type="submit" disabled={loading} style={{ width:'100%', padding:'11px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', borderRadius:8, color:'white', fontSize:14, fontWeight:600, cursor:'pointer', opacity: loading ? 0.7 : 1, marginTop:4 }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div style={{ marginTop:20, textAlign:'center' }}>
            <p style={{ color:'#64748b', fontSize:13 }}>Don't have an account?{' '}
              <Link to="/signup" style={{ color:'#818cf8', textDecoration:'none', fontWeight:500 }}>Sign up</Link>
            </p>
          </div>

          {/*<div style={{ marginTop:16, padding:'12px', background:'#0f172a', borderRadius:8, border:'1px solid #334155' }}>*/}
          {/*  /!*<p style={{ color:'#64748b', fontSize:12, margin:0, textAlign:'center' }}>Demo: signup with any email to get started</p>*!/*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  );
};

export default Login;
