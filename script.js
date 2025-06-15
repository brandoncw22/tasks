
//Object arrays that hold tasks, and completed tasks
const tasks = [];
//const completedTasks = [];

//Filters for the task display
const filters = {
    completed: false,
    hightolow: false,
    lowtohigh: false,
    overdue: false,
};
const taskDisplay = document.getElementById("taskDisplay");
const addButton = document.getElementById("taskAdd");
const filterCompleted = document.getElementById("filterCompleted");

//Loading local storage
const taskData = localStorage.getItem('tasks');
const archivedData = localStorage.getItem('completedTasks')
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

//Creates task object and assigns values to its attributes based on input values
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
        completed: false
    };

    tasks.push(task);

    //Store tasks locally
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
        if (!task.completed) {
            if (task.priority == 1){
                taskCard.style.backgroundColor= "rgb(84, 248, 90)";
            } if (task.priority == 2) {
                taskCard.style.backgroundColor= "rgb(255, 229, 30)";
            } if (task.priority == 3) {
                taskCard.style.backgroundColor= "rgb(251, 128, 94)";
            }
        } else {
            taskCard.style.backgroundColor= "rgb(207, 207, 207)";
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
//Searches for task by task ID gathered from HTMl elements
function searchTask (array, searchID) {
    return array.findIndex(task => task.id == searchID);
}

//Attaches listeners to the individual task card checkboxes
function attachBoxListeners (){
    const completionBox = document.getElementsByClassName("taskComplete");
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