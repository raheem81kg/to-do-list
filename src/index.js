import "./styles/style.css";
import deleteChildren from "./functions/deleteChildren";
import { format } from "date-fns";

const projectsList = document.querySelector("[data-projects-list]");
const projectInput = document.querySelector("[data-project-name-input]");
const tasksDisplayContainer = document.querySelector("[data-tasks-display-container]");
const tasksContainer = document.querySelector("[data-tasks-container]");
const addTaskButton = document.querySelector("[data-add-task-button]");
const projectForm = document.querySelector("[data-project-form]");
const tasksTitle = document.querySelector("[data-taks-title]");
const tasksubmitform = document.querySelector("[data-task-submit-form]");
const deleteTasksListBtn = document.querySelector("[data-delete-task-list]");
const clearCompletedButton = document.querySelector("[data-clear-completed]");
const tasksCountDisplay = document.querySelector("[data-tasks-count]");
const headerContainer = document.querySelector("[data-tasks-header-container]");
const dueDateInForm = document.querySelector("[data-task-due-date]");
const modalTrigger = document.querySelector("[data-modal-trigger]");
const closeAddTaskForm = document.querySelector("[data-close-modal-button]");

let localStor = localStorage.getItem("Todo-Projects");
let projectObject = JSON.parse(localStor) || [];
let selectedProjectId = localStorage.getItem("Selected-Todo-Id") || null;

projectForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addProject();
});

function render() {
    refreshProjects();
    refreshTasks();

    // give due date in form a min
    dueDateInForm.min = format(new Date(), "yyyy-MM-dd");
}

// refreshing projects
function refreshProjects() {
    deleteChildren(projectsList);

    if (selectedProjectId) {
        projectObject.forEach((project) => {
            if (project?._id == selectedProjectId) {
                const newLi = document.createElement("li");
                newLi.className = "project-item active";
                newLi.id = project?._id;
                newLi.textContent = project?._title;
                projectsList.appendChild(newLi);
            } else {
                const newLi = document.createElement("li");
                newLi.className = "project-item";
                newLi.id = project?._id;
                newLi.textContent = project?._title;
                projectsList.appendChild(newLi);
            }
        });
        tasksDisplayContainer.style.display = "";
    } else {
        projectObject.forEach((project) => {
            if (project?._id == selectedProjectId) {
                const newLi = document.createElement("li");
                newLi.className = "project-item active";
                newLi.id = project?._id;
                newLi.textContent = project?._title;
                projectsList.appendChild(newLi);
            } else {
                const newLi = document.createElement("li");
                newLi.className = "project-item";
                newLi.id = project?._id;
                newLi.textContent = project?._title;
                projectsList.appendChild(newLi);
            }
        });
        tasksDisplayContainer.style.display = "none";
    }
}

// add projects
function addProject() {
    let projectName = projectInput.value;

    projectInput.value = "";

    const newLi = document.createElement("li");
    newLi.textContent = projectName;
    newLi.className = "project-item";
    projectsList.appendChild(newLi);

    const generatedId = Date.now();

    projectObject.push({ _title: projectName, _id: generatedId, _tasks: [] });
    localStorage.setItem("Todo-Projects", JSON.stringify(projectObject));

    localStorage.setItem("Selected-Todo-Id", generatedId);
    selectedProjectId = generatedId;

    refresh();
}

function refresh() {
    refreshProjects();
    refreshTasks();
}

function save() {
    localStorage.setItem("Selected-Todo-Id", selectedProjectId);
    localStorage.setItem("Todo-Projects", JSON.stringify(projectObject));
}

// change selected project
projectsList.addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() === "li") {
        selectedProjectId = e.target.id.toString();
        localStorage.setItem("Selected-Todo-Id", e.target.id.toString());
        refresh();
    }
});

// check/uncheck tasks
tasksContainer.addEventListener("change", (e) => {
    if (e.target.tagName.toLowerCase() === "input") {
        let selectedProject = projectObject.find((project) => {
            return project?._id == selectedProjectId;
        });

        let clickedInput = selectedProject._tasks.find((task) => {
            return task.id == e.target.id;
        });

        clickedInput.complete = !clickedInput.complete;
        renderTasksCount();
        save();
    }
});

// clear completed tasks
clearCompletedButton.addEventListener("click", () => {
    let selectedProject = projectObject.find((project) => {
        return project?._id == selectedProjectId;
    });

    selectedProject._tasks = selectedProject._tasks.filter((task) => !task.complete);
    save();
    refresh();
});

// render tasks count
function renderTasksCount() {
    let selectedProject = projectObject.find((project) => {
        return project?._id == selectedProjectId;
    });

    let incompleteTasksCount = selectedProject?._tasks?.filter((task) => {
        return !task.complete;
    }).length;

    tasksCountDisplay.textContent = ` ${incompleteTasksCount} task${incompleteTasksCount > 1 ? "s" : ""} remaining`;
}

