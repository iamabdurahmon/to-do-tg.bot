const firebaseConfig = {
  apiKey: "AIzaSyAQUZAJl1KIYE1hfXDHnoxGsQAhxi5STTU",
  authDomain: "to-do-list-bot-c91cb.firebaseapp.com",
  projectId: "to-do-list-bot-c91cb",
  storageBucket: "to-do-list-bot-c91cb.firebasestorage.app",
  messagingSenderId: "1009470959482",
  appId: "1:1009470959482:web:2fe36213184c097377b0c3",
  measurementId: "G-1VVX61WBJY",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const tg = window.Telegram.WebApp;
tg.expand();
const userId = tg.initDataUnsafe?.user?.id || "local_user";

const taskInput = document.querySelector(".task-add input");
const addBtn = document.querySelector(".add-btn");
const noTaskImg = document.querySelector(".no-task");
const taskCountSpan = document.querySelector(".task-count");

let todos = [];
let editId;
let isEditTask = false;

// 1. Ma'lumotlarni Firebase'dan olinganda "no-task"ni boshqarish
function loadTasks() {
  db.ref("todos/" + userId).on("value", (snapshot) => {
    const data = snapshot.val();
    todos = data || [];

    // Agar ma'lumot bo'sh bo'lsa, rasmni ko'rsatish
    if (todos.length === 0) {
      noTaskImg.style.display = "block";
      document.querySelectorAll(".task-card").forEach((card) => card.remove());
    } else {
      noTaskImg.style.display = "none";
      showTasks();
    }
    updateCount();
  });
}

// 2. Tasklarni ekranga chiqarish
function showTasks() {
  document.querySelectorAll(".task-card").forEach((card) => card.remove());

  todos.forEach((todo, id) => {
    let isChecked = todo.status === "completed" ? "checked" : "";
    let taskHtml = `
      <div class="task-card" id="task-${id}">
        <div class="card">
          <input type="checkbox" ${isChecked} onclick="updateStatus(this, ${id})">
          <h1 class="task-text" style="${todo.status === "completed" ? "text-decoration: line-through; opacity: 0.6;" : ""}">
              ${todo.name}
          </h1>
        </div>
        <div class="task-edit">
          <span title="Edit" class="edit-btn" onclick="editTask(${id}, '${todo.name.replace(/'/g, "\\'")}')">
              <i class="ri-pencil-ai-2-line"></i>            
          </span>
          <span title="Delete" class="delete-btn" onclick="deleteTask(${id})">
              <i class="ri-close-circle-line"></i>
          </span>
        </div>
      </div>`;
    noTaskImg.insertAdjacentHTML("beforebegin", taskHtml);
  });
}

// 3. Qo'shish funksiyasi
addBtn.addEventListener("click", () => {
  let userTask = taskInput.value.trim();
  if (userTask) {
    if (!isEditTask) {
      todos.push({ name: userTask, status: "pending" });
    } else {
      todos[editId].name = userTask;
      isEditTask = false;
      addBtn.innerHTML = '<i class="ri-add-large-line"></i>';
    }
    taskInput.value = "";
    saveToDB();
  }
});

// 4. O'chirish (Animatsiya tugagach no-task tekshiruvi bilan)
function deleteTask(id) {
  const element = document.getElementById(`task-${id}`);
  if (!element) return;

  element.style.animation = "slideOut 0.3s ease forwards";

  element.addEventListener(
    "animationend",
    () => {
      todos.splice(id, 1);
      if (isEditTask) resetInput();
      saveToDB();
      // saveToDB chaqirilganda loadTasks avtomat ishlaydi va no-taskni tekshiradi
    },
    { once: true },
  );
}

function updateStatus(checkbox, id) {
  todos[id].status = checkbox.checked ? "completed" : "pending";
  saveToDB();
}

function editTask(id, text) {
  editId = id;
  isEditTask = true;
  taskInput.value = text;
  taskInput.focus();
  addBtn.innerHTML = '<i class="ri-check-line"></i>';
}

function saveToDB() {
  db.ref("todos/" + userId).set(todos);
}

function updateCount() {
  let count = todos.filter((t) => t.status === "pending").length;
  if (taskCountSpan) taskCountSpan.textContent = count;
}

function resetInput() {
  isEditTask = false;
  taskInput.value = "";
  addBtn.innerHTML = '<i class="ri-add-large-line"></i>';
}

taskInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") addBtn.click();
});

// Birinchi marta kirganda yuklash
loadTasks();
