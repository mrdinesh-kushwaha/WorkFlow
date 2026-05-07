import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI } from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Plus, FolderKanban, Users, CheckSquare, Trash2, ArrowRight } from 'lucide-react';

const Modal = ({ open, title, onClose, children }) => {
  if (!open) return null;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 }}>
      <div style={{ background:'#1e293b', border:'1px solid #334155', borderRadius:16, padding:28, width:'100%', maxWidth:460 }}>
        <h2 style={{ color:'#f1f5f9', fontSize:18, fontWeight:600, margin:'0 0 20px' }}>{title}</h2>
        {children}
        <button onClick={onClose} style={{ marginTop:12, padding:'8px 16px', background:'transparent', border:'1px solid #334155', borderRadius:8, color:'#64748b', cursor:'pointer', fontSize:13 }}>Cancel</button>
      </div>
    </div>
  );
};

const inputStyle = { width:'100%', padding:'10px 12px', background:'#0f172a', border:'1px solid #334155', borderRadius:8, color:'#f1f5f9', fontSize:14, outline:'none', boxSizing:'border-box', marginBottom:16 };

const Projects = () => {
    const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name:'', description:'' });
  const [creating, setCreating] = useState(false);

  const load = () => projectAPI.getAll().then(r => setProjects(r.data)).catch(console.error).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await projectAPI.create(form);
      toast.success('Project created!');
      setShowCreate(false);
      setForm({ name:'', description:'' });
      load();
    } catch (err) { toast.error('Failed to create project'); }
    finally { setCreating(false); }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (!window.confirm('Delete this project?')) return;
    try {
      await projectAPI.delete(id);
      toast.success('Project deleted');
      setProjects(p => p.filter(x => x.id !== id));
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <div style={{ padding:32, color:'#64748b', fontSize:14 }}>Loading...</div>;

  return (
    <div style={{ padding:32, maxWidth:1100 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
        <div>
          <h1 style={{ color:'#f1f5f9', fontSize:24, fontWeight:700, margin:0, letterSpacing:'-0.5px' }}>Projects</h1>
          <p style={{ color:'#64748b', fontSize:14, marginTop:4 }}>{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
          {user?.role === 'ADMIN' && (
              <button onClick={() => setShowCreate(true)} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 18px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', borderRadius:8, color:'white', fontSize:14, fontWeight:600, cursor:'pointer' }}>
                  <Plus size={16} /> New Project
              </button>
          )}
      </div>

      {projects.length === 0 ? (
          <div>
              <p>
                  {user?.role === 'ADMIN'
                      ? 'No projects yet. Create your first project!'
                      : 'No projects assigned yet.'}
              </p>
          </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:16 }}>
          {projects.map(p => (
            <Link key={p.id} to={`/projects/${p.id}`} style={{ textDecoration:'none' }}>
              <div style={{ background:'#1e293b', border:'1px solid #334155', borderRadius:12, padding:24, transition:'border-color 0.15s, transform 0.15s', cursor:'pointer', position:'relative' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='#6366f1'; e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='#334155'; e.currentTarget.style.transform='none'; }}>

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:'linear-gradient(135deg,#6366f120,#8b5cf620)', border:'1px solid #6366f140', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <FolderKanban size={18} color="#8b5cf6" />
                  </div>
                    {user?.role === 'ADMIN' && (
                            <button
                                onClick={(e) => handleDelete(p.id, e)}
                                style={{
                                    background:'none',
                                    border:'none',
                                    color:'#475569',
                                    cursor:'pointer',
                                    padding:4,
                                    borderRadius:6,
                                    display:'flex',
                                    alignItems:'center'
                                }}
                                onMouseEnter={e => e.currentTarget.style.color='#ef4444'}
                                onMouseLeave={e => e.currentTarget.style.color='#475569'}
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                </div>

                <h3 style={{ color:'#f1f5f9', fontSize:16, fontWeight:600, margin:'0 0 6px', letterSpacing:'-0.2px' }}>{p.name}</h3>
                <p style={{ color:'#64748b', fontSize:13, margin:'0 0 16px', lineHeight:1.4, minHeight:36 }}>{p.description || 'No description'}</p>

                <div style={{ display:'flex', gap:16, fontSize:12, color:'#475569' }}>
                  <span style={{ display:'flex', alignItems:'center', gap:4 }}><Users size={12} /> {p.members?.length} members</span>
                  <span style={{ display:'flex', alignItems:'center', gap:4 }}><CheckSquare size={12} /> {p.taskCount} tasks</span>
                </div>

                <div style={{ marginTop:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:11, color:'#64748b' }}>by {p.owner?.name}</span>
                  <ArrowRight size={14} color="#6366f1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Modal open={showCreate} title="Create New Project" onClose={() => setShowCreate(false)}>
        <form onSubmit={handleCreate}>
          <label style={{ display:'block', color:'#94a3b8', fontSize:13, marginBottom:6 }}>Project Name *</label>
          <input style={inputStyle} value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="e.g. Website Redesign" required />
          <label style={{ display:'block', color:'#94a3b8', fontSize:13, marginBottom:6 }}>Description</label>
          <textarea style={{...inputStyle, height:80, resize:'vertical'}} value={form.description} onChange={e => setForm({...form, description:e.target.value})} placeholder="What's this project about?" />
          <button type="submit" disabled={creating} style={{ padding:'10px 20px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', borderRadius:8, color:'white', fontSize:14, fontWeight:600, cursor:'pointer', marginRight:8 }}>
            {creating ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
