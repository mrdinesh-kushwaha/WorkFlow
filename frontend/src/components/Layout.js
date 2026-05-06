import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut, Menu, X, User, Shield } from 'lucide-react';

const Layout = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/projects', icon: FolderKanban, label: 'Projects' },
    { to: '/my-tasks', icon: CheckSquare, label: 'My Tasks' },
  ];

  return (
    <div style={{ display:'flex', height:'100vh', background:'#0f172a', color:'#f1f5f9', fontFamily:"'Geist', 'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 240 : 64,
        background: '#0f172a',
        borderRight: '1px solid #1e293b',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {/* Header */}
        <div style={{ padding: '16px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #1e293b', minHeight:64 }}>
          {sidebarOpen && (
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:32, height:32, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700 }}>T</div>
              <span style={{ fontWeight:700, fontSize:16, color:'#f1f5f9', letterSpacing:'-0.3px' }}>TaskFlow</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', padding:4, borderRadius:6, display:'flex', alignItems:'center' }}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'12px 8px' }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:12, padding:'10px 12px', borderRadius:8,
              color: isActive ? '#f1f5f9' : '#64748b',
              background: isActive ? '#1e293b' : 'transparent',
              textDecoration:'none', marginBottom:4, transition:'all 0.15s',
              fontWeight: isActive ? 600 : 400, fontSize:14,
              whiteSpace: 'nowrap', overflow:'hidden',
            })}>
              <Icon size={18} style={{ flexShrink:0 }} />
              {sidebarOpen && label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding:'12px 8px', borderTop:'1px solid #1e293b' }}>
          {sidebarOpen ? (
            <div style={{ padding:'10px 12px', borderRadius:8, background:'#1e293b' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700 }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ overflow:'hidden' }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'#f1f5f9', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</div>
                  <div style={{ fontSize:11, color:'#475569', display:'flex', alignItems:'center', gap:4 }}>
                    {isAdmin ? <><Shield size={10} /><span>Admin</span></> : <><User size={10} /><span>Member</span></>}
                  </div>
                </div>
              </div>
              <button onClick={handleLogout} style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'6px 8px', borderRadius:6, background:'transparent', border:'none', color:'#64748b', cursor:'pointer', fontSize:13, transition:'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color='#ef4444'} onMouseLeave={e => e.currentTarget.style.color='#64748b'}>
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} style={{ width:'100%', display:'flex', justifyContent:'center', padding:'10px', borderRadius:8, background:'transparent', border:'none', color:'#64748b', cursor:'pointer' }}>
              <LogOut size={18} />
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex:1, overflow:'auto', background:'#0f172a' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
