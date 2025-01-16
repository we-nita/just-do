// Select Elements
const todoInput = document.getElementById("todo-input");
const addTaskBtn = document.getElementById("add-task-btn");
const todoList = document.getElementById("todo-list");

// State to track if a task is being edited
let editMode = false;
let currentTaskElement = null;

// Load tasks from localStorage on page load
document.addEventListener("DOMContentLoaded", loadTasks);

// Add/Update Task
addTaskBtn.addEventListener("click", () => {
  const task = todoInput.value.trim();
  if (task) {
    if (editMode) {
      // Update the existing task
      updateTask(task);
    } else {
      // Add a new task
      addTask(task);
      saveTask(task);
    }
    resetInput();
  }
});

// Add Task to the DOM
function addTask(task, isCompleted = false) {
  const li = document.createElement("li");
  li.className = `todo-item ${isCompleted ? "completed" : ""}`;
  li.innerHTML = `
    <span>${task}</span>
    <div class="todo-buttons">
      <button class="complete-btn">${isCompleted ? "Undo" : "Complete"}</button>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;

  // Event Listeners for Task Actions
  li.querySelector(".complete-btn").addEventListener("click", () => toggleComplete(li));
  li.querySelector(".edit-btn").addEventListener("click", () => editTask(li));
  li.querySelector(".delete-btn").addEventListener("click", () => deleteTask(li));

  todoList.appendChild(li);
}

// Toggle Complete
function toggleComplete(taskElement) {
  taskElement.classList.toggle("completed");
  updateTasks();
}

// Edit Task
function editTask(taskElement) {
  editMode = true;
  currentTaskElement = taskElement;
  todoInput.value = taskElement.querySelector("span").textContent;
  addTaskBtn.textContent = "Update Task"; // Change button text to indicate edit mode
}

// Update Task
function updateTask(newTask) {
  currentTaskElement.querySelector("span").textContent = newTask;
  updateTasks();
  resetInput();
}

// Delete Task
function deleteTask(taskElement) {
  taskElement.remove();
  updateTasks();
}

// Save Task to localStorage
function saveTask(task) {
  const tasks = getTasks();
  tasks.push({ text: task, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load Tasks from localStorage
function loadTasks() {
  const tasks = getTasks();
  tasks.forEach(({ text, completed }) => addTask(text, completed));
}

// Update Tasks in localStorage
function updateTasks() {
  const tasks = [];
  document.querySelectorAll(".todo-item").forEach(taskElement => {
    tasks.push({
      text: taskElement.querySelector("span").textContent,
      completed: taskElement.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Get Tasks from localStorage
function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

// Reset Input Field and Edit State
function resetInput() {
  todoInput.value = "";
  addTaskBtn.textContent = "Add Task"; // Revert button text
  editMode = false;
  currentTaskElement = null;
}
