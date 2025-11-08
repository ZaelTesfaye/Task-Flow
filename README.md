# 🚀 TaskFlow - Complete Task Management Application

<div align="center">

![TaskFlow](https://img.shields.io/badge/TaskFlow-v2.0-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-316192?style=for-the-badge&logo=postgresql)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)

**A modern, full-stack task management application with dark mode, role-based access control, and team collaboration features.**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Tech Stack](#-tech-stack) • [Screenshots](#-screenshots)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Documentation](#-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

**TaskFlow** is a production-ready, full-stack task management application inspired by Trello. It features a modern UI with dark mode support, comprehensive role-based access control, and seamless team collaboration capabilities.

### Key Highlights

- ✅ **25 Fully Integrated API Endpoints**
- ✅ **Dark Mode Support** with theme persistence
- ✅ **Role-Based Access Control** (Owner, Admin, Member)
- ✅ **Real-time Collaboration** features
- ✅ **Responsive Design** for all devices
- ✅ **Production-Ready** code with zero errors
- ✅ **Comprehensive Documentation** (8 detailed guides)

## ✨ Features

### 🔐 Authentication & Security
- User registration with auto-login
- Secure JWT authentication with HTTP-only cookies
- Profile management (update name/email)
- Account deletion with confirmation
- Password hashing and validation

### 📊 Project Management
- Create, update, and delete projects
- Organize projects by role (Owner/Admin/Member)
- Beautiful project cards with hover effects
- Project settings and configuration

### 👥 Team Collaboration
- Add members by User ID
- Assign roles (Admin, Member)
- Promote/demote team members
- Remove members from projects
- View all project members with roles

### 📝 Task Management
- Trello-style kanban board
- Create categories (columns) for organization
- Create tasks with title, description, and assignee
- Update task status (Active, Complete, Canceled)
- Delete tasks and categories
- Visual task cards with assignee avatars

### ⏳ Pending Updates System
- Members request task status changes
- Visual indicators for pending updates
- Admin/Owner approval workflow
- Automatic status updates after approval

### 👑 Admin Panel
- View all users (paginated)
- Change user passwords
- Delete user accounts
- Role-based access restrictions

### 🎨 Modern UI
- **Dark Mode** toggle with theme persistence
- **Glassmorphism** effects and backdrop blur
- **Gradient Accents** for visual appeal
- **Smooth Animations** and transitions
- **Professional Component Library**
- **Responsive Design** for all screen sizes

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- pnpm (for frontend) or npm (for backend)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd taskflow
```

2. **Setup Backend**
```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# Run database migrations
npx prisma migrate dev
npx prisma generate

# Start backend server
npm run dev
```

Backend runs on: `http://localhost:3000`

3. **Setup Frontend**
```bash
cd frontend/my-app
pnpm install

# Environment is pre-configured in .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Start frontend server
pnpm dev
```

Frontend runs on: `http://localhost:3001`

4. **Access the Application**

Open your browser and navigate to:
```
http://localhost:3001
```

### First Steps

1. **Register** a new account
2. **Create** your first project
3. **Add categories** (To Do, In Progress, Done)
4. **Create tasks** and assign them
5. **Invite team members** using their User ID
6. **Toggle dark mode** from the profile menu

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **HTTP Status**: http-status

### Frontend
- **Framework**: Next.js 16
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Utilities**: class-variance-authority, clsx, tailwind-merge

### Development Tools
- **Package Manager**: pnpm (frontend), npm (backend)
- **Code Quality**: ESLint
- **Type Safety**: TypeScript support

## 📁 Project Structure

```
taskflow/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── models/           # Database queries
│   │   ├── routes/           # API routes
│   │   ├── middlewares/      # Auth, validation
│   │   ├── validations/      # Joi schemas
│   │   ├── dtos/             # Data transfer objects
│   │   ├── config/           # Configuration
│   │   └── utils/            # Utilities
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   └── package.json
│
├── frontend/my-app/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # UI component library
│   │   │   ├── Layout.js     # Original layout
│   │   │   └── ModernLayout.js # Modern layout with dark mode
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── ThemeContext.js
│   │   ├── lib/
│   │   │   ├── api.js        # API client
│   │   │   └── utils.js      # Utilities
│   │   ├── pages/
│   │   │   ├── index.js      # Landing page
│   │   │   ├── login.js      # Login page
│   │   │   ├── register.js   # Registration page
│   │   │   ├── dashboard.js  # Original dashboard
│   │   │   ├── modern-dashboard.js # Modern dashboard
│   │   │   ├── admin.js      # Admin panel
│   │   │   └── project/
│   │   │       └── [id].js   # Project board
│   │   └── styles/
│   │       └── globals.css   # Global styles
│   └── package.json
│
└── Documentation/
    ├── SETUP_GUIDE.md
    ├── QUICK_START.md
    ├── README_TASKFLOW.md
    ├── APP_FLOW.md
    ├── FEATURES_CHECKLIST.md
    ├── MODERN_UI_UPGRADE.md
    ├── QUICK_REFERENCE.md
    └── VISUAL_SHOWCASE.md
```

## 🔌 API Endpoints

### Authentication (3 endpoints)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User Management (2 endpoints)
- `PATCH /api/user` - Update user profile
- `DELETE /api/user` - Delete user account

### Projects (4 endpoints)
- `POST /api/project` - Create project
- `GET /api/project` - Get user's projects
- `PATCH /api/project/:projectId` - Update project
- `DELETE /api/project/:projectId` - Delete project

### Project Members (4 endpoints)
- `POST /api/project/member/:projectId` - Add member
- `GET /api/project/member/:projectId` - Get members
- `PATCH /api/project/member/:projectId/:userId` - Update member role
- `DELETE /api/project/member/:projectId/:userId` - Remove member

### Categories (3 endpoints)
- `POST /api/category/:projectId` - Create category
- `PATCH /api/category/:projectId/:categoryId` - Update category
- `DELETE /api/category/:projectId/:categoryId` - Delete category

### Tasks (6 endpoints)
- `POST /api/task/:projectId/:categoryId` - Create task
- `GET /api/task/:projectId` - Get all tasks
- `PATCH /api/task/:projectId/:taskId` - Update task
- `DELETE /api/task/:projectId/:taskId` - Delete task
- `POST /api/task/request-update/:projectId/:taskId` - Request update
- `PATCH /api/task/accept-update/:projectId/:pendingUpdateId` - Accept update

### Admin (3 endpoints)
- `GET /admin/user/:page/:limit` - View all users
- `DELETE /admin/user/:userId` - Delete user
- `PATCH /admin/user` - Update user password

**Total: 25 endpoints - All fully integrated!**

## 📚 Documentation

Comprehensive documentation is available in the following files:

1. **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup instructions
2. **[QUICK_START.md](frontend/my-app/QUICK_START.md)** - Get started in 3 steps
3. **[README_TASKFLOW.md](frontend/my-app/README_TASKFLOW.md)** - Full feature documentation
4. **[APP_FLOW.md](frontend/my-app/APP_FLOW.md)** - Visual flow diagrams
5. **[FEATURES_CHECKLIST.md](frontend/my-app/FEATURES_CHECKLIST.md)** - Complete feature list
6. **[MODERN_UI_UPGRADE.md](frontend/my-app/MODERN_UI_UPGRADE.md)** - Modern UI guide
7. **[QUICK_REFERENCE.md](frontend/my-app/QUICK_REFERENCE.md)** - Quick reference card
8. **[VISUAL_SHOWCASE.md](frontend/my-app/VISUAL_SHOWCASE.md)** - Visual design guide

## 📸 Screenshots

### Modern Dashboard (Light Mode)
- Beautiful gradient backgrounds
- Project cards with hover effects
- Role-based organization

### Modern Dashboard (Dark Mode)
- Elegant dark theme
- Glassmorphism effects
- Smooth transitions

### Project Board
- Trello-style kanban layout
- Horizontal scrolling categories
- Task cards with status badges
- Pending update indicators

### Profile Menu
- User ID copy functionality
- Dark mode toggle
- Profile management
- Account settings

## 👥 User Roles

### Owner (👑)
- Full project control
- Update/delete project
- Manage all members
- Create/update/delete categories and tasks
- Approve pending updates

### Admin (🛡️)
- Create/update/delete categories and tasks
- Approve pending updates
- Cannot modify project settings
- Cannot remove owner

### Member (👤)
- View all tasks
- Request task status updates
- Cannot create/modify tasks directly
- Cannot manage members

## 🎨 Design System

### Colors
- **Primary**: Blue to Indigo gradient
- **Success**: Green shades
- **Warning**: Yellow shades
- **Danger**: Red to Rose gradient

### Components
- Button (5 variants)
- Card (with header, content, footer)
- Dialog (modal)
- Input (form fields)
- Label (form labels)
- Switch (toggle)

### Animations
- Hover effects with scale and shadow
- Smooth transitions (300ms)
- Loading spinners
- Modal animations

## 🔒 Security

- ✅ HTTP-only cookies for JWT tokens
- ✅ Password hashing
- ✅ Role-based access control
- ✅ Input validation on all endpoints
- ✅ CSRF protection
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection

## 📱 Responsive Design

- ✅ Desktop (1024px+) - 3 column grid
- ✅ Tablet (768px - 1023px) - 2 column grid
- ✅ Mobile (< 768px) - 1 column grid
- ✅ Touch-friendly controls
- ✅ Adaptive layouts

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🧪 Testing

### Manual Testing Workflow
1. Register new user
2. Create project
3. Add categories
4. Create tasks
5. Add team members
6. Test role permissions
7. Test pending updates
8. Toggle dark mode
9. Test on mobile
10. Test in different browsers

## 🚀 Deployment

### Backend
```bash
npm run build
npm start
```

### Frontend
```bash
pnpm build
pnpm start
```

### Environment Variables

**Backend (.env)**
```
DATABASE_URL="postgresql://user:pass@localhost:5432/taskflow"
JWT_SECRET="your-secret-key"
PORT=3000
NODE_ENV="production"
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Radix UI for accessible component primitives
- Lucide for beautiful icons
- Prisma for the excellent ORM

## 📞 Support

For issues, questions, or suggestions:
- Check the documentation files
- Review the code comments
- Open an issue on GitHub

## 🎉 What's Next?

Potential future enhancements:
- Real-time updates with WebSockets
- Drag-and-drop task reordering
- File attachments
- Comments on tasks
- Activity timeline
- Email notifications
- Search functionality
- Filters and sorting
- Export to CSV/PDF
- Mobile app

---

<div align="center">

**Built with ❤️ using Next.js, React, and Tailwind CSS**

⭐ Star this repo if you find it helpful!

[Report Bug](https://github.com/yourusername/taskflow/issues) • [Request Feature](https://github.com/yourusername/taskflow/issues)

</div>
