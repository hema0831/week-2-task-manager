let state = {
  tasks: JSON.parse(localStorage.getItem("tasks")) || [],
  filter: "all"
};

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const totalEl = document.getElementById("totalTasks");
const activeEl = document.getElementById("activeTasks");
const completedEl = document.getElementById("completedTasks");

const filterButtons = document.querySelectorAll("[data-filter]");
const themeToggle = document.getElementById("themeToggle");

/* ---------- Helpers ---------- */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(state.tasks));
}

function getFilteredTasks() {
  if (state.filter === "active") {
    return state.tasks.filter(t => !t.completed);
  }
  if (state.filter === "completed") {
    return state.tasks.filter(t => t.completed);
  }
  return state.tasks;
}

/* ---------- Task Operations ---------- */
function addTask(text) {
  if (!text.trim()) return;

  state.tasks.push({
    id: Date.now(),
    text: text.trim(),
    completed: false
  });

  saveTasks();
  render();
}

function deleteTask(id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

function toggleTask(id) {
  state.tasks = state.tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  render();
}

function editTask(id) {
  const task = state.tasks.find(t => t.id === id);
  const updated = prompt("Edit task:", task.text);
  if (!updated || !updated.trim()) return;

  task.text = updated.trim();
  saveTasks();
  render();
}

/* ---------- Render ---------- */
function render() {
  taskList.innerHTML = "";

  getFilteredTasks().forEach(task => {
    const li = document.createElement("li");
    li.dataset.id = task.id;
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""}>
      <span>${task.text}</span>
      <button>Delete</button>
    `;

    taskList.appendChild(li);
  });

  updateStats();
}

function updateStats() {
  const total = state.tasks.length;
  const completed = state.tasks.filter(t => t.completed).length;

  totalEl.textContent = total;
  completedEl.textContent = completed;
  activeEl.textContent = total - completed;
}

/* ---------- Events ---------- */
taskForm.addEventListener("submit", e => {
  e.preventDefault();
  addTask(taskInput.value);
  taskInput.value = "";
});

taskList.addEventListener("click", e => {
  const li = e.target.closest("li");
  if (!li) return;

  const id = Number(li.dataset.id);

  if (e.target.tagName === "BUTTON") deleteTask(id);
  if (e.target.tagName === "INPUT") toggleTask(id);
});

taskList.addEventListener("dblclick", e => {
  if (e.target.tagName === "SPAN") {
    const id = Number(e.target.closest("li").dataset.id);
    editTask(id);
  }
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.filter = btn.dataset.filter;
    render();
  });
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
});

/* ---------- Init ---------- */
render();
