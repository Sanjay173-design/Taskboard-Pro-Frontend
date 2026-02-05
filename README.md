# 🚀 TaskBoard Pro — Frontend

Premium SaaS-style Task Management UI built with **React + Vite + TailwindCSS**, integrated with AWS Serverless backend (Lambda + DynamoDB + Cognito + S3 + Redis).

---

## 🌐 Live Demo
👉 https:taskboard-pro-frontend.vercel.app

---

## 🧠 Features

### 🔐 Authentication
- AWS Cognito Login / Register
- Secure JWT session handling
- Protected routes

### 🧭 App Shell
- Collapsible Sidebar
- Header with Logout
- Responsive layout

### 📊 Dashboard
- Total tasks
- Completed tasks
- In progress
- Overdue
- High priority
- Status chart

### 📁 Workspaces
- Create workspace
- List user workspaces

### 📂 Projects
- Create project per workspace
- Redis cache invalidation sync

### ✅ Tasks (Core Module)
- Create tasks
- Drag & Drop Kanban board
- Status updates (Todo → Progress → Done)
- Search + Filters
- Priority & Due date support

### 📝 Task Details Modal
- Edit title
- Edit description
- Status update
- Priority update
- Due date picker
- Comments
- Activity timeline

### 📎 Attachments
- Upload file (S3 presigned URL)
- Download file
- Delete file
- Preview attachments

### 📡 Realtime Feel
- Polling auto refresh

---

## 🏗️ Tech Stack

| Layer | Tech |
|---|---|
Frontend | React + Vite |
UI | TailwindCSS |
Auth | AWS Cognito |
Hosting | Vercel |
Drag Drop | dnd-kit |
Charts | Recharts |
State | React Hooks |

---

## 🔐 Security Notes

- JWT stored securely via Amplify session
- Backend protected via Cognito authorizer
- Presigned URLs for S3 upload/download
- Redis cache invalidation implemented

## 🎯 Production Highlights

- Serverless backend
- Premium SaaS UI
- Kanban drag drop
- File attachments
- Activity tracking
- Dashboard 
- Realtime polling

## 📜 Future Improvements

- WebSocket realtime updates
- Team collaboration
- Role based access
- Notifications
- Mobile responsive optimization

👨‍💻 Author

HN Sanjay
