
//Object arrays that hold tasks, and completed tasks
const tasks = [];
const completedTasks = [];
const filters = [
    {
        filter: showCompleted,
        on: false
    }
];
const taskDisplay = document.getElementById("taskDisplay");
const addButton = document.getElementById("taskAdd");
const completedBox = document.getElementById("filter");

//Loading local storage
const taskData = localStorage.getItem('tasks');
const archivedData = localStorage.getItem('completedTasks')
if (taskData) {
    const package = JSON.parse(taskData);
    tasks.push(...package);
    console.log("tasks loaded");
}
if (archivedData) {
    const package = JSON.parse(archivedData);
    completedTasks.push(...package);
    console.log("completed loaded");
}

//initial render
renderTasks();

addButton.addEventListener("click", (e) => {
    e.preventDefault();
    createTask();
});

filterChecked.addEventListener("change", () => {
    if (!this.checked) {
        const flag = filters[0].on = false;
        renderTasks(flag);
    } else {

    }
});

function createTask(){
    const count = tasks.length + 1;
    const taskName = document.getElementById("taskName").value.trim();
    const taskDesc = document.getElementById("taskDesc").value.trim();
    const taskDate = document.getElementById("taskDate").value.trim();
    const taskTime = document.getElementById("taskTime").value.trim();
    const taskPriority = document.getElementById("taskPriority").value.trim();

    
    let task = {
        id: count,
        title: taskName,
        desc: taskDesc,
        date: taskDate,
        time: taskTime,
        priority: taskPriority,
        completed: ''
    };

    tasks.push(task);

    //Store tasks locally
    const taskData = JSON.stringify(tasks, null, 2);
    localStorage.setItem('tasks', taskData);

    renderTasks();


}
function renderTasks(flag){
    taskDisplay.innerHTML = "";
    
    tasks.forEach((task) => {
        //Creating task card
        const taskCard = document.createElement("div");
        taskCard.className = "task";
        taskCard.id = `task${task.id}`;

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

        //Append Title and Checkbox to card header
        taskHeader.appendChild(taskTitle);
        taskHeader.appendChild(checkBox);
    
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

        //Task Description
        const taskDesc = document.createElement("p");
        taskDesc.className = "taskBodyElements";
        taskDesc.id = `task${task.id}_Desc`;
        taskDesc.innerHTML = `${task.desc}`;

        //Append elements to task body
        taskBody.appendChild(taskDue);
        taskBody.appendChild(taskDesc);

        //Append taskBody to taskCard
        taskCard.appendChild(taskBody);

        //Task priority will change card color
        if (task.priority == 1){
            taskCard.style.backgroundColor= "rgb(84, 248, 90)";
        } if (task.priority == 2) {
            taskCard.style.backgroundColor= "rgb(255, 229, 30)";
        } if (task.priority == 3) {
            taskCard.style.backgroundColor= "rgb(251, 128, 94)";
        }

        //Append new task
        taskDisplay.appendChild(taskCard);

        console.log("Tasks rendered.");

        attachBoxListeners();
        console.log("Box listeners added");
    });

}
function completeTask (box) {
    const boxID = box.id;
    const taskID = boxID.match(/\d+/)[0];;

    const taskIndex = searchTask(tasks, taskID);
    if (taskIndex === -1) return;

    const task = tasks[taskIndex];
    tasks.splice(taskIndex, 1);

    completedTasks.push(task);

    const archivedData = JSON.stringify(completedTasks, null, 2);
    localStorage.setItem('completedTasks', archivedData);
    const taskData = JSON.stringify(tasks, null, 2);
    localStorage.setItem('tasks', taskData);

    renderTasks();
}

function renewTask () {
    const boxID = box.id;
    const taskID = boxID.match(/\d+/)[0];;

    const taskIndex = searchTask(completedTasks, taskID);
    if (taskIndex === -1) return;

    const task = completedTasks[taskIndex];
    completedTasks.splice(taskIndex, 1);

    tasks.push(task);

    const archivedData = JSON.stringify(completedTasks, null, 2);
    localStorage.setItem('completedTasks', archivedData);
    const taskData = JSON.stringify(tasks, null, 2);
    localStorage.setItem('tasks', taskData);

    renderTasks();
}

function searchTask (array, searchID) {
    return array.findIndex(task => task.id == searchID);
}
function attachBoxListeners (){
    const completionBox = document.getElementsByClassName("taskComplete");
    for (let box of completionBox){
        box.addEventListener("change", () => {
            if (box.checked){
                completeTask(box);
                console.log("Box is checked");
            } else {
                renewTask(box);
                console.log("Box is unchecked");
            }
        
    });
}
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