# TaskMaster - Secure ToDo App

![Next.js](https://img.shields.io/badge/Next.js-15.2.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.5.0-teal)
![NextAuth](https://img.shields.io/badge/NextAuth-4.24.11-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-purple)

A secure, modern to-do list application built with Next.js and enhanced with robust security features. TaskMaster allows standard users to manage their tasks and provides admin users with additional capabilities to manage tasks across all users.

## 🚀 Features

### For Standard Users

- Create, update, and delete personal tasks
- Mark tasks as pending or completed
- Set due dates for better task management
- Clean, responsive UI optimized for all device sizes

### For Admin Users

- All standard user features
- Assign tasks to any user in the system
- View and manage all tasks across the platform
- "Kill All" super power function to remove all tasks at once

## 🔒 Security Features

This project was developed with a strong focus on security, implementing best practices to prevent common vulnerabilities:

- **SQL Injection Protection**: Using Prisma ORM with parameterized queries
- **Cross-Site Scripting (XSS) Prevention**:
  - Client and server-side input validation with Zod
  - Automatic output escaping with React
- **Password Security**:
  - Strong password hashing with bcrypt
  - Unique salt per user
  - Server-side pepper for additional security
- **Secure Session Handling**:
  - JWT-based authentication with NextAuth.js
  - Secure cookie configuration
  - Role-based access control
- **Rate Limiting**:
  - Protects against brute force attacks
  - Account lockout for 10 minutes after 5 failed login attempts
  - IP-based tracking of login attempts

## 🛠️ Technology Stack

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js, bcrypt
- **Validation**: Zod schema validation

## 📋 Data Entities

### User

- `id`: UUID (primary key)
- `username`: String (3-50 chars, alphanumeric + underscores)
- `password_hash`: String (securely hashed)
- `password_salt`: String (unique per user)
- `email`: String (valid email format)
- `role`: Integer (0: user, 2: admin)

### Task

- `id`: UUID (primary key)
- `title`: String (task name)
- `description`: String (optional)
- `duedate`: DateTime (must be today or in the future)
- `status`: Integer (0: pending, 1: completed)
- `user_id`: Foreign key (references User)

## 🔧 Setup and Installation

### Prerequisites

- Node.js (v14+)
- PostgreSQL database

### Installation Steps

1. Clone the repository

```bash
git clone https://github.com/BrickiBulli/Abgabe.git
cd to_do_app
```

1. Install dependencies

```bash
npm install
```

3. Set up environment variables
Create a `.env` file based on the provided `.env.example`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/dbname?schema=public"
PEPPER_SECRET="your_secure_pepper_value"
NEXTAUTH_SECRET="your_secure_random_string"
NODE_ENV="development"
```

4. Run database migrations

```bash
npx prisma migrate dev
```

5. Start the development server

```bash
npm run dev
```

6. Access the application at <http://localhost:3000>

*Note: For production, remove or change these default accounts*

## 🔍 Validation Rules

### User Registration

- Username: 3-50 characters, letters, numbers, and underscores only
- Email: Valid email format
- Password: Minimum 8 characters, must include one uppercase letter, one number, and one special character

### Task Creation/Editing

- Title: Required
- Description: Optional
- Due Date: Valid date not in the past
- Status: Value from predefined list (0-1)
