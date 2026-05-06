import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI, taskAPI, authAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Plus, Users, Trash2, ArrowLeft, CheckSquare, Clock, AlertCircle, UserPlus } from 'lucide-react';

const statusColors = { TODO:'#64748b', IN_PROGRESS:'#f59e0b', IN_REVIEW:'#6366f1', DONE:'#22c55e' };
const priorityColors = { LOW:'#22c55e', MEDIUM:'#f59e0b', HIGH:'#f97316', URGENT:'#ef4444' };
const STATUSES = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

const inputStyle = { width:'100%', padding:'9px 12px', background:'#0f172a', border:'1px solid #334155', borderRadius:8, color:'#f1f5f9', fontSize:13, outline:'none', boxSizing:'border-box', marginBottom:12 };

const Modal = ({ open, title, onClose, children }) => {
  if (!open) return null;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 }}>
      <div style={{ background:'#1e293b', border:'1px solid #334155', borderRadius:16, padding:28, width:'100%', maxWidth:480, maxHeight:'90vh', overflowY:'auto' }}>
        <h2 style={{ color:'#f1f5f9', fontSize:18, fontWeight:600, margin:'0 0 20px' }}>{title}</h2>
        {children}
        <button onClick={onClose} style={{ marginTop:8, padding:'8px 16px', background:'transparent', border:'1px solid #334155', borderRadius:8, color:'#64748b', cursor:'pointer', fontSize:13 }}>Cancel</button>
      </div>
    </div>
  );
};
const TaskCard = ({ task, onStatusChange, onDelete, canDelete }) => {
  const isOverdue = task.overdue;
  return (
    <div style={{ background:'#0f172a', border:`1px solid ${isOverdue ? '#ef444430' : '#1e293b'}`, borderRadius:10, padding:16, marginBottom:8 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
        <span style={{ color:'#f1f5f9', fontSize:13, fontWeight:500, flex:1, marginRight:8 }}>{task.title}</span>
          {canDelete && (
              <button
                  onClick={() => onDelete(task.id)}
                  style={{
                      background:'none',
                      border:'none',
                      color:'#475569',
                      cursor:'pointer',
                      padding:2,
                      flexShrink:0
                  }}
                  onMouseEnter={e => e.currentTarget.style.color='#ef4444'}
                  onMouseLeave={e => e.currentTarget.style.color='#475569'}
              >
                  <Trash2 size={12} />
              </button>
          )}
      </div>
      {task.description && <p style={{ color:'#64748b', fontSize:12, margin:'0 0 8px', lineHeight:1.4 }}>{task.description}</p>}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:8 }}>
        <span style={{ padding:'2px 7px', borderRadius:20, fontSize:11, fontWeight:500, background:`${priorityColors[task.priority]}20`, color:priorityColors[task.priority] }}>{task.priority}</span>
        {isOverdue && <span style={{ padding:'2px 7px', borderRadius:20, fontSize:11, background:'#ef444420', color:'#ef4444', display:'flex', alignItems:'center', gap:3 }}><AlertCircle size={9}/> Overdue</span>}
        {task.dueDate && <span style={{ padding:'2px 7px', borderRadius:20, fontSize:11, background:'#1e293b', color:'#64748b', display:'flex', alignItems:'center', gap:3 }}><Clock size={9}/> {task.dueDate}</span>}
      </div>
      {task.assignee && <div style={{ fontSize:11, color:'#475569', marginBottom:8 }}>👤 {task.assignee.name}</div>}
      <select value={task.status} onChange={e => onStatusChange(task.id, e.target.value)}
        style={{ ...inputStyle, marginBottom:0, padding:'4px 8px', fontSize:11, color:statusColors[task.status], background:'#1e293b', border:'none', cursor:'pointer' }}>
        {STATUSES.map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
      </select>
    </div>
  );
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [taskForm, setTaskForm] = useState({ title:'', description:'', priority:'MEDIUM', dueDate:'', assigneeId:'' });
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const load = async () => {
        try {
            const [pRes, tRes] = await Promise.all([
                projectAPI.getById(id),
                taskAPI.getByProject(id)
            ]);

            setProject(pRes.data);
            setTasks(tRes.data);

            if (isAdmin) {
                const uRes = await authAPI.getUsers();
                setUsers(uRes.data);
            } else {
                setUsers([]);
            }

        } catch (err) {
            console.error("Project detail load failed:", err);
            toast.error('Failed to load project');
            navigate('/projects');
        } finally {
            setLoading(false);
        }
  };
  useEffect(() => { load(); }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await taskAPI.create(id, { ...taskForm, assigneeId: taskForm.assigneeId || null, dueDate: taskForm.dueDate || null });
      toast.success('Task created!'); setShowTaskModal(false); setTaskForm({ title:'', description:'', priority:'MEDIUM', dueDate:'', assigneeId:'' }); load();
    } catch { toast.error('Failed to create task'); } finally { setSaving(false); }
  };

  const handleStatusChange = async (taskId, status) => {
    try { await taskAPI.updateStatus(taskId, status); setTasks(t => t.map(x => x.id === taskId ? {...x, status} : x)); }
    catch { toast.error('Update failed'); }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete task?')) return;
    try { await taskAPI.delete(taskId); setTasks(t => t.filter(x => x.id !== taskId)); toast.success('Task deleted'); }
    catch { toast.error('Delete failed'); }
  };

  const handleAddMember = async (userId) => {
    try { const r = await projectAPI.addMember(id, userId); setProject(r.data); toast.success('Member added'); }
    catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove member?')) return;
    try { const r = await projectAPI.removeMember(id, userId); setProject(r.data); toast.success('Member removed'); }
    catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  if (loading) return <div style={{ padding:32, color:'#64748b' }}>Loading...</div>;
  if (!project) return null;

  const isOwner = project.owner?.id === user?.id || isAdmin;
  const filteredTasks = filterStatus === 'ALL' ? tasks : tasks.filter(t => t.status === filterStatus);
  const tasksByStatus = STATUSES.reduce((acc, s) => { acc[s] = tasks.filter(t => t.status === s); return acc; }, {});
    const nonMembers = users.filter(u =>
        u.id !== user?.id &&
        u.role !== 'ADMIN' &&
        !project.members?.some(m => m.id === u.id)
    );
  return (
    <div style={{ padding:32, maxWidth:1200 }}>
      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <button onClick={() => navigate('/projects')} style={{ display:'flex', alignItems:'center', gap:6, color:'#64748b', background:'none', border:'none', cursor:'pointer', fontSize:13, marginBottom:16, padding:0 }}>
          <ArrowLeft size={14} /> Back to Projects
        </button>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <h1 style={{ color:'#f1f5f9', fontSize:24, fontWeight:700, margin:'0 0 6px', letterSpacing:'-0.5px' }}>{project.name}</h1>
            <p style={{ color:'#64748b', fontSize:14, margin:0 }}>{project.description || 'No description'}</p>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            {isOwner && (
              <button onClick={() => setShowMemberModal(true)} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', background:'#1e293b', border:'1px solid #334155', borderRadius:8, color:'#94a3b8', cursor:'pointer', fontSize:13 }}>
                <UserPlus size={14} /> Members
              </button>
            )}
              {isOwner && (
                  <button onClick={() => setShowTaskModal(true)} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', borderRadius:8, color:'white', cursor:'pointer', fontSize:13, fontWeight:600 }}>
                      <Plus size={14} /> Add Task
                  </button>
              )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:'flex', gap:12, marginBottom:24 }}>
        {STATUSES.map(s => (
          <div key={s} style={{ background:'#1e293b', border:'1px solid #334155', borderRadius:8, padding:'10px 16px', textAlign:'center' }}>
            <div style={{ fontSize:20, fontWeight:700, color:statusColors[s] }}>{tasksByStatus[s]?.length || 0}</div>
            <div style={{ fontSize:11, color:'#64748b', marginTop:2 }}>{s.replace('_',' ')}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:0, marginBottom:24, borderBottom:'1px solid #334155' }}>
        {['tasks', 'members'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding:'10px 20px', background:'none', border:'none', borderBottom: activeTab===tab ? '2px solid #6366f1' : '2px solid transparent', color: activeTab===tab ? '#818cf8' : '#64748b', cursor:'pointer', fontSize:14, fontWeight: activeTab===tab ? 600 : 400, textTransform:'capitalize', transition:'all 0.15s' }}>
            {tab} {tab==='tasks' && `(${tasks.length})`} {tab==='members' && `(${project.members?.length})`}
          </button>
        ))}
      </div>

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div>
          {/* Filter */}
          <div style={{ display:'flex', gap:8, marginBottom:16 }}>
            {['ALL', ...STATUSES].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{ padding:'5px 12px', borderRadius:20, fontSize:12, fontWeight:500, border:'1px solid', borderColor: filterStatus===s ? '#6366f1' : '#334155', background: filterStatus===s ? '#6366f120' : 'transparent', color: filterStatus===s ? '#818cf8' : '#64748b', cursor:'pointer' }}>
                {s.replace('_',' ')}
              </button>
            ))}
          </div>

          {filteredTasks.length === 0 ? (
            <div style={{ textAlign:'center', padding:'48px 0', color:'#475569' }}>
              <CheckSquare size={36} style={{ marginBottom:12, opacity:0.3 }} />
              <p>No tasks yet. Add your first task!</p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:12 }}>
              {filteredTasks.map(task => (
                  <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDeleteTask}
                      canDelete={isOwner}
                  />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div style={{ maxWidth:600 }}>
          {project.members?.map(member => (
            <div key={member.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderBottom:'1px solid #1e293b' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700 }}>
                  {member.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ color:'#f1f5f9', fontSize:14, fontWeight:500 }}>{member.name}</div>
                  <div style={{ color:'#64748b', fontSize:12 }}>{member.email} · {member.role}</div>
                </div>
              </div>
              {isOwner && member.id !== project.owner?.id && (
                <button onClick={() => handleRemoveMember(member.id)} style={{ background:'none', border:'1px solid #334155', borderRadius:6, color:'#ef4444', cursor:'pointer', padding:'4px 10px', fontSize:12 }}>Remove</button>
              )}
              {member.id === project.owner?.id && <span style={{ fontSize:11, color:'#6366f1', background:'#6366f120', padding:'3px 8px', borderRadius:20 }}>Owner</span>}
            </div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      <Modal open={showTaskModal} title="Create Task" onClose={() => setShowTaskModal(false)}>
        <form onSubmit={handleCreateTask}>
          <label style={{ display:'block', color:'#94a3b8', fontSize:12, marginBottom:4 }}>Title *</label>
          <input style={inputStyle} value={taskForm.title} onChange={e => setTaskForm({...taskForm, title:e.target.value})} placeholder="Task title" required />
          <label style={{ display:'block', color:'#94a3b8', fontSize:12, marginBottom:4 }}>Description</label>
          <textarea style={{...inputStyle, height:70, resize:'vertical'}} value={taskForm.description} onChange={e => setTaskForm({...taskForm, description:e.target.value})} placeholder="Optional description" />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={{ display:'block', color:'#94a3b8', fontSize:12, marginBottom:4 }}>Priority</label>
              <select style={inputStyle} value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority:e.target.value})}>
                {['LOW','MEDIUM','HIGH','URGENT'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display:'block', color:'#94a3b8', fontSize:12, marginBottom:4 }}>Due Date</label>
              <input type="date" style={inputStyle} value={taskForm.dueDate} onChange={e => setTaskForm({...taskForm, dueDate:e.target.value})} />
            </div>
          </div>
          <label style={{ display:'block', color:'#94a3b8', fontSize:12, marginBottom:4 }}>Assign To</label>
          <select style={inputStyle} value={taskForm.assigneeId} onChange={e => setTaskForm({...taskForm, assigneeId:e.target.value})}>
            <option value="">Unassigned</option>
              {users
                  .filter(u => u.role === 'MEMBER')
                  .map(u => (
                      <option key={u.id} value={u.id}>
                          {u.name}
                      </option>
                  ))}
          </select>
          <button type="submit" disabled={saving} style={{ padding:'10px 20px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', borderRadius:8, color:'white', fontSize:14, fontWeight:600, cursor:'pointer', marginRight:8 }}>
            {saving ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      </Modal>

      {/* Add Member Modal */}
      <Modal open={showMemberModal} title="Add Team Member" onClose={() => setShowMemberModal(false)}>
        {nonMembers.length === 0 ? (
          <p style={{ color:'#64748b', fontSize:14 }}>All users are already members.</p>
        ) : (
          nonMembers.map(u => (
            <div key={u.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #334155' }}>
              <div>
                <div style={{ color:'#f1f5f9', fontSize:14 }}>{u.name}</div>
                <div style={{ color:'#64748b', fontSize:12 }}>{u.email}</div>
              </div>
              <button onClick={() => handleAddMember(u.id)} style={{ padding:'6px 14px', background:'#6366f120', border:'1px solid #6366f140', borderRadius:6, color:'#818cf8', cursor:'pointer', fontSize:12, fontWeight:500 }}>
                Add
              </button>
            </div>
          ))
        )}
      </Modal>
    </div>
  );
};

export default ProjectDetail;
