//Object arrays that hold tasks, and completed tasks
const tasks = [];
let sCount = 0;
//const completedTasks = [];

//Filters for the task display
const filters = {
    completed: false,
    hightolow: false,
    lowtohigh: false,
    overdue: false,
};

const taskDisplay = document.getElementById("taskDisplay");
const subTaskList = document.getElementById("subTaskList");
const addButton = document.getElementById("taskAdd");
const subTaskAdd = document.getElementById("subTaskAdd");
const filterCompleted = document.getElementById("filterCompleted");

//Loading local storage
const taskData = localStorage.getItem('tasks');
if (taskData) {
    const package = JSON.parse(taskData);
    tasks.push(...package);
    console.log("tasks loaded");
}
/*if (archivedData) {
    const package = JSON.parse(archivedData);
    completedTasks.push(...package);
    console.log("completed loaded");
}*/

//initial render
renderTasks();

addButton.addEventListener("click", (e) => {
    e.preventDefault();
    createTask();
});

filterCompleted.addEventListener("change", function () {
    filters.completed = this.checked;
    renderTasks();
});

subTaskAdd.addEventListener("click", (e) =>{
    e.preventDefault();
    addSubTaskInput();
});


//Creates task object and assigns values to its attributes based on input values
function createTask(){
    const count = tasks.length + 1;
    const taskName = document.getElementById("taskName").value.trim();
    const taskDesc = document.getElementById("taskDesc").value.trim();
    const taskDate = document.getElementById("taskDate").value.trim();
    const taskTime = document.getElementById("taskTime").value.trim();
    const taskPriority = document.getElementById("taskPriority").value.trim();
    const subTasks = [];

    for(let i = 1; i <= sCount; i++) {
        const sTaskTitle = document.getElementById(`subTask${i}_TitleInput`).value.trim();
        const sTaskDesc = document.getElementById(`subTask${i}_DescInput`).value.trim();

        const subTask = {id: i, title: sTaskTitle, desc: sTaskDesc};

        subTasks.push(subTask);
    }

    let task = {
        id: count,
        title: taskName,
        desc: taskDesc,
        date: taskDate,
        time: taskTime,
        priority: taskPriority,
        subTasks: subTasks,
        completed: false
    };

    tasks.push(task);

    //Store tasks locally
    const taskData = JSON.stringify(tasks, null, 2);
    localStorage.setItem('tasks', taskData);

    renderTasks();

    subTaskList.innerHTML = "";


}

function deleteTask (btn) {
    const btnID = btn.id;
    const taskID = btnID.match(/\d+/)[0];;

    const taskIndex = searchTask(tasks, taskID);
    if (taskIndex === -1) return;

    tasks.splice(taskIndex, 1);

    console.log("task deleted");

    const taskData = JSON.stringify(tasks, null, 2);
    localStorage.setItem('tasks', taskData);

    renderTasks();
}

function renderTasks(){
    taskDisplay.innerHTML = "";

    const filteredTasks = checkFilters(tasks);

    console.log("Tasks have been filtered.");

    filteredTasks.forEach((task) => {
        //Creating task card
        const taskCard = document.createElement("div");
        taskCard.className = "task";
        taskCard.id = `task${task.id}`;

        //Add settings bar
        const taskSettings = document.createElement("div");
        taskSettings.className = "taskSettings";
        taskSettings.id = `task${task.id}_settings`;

        //Add delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "deleteBtn";
        deleteBtn.id = `task${task.id}_deleteBtn`;
        deleteBtn.innerHTML = 'X';

        //Append delete button
        taskSettings.appendChild(deleteBtn);

        //Adding the card header
        const taskHeader = document.createElement("div");
        taskHeader.className = "taskHeader";
        taskHeader.id = `task${task.id}_Header`;

        //The title of the task
        const taskTitle = document.createElement("h1");
        taskTitle.className = "taskTitle";
        taskTitle.id = `task${task.id}_Title`;
        taskTitle.innerHTML = `${task.title}`;
        
        //The checkbox
        const checkBox = document.createElement("input");
        checkBox.className = "taskComplete";
        checkBox.id = `task${task.id}_Complete`;
        checkBox.type = "checkbox";
        checkBox.checked = task.completed;

        //Append Title and Checkbox to card header
        taskHeader.appendChild(taskTitle);
        taskHeader.appendChild(checkBox);

        //Append setting to card
        taskCard.appendChild(taskSettings);

        //Append header to card
        taskCard.appendChild(taskHeader);
        
        //Task body
        const taskBody = document.createElement("div");
        taskBody.className = "taskBody";
        taskBody.id = `task${task.id}_Body`;

        //Divider line
        const line = document.createElement("hr");
        taskBody.appendChild(line);

        //Due date and time
        const taskDue = document.createElement("h2");
        taskDue.className = "taskBodyElements";
        taskDue.id = `task${task.id}_Due`;
        taskDue.innerHTML = `Due ${task.date} @ ${formatTimeTo12Hour(task.time)}`;

        //Task Descriptions
        const taskDesc = document.createElement("p");
        taskDesc.className = "taskBodyElements";
        taskDesc.id = `task${task.id}_Desc`;
        taskDesc.innerHTML = `${task.desc}`;


        //Append elements to task body
        taskBody.appendChild(taskDue);
        taskBody.appendChild(taskDesc);

        taskCard.appendChild(taskBody);

        //SubTask Body
        const subTaskBody = document.createElement("div");
        subTaskBody.className = "sTaskBody";
        subTaskBody.id = `task${task.id}_sTaskBody`;

        taskBody.appendChild(line);

        //Sub task list
        const subTaskList = document.createElement("ul");
        subTaskList.className = "sTaskList";
        subTaskList.id = `task${task.id}_sTaskList`;

        const list = task.subTasks;

        list.forEach((subTask) => {
            const listItem = document.createElement("li");
            listItem.className = "sListItem";
            listItem.id = `task${task.id}_sTask${subTask.id}`;

            const sCompleteBox = document.createElement("input");
            sCompleteBox.type = "checkbox";
            sCompleteBox.className = "sCompleteBox";
            sCompleteBox.id = `task${task.id}_sCompleteBox${subTask.id}`;

            const sTitle = document.createElement("h4");
            sTitle.className = "sTitle";
            sTitle.id = `task${task.id}_sTitle${subTask.id}`;
            sTitle.innerHTML = `${subTask.title}: `;

            const sDesc = document.createElement("h6");
            sDesc.className = "sDesc";
            sDesc.id = `task${task.id}_sDesc${subTask.id}`;
            sDesc.innerHTML = `${subTask.desc}`;

            listItem.appendChild(sCompleteBox);
            listItem.appendChild(sTitle);
            listItem.appendChild(sDesc);

            subTaskList.appendChild(listItem);
        });

        subTaskBody.appendChild(subTaskList);

        taskCard.appendChild(taskBody);
        taskCard.appendChild(subTaskBody);

        //Task priority will change card color
        if (!task.completed) {
            if (task.priority == 1){
                taskCard.style.backgroundColor= "rgb(148, 250, 152)";
            } if (task.priority == 2) {
                taskCard.style.backgroundColor= "rgb(250, 235, 125)";
            } if (task.priority == 3) {
                taskCard.style.backgroundColor= "rgb(255, 124, 124)";
            }
        } else {
            taskCard.style.backgroundColor= "rgb(207, 207, 207)";
        }
        

        //Append new task
        taskDisplay.appendChild(taskCard);

        console.log("Tasks rendered.");

        attachListeners();
        console.log("Box listeners added");
    });

}

