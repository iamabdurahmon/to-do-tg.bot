document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.querySelector(".task-add input");
  const addBtn = document.querySelector(".add-btn");
  const noTaskImg = document.querySelector(".no-task");
  const taskCountSpan = document.querySelector(".task-count");

  let todos = JSON.parse(localStorage.getItem("todo-list")) || [];
  let editId;
  let isEditTask = false;

  function showTasks() {
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
              <input type="checkbox" ${isCompleted} class="status-cb" data-id="${id}">
              <h1 class="task-text" style="${textStyle}">${todo.name}</h1>
            </div>
            <div class="task-edit">
              <span class="edit-btn" data-id="${id}"><i class="ri-pencil-ai-2-line"></i></span>
              <span class="delete-btn" data-id="${id}"><i class="ri-close-circle-line"></i></span>
            </div>
          </div>`;
        if (noTaskImg) noTaskImg.insertAdjacentHTML("beforebegin", taskHtml);
      });
    }
    attachEvents();
    updateCount();
  }

  function attachEvents() {
    document.querySelectorAll(".status-cb").forEach((cb) => {
      cb.onclick = (e) => {
        todos[e.target.dataset.id].status = e.target.checked
          ? "completed"
          : "pending";
        saveData();
      };
    });
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.onclick = () => {
        todos.splice(btn.dataset.id, 1);
        saveData();
      };
    });
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.onclick = () => {
        editId = btn.dataset.id;
        isEditTask = true;
        taskInput.value = todos[editId].name;
        taskInput.focus();
        addBtn.innerHTML = '<i class="ri-check-line"></i>';
      };
    });
  }

  function saveData() {
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTasks();
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

  function updateCount() {
    let pending = todos.filter((t) => t.status === "pending").length;
    if (taskCountSpan) taskCountSpan.textContent = pending;
  }

  taskInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") addBtn.click();
  });
  showTasks();
});
