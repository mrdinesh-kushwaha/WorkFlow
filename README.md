<div align="center">
 
# WorkFlow
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

[Live Demo](https://workflow-platform.netlify.app) · [Application Preview](#-homepage) · [Report Bug](../../issues) · [Request Feature](../../issues) · [Documentation](#-rest-api-reference)

</div>

---

## 🧭 Overview

**WorkFlow** is a production-ready, full-stack project management platform built with **Spring Boot** and **React**. Designed for modern teams, it eliminates scattered task tracking and missed deadlines by providing a unified workspace with secure role-based access, real-time dashboards, and automated overdue detection.

> Whether you're managing a small dev team or a cross-functional department, WorkFlow gives you the visibility and control to ship faster.

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
| ![Home1](https://github.com/user-attachments/assets/636b7b5b-90e5-4fb6-a278-1026f34ba127) | ![Home2](https://github.com/user-attachments/assets/729683d0-36d3-4107-9952-a5d423b0f6e8) |
| ![Home3](https://github.com/user-attachments/assets/b10a4971-04c8-497b-824f-2586a5a2eeb0) | ![Home4](https://github.com/user-attachments/assets/49f29c69-60cb-4619-99c7-21c7b7588eef) |

### 🔑 Authentication
| Signup | Login |
|--------|-------|
| ![Signup](https://github.com/user-attachments/assets/8eb90bf8-fd35-4e6b-9e31-e110f74495b9) | ![Login](https://github.com/user-attachments/assets/af395172-5b16-4f10-aadc-6301aa92e14a) |
 
### 👤 Member Experience
| Dashboard | Projects |
|-----------|----------|
| ![Member Dashboard](https://github.com/user-attachments/assets/0fd76753-9ce1-4946-aa5f-99b9bd80ad35) | ![Member Projects](https://github.com/user-attachments/assets/89f17005-a972-4af0-8bd6-fd27a7ea4e8b) |
 
| Tasks | |
|-------|--|
| ![Member Tasks](https://github.com/user-attachments/assets/0dcd4f24-2c52-4e3e-b6bf-283f8abb50af) | |
 
### 🛡️ Admin Experience
| Dashboard | Projects |
|-----------|----------|
| ![Admin Dashboard](https://github.com/user-attachments/assets/08e24320-4d9c-4b0f-ad09-a059d6e2ebce) | ![Admin Projects](https://github.com/user-attachments/assets/38b41d9c-0ca4-43fd-8af8-342f5286c88d) |
 
| Task Management | Assigned Tasks |
|-----------------|----------------|
| ![Admin Task Management](https://github.com/user-attachments/assets/713bbd8f-4341-44d5-8166-590d78f655ec) | ![Admin Assigned Tasks](https://github.com/user-attachments/assets/d2011f84-b9cd-4582-9908-47a479ceec59) |
 
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
docker build -t workflow .

# Run in dev mode (H2)
docker run -p 8080:8080 workflow

# Run in production mode (PostgreSQL)
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host:5432/taskdb \
  -e PGUSER=postgres \
  -e PGPASSWORD=secret \
  -e JWT_SECRET=MySecretKey123 \
  workflow
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
