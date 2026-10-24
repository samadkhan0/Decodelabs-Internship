
# FocusFlow — Productivity Dashboard

FocusFlow is a simple, responsive productivity dashboard built with HTML, CSS, and vanilla JavaScript. It helps users organize daily tasks, track completion, and monitor their productivity through a clean dashboard interface.

## Features

- **Task Management:** Add tasks with a title and priority.
- **Task Completion:** Mark tasks as completed or pending.
- **Task Deletion:** Remove individual tasks from the list.
- **Search:** Find tasks by title.
- **Filtering:** View all, pending, or completed tasks.
- **Live Statistics:** Track total tasks, pending tasks, completed tasks, and completion rate.
- **Progress Tracking:** View overall completion progress.
- **Local Storage:** Save tasks in the browser so they remain available after refreshing.
- **Navigation:** Navigate between the dashboard, task list, progress panel, and settings.
- **Responsive Interface:** A sidebar-based layout designed for a clear user experience.

## Technologies Used

- **HTML5** — page structure
- **CSS3** — styling and responsive layout
- **Vanilla JavaScript** — task management, navigation, filtering, and statistics
- **Browser Local Storage** — client-side task persistence

## Project Structure

```text
decode-productivity-dashboard/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Getting Started

### Requirements

A modern web browser and a code editor such as Visual Studio Code.

### Run Locally

1. Download or clone the project repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` in a browser, or use the Live Server extension.
4. Add tasks and explore the dashboard features.

No backend server, database, or package installation is required.

## How Data Is Stored

FocusFlow uses the browser's `localStorage` to save tasks locally. Task data can persist across page refreshes and browser restarts in the same browser profile.

Because this is a frontend-only application, tasks are not synchronized across devices or shared between different users.

## Testing

The following functionality has been tested during development:

- Adding tasks and updating dashboard statistics
- Marking tasks as completed
- Preserving task completion after refreshing
- Searching tasks by title
- Filtering tasks by status
- Navigating between dashboard panels

Deletion, settings actions, and responsive behavior should also be checked before final submission.

## Future Improvements

- Edit existing tasks
- Add task due dates and sorting
- Add dark mode
- Add optional backend storage and user accounts

## Project Information

- **Project:** FocusFlow — Productivity Dashboard
- **Project Type:** Frontend Web Development
- **Developer:** Abdul Samad Khan

Built as a practical project to develop and demonstrate frontend web development skills.
