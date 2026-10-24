# DecodeLabs Project 2 — Task Manager REST API

A simple REST API built with Node.js and Express.js as part of the DecodeLabs Full Stack Development training program.

## Features

- Retrieve all tasks
- Retrieve a task by ID
- Create a new task
- Update an existing task
- Delete a task
- Validate user input
- Return appropriate HTTP status codes
- Store tasks in a JSON file so data persists after restarting the server

## Technologies Used

- Node.js
- Express.js
- JavaScript
- JSON file storage

## Installation

1. Install Node.js.
2. Clone or download this repository.
3. Open the Project-2-Backend-API folder in your terminal.
4. Install dependencies:

   `npm install`

5. Start the server:

   `node server.js`

The API will run at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check API status |
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get a task by ID |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## Example Request

Create a task using POST `/api/tasks` with this JSON body:

```json
{
  "title": "Complete Project 2",
  "priority": "High"
}
```

Available priorities are `Low`, `Medium`, and `High`.

## HTTP Status Codes

- `200 OK` — Request completed successfully.
- `201 Created` — Task created successfully.
- `400 Bad Request` — Invalid input.
- `404 Not Found` — Task does not exist.

## Data Storage

Tasks are stored in `tasks.json`. Changes are saved to the file, so tasks remain available after the server restarts.

## Learning Outcomes

This project helped me practice REST API development, HTTP methods, request validation, JSON responses, error handling, and basic file-based data persistence.

## Author

Abdul Samad khan
