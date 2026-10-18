"use strict";


const STORAGE_KEY = "focusflow-tasks-v2";
const LEGACY_STORAGE_KEY = "focusflow-tasks";

const elements = {
    taskForm: document.getElementById("taskForm"),
    taskTitle: document.getElementById("taskTitle"),
    taskPriority: document.getElementById("taskPriority"),
    taskList: document.getElementById("taskList"),
    emptyState: document.getElementById("emptyState"),
    emptyTitle: document.getElementById("emptyTitle"),
    emptyDescription: document.getElementById("emptyDescription"),
    formMessage: document.getElementById("formMessage"),

    searchInput: document.getElementById("searchInput"),
    taskFilter: document.getElementById("taskFilter"),
    visibleTaskCount: document.getElementById("visibleTaskCount"),

    totalTasks: document.getElementById("totalTasks"),
    pendingTasks: document.getElementById("pendingTasks"),
    completedTasks: document.getElementById("completedTasks"),
    completionRate: document.getElementById("completionRate"),

    progressCircle: document.getElementById("progressCircle"),
    circlePercentage: document.getElementById("circlePercentage"),
    summaryCompleted: document.getElementById("summaryCompleted"),
    summaryPending: document.getElementById("summaryPending"),
    progressMessage: document.getElementById("progressMessage"),

    currentDate: document.getElementById("currentDate"),
    currentYear: document.getElementById("currentYear"),

    addTaskTop: document.getElementById("addTaskTop"),
    addTaskButton: document.getElementById("addTaskButton"),

    settingsDialog: document.getElementById("settingsDialog"),
    clearCompletedButton: document.getElementById("clearCompletedButton"),
    clearAllButton: document.getElementById("clearAllButton"),
    settingsMessage: document.getElementById("settingsMessage"),

    menuToggle: document.getElementById("menuToggle"),
    sidebar: document.getElementById("sidebar")
};



let tasks = [];
let messageTimeout = null;

 

function createTaskId() {
    if (
        window.crypto &&
        typeof window.crypto.randomUUID === "function"
    ) {
        return window.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getElement(id) {
    return document.getElementById(id);
}

function showMessage(message, type = "success") {
    if (!elements.formMessage) return;

    elements.formMessage.textContent = message;
    elements.formMessage.className = `form-message ${type}`;
    elements.formMessage.setAttribute("role", "status");

    if (messageTimeout !== null) {
        clearTimeout(messageTimeout);
    }

    messageTimeout = setTimeout(() => {
        if (elements.formMessage) {
            elements.formMessage.textContent = "";
            elements.formMessage.className = "form-message";
        }
        messageTimeout = null;
    }, 3500);
}

function showSettingsMessage(message) {
    if (!elements.settingsMessage) return;

    elements.settingsMessage.textContent = message;
    elements.settingsMessage.setAttribute("role", "status");
}

function updateDate() {
    const now = new Date();

    if (elements.currentDate) {
        elements.currentDate.textContent =
            now.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            });
    }

    if (elements.currentYear) {
        elements.currentYear.textContent = now.getFullYear();
    }
}

function readStoredTasks(value) {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter((task) =>
            task &&
            typeof task === "object" &&
            typeof task.title === "string" &&
            task.title.trim() !== ""
        )
        .map((task, index) => ({
            id: task.id ?? `${Date.now()}-${index}`,
            title: task.title.trim().slice(0, 120),
            priority: ["low", "medium", "high"].includes(
                task.priority
            )
                ? task.priority
                : "medium",
            completed: task.completed === true,
            createdAt: Number.isFinite(task.createdAt)
                ? task.createdAt
                : Date.now()
        }));
}

function loadTasks() {
    try {
        const storedTasks = localStorage.getItem(STORAGE_KEY);

        if (storedTasks !== null) {
            tasks = readStoredTasks(JSON.parse(storedTasks));
            return;
        }

        // Migrate tasks saved by the earlier version.
        const legacyTasks = localStorage.getItem(LEGACY_STORAGE_KEY);

        if (legacyTasks !== null) {
            tasks = readStoredTasks(JSON.parse(legacyTasks));
            saveTasks();
            return;
        }

        tasks = [];
    } catch (error) {
        console.error("FocusFlow could not load saved tasks:", error);
        tasks = [];
    }
}

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        return true;
    } catch (error) {
        console.error("FocusFlow could not save tasks:", error);

        showMessage(
            "Tasks could not be saved in this browser.",
            "error"
        );

        return false;
    }
}


function handleAddTask(event) {
    event.preventDefault();

    if (!elements.taskTitle || !elements.taskPriority) {
        console.error("FocusFlow: task input elements were not found.");
        return;
        }

    const title = elements.taskTitle.value.trim();
    const priority = elements.taskPriority.value;

    if (!title) {
        showMessage("Please enter a task title.", "error");
        elements.taskTitle.focus();
        return;
    }

    const newTask = {
        id: createTaskId(),
        title: title.slice(0, 120),
        priority: ["low", "medium", "high"].includes(priority)
            ? priority
            : "medium",
        completed: false,
        createdAt: Date.now()
    };

    tasks.unshift(newTask);

    const saved = saveTasks();

    // Show the newly created task even if storage is unavailable.
    if (elements.taskFilter) {
        elements.taskFilter.value = "all";
    }

    if (elements.searchInput) {
        elements.searchInput.value = "";
    }

    renderDashboard();

    elements.taskForm.reset();

    if (elements.taskPriority) {
        elements.taskPriority.value = "medium";
    }

    elements.taskTitle.focus();

    if (saved) {
        showMessage("Task added successfully.");
    }
}



