# 🚀 TaskFlow - Team Task Manager

A full-stack task management application with **Java Spring Boot** backend and **React** frontend, featuring role-based access control, project management, and real-time task tracking.

---

## ✨ Features

- 🔐 **JWT Authentication** — Signup / Login with secure token-based auth
- 👥 **Role-Based Access** — `ADMIN` (full access) and `MEMBER` (project-scoped)
- 📁 **Project Management** — Create, edit, delete projects; manage team members
- ✅ **Task Management** — Create tasks, assign to members, track status & priority
- 📊 **Dashboard** — Overview of all tasks, statuses, overdue items, and recent activity
- ⚠️ **Overdue Detection** — Automatic overdue flagging for past-due tasks
- 🗄️ **PostgreSQL on Railway** — Persistent database in production

---

## 🏗️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Backend    | Java 17, Spring Boot 3.2          |
| Security   | Spring Security + JWT (JJWT)      |
| Database   | PostgreSQL (prod) / H2 (dev)      |
| ORM        | Spring Data JPA / Hibernate       |
| Frontend   | React 18, React Router v6         |
| HTTP Client| Axios                             |
| Deployment | Railway (Docker)                  |

---

## 📂 Project Structure

```
taskmanager/
├── backend/                        # Spring Boot API
│   └── src/main/java/com/taskmanager/
│       ├── config/                 # Security, CORS, MVC config
│       ├── controller/             # REST controllers
│       ├── dto/                    # Data Transfer Objects
│       ├── entity/                 # JPA entities (User, Project, Task)
│       ├── repository/             # Spring Data JPA repos
│       ├── security/               # JWT filter & UserDetailsService
│       └── service/                # Business logic
├── frontend/                       # React app
│   └── src/
│       ├── api/                    # Axios API calls
│       ├── context/                # Auth context (React Context)
│       ├── pages/                  # Login, Signup, Dashboard, Projects, etc.
│       └── components/             # Layout, Sidebar
├── Dockerfile                      # Multi-stage build (frontend + backend)
└── railway.toml                    # Railway deployment config
```

---

## 🔌 REST API Endpoints

### Auth
| Method | Endpoint           | Access | Description     |
|--------|--------------------|--------|-----------------|
| POST   | /api/auth/signup   | Public | Register user   |
| POST   | /api/auth/login    | Public | Login, get JWT  |
| GET    | /api/auth/me       | Auth   | Current user    |
| GET    | /api/auth/users    | Auth   | List all users  |
| GET    | /api/auth/health   | Public | Health check    |

### Projects
| Method | Endpoint                          | Description             |
|--------|-----------------------------------|-------------------------|
| GET    | /api/projects                     | List my projects        |
| POST   | /api/projects                     | Create project          |
| GET    | /api/projects/:id                 | Get project details     |
| PUT    | /api/projects/:id                 | Update project (owner)  |
| DELETE | /api/projects/:id                 | Delete project (owner)  |
| POST   | /api/projects/:id/members/:userId | Add member              |
| DELETE | /api/projects/:id/members/:userId | Remove member           |

### Tasks
| Method | Endpoint                      | Description           |
|--------|-------------------------------|-----------------------|
| GET    | /api/projects/:id/tasks       | List project tasks    |
| POST   | /api/projects/:id/tasks       | Create task           |
| GET    | /api/tasks/:taskId            | Get task              |
| PUT    | /api/tasks/:taskId            | Update task           |
| PATCH  | /api/tasks/:taskId/status     | Update status only    |
| DELETE | /api/tasks/:taskId            | Delete task           |
| GET    | /api/tasks/my                 | My assigned tasks     |

### Dashboard
| Method | Endpoint       | Description        |
|--------|----------------|--------------------|
| GET    | /api/dashboard | Dashboard stats    |

---

## 🚀 Local Development

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- npm 9+

### Run Backend

```bash
cd backend
mvn spring-boot:run
```
Backend runs on http://localhost:8080  
H2 Console: http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:mem:taskdb`, no password)

### Run Frontend

```bash
cd frontend
npm install
npm start
```
Frontend runs on http://localhost:3000 (proxies API to 8080)

---

## 🚂 Deploy to Railway

### Step 1 — Create Railway Account
Go to [railway.app](https://railway.app) → Sign up with GitHub

### Step 2 — Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"** (push code to GitHub first) OR **"Empty Project"**

### Step 3 — Add PostgreSQL Database
1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway automatically creates env vars: `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

### Step 4 — Create App Service
1. Click **"+ New"** → **"GitHub Repo"** (connect your repo)
2. Railway detects the `Dockerfile` automatically

### Step 5 — Set Environment Variables
In your app service → **Variables** tab, add:

```
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
PGUSER=${{Postgres.PGUSER}}
PGPASSWORD=${{Postgres.PGPASSWORD}}
JWT_SECRET=YourSuperSecretKeyHereMakeItLongAndRandom123!@#
CORS_ORIGINS=https://your-app.up.railway.app
PORT=8080
```

> **Tip:** Use Railway's variable references `${{Postgres.PGHOST}}` to auto-link database credentials.

### Step 6 — Generate Domain
In your service → **Settings** → **Networking** → **Generate Domain**

Your app will be live at `https://your-app-name.up.railway.app`

### Step 7 — Deploy
Railway auto-deploys on every `git push` to your connected branch.

To manually deploy: Click **"Deploy"** in the Railway dashboard.

---

## 🐳 Docker Build (Local Test)

```bash
# Build the full image
docker build -t taskflow .

# Run with H2 (dev mode)
docker run -p 8080:8080 taskflow

# Run with PostgreSQL
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host:5432/taskdb \
  -e PGUSER=postgres \
  -e PGPASSWORD=secret \
  -e JWT_SECRET=MySecretKey123 \
  taskflow
```

---

## 🔐 Role-Based Access Control

| Action                    | ADMIN | MEMBER (owner) | MEMBER (other) |
|---------------------------|-------|----------------|----------------|
| See all projects          | ✅    | ❌             | ❌             |
| Create project            | ✅    | ✅             | ✅             |
| Edit/Delete own project   | ✅    | ✅             | ❌             |
| Add/Remove members        | ✅    | ✅             | ❌             |
| Create tasks              | ✅    | ✅             | ✅ (member)    |
| Delete/Edit tasks         | ✅    | ✅             | ✅ (member)    |
| Update task status        | ✅    | ✅             | ✅ (member)    |

---

## 📝 Environment Variables Reference

| Variable                | Description                    | Default               |
|-------------------------|--------------------------------|-----------------------|
| `PORT`                  | Server port                    | `8080`                |
| `SPRING_PROFILES_ACTIVE`| Active profile (`prod`)        | default (H2)          |
| `SPRING_DATASOURCE_URL` | JDBC URL for PostgreSQL        | H2 in-memory          |
| `PGUSER`                | DB username                    | `sa`                  |
| `PGPASSWORD`            | DB password                    | *(empty)*             |
| `JWT_SECRET`            | JWT signing secret (32+ chars) | *dev default*         |
| `CORS_ORIGINS`          | Allowed frontend origins        | `http://localhost:3000`|

---

## 👤 Default Test Users

After signup, you can create an ADMIN by selecting "Admin" role during signup.

**Sample workflow:**
1. Sign up as Admin → Create project → Add members
2. Sign up as Member → Get added to project → Assign & manage tasks
