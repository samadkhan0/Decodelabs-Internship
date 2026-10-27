# Project 3 — Database Integration

A simple Task Manager REST API built with **Node.js, Express.js, and SQLite** as part of the Decode Labs Full Stack Development Industrial Training Program.

## Project Overview

This project demonstrates how to connect a backend application to a database, store and retrieve records, and perform CRUD (Create, Read, Update, Delete) operations.

## Technologies Used

- Node.js
- Express.js
- SQLite
- better-sqlite3

## Features

- Create new tasks with a title and priority.
- Retrieve all tasks.
- Retrieve a single task using its ID.
- Update task details and completion status.
- Delete tasks.
- Validate user input.
- Store task data persistently in an SQLite database.
- Return appropriate HTTP status codes and JSON responses.

## Database Schema

The `tasks` table contains the following fields:

| Field | Type | Description |
|---|---|---|
| `id` | INTEGER | Primary key, auto-incremented |
| `title` | TEXT | Task title (required) |
| `priority` | TEXT | Low, Medium, or High |
| `completed` | INTEGER | Completion status (0 or 1) |

The database file, `tasks.db`, is created automatically when the application starts.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the server

```bash
node server.js
```

The API will run at:

`http://localhost:3000`

### 3. Test the API

Open the following URL in your browser to check whether the API is running:

`http://localhost:3000/`

To retrieve all tasks, visit:

`http://localhost:3000/api/tasks`

Use Postman or PowerShell to test POST, PUT, and DELETE requests.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check API status |
| GET | `/api/tasks` | Retrieve all tasks |
| GET | `/api/tasks/:id` | Retrieve one task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## Learning Outcomes

- Backend API development using Express.js.
- Database integration using SQLite.
- Implementing CRUD operations.
- Validating request data.
- Handling API responses and HTTP status codes.
- Understanding persistent data storage.

## Author

**Abdul Samad Khan**

Computer Science Student | Full-Stack Web Development Learner

## Training Program

Decode Labs — Full Stack Development Industrial Training Program