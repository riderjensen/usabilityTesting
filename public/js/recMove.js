// record movement js
// probably need to get screen width/size so we know what size to display back to the user, maybe gather initial information about the test and then send that before the first array?

// int socket
let socket = io.connect();

let x, y;
let objectArray = [];
let time, scrollOnPage = 0;
let w = window.innerWidth;
let h = window.innerHeight;

// these are our event listeners
window.addEventListener("scroll", usableScrolling);
document.getElementById("usableBody").addEventListener("click", usabelClicked);
document.getElementById("usableBody").addEventListener("mousemove", usableShowCoords);


function usabelClicked() {
	//push the click event into the general larger array
	let seconds = getTimeElapsed();
}



// vars for the scrolling function
let doneOnce = false;
let scrollSeconds;
let myTimeout;

function usableScrolling() {
	// only grab the scroll time once, right when we start the scroll
	if (!doneOnce) {
		scrollSeconds = getTimeElapsed();
		doneOnce = true;
	}
	// wait a half of a second before resetting so that we can get a new scroll time

	clearTimeout(myTimeout);
	myTimeout = setTimeout(function () {
		doneOnce = false;
		scrollOnPage = document.documentElement.scrollTop;

		// need to push scrollOnPage and scrollSeconds to its own array that we can execute on the back

	}, 500);
}

function usableShowCoords(event) {
	x = event.clientX;
	y = event.clientY;
}

setInterval(function () {
	// dont send time, just iterate at the same rate that it was recorded to save on space
	let object = {
		x: ((x / w) * 100),
		y: ((y / h) * 100),
	}
	if (objectArray.length > 50) {

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
function getTimeElapsed() {
	const e = new Date();
	const currentTime = e.getTime();
	const timeClicked = currentTime - startTime;
	const secondsClicked = timeClicked / 1000;
	return secondsClicked;
}
// anything that loads after page has been saved




// Trying to change scripts when they are loaded after everything else has loaded

// const rootURL = document.getElementById('usableRootURL').innerHTML;

// window.addEventListener("load", function () {
// 	console.log('---------------------------')
// 	let linkArray = document.getElementsByTagName('link');
// 	let scriptArray = document.getElementsByTagName('script');


// 	Array.prototype.forEach.call(linkArray, element => {
// 		let elHREF = element.href;
// 		let test = elHREF.split('');
// 		if (test[0] === '/') {
// 			element.href = rootURL + element.href;
// 			// console.log(element.href);
// 		}
// 	});
// 	Array.prototype.forEach.call(scriptArray, element => {
// 		if (element.src === '') {
// 			// src is null, dont do anything
// 		} else {
// 			let elHREF = element.src;
// 			let test = elHREF.split('');
// 			let firstPart = test[0] + test[1] + test[2] + test[3] + test[4] + test[5] + test[6] + test[7] + test[8] + test[9] + test[10];
// 			if (firstPart === 'http://loca') {
// 				let splitnewURL = elHREF.split('/');
// 				newURL = rootURL;
// 				for (let i = 4; i < splitnewURL.length; i++) {
// 					newURL += '/' + splitnewURL[i];
// 				}
// 				console.log(newURL);

// 			}
// 		}

// 	});
// 	let my_awesome_script = document.createElement('script');

// 	my_awesome_script.setAttribute('src','http://localhost:3000/recMove.js');

// 	document.head.appendChild(my_awesome_script);

// });




// for getting and setting a cookie
// cookie broke tho
function cookieTest(){
	const name = "usableCookieTracking=";
	const decodedCookie = decodeURIComponent(document.cookie);
	const ca = decodedCookie.split(';');
	let c;
	let cookieIsThere = false;
	for(let i = 0; i <ca.length; i++) {
		c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			console.log('test');
			cookieIsThere = true;
		}
	}
	// didnt find cookie
	if(cookieIsThere === false){
		console.log(`SETTING COOKIE!!`);
		const pageURL = window.location.href;
		const pageArray = pageURL.split('/');
		const pageID = pageArray[pageArray.length -1];

		const d = new Date();
		d.setTime(d.getTime() + (1*24*60*60*1000));
		const expires = "expires="+ d.toUTCString();
		document.cookie = `usableCookieTracking=${pageID};${expires};path=/`;
	} else {
		//found cookie
		console.log(`FOUND: ${c.substring(name.length, c.length)}`);
	}
}
cookieTest();