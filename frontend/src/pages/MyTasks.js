import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { CheckSquare, AlertCircle, Clock, ExternalLink } from 'lucide-react';

const statusColors = { TODO:'#64748b', IN_PROGRESS:'#f59e0b', IN_REVIEW:'#6366f1', DONE:'#22c55e' };
const priorityColors = { LOW:'#22c55e', MEDIUM:'#f59e0b', HIGH:'#f97316', URGENT:'#ef4444' };
const STATUSES = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

const MyTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const { isAdmin } = useAuth();

    useEffect(() => {
        const request = isAdmin ? taskAPI.assignedTasks() : taskAPI.myTasks();
        request
            .then(r => setTasks(r.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [isAdmin]);

    const handleStatusChange = async (taskId, status) => {
        try {
            await taskAPI.updateStatus(taskId, status);
            setTasks(t => t.map(x => x.id === taskId ? { ...x, status } : x));
            toast.success('Status updated');
        } catch {
            toast.error('Update failed');
        }
    };

    if (loading) return <div style={{ padding:32, color:'#64748b', fontSize:14 }}>Loading...</div>;

    const overdue = tasks.filter(t => t.overdue);
    const filtered = filterStatus === 'ALL' ? tasks : tasks.filter(t => t.status === filterStatus);

    return (
        <div style={{ padding: window.innerWidth <= 768 ? '72px 16px 16px' : 32, maxWidth:isAdmin ? 1200 : 900, width:'100%', boxSizing:'border-box', overflowX:'hidden' }}>
            <div style={{ marginBottom:28 }}>
                <h1 style={{ color:'#f1f5f9', fontSize:24, fontWeight:700, margin:0, letterSpacing:'-0.5px' }}>
                    {isAdmin ? 'Assigned Tasks' : 'My Tasks'}
                </h1>

                <p style={{ color:'#64748b', fontSize:14, marginTop:4 }}>
                    {isAdmin
                        ? `${tasks.length} assigned task${tasks.length !== 1 ? 's' : ''} found`
                        : `${tasks.length} task${tasks.length !== 1 ? 's' : ''} assigned to you`}
                </p>
            </div>

            {overdue.length > 0 && (
                <div style={{ background:'#ef444410', border:'1px solid #ef444430', borderRadius:10, padding:'12px 16px', marginBottom:20, display:'flex', alignItems:'center', gap:10 }}>
                    <AlertCircle size={16} color="#ef4444" />
                    <span style={{ color:'#ef4444', fontSize:14, fontWeight:500 }}>
            {overdue.length} overdue task{overdue.length !== 1 ? 's' : ''} need attention
          </span>
                </div>
            )}

            <div style={{ display:'flex', gap:8, marginBottom:20, overflowX:'auto', paddingBottom:6 }}>
                {['ALL', ...STATUSES].map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)} style={{ padding:'5px 14px', borderRadius:20, fontSize:12, fontWeight:500, border:'1px solid', borderColor:filterStatus === s ? '#6366f1' : '#334155', background:filterStatus === s ? '#6366f120' : 'transparent', color:filterStatus === s ? '#818cf8' : '#64748b', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
                        {s.replace('_',' ')} {s !== 'ALL' && `(${tasks.filter(t => t.status === s).length})`}
                    </button>
                ))}f
            </div>

            {filtered.length === 0 ? (
                <div style={{ textAlign:'center', padding:'60px 0', color:'#475569' }}>
                    <CheckSquare size={48} style={{ marginBottom:16, opacity:0.3 }} />
                    <p>No tasks here</p>
                </div>
            ) : isAdmin ? (
                <div style={{ overflowX:'auto', background:'#1e293b', border:'1px solid #334155', borderRadius:12 }}>
                    <table style={{ width:'100%', borderCollapse:'collapse', minWidth:900 }}>
                        <thead>
                        <tr style={{ borderBottom:'1px solid #334155' }}>
                            {['Task', 'Project', 'Assigned To', 'Status', 'Priority', 'Deadline', 'Completed At'].map(h => (
                                <th key={h} style={{ textAlign:'left', padding:'12px 14px', color:'#94a3b8', fontSize:12, fontWeight:600 }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                        </thead>

                        <tbody>
                        {filtered.map(task => (
                            <tr key={task.id} style={{ borderBottom:'1px solid #334155' }}>
                                <td style={{ padding:'12px 14px', color:'#f1f5f9', fontSize:13 }}>{task.title}</td>

                                <td style={{ padding:'12px 14px', fontSize:13 }}>
                                    <Link to={`/projects/${task.projectId}`} style={{ color:'#6366f1', textDecoration:'none' }}>
                                        {task.projectName}
                                    </Link>
                                </td>

                                <td style={{ padding:'12px 14px', color:'#cbd5e1', fontSize:13 }}>
                                    {task.assignee?.name || '-'}
                                    <div style={{ color:'#64748b', fontSize:11 }}>{task.assignee?.email || ''}</div>
                                </td>

                                <td style={{ padding:'12px 14px', color:statusColors[task.status], fontSize:13 }}>
                                    {task.status?.replace('_',' ')}
                                </td>

                                <td style={{ padding:'12px 14px', color:priorityColors[task.priority], fontSize:13 }}>
                                    {task.priority}
                                </td>

                                <td style={{ padding:'12px 14px', color:task.overdue ? '#ef4444' : '#cbd5e1', fontSize:13 }}>
                                    {task.dueDate || '-'}
                                </td>

                                <td style={{ padding:'12px 14px', color:'#94a3b8', fontSize:13 }}>
                                    {task.completedAt ? new Date(task.completedAt)
                                        .toLocaleString('en-IN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                            hour12: true
                                        })
                                        .replace('am', 'AM')
                                        .replace('pm', 'PM'): '-'}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {filtered.map(task => (
                        <div key={task.id} style={{ background:'#1e293b', border:`1px solid ${task.overdue ? '#ef444430' : '#334155'}`, borderRadius:12, padding:'16px 20px' }}>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, flexDirection: window.innerWidth <= 480 ? 'column' : 'row' }}>
                                <div style={{ flex:1 }}>
                                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                                        <span style={{ color:'#f1f5f9', fontSize:15, fontWeight:500 }}>{task.title}</span>
                                        {task.overdue && <span style={{ padding:'2px 8px', borderRadius:20, fontSize:11, background:'#ef444420', color:'#ef4444', display:'flex', alignItems:'center', gap:3 }}><AlertCircle size={9}/> Overdue</span>}
                                    </div>

                                    {task.description && <p style={{ color:'#64748b', fontSize:13, margin:'0 0 8px', lineHeight:1.4 }}>{task.description}</p>}

                                    <div style={{ display:'flex', gap:10, fontSize:12, color:'#64748b', alignItems:'center', flexWrap:'wrap' }}>
                                        <Link to={`/projects/${task.projectId}`} style={{ color:'#6366f1', textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}>
                                            <ExternalLink size={11} /> {task.projectName}
                                        </Link>

                                        <span style={{ padding:'2px 7px', borderRadius:20, fontSize:11, background:`${priorityColors[task.priority]}20`, color:priorityColors[task.priority] }}>
                      {task.priority}
                    </span>

                                        {task.dueDate && <span style={{ display:'flex', alignItems:'center', gap:3 }}><Clock size={11} /> {task.dueDate}</span>}
                                    </div>
                                </div>

                                <select value={task.status} onChange={e => handleStatusChange(task.id, e.target.value)}
                                        style={{ padding:'6px 10px', background:'#0f172a', border:'1px solid #334155', borderRadius:8, color:statusColors[task.status], fontSize:12, cursor:'pointer', outline:'none', flexShrink:0, width: window.innerWidth <= 480 ? '100%' : 'auto' }}>
                                    {STATUSES.map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTasks;