document.addEventListener("DOMContentLoaded", () => {
  const dropdownBtns = document.querySelectorAll(".dropdown-btn");

  dropdownBtns.forEach((x) => {
    x.addEventListener("click", (event) => {
      event.stopPropagation();
      const dropdownContent =
        x.parentElement.getElementsByClassName("dropdown-content")[0];
      dropdownContent.classList.toggle("show");
    });
  });

  // Close the dropdown if the user clicks anywhere else on the page
  window.addEventListener("click", () => {
    const dropdowns = document.querySelectorAll(".dropdown-content");
    dropdowns.forEach((x) => x.classList.remove("show"));
  });

  renderSummary();
  renderTaskList();
  setupSidebarButtons();
  setupModalEvents();
  setupFormSubmission();
});

let taskList = [
  {
    id: 1,
    title: "To do home-work",
    deadline: "09/01/2026",
    description: "This is a new task",
    status: 0,
  },
  {
    id: 2,
    title: "Finish project proposal",
    deadline: "09/15/2026",
    description:
      "Draft the proposal document, gather feedback from the team, and revise before sending it to the client.",
    status: 0,
  },
  {
    id: 3,
    title: "Book flights for conference",
    deadline: "10/02/2026",
    description:
      "Compare flight options and book the cheapest round trip that fits the conference schedule.",
    status: 0,
  },
  {
    id: 5,
    title: "Submit expense report",
    deadline: "08/28/2026",
    description:
      "Collect receipts from last month's trip and submit them through the expense portal.",
    status: 1,
  },
  {
    id: 6,
    title: "Renew gym membership",
    deadline: "08/20/2026",
    description: "Renew the annual membership before it lapses.",
    status: 1,
  },
  {
    id: 7,
    title: "Old grocery list",
    deadline: "07/01/2026",
    description: "This task is no longer needed and was removed.",
    status: 2,
  },
];

function getStatusInfo(status) {
  switch (status) {
    case 0:
      return {
        statusClass: "status-inprogress",
        badgeClass: "badge-inprogress",
        badgeText: "In Progress",
      };
    case 1:
      return {
        statusClass: "status-completed",
        badgeClass: "badge-completed",
        badgeText: "Completed",
      };
    case 2:
      return {
        statusClass: "status-deleted",
        badgeClass: "badge-deleted",
        badgeText: "Deleted",
      };
    default:
      return {
        statusClass: "",
        badgeClass: "",
        badgeText: "",
      };
  }
}

function renderSummary() {
  const counts = { 0: 0, 1: 0, 2: 0 };
  taskList.forEach((task) => {
    counts[task.status]++;
  });

  document.getElementById("inprogress-count").textContent = counts[0];
  document.getElementById("completed-count").textContent = counts[1];
  document.getElementById("deleted-count").textContent = counts[2];
}

const markAsCompleteEventHandler = (e) => {
  e.stopPropagation();
  let taskId = e.target.dataset.id;
  const idx = taskList.findIndex((x) => x.id === parseInt(taskId));
  taskList[idx].status = 1;

  renderSummary();
  renderTaskList();
};

const deleteEventHandler = (e) => {
  e.stopPropagation();
  let taskId = e.target.dataset.id;
  const idx = taskList.findIndex((x) => x.id === parseInt(taskId));
  taskList[idx].status = 2;

  renderSummary();
  renderTaskList();
};

function buildTaskButtonsHTML(id, status) {
  if (status === 0) {
    return `
      <button class="btn btn-primary mark-as-cmp-btn" data-id="${id}" onclick="markAsCompleteEventHandler(event);">Mark As Complete</button>
      <button class="btn btn-secondary delete-task-btn" data-id="${id}" onclick="deleteEventHandler(event);">Delete</button>
    `;
  }
  if (status === 1) {
    return `<button class="btn btn-secondary" data-id="${id}" onclick="deleteEventHandler(event);">Delete</button>`;
  }

  return "";
}

function buildTaskCardHTML(task) {
  const { statusClass, badgeClass, badgeText } = getStatusInfo(task.status);
  const footerHtml = buildTaskButtonsHTML(task.id, task.status);
  return `
      <article class="task-card ${statusClass}">
      <header>
        <h3 class="task-title">${task.title}</h3>
      </header>
      <span class="text-muted text-sm">${task.deadline}</span>
      <div>
        <span class="status-badge ${badgeClass}">${badgeText}</span>
      </div>
      <p>${task.description}</p>
      <footer class="text-right">
        ${footerHtml}
      </footer>
    </article>
  `;
}

function renderTaskList(filterValue = -1) {
  const taskListEl = document.querySelector(".task-list");
  taskListEl.innerHTML = "";

  taskList
    .filter((task) => {
      return filterValue === -1 || task.status === parseInt(filterValue);
    })
    .forEach((task) => {
      const li = document.createElement("li");
      li.innerHTML = buildTaskCardHTML(task);
      taskListEl.appendChild(li);
    });
}

function setupSidebarButtons() {
  let buttons = document.querySelectorAll(".sidebar-menu button");
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const filter = parseInt(btn.dataset.filter);
      renderTaskList(filter);

      // Remove the selected and set it to the new li element
      const selected = document.querySelector(".sidebar-menu .selected");
      selected.classList.remove("selected");

      // Add selected to the new li element
      btn.parentElement.classList.add("selected");
    });
  });
}

function setupModalEvents() {
  const overlayEl = document.getElementById("add-task-overlay");
  const modalEl = document.getElementById("add-task-modal");
  const addTaskBtn = document.getElementById("add-task-btn");

  addTaskBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleModal();
  });

  const closeModalBtn = document.getElementById("close-modal-btn");
  const cancelBtn = document.getElementById("cancel-add-task-btn");

  closeModalBtn.addEventListener("click", toggleModal);
  cancelBtn.addEventListener("click", toggleModal);
}

const toggleModal = (e) => {
  const overlayEl = document.getElementById("add-task-overlay");
  const modalEl = document.getElementById("add-task-modal");
  modalEl.classList.toggle("hidden");
  overlayEl.classList.toggle("hidden");
};

function setupFormSubmission() {
  const addTaskForm = document.getElementById("add-task-form");
  addTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = Object.fromEntries(formData.entries());
    taskList = [
      { id: 1 + Math.max(...taskList.map((x) => x.id)), status: 0, ...data },
      ...taskList,
    ];

    addTaskForm.reset();
    renderTaskList();
    renderSummary();
    toggleModal();
  });
}
