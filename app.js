// Firebase Konfiguratsiyasi
const firebaseConfig = {
  apiKey: "AIzaSyAQUZAJl1KIYE1hfXDHnoxGsQAhxi5STTU",
  authDomain: "to-do-list-bot-c91cb.firebaseapp.com",
  projectId: "to-do-list-bot-c91cb",
  storageBucket: "to-do-list-bot-c91cb.firebasestorage.app",
  messagingSenderId: "1009470959482",
  appId: "1:1009470959482:web:2fe36213184c097377b0c3",
  measurementId: "G-1VVX61WBJY",
};

// Firebase-ni ishga tushirish
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Telegram WebApp API
const tg = window.Telegram.WebApp;
tg.expand(); // Ilovani to'liq ekranga yoyish
const userId = tg.initDataUnsafe?.user?.id || "local_user"; // Foydalanuvchi ID-sini olish

// Elementlar
const taskInput = document.querySelector(".task-add input");
const addBtn = document.querySelector(".add-btn");
const noTaskImg = document.querySelector(".no-task");
const taskCountSpan = document.querySelector(".task-count");

let todos = [];
let editId;
let isEditTask = false;

// 1. Bazadan ma'lumotlarni Real-time (jonli) yuklab olish
function loadTasksFromFirebase() {
  db.ref("todos/" + userId).on("value", (snapshot) => {
    const data = snapshot.val();
    todos = data || [];
    showTasks();
  });
}

// 2. Tasklarni ekranga chiqarish
function showTasks() {
  document.querySelectorAll(".task-card").forEach((card) => card.remove());

  if (todos.length > 0) {
    noTaskImg.style.display = "none";
    todos.forEach((todo, id) => {
      let isCompleted = todo.status === "completed" ? "checked" : "";
      let textStyle = todo.status === "completed" ? 'style="text-decoration: line-through; opacity: 0.6;"' : "";

      let taskHtml = `
        <div class="task-card" data-id="${id}">
          <div class="card">
            <input type="checkbox" ${isCompleted} onclick="updateStatus(this, ${id})">
            <h1 class="task-text" ${textStyle}>${todo.name}</h1>
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
  } else {
    noTaskImg.style.display = "block";
  }
  updateCount();
}

// 3. Ma'lumotlarni Firebase-ga saqlash
function saveToFirebase() {
  db.ref("todos/" + userId).set(todos);
}

// 4. Qo'shish yoki Tahrirlash
addBtn.addEventListener("click", () => {
  let userTask = taskInput.value.trim();
  if (userTask) {
    if (!isEditTask) {
      todos.push({ name: userTask, status: "pending" });
    } else {
      isEditTask = false;
      todos[editId].name = userTask;
      addBtn.innerHTML = '<i class="ri-add-large-line"></i>';
    }
    taskInput.value = "";
    saveToFirebase();
  }
});

// 5. Tahrirlash rejimiga o'tish
function editTask(id, text) {
  editId = id;
  isEditTask = true;
  taskInput.value = text;
  taskInput.focus();
  addBtn.innerHTML = '<i class="ri-check-line"></i>';
}

// 6. O'chirish (Animatsiya bilan)
function deleteTask(deleteId) {
  const targetCard = document.querySelector(`.task-card[data-id="${deleteId}"]`);

  if (targetCard) {
    targetCard.classList.add("removing");
    targetCard.addEventListener(
      "animationend",
      () => {
        todos.splice(deleteId, 1);
        saveToFirebase();
        resetInput();
      },
      { once: true },
    );
  } else {
    todos.splice(deleteId, 1);
    saveToFirebase();
  }
}

// 7. Statusni yangilash
function updateStatus(selectedTask, id) {
  todos[id].status = selectedTask.checked ? "completed" : "pending";
  saveToFirebase();
}

function updateCount() {
  taskCountSpan.textContent = todos.filter((t) => t.status === "pending").length;
}

function resetInput() {
  isEditTask = false;
  taskInput.value = "";
  addBtn.innerHTML = '<i class="ri-add-large-line"></i>';
}

taskInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") addBtn.click();
});

// Ishga tushirish
loadTasksFromFirebase();
