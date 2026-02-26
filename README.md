

🚦 Redline — Priority-Based Task Management Platform
Overview
Redline is a full-stack task management platform built around a traffic-light priority system.
It helps users focus on what truly matters by combining color-based urgency logic with dynamic deadline tracking.
The system is designed to visually highlight urgency and automatically escalate tasks as deadlines approach.


🔥 Key Concept — Traffic Light Priority System
Redline is based on three urgency levels:
🟢 Green — Low urgency
🟡 Yellow — Medium urgency
🔴 Red — High urgency
Instead of manually managing priority, tasks can dynamically change their urgency level depending on remaining time.


✨ Core Features

Task Management (Full CRUD)
Create tasks
Update tasks
Delete tasks
Mark tasks as completed
Retrieve tasks per authenticated user
Each task contains:
Text content
Priority color
Optional deadline (timer)
Completion status


🎯 Dynamic Deadline System

When a deadline is set, the task automatically updates its urgency level:
Remaining Time
Priority
14–8 days
🟢 Green
7–3 days
🟡 Yellow
2 days–1 hour
🔴 Red
Tasks visually escalate as the deadline approaches.
Additional UX detail:
Red tasks close to deadline receive a shadow highlight for visual emphasis.


🔍 Filtering System
Users can filter tasks by:
All
Green
Yellow
Red
Done
Color priority is represented via left border indicators for instant visual scanning.


🔐 Authentication System

User registration
Email verification
Login
Password reset
Authentication is fully separated from task logic and secured via backend validation.


🏗 Architecture

Redline follows a clean full-stack architecture with separated concerns.
Backend
Node.js
Express
Prisma ORM
PostgreSQL
RESTful API design
Frontend
React
Vite
Modular component structure
Dynamic state updates
API-driven UI


🧠 Technical Highlights

Dynamic color recalculation based on remaining time
Secure task isolation per authenticated user
API-based architecture ready for scaling
Structured project organization (frontend/backend separation)
Real-world authentication flow implementation


🚀 Planned Improvements

Persist tasks created before registration (guest → user migration)
Strengthen API validation & security layers
Improve password reset flow with session auto-restoration
Add pagination & performance optimization
Unit & integration testing layer


📌 Project Goal

Redline was initially built as a personal productivity tool — a system to reduce mental overload and avoid keeping everything in memory.
The goal was to create a simple but structured environment where task urgency is visually clear and priorities adjust automatically over time.
As the project evolved, it became both a real-world tool for daily use and a hands-on full-stack engineering exercise.
It demonstrates:
Backend architecture design
REST API implementation
Authentication system integration
Full-stack communication flow
Practical task management logic with dynamic priority handling



🚦Why traffic-light system?

Instead of building a typical task manager, I wanted to introduce a visual priority model inspired by the traffic-light system.
The goal was to make urgency instantly understandable without reading labels.
Colors create faster recognition and improve decision-making.
This approach makes task prioritization more intuitive and engaging compared to traditional list-based systems.


Why dynamic urgency?

The project was originally built for personal use.
In daily life, some tasks become more urgent over time.
Instead of keeping everything in mind, I designed a system where task priority changes automatically as the deadline approaches.
This removes mental pressure and allows the system to reflect real-time urgency.


What problem does it solve?

Most task applications focus only on storing tasks.
Redline goes further by visualizing time pressure dynamically.
The traffic-light model combined with automatic urgency transitions helps users:
Understand priority at a glance
Track remaining time visually
Focus on what truly requires attention
The goal is not just remembering tasks, but managing urgency intelligently.


🏗️Installation
1. Clone the repository
git clone https://github.com/Abdulbasiyr/Redline.git
cd Redline


2. Install dependencies
Install backend dependencies:
cd src/backend
npm install
cd ../../
Install frontend dependencies:
cd src
npm install


4. Setup environment variables
Create .env inside:

src/backend/
Add:
Env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key

ACCESS_TTL=15m
REFRESH_TTL=30d
RESET_TTL=10m

SMTP_USER=your_email
SMTP_PASS=your_password

PORT=5000
Если Vite использует переменные:
Create .env inside:

src/
Env
VITE_API_URL=http://localhost:5000
4. Run backend
Bash
cd src/backend
node .
5. Run frontend
Open terminal:
cd src
npm run dev
