
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const dataFile = path.join(__dirname, "tasks.json");

app.use(express.json());

function loadTasks() {
    const content = fs.readFileSync(dataFile, "utf8");
    return JSON.parse(content).tasks;
}

function saveTasks() {
    fs.writeFileSync(
        dataFile,
        JSON.stringify({ tasks }, null, 2)
    );
}

let tasks = loadTasks();
let nextId = tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;

app.get("/", (req, res) => {
    res.status(200).json({
        message: "DecodeLabs Project 2 - Task Manager API",
        status: "Running"
    });
});

app.get("/api/tasks", (req, res) => {
    res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
    });
});

app.get("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find(task => task.id === id);

    if (!Number.isInteger(id) || id <= 0 || !task) {
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

    const newTask = {
        id: nextId++,
        title: title.trim(),
        priority,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();

    res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: newTask
    });
});

app.put("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find(task => task.id === id);

    if (!Number.isInteger(id) || id <= 0 || !task) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    const { title, priority, completed } = req.body;

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

    if (title !== undefined) task.title = title.trim();
    if (priority !== undefined) task.priority = priority;
    if (completed !== undefined) task.completed = completed;

    saveTasks();

    res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: task
    });
});

app.delete("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = tasks.findIndex(task => task.id === id);

    if (!Number.isInteger(id) || id <= 0 || index === -1) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    const deletedTask = tasks.splice(index, 1)[0];
    saveTasks();

    res.status(200).json({
        success: true,
        message: "Task deleted successfully",
        data: deletedTask
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
