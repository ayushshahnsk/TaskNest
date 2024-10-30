// app.js

// Define user credentials
const users = {
    user1: { id: 'Ayush', password: 'Ayush.shah' },
    user2: { id: 'Dhiraj', password: 'Dhiraj.ahire' },
    user3: { id: 'Test', password: 'Test.123' }
};

// Define the current workspace and initialize data structure
let currentWorkspace = 'HSS';
let workspacesData = JSON.parse(localStorage.getItem('workspacesData')) || {};

// Initialize data for each workspace if it doesn't exist
const initializeWorkspaceData = (workspace) => {
    if (!workspacesData[workspace]) {
        workspacesData[workspace] = { todo: [], remaining: [], completed: [] };
    }
};

// Show login modal on page load
window.onload = function () {
    document.getElementById('login-modal').style.display = 'flex';
};

// Hide login modal and show main app
function login() {
    const userId = document.getElementById('user-id').value.trim();
    const password = document.getElementById('password').value.trim();

    // Check if the user exists
    const user = Object.values(users).find(user => user.id === userId && user.password === password);

    if (user) {
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('app').style.display = 'flex';
        initializeWorkspaceData(currentWorkspace);
        updateDisplay();
    } else {
        document.getElementById('error-message').innerText = 'Nice try, hacker! 🦹‍♂️ But you’ll need to do better!';
    }
}

// Switch workspaces and load their data
function switchWorkspace(workspace) {
    currentWorkspace = workspace;
    initializeWorkspaceData(workspace);
    updateDisplay();
}

// Update task lists based on current workspace data
function updateDisplay() {
    document.getElementById('workspace-title').innerText = currentWorkspace;
    loadTasks('todo', 'todo-list');
    loadTasks('remaining', 'remaining-list');
    loadTasks('completed', 'completed-list');
}

// Load tasks into a specific list
function loadTasks(taskType, listId) {
    const taskList = document.getElementById(listId);
    taskList.innerHTML = '';
    workspacesData[currentWorkspace][taskType].forEach((task, index) => {
        const listItem = document.createElement('li');

        // Generate the icons based on the taskType
        let controlsHTML = '';
        if (taskType === 'todo') {
            controlsHTML = `
                <button title="Move to remaining" onclick="moveTask('${taskType}', 'remaining', ${index})">➡️</button>
                <button title="Mark as completed" onclick="moveTask('${taskType}', 'completed', ${index})">✔️</button>
            `;
        } else if (taskType === 'remaining') {
            controlsHTML = `
                <button title="Mark as completed" onclick="moveTask('${taskType}', 'completed', ${index})">✔️</button>
            `;
        } else if (taskType === 'completed') {
            controlsHTML = `
                <button title="Move back to remaining" onclick="moveTask('${taskType}', 'remaining', ${index})">⬅️</button>
            `;
        }

        // Add edit and delete icons to all tasks
        controlsHTML += `
            <button title="Edit task" onclick="editTask('${taskType}', ${index})">✏️</button>
            <button title="Delete task" onclick="deleteTask('${taskType}', ${index})">🗑️</button>
        `;

        // Set the inner HTML of the list item
        listItem.innerHTML = `
            <span>${task}</span>
            <div class="task-controls">${controlsHTML}</div>
        `;

        // Append the task item to the list
        taskList.appendChild(listItem);
    });
}

// Add a new task to "To Do" or "Remaining"
function addTask(taskType) {
    const inputField = document.getElementById(`${taskType}-input`);
    const taskText = inputField.value.trim();

    if (taskText) {
        // Instead of adding to "To Do", add directly to "Remaining" if taskType is "todo"
        const targetSection = taskType === 'todo' ? 'remaining' : taskType;
        workspacesData[currentWorkspace][targetSection].push(taskText);
        inputField.value = '';  // Clear the input field after adding
        saveData();
        updateDisplay();
    } else {
        alert("Please enter a task before adding!");
    }
}

// Move task from one list to another
function moveTask(from, to, index) {
    const task = workspacesData[currentWorkspace][from][index];
    workspacesData[currentWorkspace][from].splice(index, 1);
    workspacesData[currentWorkspace][to].push(task);
    saveData();
    updateDisplay();
}

// Edit a specific task
function editTask(taskType, index) {
    const newTaskText = prompt('Edit your task:', workspacesData[currentWorkspace][taskType][index]);
    if (newTaskText) {
        workspacesData[currentWorkspace][taskType][index] = newTaskText.trim();
        saveData();
        updateDisplay();
    }
}

// Delete a specific task
function deleteTask(taskType, index) {
    workspacesData[currentWorkspace][taskType].splice(index, 1);
    saveData();
    updateDisplay();
}

// Clear tasks for the current workspace
function clearCurrentWorkspace() {
    const confirmClear = confirm(`Are you sure you want to clear all tasks in ${currentWorkspace}?`);
    if (confirmClear) {
        workspacesData[currentWorkspace] = { todo: [], remaining: [], completed: [] };
        saveData();
        updateDisplay();
    }
}

// Clear tasks for all workspaces
function clearAllWorkspaces() {
    const confirmClear = confirm("Are you sure you want to clear all tasks in all workspaces?");
    if (confirmClear) {
        workspacesData = {};
        initializeWorkspaceData(currentWorkspace);
        saveData();
        updateDisplay();
    }
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.getElementById('toggle-password');

    // Check the type of the password input and toggle it
    if (passwordInput.type === "password") {
        passwordInput.type = "text"; // Change to text to show password
        toggleButton.innerHTML = '🙈'; // Change icon to indicate it's visible
    } else {
        passwordInput.type = "password"; // Change back to password
        toggleButton.innerHTML = '👁️'; // Change icon back to eye
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('workspacesData', JSON.stringify(workspacesData));
}