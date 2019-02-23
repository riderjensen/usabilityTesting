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


  if(taskListArray.length > 4) {
    return;
  } else if(taskListArray.length > 3) {
    document.querySelector('.add-task-button').style.display = 'none';
  } else {
    document.querySelector('.add-task-button').style.display = 'block';
  }
  
  let taskNumber = taskListArray.length;


  // Create new Task
  const taskSection = document.querySelector('#tasks');
  const taskItem = document.querySelector('#taskItem');
  let newTaskItem = taskItem.cloneNode(true);
  taskListArray.push(newTaskItem);
  taskNumber++;
  
  // Change Task Number on left and update name attribute
  taskListArray[taskNumber - 1].children[0].children[0].innerHTML = taskNumber;
  taskListArray[taskNumber - 1].children[1].children[0].attributes[1].value = `task${taskNumber}`;

  // Add new task
  taskSection.appendChild(newTaskItem);
}