// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    const taskId = `task_${nextId}`;
    nextId++;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return taskId;
}
// Todo: create a function to create a task card
function createTaskCard(task) {
    $(document).ready(function() {
        let taskList = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskContainer = $('#todo-cards');
    
        taskList.forEach(function(task) {
            const taskCard = $('<div>').addClass('card mb-3 draggable').attr('id', task.id);
    
            const cardHeader = $('<div>').addClass('card-header').text(task.title);
    
            const cardBody = $('<div>').addClass('card-body');
    
            const dueDateParagraph = $('<p>').addClass('card-text').text('Due Date: ' + task.dueDate);
    
            const descriptionParagraph = $('<p>').addClass('card-text').text(task.description);
    
            const deleteButton = $('<button>').addClass('btn btn-danger delete-btn').text('Delete');
    
            cardBody.append(descriptionParagraph, dueDateParagraph, deleteButton);
            taskCard.append(cardHeader, cardBody);
            taskContainer.append(taskCard);
        });
    });
}
// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

    if (taskList === null) {
        taskList = [];
    }

    $('.lane .card').remove();

    taskList.forEach(function(task) {
        
        const taskCard = $('<div>').addClass('card mb-3 draggable').attr('id', task.id);
        const cardHeader = $('<div>').addClass('card-header').text(task.title);
        const cardBody = $('<div>').addClass('card-body');
        const dueDateParagraph = $('<p>').addClass('card-text').text('Due Date: ' + task.dueDate);
        const descriptionParagraph = $('<p>').addClass('card-text').text(task.description);
        const deleteButton = $('<button>').addClass('btn btn-danger delete-btn').text('Delete');

        cardBody.append(descriptionParagraph, dueDateParagraph, deleteButton);
        taskCard.append(cardHeader, cardBody);

        $('#' + task.status + '-cards').append(taskCard);
    });

    $('.draggable').draggable({
        revert: 'invalid',
        cursor: 'move',
        stack: '.draggable'
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    const taskTitle = $('#taskTitle').val();
    const taskDueDate = $('#taskDueDate').val();
    const taskDescription = $('#taskDescription').val();

    const newTask = {
        id: generateTaskId(),
        title: taskTitle,
        dueDate: taskDueDate,
        description: taskDescription,
        status: 'todo'
    };

    taskList.push(newTask);

    localStorage.setItem('tasks', JSON.stringify(taskList));

    renderTaskList();

    $('#taskForm')[0].reset();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(event.target).closest('.card').attr('id');

    taskList = taskList.filter(task => task.id !== taskId);

    localStorage.setItem('tasks', JSON.stringify(taskList));

    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.attr('id');
    const newStatus = $(event.target).closest('.lane').attr('id');

    const droppedTask = taskList.find(task => task.id === taskId);
    droppedTask.status = newStatus;

    localStorage.setItem('tasks', JSON.stringify(taskList));

    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    
    renderTaskList();

    $('#taskForm').submit(handleAddTask);

    $(document).on('click', '.delete-btn', handleDeleteTask);

    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop
    });

    $('#taskDueDate').datepicker();
});
