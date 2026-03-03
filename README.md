# 🚀 EduVerse – Innovation-Driven LMS Platform

EduVerse is a full-stack, problem-driven Learning Management System (LMS) that transforms traditional course-based learning into a collaborative innovation ecosystem.

Unlike standard LMS platforms that only provide video lessons and quizzes, EduVerse integrates structured learning with real-world problem solving, idea validation, team collaboration, project building, and gamification.

---

## 🌍 Vision

EduVerse aims to replace passive learning with active innovation by enabling students to build real-world solutions within an educational platform.

---

# 🧱 Tech Stack

## 🔹 Backend
- Laravel (RESTful API)
- MySQL (Relational Database)
- Laravel Sanctum (Authentication)
- Role-based Middleware
- Cloudinary (Media Storage)

## 🔹 Frontend
- React.js
- Context API (Auth State Management)
- React Router
- Bootstrap
- FilePond (File Uploads)

---

# 👥 User Roles

### 🛠 Admin
- Manage categories
- Monitor analytics
- Track enrollments
- View innovation metrics

### 👨‍🏫 Instructor
- Create & manage courses
- Upload lessons & videos
- Validate ideas
- Score projects
- Issue certificates

### 🎓 Student
- Enroll in courses
- Track progress
- Post real-world problems
- Submit solution ideas
- Vote on ideas
- Join teams
- Build projects
- Earn leaderboard points

---

# 🎓 Course Management

- Course CRUD
- Chapters & Lessons
- Video uploads (Cloudinary)
- Enrollment tracking
- Progress tracking
- Certificate generation

---

# 💡 Innovation Hub (Core Feature)

EduVerse introduces a structured innovation pipeline:

1. Problem Posted
2. Ideas Proposed
3. Community Voting
4. Instructor Validation
5. Team Formation
6. Build Phase
7. Public Showcase
8. Completion & Scoring

This simulates a real product development lifecycle inside an LMS.

---

# 🏆 Gamification & Leaderboard

Dynamic scoring system based on:

- Updates
- Selected ideas
- Completed ideas
- Quality bonus
- Completed courses

Encourages continuous participation and real project completion.

---

# 🌟 Public Showcase

Completed projects can be published with:

- Project description
- GitHub link
- Demo link
- Build updates
- Instructor validation

Students can use this as a portfolio.

---

# 🔐 Security & Architecture

- RESTful API structure
- Sanctum-based authentication
- Role-based access control
- Protected routes
- Clean frontend-backend separation
- Scalable relational database design

---

# ⚙️ Installation Guide

Frontend Setup
cd frontend
npm install
npm run dev

## Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
---