// refreshing tasks
function refreshTasks() {
    while (tasksContainer.children[0] !== addTaskButton) {
        tasksContainer.children[0].remove();
    }

    let selectedProject = projectObject.find((project) => {
        return project?._id == selectedProjectId;
    });

    tasksTitle.textContent = selectedProject?._title;

    if (selectedProject?._tasks[0]) {
        selectedProject?._tasks.forEach((task) => {
            // get task priority color
            let priorityColor = "black";
            if (task.priority == "low-priority") {
                priorityColor = "black";
            } else if (task.priority == "medium-priority") {
                priorityColor = "yellow";
            } else if (task.priority == "high-priority") {
                priorityColor = "red";
            }
            const singletaskContainer = document.createElement("div");
            singletaskContainer.className = "task";

            singletaskContainer.innerHTML = `<div class="task-main-body">
                            <input type="checkbox" name="task" id="${task.id}" ${task.complete ? "checked" : ""}>
                            <label contenteditable="true">
                            ${task.title}
                            </label>

                            <svg class="start-svg" data-info-button style="width:20.5px;height:20.5px" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
                            </svg>

                            <svg class="not-start-svg" data-flag-button style="width:21px;height:21px" viewBox="0 0 24 24">
                                <path fill="${priorityColor}" d="M6,3A1,1 0 0,1 7,4V4.88C8.06,4.44 9.5,4 11,4C14,4 14,6 16,6C19,6 20,4 20,4V12C20,12 19,14 16,14C13,14 13,12 11,12C8,12 7,14 7,14V21H5V4A1,1 0 0,1 6,3Z" />
                            </svg>

                            <svg class="not-start-svg"  data-delete-button style="width:21px;height:21px" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
                            </svg>

                        </div>
                        <div class="task-details">
                            <div class="task-title">
                                <span class="semi-bold" >Title: ${task.title}</span>
                            </div>
                            <div class="task-description">
                                <span class="semi-bold" >Description: ${task.description}</span>
                            </div>
                            <div class="task-due-date">
                                <span class="semi-bold">Due date: ${task.dueDate}</span>
                            </div>
                            <div class="task-priority">
                                <span class="semi-bold">Priority: ${task.priority}</span>
                            </div>
                        </div>`;

            tasksContainer.insertBefore(singletaskContainer, addTaskButton);
        });
    } else {
        const noTextMessage = document.createElement("div");
        noTextMessage.innerHTML = "No tasks available";
        tasksContainer.insertBefore(noTextMessage, addTaskButton);
    }

    renderTasksCount();
}

// add tasks
function addTask() {
    let selectedProject = projectObject.find((project) => {
        return project?._id == selectedProjectId;
    });

    const taskTitle = document.querySelector("#new-task-title").value;
    const taskDescription = document.querySelector("#new-task-description").value;
    const taskDuedate = document.querySelector("#new-task-duedate").value;
    const taskPriority = document.querySelector("#new-task-priority").value;
    console.log(taskPriority);
    const taskProjectId = document.querySelector("#new-task-project").value;

    selectedProject._tasks.push({
        id: Date.now(),
        title: taskTitle,
        description: taskDescription,
        dueDate: taskDuedate,
        priority: taskPriority,
        complete: false,
    });

    localStorage.setItem("Todo-Projects", JSON.stringify(projectObject));

    refreshTasks();
}

// edit tasks
tasksContainer.addEventListener("input", (e) => {
    if (e.target.tagName.toLowerCase() === "label") {
        let selectedProject = projectObject.find((project) => {
            return project?._id == selectedProjectId;
        });

        // this is giving me the clicked input's sibling which is the input that has the id connecting it to the local storage
        let clickedTask = selectedProject._tasks.find((task) => {
            return task.id == e.target.previousSibling.previousSibling.id;
        });

        clickedTask.title = e.target.textContent;
        save();
    }
});

// edit project title
headerContainer.addEventListener("input", (e) => {
    if (e.target.tagName.toLowerCase() === "h1") {
        let selectedProject = projectObject.find((project) => {
            return project?._id == selectedProjectId;
        });

        selectedProject._title = e.target.textContent;
        refreshProjects();
        save();
    }
});

// OPEN TASK DESCRIPTION
tasksContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("task-main-body")) {
        e.target.parentNode.children[1].classList.toggle("open");
    } else if (e.target.hasAttribute("data-info-button")) {
        e.target.parentNode.nextElementSibling.classList.toggle("open");
    }
});

// Render flags
tasksContainer.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-flag-button")) {
        let selectedProject = projectObject.find((project) => {
            return project?._id == selectedProjectId;
        });

        let clickedTask = selectedProject._tasks.find((task) => task.id == e.target.parentNode.children[0].id);

        if (clickedTask.priority == "low-priority") {
            clickedTask.priority = "medium-priority";
        } else if (clickedTask.priority == "medium-priority") {
            clickedTask.priority = "high-priority";
        } else if (clickedTask.priority == "high-priority") {
            clickedTask.priority = "low-priority";
        }

        save();
        refresh();
    }
});

// DELETE TASK
tasksContainer.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-delete-button")) {
        e.target.parentNode.nextElementSibling.classList.toggle("open");

        let selectedProject = projectObject.find((project) => {
            return project?._id == selectedProjectId;
        });

        selectedProject._tasks = selectedProject._tasks.filter((task) => task.id != e.target.parentNode.children[0].id);
        save();
        refreshTasks();
    }
});

// DELETE LIST
deleteTasksListBtn.addEventListener("click", () => {
    projectObject = projectObject.filter((item) => item._id != selectedProjectId);
    selectedProjectId = "";
    save();
    refresh();
});

// MODAL FORM CONTROLS

tasksubmitform.addEventListener("submit", (e) => {
    e.preventDefault();
    modalTrigger.classList.toggle("active");
    addTask();
    tasksubmitform.reset();
});

addTaskButton.addEventListener("click", () => {
    modalTrigger.classList.toggle("active");
    tasksubmitform.reset();
});

modalTrigger.addEventListener("click", () => {
    modalTrigger.classList.toggle("active");
    tasksubmitform.reset();
});

closeAddTaskForm.addEventListener("click", () => {
    modalTrigger.classList.toggle("active");
    tasksubmitform.reset();
});

render();