function getVisibleTasks() {
    const searchTerm = elements.searchInput
        ? elements.searchInput.value.trim().toLowerCase()
        : "";
       
    const filter = elements.taskFilter
        ? elements.taskFilter.value
        : "all";

    return tasks.filter((task) => {
        const matchesSearch = task.title
            .toLowerCase()
            .includes(searchTerm);

        const matchesFilter =
            filter === "all" ||
            (filter === "pending" && !task.completed) ||
            (filter === "completed" && task.completed);

        return matchesSearch && matchesFilter;
    });
}

function createTaskElement(task) {
    const item = document.createElement("li");
    item.className = "task-item";

    if (task.completed) {
        item.classList.add("completed");
    }

    item.dataset.taskId = String(task.id);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute(
        "aria-label",
        `Mark "${task.title}" as ${task.completed ? "pending" : "completed"}`
    );

    checkbox.addEventListener("change", () => {
        toggleTask(task.id);
    });

    const content = document.createElement("div");
    content.className = "task-content";

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    if (task.completed) {
        title.classList.add("completed-title");
    }

    const priority = document.createElement("span");
    priority.className = `task-priority priority-${task.priority}`;
    priority.textContent =
        task.priority.charAt(0).toUpperCase() +
        task.priority.slice(1);

    content.append(title, priority);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-task-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute(
        "aria-label",
        `Delete task: ${task.title}`
    );

    deleteButton.addEventListener("click", () => {
        deleteTask(task.id);
    });

    item.append(checkbox, content, deleteButton);

    return item;
}


function renderTaskList() {
    if (!elements.taskList) {
        console.error('FocusFlow: missing element with id "taskList".');
        return;
    }

    const visibleTasks = getVisibleTasks();
    elements.taskList.replaceChildren();

    visibleTasks.forEach((task) => {
        elements.taskList.appendChild(createTaskElement(task));
    });

    if (elements.visibleTaskCount) {
        elements.visibleTaskCount.textContent =
            `${visibleTasks.length} ${
                visibleTasks.length === 1 ? "task" : "tasks"
            }`;
    }

    if (elements.emptyState) {
        elements.emptyState.hidden = visibleTasks.length > 0;
    }

    if (visibleTasks.length === 0) {
        const searchTerm = elements.searchInput
            ? elements.searchInput.value.trim()
            : "";

        const filter = elements.taskFilter
            ? elements.taskFilter.value
            : "all";

        if (elements.emptyTitle) {
            if (searchTerm) {
                elements.emptyTitle.textContent = "No matching tasks";
            } else if (filter === "completed") {
                elements.emptyTitle.textContent = "No completed tasks yet";
            } else if (filter === "pending") {
                elements.emptyTitle.textContent = "No pending tasks";
            } else {
                elements.emptyTitle.textContent = "Your list is empty";
            }
        }

        if (elements.emptyDescription) {
            elements.emptyDescription.textContent = searchTerm
                ? "Try another search term."
                : "Add a task to get your day started.";
        }
    }
}


function renderStatistics() {
    const total = tasks.length;
    const completed = tasks.filter(
        (task) => task.completed
    ).length;
    const pending = total - completed;

    const percentage = total > 0
        ? Math.round((completed / total) * 100)
        : 0;

    if (elements.totalTasks) {
        elements.totalTasks.textContent = total;
    }

    if (elements.pendingTasks) {
        elements.pendingTasks.textContent = pending;
    }

    if (elements.completedTasks) {
        elements.completedTasks.textContent = completed;
    }

    if (elements.completionRate) {
        elements.completionRate.textContent = `${percentage}%`;
    }

    if (elements.circlePercentage) {
        elements.circlePercentage.textContent = `${percentage}%`;
    }

    if (elements.summaryCompleted) {
        elements.summaryCompleted.textContent = completed;
    }

    if (elements.summaryPending) {
        elements.summaryPending.textContent = pending;
    }

    if (elements.progressCircle) {
        elements.progressCircle.style.setProperty(
            "--progress",
            `${percentage}%`
        );

        elements.progressCircle.setAttribute(
            "aria-valuenow",
            String(percentage)
        );
    }

    if (elements.progressMessage) {
        if (total === 0) {
            elements.progressMessage.textContent =
                "Add your first task to start tracking progress.";
        } else if (percentage === 100) {
            elements.progressMessage.textContent =
                "Excellent work! All tasks are completed.";
        } else if (percentage >= 50) {
            elements.progressMessage.textContent =
                "Great progress. Keep going!";
        } else {
            elements.progressMessage.textContent =
                "One step at a time. You've got this!";
        }
    }
}

