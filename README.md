<div align="center">

<img src="https://img.shields.io/badge/TaskFlow-v1.0.0-6366f1?style=for-the-badge&logoColor=white" alt="TaskFlow" />

# TaskFlow
### Enterprise-Grade Team Task Management Platform

*Centralize. Collaborate. Execute.*

[![Java](https://img.shields.io/badge/Java_17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)](https://openjdk.org/projects/jdk/17/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.2-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![netlify](https://img.shields.io/badge/netlify-0B0D0E?style=flat-square&logo=netlify&logoColor=white)](https://netlify.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<br />

[Live Demo](https://taskflow-platform.netlify.app) · [Application Preview](#-homepage) · [Report Bug](../../issues) · [Request Feature](../../issues) · [Documentation](#-rest-api-reference)


</div>

---

## 🧭 Overview

**TaskFlow** is a production-ready, full-stack project management platform built with **Spring Boot** and **React**. Designed for modern teams, it eliminates scattered task tracking and missed deadlines by providing a unified workspace with secure role-based access, real-time dashboards, and automated overdue detection.

> Whether you're managing a small dev team or a cross-functional department, TaskFlow gives you the visibility and control to ship faster.

---

## ✨ Feature Highlights

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Stateless, secure token-based auth with signup & login flows |
| 👥 **Role-Based Access Control** | Granular permissions for `ADMIN` and `MEMBER` roles |
| 📁 **Project Management** | Full CRUD for projects — create, edit, delete, and manage teams |
| ✅ **Task Management** | Create, assign, prioritize, and track tasks across projects |
| 📊 **Real-Time Dashboard** | Live overview of task statuses, overdue items, and recent activity |
| ⚠️ **Auto Overdue Detection** | Automatically flags past-due tasks; clears on `DONE` status |
| 🗄️ **Dual DB Support** | H2 for local dev, PostgreSQL for production via Neon|
| 🚂 **Dockerized Deployment** | Multi-stage Docker build with one-click netlify deployment |

---

### 🏠 Homepage
| | |
|--|--|
| ![Home1](https://github.com/user-attachments/assets/5b1b1d58-8173-40f5-bb1b-7a15e558eec6) | ![Home2](https://github.com/user-attachments/assets/320c0c07-43a0-43d6-815d-512fb0e3185e) |
| ![Home3](https://github.com/user-attachments/assets/80656384-b8e4-43a2-8fb2-841fa0283a91) | ![Home4](https://github.com/user-attachments/assets/a0368222-9112-4188-a252-54b6c3d38832) |

### 🔑 Authentication
| Signup | Login |
|--------|-------|
| ![Signup](https://github.com/user-attachments/assets/aa91e01d-524b-4649-9a90-ed7428945418) | ![Login](https://github.com/user-attachments/assets/e1596b3f-6773-4d6c-9703-353853838215) |
 
### 👤 Member Experience
| Dashboard | Projects |
|-----------|----------|
| ![Member Dashboard](https://github.com/user-attachments/assets/c44050af-819c-4fd9-a2de-9d1b30cabcb3) | ![Member Projects](https://github.com/user-attachments/assets/5aaea614-f630-4514-a993-a9f25e649f7f) |
 
| Tasks | |
|-------|--|
| ![Member Tasks](https://github.com/user-attachments/assets/b9b70ed5-0e9b-4505-873a-e979b3b38bde) | |
 
### 🛡️ Admin Experience
| Dashboard | Projects |
|-----------|----------|
| ![Admin Dashboard](https://github.com/user-attachments/assets/47724419-7b36-4d94-8bc1-d08f4626ec38) | ![Admin Projects](https://github.com/user-attachments/assets/1f602647-30d5-4b75-9139-4d3585fcc764) |
 
| Task Management | Assigned Tasks |
|-----------------|----------------|
| ![Admin Task Management](https://github.com/user-attachments/assets/9c6d0777-0012-43ca-8927-5384c0d9d1a7) | ![Admin Assigned Tasks](https://github.com/user-attachments/assets/fe63b5a2-040e-41ce-859e-a27a27a3404a) |
 
---

## Production Grade Deployement:

```
Forntend - Netlify
Backend - Render
Database - Neon
```

---

## 🏗️ Tech Stack

```
┌─────────────┬──────────────────────────────────────────┐
│  Layer       │  Technology                              │
├─────────────┼──────────────────────────────────────────┤
│  Backend     │  Java 17 · Spring Boot 3.2               │
│  Security    │  Spring Security · JWT (JJWT)            │
│  Database    │  PostgreSQL (prod) · H2 (dev)            │
│  ORM         │  Spring Data JPA · Hibernate             │
│  Frontend    │  React 18 · React Router v6              │
│  HTTP Client │  Axios                                   │
│  Deployment  │  netlify · Docker (multi-stage build)    │
└─────────────┴──────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
taskmanager/
├── backend/                              # Spring Boot REST API
│   └── src/main/java/com/taskmanager/
│       ├── config/                       # Security, CORS & MVC config
│       ├── controller/                   # REST endpoint controllers
│       ├── dto/                          # Request/Response DTOs
│       ├── entity/                       # JPA entities (User, Project, Task)
│       ├── repository/                   # Spring Data JPA repositories
│       ├── security/                     # JWT filter & UserDetailsService
│       └── service/                      # Core business logic
│
├── frontend/                             # React SPA
│   └── src/
│       ├── api/                          # Axios API service layer
│       ├── context/                      # Auth context (React Context API)
│       ├── pages/                        # Login, Signup, Dashboard, Projects
│       └── components/                   # Shared UI (Layout, Sidebar, etc.)
│
├── Dockerfile                            # Multi-stage Docker build
└── netlify.toml                          # netlify deployment config
```

---

## 🔌 REST API Reference

### Auth Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/signup` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and receive JWT |
| `GET` | `/api/auth/me` | Auth | Get current user info |
| `GET` | `/api/auth/users` | Auth | List all registered users |
| `GET` | `/api/auth/health` | Public | Health check endpoint |

### Project Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects` | List accessible projects |
| `POST` | `/api/projects` | Create a new project |
| `GET` | `/api/projects/:id` | Get project details |
| `PUT` | `/api/projects/:id` | Update project (owner only) |
| `DELETE` | `/api/projects/:id` | Delete project (owner only) |
| `POST` | `/api/projects/:id/members/:userId` | Add a member to project |
| `DELETE` | `/api/projects/:id/members/:userId` | Remove a member from project |

### Task Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects/:id/tasks` | List all tasks in a project |
| `POST` | `/api/projects/:id/tasks` | Create a task in a project |
| `GET` | `/api/tasks/:taskId` | Get task details |
| `PUT` | `/api/tasks/:taskId` | Update a task |
| `PATCH` | `/api/tasks/:taskId/status` | Update task status only |
| `DELETE` | `/api/tasks/:taskId` | Delete a task |
| `GET` | `/api/tasks/my` | Get tasks assigned to current user |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard` | Fetch dashboard statistics |

---

## 🔐 Role-Based Access Control

| Action | ADMIN | MEMBER |
|--------|:-----:|:------:|
| View all projects | ✅ | ❌ |
| Create projects | ✅ | ❌ |
| Edit / Delete own projects | ✅ | ❌ |
| Add / Remove members | ✅ | ❌ |
| Create tasks | ✅ | ❌ |
| Edit / Delete tasks | ✅ | ❌ |
| Update task status | ✅ | ✅ |

---

## 🚀 Local Development

### Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- npm 9+

### 1. Start the Backend

```bash
cd backend
mvn spring-boot:run
```

- API runs at: `http://localhost:8080`
- H2 Console: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:taskdb`
  - Username: `sa` | Password: *(empty)*

### 2. Start the Frontend

```bash
cd frontend
npm install
npm start
```

- App runs at: `http://localhost:3000`
- API requests are proxied to `localhost:8080`

---

## 🐳 Docker (Local Testing)

```bash
# Build the image
docker build -t taskflow .

# Run in dev mode (H2)
docker run -p 8080:8080 taskflow

# Run in production mode (PostgreSQL)
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host:5432/taskdb \
  -e PGUSER=postgres \
  -e PGPASSWORD=secret \
  -e JWT_SECRET=MySecretKey123 \
  taskflow
```

---

## 🚂 Deploying to netlify

### Step 1 — Create a netlify Account
Sign up at [netlify.app](https://netlify.app) using your GitHub account.

### Step 2 — New Project
Click **"New Project"** → **"Deploy from GitHub Repo"** (push your code to GitHub first).

### Step 3 — Add PostgreSQL
Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**.
netlify automatically provisions: `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`.

### Step 4 — Connect Your Repo
Click **"+ New"** → **"GitHub Repo"** and select your repository.
netlify auto-detects your `Dockerfile`.

### Step 5 — Set Environment Variables

In your service → **Variables** tab:

```env
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
PGUSER=${{Postgres.PGUSER}}
PGPASSWORD=${{Postgres.PGPASSWORD}}
JWT_SECRET=YourSuperSecretKeyHereMakeItLongAndRandom123!@#
CORS_ORIGINS=https://your-app.up.netlify.app
PORT=8080
```

> 💡 **Tip:** Use netlify variable references like `${{Postgres.PGHOST}}` to automatically link your database credentials to your app service.

### Step 6 — Generate a Public Domain
Go to your service → **Settings** → **Networking** → **Generate Domain**.

Your app will be live at `https://your-app-name.up.netlify.app` 🎉

### Step 7 — Auto-Deployments
netlify auto-deploys on every `git push` to your connected branch.
To trigger a manual deploy, click **"Deploy"** in the netlify dashboard.

---

## ⚙️ Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Application server port | `8080` |
| `SPRING_PROFILES_ACTIVE` | Active Spring profile (`prod`) | `default` (H2) |
| `SPRING_DATASOURCE_URL` | JDBC connection URL for PostgreSQL | H2 in-memory |
| `PGUSER` | Database username | `sa` |
| `PGPASSWORD` | Database password | *(empty)* |
| `JWT_SECRET` | JWT signing secret (32+ characters recommended) | *dev default* |
| `CORS_ORIGINS` | Allowed CORS origins for the frontend | `http://localhost:3000` |

---

## 👤 Getting Started (Sample Workflow)

1. **Sign up as Admin** — select the `Admin` role during registration
2. **Create a project** and add team members to it
3. **Sign up as Member** — get added to the project by an Admin
4. **Assign tasks** to members and track progress on the dashboard

---

## 👨‍💻 Author

Developed with ❤️ by **Dinesh Kushwaha**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat-square&logo=github&logoColor=white)](https://github.com/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mrdinesh-kushwaha/)

---

<div align="center">

⭐ **If you find this project useful, please consider giving it a star!** ⭐

</div>
