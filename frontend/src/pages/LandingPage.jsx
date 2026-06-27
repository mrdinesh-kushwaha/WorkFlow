import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    CheckSquare,
    FolderKanban,
    Users,
    ShieldCheck,
    ClipboardList,
    BarChart3,
    Clock,
    Activity,
    Github,
    Linkedin,
    Twitter
} from "lucide-react";
import "./LandingPage.css";

const features = [
    {
        icon: <FolderKanban />,
        title: "Project Management",
        text: "Create, organize, update, and manage projects with a clean team workflow."
    },
    {
        icon: <Users />,
        title: "Team Collaboration",
        text: "Add members to projects and keep everyone aligned with assigned work."
    },
    {
        icon: <ShieldCheck />,
        title: "Role-Based Access",
        text: "Admin gets full control while Members access only their scoped projects."
    },
    {
        icon: <ClipboardList />,
        title: "Task Assignment",
        text: "Create tasks, assign them to members, set priority, and monitor ownership."
    },
    {
        icon: <Activity />,
        title: "Real-Time Status Tracking",
        text: "Track Todo, In Progress, Done, overdue tasks, and recent activity easily."
    },
    {
        icon: <BarChart3 />,
        title: "Dashboard Analytics",
        text: "View project progress, task counts, status summaries, and workflow insights."
    },
    {
        icon: <Clock />,
        title: "Deadline Monitoring",
        text: "Automatically detect overdue tasks and improve accountability across teams."
    }
];

const steps = [
    "Create Project",
    "Add Team Members",
    "Assign Tasks",
    "Track Progress"
];

