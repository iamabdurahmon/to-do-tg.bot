// Barcha kodni DOM yuklangandan keyin ishlashini ta'minlaymiz
document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.querySelector(".task-add input");
  const addBtn = document.querySelector(".add-btn");
  const noTaskImg = document.querySelector(".no-task");
  const taskCountSpan = document.querySelector(".task-count");

  // Xotiradan ma'lumot olishda xatolikni oldini olish
  let todos = JSON.parse(localStorage.getItem("todo-list")) || [];
  let editId;
  let isEditTask = false;

  function showTasks() {
    // Avvalgi kartalarni o'chirish
    document.querySelectorAll(".task-card").forEach((card) => card.remove());

    if (todos.length === 0) {
      if (noTaskImg) noTaskImg.style.display = "block";
    } else {
      if (noTaskImg) noTaskImg.style.display = "none";

      todos.forEach((todo, id) => {
        let isCompleted = todo.status === "completed" ? "checked" : "";
        let textStyle =
          todo.status === "completed"
            ? "text-decoration: line-through; opacity: 0.6;"
            : "";

        let taskHtml = `
                    <div class="task-card" id="task-${id}">
                        <div class="card">
                            <input type="checkbox" ${isCompleted} data-id="${id}" class="status-checkbox">
                            <h1 class="task-text" style="${textStyle}">${todo.name}</h1>
                        </div>
                        <div class="task-edit">
                            <span class="edit-icon" data-id="${id}"><i class="ri-pencil-ai-2-line"></i></span>
                            <span class="delete-icon" data-id="${id}"><i class="ri-close-circle-line"></i></span>
                        </div>
                    </div>`;

        // Elementni xavfsiz joylashtirish
        if (noTaskImg) {
          noTaskImg.insertAdjacentHTML("beforebegin", taskHtml);
        }
      });
    }

    // Hodisalarni qayta bog'lash (onclick o'rniga zamonaviy usul)
    attachEventListeners();
    updateCount();
  }

  function attachEventListeners() {
    // Checkboxlar uchun
    document.querySelectorAll(".status-checkbox").forEach((cb) => {
      cb.onclick = (e) => updateStatus(e.target, e.target.dataset.id);
    });

    // Tahrirlash uchun
    document.querySelectorAll(".edit-icon").forEach((icon) => {
      icon.onclick = () => editTask(icon.dataset.id);
    });

    // O'chirish uchun
    document.querySelectorAll(".delete-icon").forEach((icon) => {
      icon.onclick = () => deleteTask(icon.dataset.id);
    });
  }

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
      saveData();
    }
  });

  function saveData() {
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTasks();
  }

  function updateStatus(checkbox, id) {
    todos[id].status = checkbox.checked ? "completed" : "pending";
    saveData();
  }

  function deleteTask(id) {
    todos.splice(id, 1);
    saveData();
  }

  function editTask(id) {
    editId = id;
    isEditTask = true;
    taskInput.value = todos[id].name;
    taskInput.focus();
    addBtn.innerHTML = '<i class="ri-check-line"></i>';
  }

  function updateCount() {
    let pendingTasks = todos.filter((t) => t.status === "pending").length;
    if (taskCountSpan) taskCountSpan.textContent = pendingTasks;
  }

  taskInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") addBtn.click();
  });

  // Birinchi marta ishga tushirish
  showTasks();
});
