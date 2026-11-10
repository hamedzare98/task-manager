# Task Manager

A full-stack task manager built to practice modern Angular and NestJS. Users sign up, log in with their email **or** username, and manage their own tasks with due dates and overdue tracking.

## Features

- Register and log in with email or username (JWT authentication, passwords hashed with bcrypt)
- Per-user data: every user only sees and edits their own tasks
- Create, complete, edit and delete tasks
- Optional due date per task with an automatic "overdue" status
- Protected routes: visitors who are not logged in are redirected to the login page, and an expired token logs the user out automatically
- Persian (RTL) interface with a custom Tailwind theme

## Tech stack

- **Frontend:** Angular 22 (standalone components, signals, functional guards and interceptors), Tailwind CSS 4
- **Backend:** NestJS (ESM), Prisma 5, PostgreSQL, bcrypt, jsonwebtoken

## Screenshots

![Login](docs/screenshots/login.png)
![Task list](docs/screenshots/task-list.png)
![Editing a task](docs/screenshots/edit-task.png)

## API

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | no | Create an account (email, username, password) |
| POST | `/auth/login` | no | Log in with email or username, returns a JWT |
| GET | `/tasks` | yes | List the current user's tasks |
| POST | `/tasks` | yes | Create a task |
| PATCH | `/tasks/:id` | yes | Update title, done state or due date |
| DELETE | `/tasks/:id` | yes | Delete a task |

Protected routes expect an `Authorization: Bearer <token>` header.

## Run locally

Requirements: Node.js 24 and a local PostgreSQL 16 server.

```bash
createdb task_manager
```

Backend (http://localhost:3000):

```bash
cd backend
npm install
cp .env.example .env        # then fill in DATABASE_URL and JWT_SECRET
npx prisma migrate deploy
npm run start:dev
```

Generate a secret with `openssl rand -hex 32`.

Frontend (http://localhost:4200):

```bash
cd frontend
npm install
npx ng serve
```

If `bcrypt` fails to load, npm 11 may have blocked its install script. Approve it with `npm install-scripts approve bcrypt` and run `npm install` again.

## Project structure

```
frontend/   Angular app
backend/    NestJS API, Prisma schema and migrations
```