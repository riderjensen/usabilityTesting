// Get main URL input on top of home page
const homeUrl = document.getElementById('homeURL');
const testUrl = document.getElementById('webURL');


homeUrl.addEventListener('keyup', (e) => {
  testUrl.value = e.target.value;
});



const addTask = () => {
  // Grab all tasks
  const taskList = document.querySelectorAll('#taskItem');
  const taskListArray = Array.from(taskList);


  if (taskListArray.length > 4) {
    return;
  }

  if (taskListArray.length > 0 && taskListArray.length <= 4) {
    document.querySelector('.add-task-button').style.display = 'block';
  }

  if (taskListArray.length === 4) {
    document.querySelector('.add-task-button').style.display = 'none';
  }

  let taskNumber = taskListArray.length;

  // Create new Task
  const taskSection = document.querySelector('#tasks');
  const taskItem = document.querySelector('.task-copy-template');
  let newTaskItem = taskItem.cloneNode(true);
 
  taskListArray.push(newTaskItem);
  taskNumber++;

  // Change Task Number on left and update name attribute
  taskListArray[taskNumber - 1].children[0].children[0].innerHTML = taskNumber;
  taskListArray[taskNumber - 1].children[1].children[0].attributes[1].value = `task${taskNumber}`;

  // Add Delete Button
  const deleteButton = document.createElement('i');
  deleteButton.classList.add('fa', 'fa-minus-circle');
  deleteButton.setAttribute('onclick', 'deleteTask(this)');
  
  const nameTag = newTaskItem.children[1].children[0];
  nameTag.after(deleteButton);

  // Add new task
  taskSection.appendChild(newTaskItem);

}


// DELETE TASKS
const deleteTask = (taskToDelete) => {

  // Grab all tasks
  const taskList = document.querySelectorAll('#taskItem');
  const taskListArray = Array.from(taskList);

  if (taskListArray.length < 2) {
    return;
  }

  if (taskListArray.length > 0) {
    document.querySelector('.add-task-button').style.display = 'block';
  }

  // console.log(taskToDelete);
  taskToDelete.parentNode.parentNode.remove();
};