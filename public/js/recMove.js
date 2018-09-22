// record movement js

// int socket
let socket = io.connect();

let x,y;
let objectArray = [];
let time,scrollOnPage = 0;
let w = window.innerWidth;
let h = window.innerHeight;

// these are our event listeners
document.getElementById("usableBody").addEventListener("scroll", usableScrolling);
document.getElementById("usableBody").addEventListener("click", usabelClicked);
document.getElementById("usableBody").addEventListener("mousemove", usableShowCoords);


function usabelClicked(){
	//push the click event into the general larger array
	console.log('WE HAD A CLICK!!!');
}

// scrolling seems to be broken
function usableScrolling(){
  scrollOnPage = document.documentElement.scrollTop;
  console.log('WE HAD A SCROLL!!!');
}

function usableShowCoords(event) {
    x = event.clientX;
	y = event.clientY;
	console.log('The mouse was MOVED!!!');
}

setInterval(function()
  { 
  time++;
  let  object = {
    x:  ((x/w)*100),
    y: ((y/h)*100),
    time: time
  }
  if ( objectArray.length > 50){
    
    let testArray = [];
    testArray = objectArray;
    // push testArray to the app
	socket.emit('testingInfo', testArray);
	
    // empty object array and begin again
    objectArray = [];
  }
  // push object to object array
  objectArray.push(object);  
}, 100);