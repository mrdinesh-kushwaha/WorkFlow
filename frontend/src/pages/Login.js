import React, { useState } from 'react';
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
    <div style={{ minHeight:'100vh', background:'#0f172a', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ width:'100%', maxWidth:420 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:48, height:48, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius:12, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:700, marginBottom:16 }}>T</div>
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

          <div style={{ marginTop:16, padding:'12px', background:'#0f172a', borderRadius:8, border:'1px solid #334155' }}>
            <p style={{ color:'#64748b', fontSize:12, margin:0, textAlign:'center' }}>Demo: signup with any email to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
