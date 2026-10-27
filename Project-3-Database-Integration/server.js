const express = require("express");
const Database = require("better-sqlite3");

const app = express();
const PORT = 3000;

app.use(express.json());

const db = new Database("tasks.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        priority TEXT NOT NULL DEFAULT 'Medium',
        completed INTEGER NOT NULL DEFAULT 0
    )
`);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "DecodeLabs Project 3 - Task Manager API",
        status: "Running"
    });
});

app.get("/api/tasks", (req, res) => {
    const tasks = db.prepare(
        "SELECT * FROM tasks ORDER BY id"
    ).all();

    res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
    });
});

app.get("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid task ID"
        });
    }

    const task = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(id);

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    res.status(200).json({
        success: true,
        data: task
    });
});
app.post("/api/tasks", (req, res) => {
    const { title, priority = "Medium" } = req.body;

    const validPriorities = ["Low", "Medium", "High"];

    if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
            success: false,
            message: "Task title is required"
        });
    }

    if (!validPriorities.includes(priority)) {
        return res.status(400).json({
            success: false,
            message: "Priority must be Low, Medium, or High"
        });
    }

    const result = db.prepare(
        "INSERT INTO tasks (title, priority, completed) VALUES (?, ?, ?)"
    ).run(title.trim(), priority, 0);

    const newTask = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(result.lastInsertRowid);

    res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: newTask
    });
});
app.put("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const { title, priority, completed } = req.body;

    const task = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(id);

    if (!Number.isInteger(id) || id <= 0 || !task) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    if (title !== undefined && (typeof title !== "string" || !title.trim())) {
        return res.status(400).json({
            success: false,
            message: "Title must not be empty"
        });
    }

    if (priority !== undefined && !["Low", "Medium", "High"].includes(priority)) {
        return res.status(400).json({
            success: false,
            message: "Priority must be Low, Medium, or High"
        });
    }

    if (completed !== undefined && typeof completed !== "boolean") {
        return res.status(400).json({
            success: false,
            message: "Completed must be true or false"
        });
    }

    const updatedTitle = title === undefined ? task.title : title.trim();
    const updatedPriority = priority === undefined ? task.priority : priority;
    const updatedCompleted = completed === undefined
        ? task.completed
        : Number(completed);

    db.prepare(`
        UPDATE tasks
        SET title = ?, priority = ?, completed = ?
        WHERE id = ?
    `).run(updatedTitle, updatedPriority, updatedCompleted, id);

    const updatedTask = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(id);

    res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: updatedTask
    });
});
app.delete("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid task ID"
        });
    }

    const result = db.prepare(
        "DELETE FROM tasks WHERE id = ?"
    ).run(id);

    if (result.changes === 0) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "Task deleted successfully"
    });
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});