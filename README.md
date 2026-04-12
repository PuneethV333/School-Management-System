# 🏫 School Management System

A full-stack School Management System built with **React**, **TypeScript**, **Node.js**, **MongoDB**, and **Redis**. Designed for teachers, students, and administrators to manage attendance, marks, announcements, timetables, and more — through a sleek dark-themed dashboard.

> Built solo in **30 days** with **90 commits** (Mar 11 – Apr 12, 2026). Every feature, bug fix, and architectural decision was made and iterated on independently — from Redis caching strategies to role-based access control.

---

## ✨ Features

- 🔐 **Authentication** — JWT + Redis session management, cookie-based auth, role-based access (Authority / Teacher / Student)
- 📊 **Attendance Tracking** — Mark, view and analyze weekly/monthly attendance with interactive charts
- 📝 **Marks Management** — Add and view UT and Exam marks with bulk operations
- 📢 **Announcements** — Create and manage school-wide announcements
- 🗓️ **Timetable** — View class timetables per role
- 📚 **Syllabus** — Track syllabus progress
- 👤 **Profiles** — Student and teacher profile management with Cloudinary image upload
- ⚡ **Redis Caching** — Every endpoint cached with proper invalidation using non-blocking `scan()`
- 📱 **Responsive UI** — Mobile-friendly dark theme built with Tailwind CSS

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Tailwind CSS | Styling |
| Recharts | Attendance charts |
| React Query | Server state management |
| React Router v6 | Client-side routing |
| Axios | HTTP client |
| React Hot Toast | Notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Server framework |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database |
| Redis | Caching + session management |
| JWT | Authentication |
| Helmet | Security headers |
| Express Rate Limit | DDoS protection |
| Cloudinary | Image storage |
| Morgan | Request logging |
| Compression | Response compression |

---

## 📁 Project Structure

```
School-Management-System/
├── src-backend/
│   ├── config/          # Redis, env validation
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, error handling, Redis
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── services/        # Business logic
│   ├── utils/           # JWT, Redis, error utilities
│   ├── app.ts           # Express app setup
│   └── server.ts        # Entry point
│
└── src-frontend/
    ├── api/             # Axios API calls
    ├── components/      # Reusable UI components
    ├── config/          # Menu config
    ├── context/         # React context
    ├── Graph/           # Recharts attendance graph
    ├── hooks/           # React Query hooks
    ├── pages/           # Route pages
    ├── ProtectedRoute/  # Auth guard
    ├── types/           # TypeScript interfaces
    ├── utils/           # Helper functions
    ├── App.tsx          # Routes (all lazy loaded)
    └── main.tsx         # Entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18+`
- MongoDB
- Redis

### Backend Setup

```bash
cd src-backend

npm install

# Create .env file
cp .env.example .env
# Fill in your values (see Environment Variables below)

npm run dev
```

### Frontend Setup

```bash
cd src-frontend

npm install

npm run dev
```

---

## 🔐 Environment Variables

```env
# Backend
JWT_SECRET=
MONGO_URI=
REDIS_URL=
CURRENT_ACADEMIC_YEAR=2025-26
VITE_FRONTEND_URL=http://localhost:5173
PORT=3000

# Frontend
VITE_BACKEND_URL=http://localhost:3000
```

The server validates all required env vars on startup and exits immediately with a clear error message if any are missing.

---

## 🏗️ Architecture Highlights

**Caching strategy** — Every GET endpoint checks Redis before hitting MongoDB. Cache is invalidated on mutation using non-blocking `scan()` instead of `keys()` to avoid blocking Redis under load.

**Role-based access** — Three roles (authority, teacher, student) with access checks at both middleware and controller level. Students can only see their own data; teachers and authority see class-wide data.

**Bulk operations** — Marks are written using MongoDB `bulkWrite` for efficient batch updates across an entire class in a single DB round trip.

**Lazy loading** — Every route in the frontend is lazy loaded, splitting the bundle so users only download what they need.

**Session management** — JWT tokens are stored in Redis with a TTL. Logout invalidates the session server-side — something most JWT implementations skip.

**Env validation** — Server validates all required environment variables on startup and exits with a clear error before accepting any requests.

---

## 👤 User Roles

| Feature | Authority | Teacher | Student |
|---|---|---|---|
| Mark attendance | ✅ | ✅ | ❌ |
| View all attendance | ✅ | ✅ | Class only |
| Add marks | ✅ | ✅ | ❌ |
| View marks | ✅ | ✅ | Own only |
| Manage announcements | ✅ | ✅ | View only |
| View timetable | ✅ | ✅ | ✅ |
| View syllabus | ✅ | ✅ | ✅ |

---

## 📈 Performance

With Nginx + PM2 cluster mode this backend comfortably handles **1,000+ concurrent users** — sufficient for any single school deployment.

| Setup | Concurrent Users |
|---|---|
| Node.js alone | ~500 |
| + Nginx | ~1,000 |
| + Nginx + PM2 cluster | ~4,000+ |

---

## 🗓️ Development Timeline

- **Started:** March 11, 2026
- **Completed:** April 12, 2026
- **Duration:** 30 days
- **Commits:** 90
- **Built:** Solo, from scratch

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'add: your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use this project as a reference or starting point.