import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut, Menu, X, User, Shield } from 'lucide-react';

const Layout = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const isMobile = window.innerWidth <= 768;
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/projects', icon: FolderKanban, label: 'Projects' },
    { to: '/my-tasks', icon: CheckSquare, label: isAdmin ? 'Assigned Tasks' : 'My Tasks' },
  ];

  return (
      <div style={{ display:'flex', minHeight:'100dvh', width:'100%', overflowX:'hidden', background:'#0f172a', color:'#f1f5f9', fontFamily:"'Geist', 'Inter', sans-serif" }}>

        {isMobile && !sidebarOpen && (
            <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  position:'fixed',
                  top:16,
                  right:16,
                  zIndex:1100,
                  width:44,
                  height:44,
                  borderRadius:12,
                  border:'1px solid #334155',
                  background:'#1e293b',
                  color:'#fff',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  cursor:'pointer'
                }}
            >
              <Menu size={22} />
            </button>
        )}

        {isMobile && sidebarOpen && (
            <div
                onClick={() => setSidebarOpen(false)}
                style={{
                  position:'fixed',
                  inset:0,
                  background:'rgba(0,0,0,0.45)',
                  zIndex:999
                }}
            />
        )}

        <aside style={{
          width: isMobile ? 260 : (sidebarOpen ? 240 : 64),
          position: isMobile ? 'fixed' : 'relative',
          left: isMobile ? (sidebarOpen ? 0 : -260) : 'auto',
          top:0,
          bottom:0,
          height:'100dvh',
          zIndex:1000,
          background:'#0f172a',
          borderRight:'1px solid #1e293b',
          display:'flex',
          flexDirection:'column',
          transition: isMobile ? 'left 0.25s ease' : 'width 0.2s ease',
          overflow:'hidden',
          flexShrink:0,
        }}>
          <div style={{ padding:'16px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #1e293b', minHeight:64 }}>
            {sidebarOpen && (
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:32, height:32, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700 }}>T</div>
                  <span style={{ fontWeight:700, fontSize:16, color:'#f1f5f9' }}>WorkFlow</span>
                </div>
            )}

            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{ background:'none', border:'none', color:'#64748b', cursor:'pointer', padding:4, borderRadius:6, display:'flex', alignItems:'center' }}
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          <nav style={{ flex:1, padding:'12px 8px' }}>
            {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                    key={to}
                    to={to}
                    onClick={() => isMobile && setSidebarOpen(false)}
                    style={({ isActive }) => ({
                      display:'flex',
                      alignItems:'center',
                      gap:12,
                      padding:'10px 12px',
                      borderRadius:8,
                      color: isActive ? '#f1f5f9' : '#64748b',
                      background: isActive ? '#1e293b' : 'transparent',
                      textDecoration:'none',
                      marginBottom:4,
                      fontWeight: isActive ? 600 : 400,
                      fontSize:14,
                      whiteSpace:'nowrap',
                      overflow:'hidden',
                    })}
                >
                  <Icon size={18} style={{ flexShrink:0 }} />
                  {sidebarOpen && label}
                </NavLink>
            ))}
          </nav>

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

                  <button onClick={handleLogout} style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'6px 8px', borderRadius:6, background:'transparent', border:'none', color:'#64748b', cursor:'pointer', fontSize:13 }}>
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

        <main style={{ flex:1, width:'100%', minWidth:0, overflowX:'hidden', overflowY:'auto', background:'#0f172a' }}>
          <Outlet />
        </main>
      </div>
  );
};

export default Layout;