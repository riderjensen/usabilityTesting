// Get main URL input on top of home page
const homeUrl = document.getElementById('homeURL');
const testUrl = document.getElementById('webURL');


homeUrl.addEventListener('keyup', (e) => {
  testUrl.value = e.target.value;
});



const addTask = (e) => {
  // Grab all tasks
  const taskList = document.querySelectorAll('#taskItem');
  const taskListArray = Array.from(taskList);
  
  let taskNumber = taskListArray.length;
  
  // console.log(taskListArray.length);


  // Create new Task
  const taskSection = document.querySelector('#tasks');
  const taskItem = document.querySelector('#taskItem');
  let newTaskItem = taskItem.cloneNode(true);
  taskListArray.push(newTaskItem);
  taskNumber++;
  

  console.log(taskListArray.length);
  console.log(taskNumber);
  console.log(taskListArray[taskNumber - 1]);

  taskListArray[taskNumber - 1].children[0].children[0].innerHTML = taskNumber;

  // Add new task
  taskSection.appendChild(newTaskItem);
 

  // taskList.appendChild(newTaskItem);
}