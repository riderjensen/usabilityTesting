// record movement js
// probably need to get screen width/size so we know what size to display back to the user, maybe gather initial information about the test and then send that before the first array?

// int socket
let socket = io.connect();

let x,y;
let objectArray = [];
let time,scrollOnPage = 0;
let w = window.innerWidth;
let h = window.innerHeight;

// these are our event listeners
window.addEventListener("scroll", usableScrolling);
document.getElementById("usableBody").addEventListener("click", usabelClicked);
document.getElementById("usableBody").addEventListener("mousemove", usableShowCoords);


function usabelClicked(){
	//push the click event into the general larger array
  	let seconds = getTimeElapsed();
}



// vars for the scrolling function
let doneOnce = false;
let scrollSeconds;
let myTimeout;

function usableScrolling(){
	// only grab the scroll time once, right when we start the scroll
	if(!doneOnce){
		scrollSeconds = getTimeElapsed();
		doneOnce = true;
	}
	// wait a half of a second before resetting so that we can get a new scroll time
	
	clearTimeout(myTimeout);
	myTimeout = setTimeout(function(){ 
		doneOnce = false;
		scrollOnPage = document.documentElement.scrollTop;

		// need to push scrollOnPage and scrollSeconds to its own array that we can execute on the back

	   }, 500);
}

function usableShowCoords(event) {
    x = event.clientX;
	y = event.clientY;
}

setInterval(function()
  { 
	  // dont send time, just iterate at the same rate that it was recorded to save on space
 	let  object = {
    	x:  ((x/w)*100),
    	y: ((y/h)*100),
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



// get new date for when we opened the page
const d = new Date();
const startTime = d.getTime();

// get time since the page was opened function
function getTimeElapsed(){
  const e = new Date();
  const currentTime = e.getTime();
  const timeClicked = currentTime - startTime;
  const secondsClicked = timeClicked/1000;
  return secondsClicked;
}