function renderDashboard() {
    renderStatistics();
    renderTaskList();
}


function toggleTask(taskId) {
    const task = tasks.find(
        (item) => String(item.id) === String(taskId)
    );

    if (!task) return;

    task.completed = !task.completed;

    saveTasks();
    renderDashboard();
}

function deleteTask(taskId) {
    const taskExists = tasks.some(
        (task) => String(task.id) === String(taskId)
    );

    if (!taskExists) return;

    tasks = tasks.filter(
        (task) => String(task.id) !== String(taskId)
    );

    saveTasks();
    renderDashboard();
    showMessage("Task deleted.");
}


function clearCompletedTasks() {
    const completedCount = tasks.filter(
        (task) => task.completed
    ).length;

    if (completedCount === 0) {
        showSettingsMessage("There are no completed tasks to clear.");
        return;
    }

    tasks = tasks.filter((task) => !task.completed);

    saveTasks();
    renderDashboard();

    showSettingsMessage("Completed tasks cleared.");
}

function clearAllTasks() {
    if (tasks.length === 0) {
        showSettingsMessage("Your task list is already empty.");
        return;
    }

    const confirmed = window.confirm(
        "Are you sure you want to delete all tasks? This cannot be undone."
    );

    if (!confirmed) return;

    tasks = [];

    saveTasks();
    renderDashboard();

    showSettingsMessage("All tasks have been cleared.");
}


function closeSidebar() {
    if (elements.sidebar) {
        elements.sidebar.classList.remove("active");
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll(
        ".sidebar-nav [data-section]"
    );

    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const section = link.dataset.section;

            // Settings is handled separately by its dialog.
            if (section === "settings") {
                event.preventDefault();

                const dialog = document.getElementById("settingsDialog");

                if (dialog && typeof dialog.showModal === "function") {
                    if (!dialog.open) {
                        dialog.showModal();
                    }
                } else if (dialog) {
                    dialog.setAttribute("open", "");
                }

                closeSidebar();
                return;
            }

            const target = document.getElementById(section);

            if (!target) {
                console.warn(
                    `FocusFlow: navigation target "${section}" was not found.`
                );
                return;
            }

            event.preventDefault();

            // Update the active navigation link.
            navLinks.forEach((item) => {
                item.classList.toggle("active", item === link);
            });

            // Scroll to the requested panel.
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            // Update the URL without reloading the page.
            history.replaceState(null, "", `#${section}`);

            closeSidebar();
        });
    });

    if (elements.menuToggle) {
        elements.menuToggle.addEventListener("click", () => {
            if (elements.sidebar) {
                const isOpen =
                    elements.sidebar.classList.toggle("is-open");

                elements.menuToggle.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );
            }
        });
    }
}



function setupSettings() {
    const settingsOpenButton = getElement("settingsButton");
    const settingsCloseButton = getElement("closeSettingsButton");

    if (settingsOpenButton && elements.settingsDialog) {
        settingsOpenButton.addEventListener("click", () => {
            if (typeof elements.settingsDialog.showModal === "function") {
                elements.settingsDialog.showModal();
            } else {
                elements.settingsDialog.setAttribute("open", "");
            }
        });
    }

    if (settingsCloseButton && elements.settingsDialog) {
        settingsCloseButton.addEventListener("click", () => {
            if (typeof elements.settingsDialog.close === "function") {
                elements.settingsDialog.close();
            } else {
                elements.settingsDialog.removeAttribute("open");
            }
        });
    }

    if (elements.clearCompletedButton) {
        elements.clearCompletedButton.addEventListener(
            "click",
            clearCompletedTasks
        );
    }

    if (elements.clearAllButton) {
        elements.clearAllButton.addEventListener(
            "click",
            clearAllTasks
        );
    }
}



function setupEventListeners() {
    if (elements.taskForm) {
        elements.taskForm.addEventListener(
            "submit",
            handleAddTask
                );
    } else {
        console.error(
            'FocusFlow: form with id "taskForm" was not found.'
        );
    }

    if (elements.searchInput) {
        elements.searchInput.addEventListener(
            "input",
            renderTaskList
        );
    }

    if (elements.taskFilter) {
        elements.taskFilter.addEventListener(
            "change",
            renderTaskList
        );
    }

    if (elements.addTaskTop) {
        elements.addTaskTop.addEventListener("click", () => {
            if (elements.taskTitle) {
                elements.taskTitle.focus();
            }
        });
    }

    setupNavigation();
    setupSettings();

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "/" &&
            !["INPUT", "TEXTAREA", "SELECT"].includes(
                document.activeElement?.tagName
            )
        ) {
            event.preventDefault();

            if (elements.searchInput) {
                elements.searchInput.focus();
            }
        }

        if (event.key === "Escape") {
            closeSidebar();
        }
    });
}

function initialiseDashboard() {
    console.log("FocusFlow: initializing dashboard...");

    loadTasks();
    updateDate();
    setupEventListeners();
    renderDashboard();

    console.log("FocusFlow: dashboard initialized successfully.");
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initialiseDashboard,
        { once: true }
    );
} else {
    initialiseDashboard();
}