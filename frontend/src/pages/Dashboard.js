import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI, projectAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { FolderKanban, CheckSquare, AlertCircle, TrendingUp, ArrowRight, RefreshCw } from 'lucide-react';

const statColor = { total:'#6366f1', todo:'#64748b', progress:'#f59e0b', done:'#22c55e', overdue:'#ef4444' };
const statusColors = { TODO:'#64748b', IN_PROGRESS:'#f59e0b', IN_REVIEW:'#6366f1', DONE:'#22c55e' };

const StatCard = ({ label, value, color, icon: Icon }) => (
    <div style={{ background:'#1e293b', border:'1px solid #334155', borderRadius:12, padding:'20px 24px', display:'flex', alignItems:'center', gap:16 }}>
        <div style={{ width:44, height:44, borderRadius:10, background:`${color}20`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon size={20} color={color} />
        </div>
        <div>
            <div style={{ fontSize:26, fontWeight:700, color:'#f1f5f9', lineHeight:1 }}>{value}</div>
            <div style={{ fontSize:13, color:'#64748b', marginTop:4 }}>{label}</div>
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDashboard = useCallback(async (isManual = false) => {
        if (isManual) setRefreshing(true);
        else setLoading(true);

        try {
            const projectsRes = await projectAPI.getAll();
            const dashboardRes = await dashboardAPI.get();
            const projects = Array.isArray(projectsRes.data) ? projectsRes.data : [];

            setData({
                ...dashboardRes.data,
                totalProjects: dashboardRes.data?.totalProjects ?? projects.length,
                totalTasks: dashboardRes.data?.totalTasks ?? 0,
                inProgressTasks: dashboardRes.data?.inProgressTasks ?? 0,
                doneTasks: dashboardRes.data?.doneTasks ?? 0,
                overdueTasks: dashboardRes.data?.overdueTasks ?? 0,
                recentTasks: dashboardRes.data?.recentTasks ?? [],
                recentProjects: dashboardRes.data?.recentProjects ?? projects.slice(0, 5)
            });
        } catch (err) {
            console.error("Dashboard loading error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Har baar dashboard page open hone par fresh data fetch hoga
    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    if (loading) return <div style={{ padding:32, color:'#64748b', fontSize:14 }}>Loading dashboard...</div>;

    return (
        <div style={{ padding:32, maxWidth:1200 }}>

            {/* Header + Refresh Button */}
            <div style={{ marginBottom:32, display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                    <h1 style={{ color:'#f1f5f9', fontSize:24, fontWeight:700, margin:0, letterSpacing:'-0.5px' }}>
                        Good day, {user?.name?.split(' ')[0]} 👋
                    </h1>
                    <p style={{ color:'#64748b', marginTop:6, fontSize:14 }}>Here's what's happening with your projects</p>
                </div>
                <button
                    onClick={() => fetchDashboard(true)}
                    disabled={refreshing}
                    style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:'#1e293b', border:'1px solid #334155', borderRadius:8, color:'#94a3b8', cursor:'pointer', fontSize:13, opacity: refreshing ? 0.6 : 1 }}
                >
                    <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {/* Stats Cards */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:16, marginBottom:32 }}>
                <StatCard label="Total Projects" value={data?.totalProjects ?? 0} color={statColor.total}   icon={FolderKanban} />
                <StatCard label="Total Tasks"    value={data?.totalTasks ?? 0}    color={statColor.total}   icon={CheckSquare} />
                <StatCard label="In Progress"    value={data?.inProgressTasks ?? 0} color={statColor.progress} icon={TrendingUp} />
                <StatCard label="Completed"      value={data?.doneTasks ?? 0}     color={statColor.done}    icon={CheckSquare} />
                <StatCard label="Overdue"        value={data?.overdueTasks ?? 0}  color={statColor.overdue} icon={AlertCircle} />
            </div>

            {/* Recent Tasks + Recent Projects */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>

                {/* Recent Tasks */}
                <div style={{ background:'#1e293b', border:'1px solid #334155', borderRadius:12, padding:24 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                        <h2 style={{ color:'#f1f5f9', fontSize:16, fontWeight:600, margin:0 }}>My Recent Tasks</h2>
                        <Link to="/my-tasks" style={{ color:'#6366f1', fontSize:13, textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}>
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>
                    {!data?.recentTasks?.length ? (
                        <p style={{ color:'#475569', fontSize:13, textAlign:'center', padding:'24px 0' }}>No tasks assigned yet</p>
                    ) : (
                        data.recentTasks.map(task => (
                            <div key={task.id} style={{ padding:'12px 0', borderBottom:'1px solid #334155' }}>
                                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                                    <div>
                                        <div style={{ color:'#f1f5f9', fontSize:14, fontWeight:500, marginBottom:4 }}>{task.title}</div>
                                        <div style={{ color:'#64748b', fontSize:12 }}>{task.projectName}</div>
                                    </div>
                                    <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                    <span style={{ padding:'2px 8px', borderRadius:20, fontSize:11, fontWeight:500, background:`${statusColors[task.status]}20`, color:statusColors[task.status] }}>
                      {task.status?.replace('_', ' ')}
                    </span>
                                        {task.overdue && (
                                            <span style={{ padding:'2px 8px', borderRadius:20, fontSize:11, fontWeight:500, background:'#ef444420', color:'#ef4444' }}>Overdue</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Recent Projects */}
                <div style={{ background:'#1e293b', border:'1px solid #334155', borderRadius:12, padding:24 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                        <h2 style={{ color:'#f1f5f9', fontSize:16, fontWeight:600, margin:0 }}>Recent Projects</h2>
                        <Link to="/projects" style={{ color:'#6366f1', fontSize:13, textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}>
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>
                    {!data?.recentProjects?.length ? (
                        <p style={{ color:'#475569', fontSize:13, textAlign:'center', padding:'24px 0' }}>No projects yet</p>
                    ) : (
                        data.recentProjects.map(p => (
                            <Link key={p.id} to={`/projects/${p.id}`} style={{ display:'block', textDecoration:'none', padding:'12px 0', borderBottom:'1px solid #334155' }}>
                                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                                    <div>
                                        <div style={{ color:'#f1f5f9', fontSize:14, fontWeight:500 }}>{p.name}</div>
                                        <div style={{ color:'#64748b', fontSize:12, marginTop:2 }}>{p.taskCount} tasks · {p.members?.length} members</div>
                                    </div>
                                    <span style={{ padding:'2px 8px', borderRadius:20, fontSize:11, fontWeight:500, background:'#22c55e20', color:'#22c55e' }}>{p.status}</span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default Dashboard;