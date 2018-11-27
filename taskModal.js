// document.querySelector('body').style.position = 'relative;';
// document.querySelector('body').cssText = 'background: blue; height: 5000px;';

// Create outer div
const outerDiv = document.createElement('div');
outerDiv.setAttribute('id', 'taskModal');
outerDiv.style.cssText = 'width: 500px; height: auto; border: 1px solid #ccc; box-sizing: border-box; border-radius: 10px; position: fixed; bottom: 40px; transition: .3s linear; z-index: 99; background: #fff; box-shadow: 1px 1px 2px #ccc';

// Create header
const usableLogoDiv = document.createElement('div');
const usableLogo = document.createElement('img');
usableLogo.setAttribute('src', 'https://agitated-fermi-28bdc8.netlify.com/img/usable_logo.f82721b1.svg');
usableLogo.setAttribute('alt', 'Usable Logo');
usableLogoDiv.appendChild(usableLogo);
usableLogoDiv.style.cssText = 'display: flex; justify-content: center; width: 100%;  border-radius: 10px 10px 0 0; background: #000; padding: 10px 0; border: 1px solid #ccc;';

outerDiv.appendChild(usableLogoDiv);

// Create Min-Max Div
const minMax = document.createElement('div');
minMax.style.cssText = 'position: relative; float: right; width: 40px; height: 40px; right: -50px';

// Create Min-Max Button
const minMaxButton = document.createElement('div');
minMaxButton.setAttribute('id', 'minMaxButton');
minMaxButton.style.cssText = 'background: cyan; height: 100%; width: 100%; border-radius: 50px; display: flex; justify-content: center; align-items: center;';

minMax.appendChild(minMaxButton);

// Create Min-Max Span
const minMaxSpan = document.createElement('span');
minMaxSpan.textContent = '-'
minMaxSpan.style.cssText = 'color: #fff; font-size: 2rem; display: inline-block;'

minMaxButton.appendChild(minMaxSpan);


outerDiv.appendChild(minMax); 

// Create H1
const heading1 = document.createElement('h1');
heading1.style.cssText = 'font-family: sans-serif; font-size: 21px; text-transform: uppercase; font-weight: 600; color: #333; margin-bottom: 15px; text-decoration: underline; padding-top: 16px; text-align: center; position: relative; right: -20px';
outerDiv.appendChild(heading1);

// Create Task Paragraph
const taskParagraph = document.createElement('p');
taskParagraph.setAttribute('id', 'taskItem');
taskParagraph.style.cssText = 'line-height: 21px; padding: 15px; font-family: sans-serif;'
outerDiv.appendChild(taskParagraph);

// Input Box
const feedback = document.createElement('textarea');
feedback.style.cssText = 'padding: 15px; width: 75%; display: block; margin: 25px auto; border-radius: 3px;'
feedback.setAttribute('placeholder', 'Give us some feedback about this task!');
outerDiv.appendChild(feedback);

// Create Bottom Section
const bottomSection = document.createElement('div');
bottomSection.style.cssText = 'display: flex; border-top: 1px solid #aaa';

// Create Back Button
const backButton = document.createElement('div');
backButton.textContent = 'BACK';
backButton.style.cssText = 'flex-grow: 1; padding: 10px; text-decoration: none; font-family: sans-serif; text-align: center; background: #aaa; color: #fff; border-radius: 0 0 0 10px;';

bottomSection.appendChild(backButton);

// Create Task Div
const taskDiv = document.createElement('div');
taskDiv.style.cssText = 'flex-grow: 1; padding: 10px; text-decoration: none; font-family: sans-serif; text-align: center;';

bottomSection.appendChild(taskDiv);

// Create Next Button
const nextButton = document.createElement('div');
nextButton.textContent = 'Next';
nextButton.style.cssText = 'flex-grow: 1; padding: 10px; text-decoration: none; font-family: sans-serif; text-align: center; background: cyan; color: #fff; border-radius: 0 0 10px 0;';

bottomSection.appendChild(nextButton);

outerDiv.appendChild(bottomSection);

// Append Entire Modal to Body
document.querySelector('body').appendChild(outerDiv);

/* =======================================*/

// Array of Tasks
const taskList = ['Please locate the section dedicated to pricing and features.', 'Test full site navigation and document any inconsitencies.', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt atque architecto distinctio, hic eos optio?', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt atque architecto distinctio, hic eos optio? Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt atque architecto distinctio, hic eos optio?', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt atque architecto distinctio, hic eos optio?'];

let taskCounter = 0;
let headingTaskCounter = 1;

// Minimize and Maximize Modal
const minMaxButtonEvent = document.getElementById('minMaxButton');
minMaxButtonEvent.addEventListener('click', () => {
  if(minMaxSpan.textContent === '-') {
    outerDiv.style.cssText = 'width: 500px; height: auto; border: 1px solid #ccc; box-sizing: border-box; border-radius: 10px; position: fixed; bottom: 40px; transition: .3s linear; z-index: 99; left: -502px; background: #fff;';
    minMaxSpan.textContent = '+';
  } else {
    outerDiv.style.cssText = 'width: 500px; height: auto; border: 1px solid #ccc; box-sizing: border-box; border-radius: 10px; position: fixed; bottom: 40px; transition: .3s linear; z-index: 99; left: 0; background: #fff;';
    minMaxSpan.textContent = '-';
  }
});

minMaxButtonEvent.onmouseover = () => {
  minMaxButtonEvent.style.cssText = 'background: cyan; height: 100%; width: 100%; border-radius: 50px; display: flex; justify-content: center; align-items: center; transform: scale(1.1); transition: .2s; cursor: pointer;';
};

minMaxButtonEvent.onmouseleave = () => {
  minMaxButtonEvent.style.cssText = 'background: cyan; height: 100%; width: 100%; border-radius: 50px; display: flex; justify-content: center; align-items: center; transform: scale(1); transition: .2s;';
};

// Next Button
nextButton.addEventListener('mouseover', (e) => {
  e.target.style.cssText = 'flex-grow: 1; padding: 10px; text-decoration: none; font-family: sans-serif; text-align: center; background: cyan; color: #fff; border-radius: 0 0 10px 0; cursor: pointer;';
});

nextButton.addEventListener('click', () => {
  if (taskCounter <= taskList.length - 2) {
    taskCounter++
    taskParagraph.textContent = taskList[taskCounter]; 
    headingTaskCounter++;
    heading1.textContent = 'Task ' + headingTaskCounter;
    taskDiv.textContent = 'Task ' + headingTaskCounter + ' of ' + taskList.length;
    // console.log(taskCounter);
  }
});

// Back Button
backButton.addEventListener('mouseover', (e) => {
  e.target.style.cssText = 'flex-grow: 1; padding: 10px; text-decoration: none; font-family: sans-serif; text-align: center; background: #aaa; color: #fff; border-radius: 0 0 0 10px; cursor: pointer;';
});

backButton.addEventListener('click', () => {
  if (taskCounter >= 1) {
    taskCounter--;
    taskParagraph.textContent = taskList[taskCounter]; 
    headingTaskCounter--;
    heading1.textContent = 'Task ' + headingTaskCounter;
    taskDiv.textContent = 'Task ' + headingTaskCounter + ' of ' + taskList.length;
    // console.log(taskCounter);
  }
});

// Initiate Test
function startTest() {
  document.getElementById('taskItem').textContent = taskList[0];
  heading1.textContent = 'Task ' + headingTaskCounter;
  taskDiv.textContent = 'Task ' + headingTaskCounter + ' of ' + taskList.length;
};
startTest();