const LandingPage = () => {
    useEffect(() => {
        const elements = document.querySelectorAll(".reveal");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                    } else {
                        entry.target.classList.remove("show");
                    }
                });
            },
            {
                threshold: 0.18,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="landing-page">
            <nav className="landing-navbar">
                <Link to="/" className="landing-logo">
          <span className="logo-icon">
            <CheckSquare size={24} />
          </span>
                    <span>WorkFlow</span>
                </Link>

                <div className="landing-nav-actions">
                    <Link to="/login" className="nav-btn nav-login">
                        Login
                    </Link>
                    <Link to="/signup" className="nav-btn nav-signup">
                        Signup
                    </Link>
                </div>
            </nav>

            <section className="hero-section">
                <div className="hero-content">
                    <p className="hero-badge">Full-Stack Team Task Management Platform</p>

                    <h1>
                        Organize Projects. Assign Tasks. Track Progress —
                        <span> All in One Place.</span>
                    </h1>

                    <p className="hero-description">
                        WorkFlow helps teams manage projects, collaborate securely,
                        assign tasks, monitor deadlines, and track progress through
                        role-based dashboards for Admins and Members.
                    </p>

                    <div className="hero-actions">
                        <Link to="/signup" className="primary-cta">
                            Get Started
                        </Link>
                        <Link to="/login" className="secondary-cta">
                            Login
                        </Link>
                    </div>

                    <div className="hero-stats">
                        <div>
                            <strong>JWT</strong>
                            <span>Secure Auth</span>
                        </div>
                        <div>
                            <strong>Admin</strong>
                            <span>Full Access</span>
                        </div>
                        <div>
                            <strong>Member</strong>
                            <span>Scoped Access</span>
                        </div>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="dashboard-card floating-card">
                        <div className="card-top">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>

                        <div className="visual-header">
                            <div>
                                <p>Dashboard Overview</p>
                                <h3>WorkFlow Analytics</h3>
                            </div>
                            <BarChart3 size={30} />
                        </div>

                        <div className="progress-block">
                            <div className="progress-info">
                                <span>Project Progress</span>
                                <strong>78%</strong>
                            </div>
                            <div className="progress-line">
                                <span></span>
                            </div>
                        </div>

                        <div className="task-preview">
                            <div className="task-item todo">Todo</div>
                            <div className="task-item progress">In Progress</div>
                            <div className="task-item done">Done</div>
                        </div>

                        <div className="mini-grid">
                            <div>
                                <strong>12</strong>
                                <span>Projects</span>
                            </div>
                            <div>
                                <strong>34</strong>
                                <span>Tasks</span>
                            </div>
                            <div>
                                <strong>05</strong>
                                <span>Overdue</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="problem-section reveal">
                <div className="section-heading">
                    <p>Why WorkFlow?</p>
                    <h2>Built to reduce scattered task tracking and missed deadlines</h2>
                    <span>
            Modern teams need centralized visibility, secure collaboration,
            and faster execution. WorkFlow brings projects, members, tasks,
            statuses, deadlines, and dashboards into one clean workflow.
          </span>
                </div>
            </section>

            <section className="features-section reveal">
                <div className="section-heading">
                    <p>Key Features</p>
                    <h2>Everything your team needs to stay productive</h2>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div className="feature-card" key={index}>
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="roles-section reveal">
                <div className="roles-content">
                    <div>
                        <p className="section-label">Admin & Member Workflow</p>
                        <h2>Designed for role-based team execution</h2>
                        <p>
                            Admins can create projects, manage members, assign tasks,
                            update project details, and monitor complete dashboard analytics.
                            Members can view assigned projects, update task status, and track
                            their own progress without accessing unrelated project data.
                        </p>
                    </div>

                    <div className="roles-card-wrapper">
                        <div className="role-card admin-card">
                            <h3>Admin</h3>
                            <ul>
                                <li>Create and manage projects</li>
                                <li>Add or remove team members</li>
                                <li>Assign tasks and monitor progress</li>
                                <li>Track dashboard and overdue items</li>
                            </ul>
                        </div>

                        <div className="role-card member-card">
                            <h3>Member</h3>
                            <ul>
                                <li>View assigned projects</li>
                                <li>Check assigned tasks</li>
                                <li>Update task status</li>
                                <li>Track personal productivity</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="steps-section reveal">
                <div className="section-heading">
                    <p>How It Works</p>
                    <h2>Simple workflow from project creation to progress tracking</h2>
                </div>

                <div className="steps-grid">
                    {steps.map((step, index) => (
                        <div className="step-card" key={index}>
                            <span>Step {index + 1}</span>
                            <h3>{step}</h3>
                            <p>
                                {index === 0 &&
                                    "Start by creating a project with clear goals and structure."}
                                {index === 1 &&
                                    "Invite team members and keep collaboration project-scoped."}
                                {index === 2 &&
                                    "Assign tasks with priority, ownership, and deadlines."}
                                {index === 3 &&
                                    "Monitor task status, overdue work, and dashboard insights."}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="cta-section reveal">
                <div className="cta-box">
                    <div className="cta-glow"></div>

                    <h2>Ready to manage your team workflow smarter?</h2>
                    <p>
                        Start organizing projects, assigning tasks, tracking deadlines, and
                        improving team accountability with WorkFlow.
                    </p>

                    <div className="cta-actions">
                        <Link to="/signup" className="primary-cta">
                            Start with WorkFlow
                        </Link>
                        <Link to="/login" className="secondary-cta dark">
                            Login
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="landing-footer">
                <div>
                    <h3>WorkFlow</h3>
                    <p>
                        A full-stack team task management platform for secure project
                        collaboration and productivity tracking.
                    </p>
                </div>

                <div className="footer-links">
                    <a
                        href="https://www.linkedin.com/in/mrdinesh-kushwaha/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                    >
                        <Linkedin size={20} />
                    </a>

                    <a
                        href="#"
                        // target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter"
                    >
                        <Twitter size={20} />
                    </a>

                    <a
                        href="https://github.com/mrdinesh-kushwaha"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                    >
                        <Github size={20} />
                    </a>
                </div>

                <p className="copyright">
                    © 2026 WorkFlow. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;