function completeTask (box) {
    const boxID = box.id;
    const taskID = boxID.match(/\d+/)[0];;

    const taskIndex = searchTask(tasks, taskID);
    if (taskIndex === -1) return;

    const task = tasks[taskIndex];
    task.completed = true;

    console.log(task.completed);

    const taskData = JSON.stringify(tasks, null, 2);
    localStorage.setItem('tasks', taskData);

    renderTasks();
}
//Renews a task and marks complete as false
function renewTask (box) {
    const boxID = box.id;
    //Gets only the number from the checkbox id attribute
    const taskID = boxID.match(/\d+/)[0];;

    const taskIndex = searchTask(tasks, taskID);
    if (taskIndex === -1) return;

    const task = tasks[taskIndex];
    task.completed = false;

    const taskData = JSON.stringify(tasks, null, 2);
    localStorage.setItem('tasks', taskData);

    renderTasks();
}

function addSubTaskInput () {

    sCount++;

    const newInput = document.createElement("div");
    newInput.className = "subTaskInput";
    newInput.id = `subTask${sCount}_Input`;

    const listItem = document.createElement("li");
    listItem.className = "listItem";
    listItem.id = `listItem${sCount}`;

    const taskForm = document.createElement("form");
    taskForm.className = "taskForm";
    taskForm.id = `taskForm${sCount}`;

    const taskTitle = document.createElement("input");
    taskTitle.className = "subTaskTitleInput";
    taskTitle.id = `subTask${sCount}_TitleInput`;
    taskTitle.type = "text";
    taskTitle.placeholder = "Title";

    taskForm.appendChild(taskTitle);

    const taskDesc = document.createElement("input");
    taskDesc.className = "subTaskDescInput";
    taskDesc.id = `subTask${sCount}_DescInput`;
    taskDesc.type = "text";
    taskDesc.placeholder = "Description";

    taskForm.appendChild(taskDesc);

    listItem.appendChild(taskForm);
    subTaskList.appendChild(listItem);
}

//Searches for task by task ID gathered from HTMl elements
function searchTask (array, searchID) {
    return array.findIndex(task => task.id == searchID);
}

//Attaches listeners to the individual task card checkboxes
function attachListeners (){
    const completionBox = document.getElementsByClassName("taskComplete");
    const deleteBtn = document.getElementsByClassName("deleteBtn");
    for (let box of completionBox){
        box.addEventListener("change", () => {
            //Complete a task
            if (box.checked){
                completeTask(box);
                console.log("Box is checked");
            //Renew a task
            } else {
                renewTask(box);
                console.log("Box is unchecked");
            }
        
        });
    }
    for (let btn of deleteBtn){
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            deleteTask(btn);
        });
    }
}
//Checks the filters during rendering of tasks
function checkFilters (tasks) {
    return tasks.filter((task) => {
        // If 'completed' filter is ON, show both completed and uncompleted
        // If 'completed' filter is OFF, show only uncompleted
        return filters.completed || !task.completed;
    });
}

//Adds am or pm
function formatTimeTo12Hour(timeStr) {
    const [hourStr, minute] = timeStr.split(":");
    let hour = parseInt(hourStr);
    //If hour >= 12, then PM, else AM
    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;

    return `${hour}:${minute} ${ampm}`;
}
