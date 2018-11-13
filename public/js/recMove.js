// global cookie that we are setting/getting
let globalCookie;
// this is out main date creation to be used in multiple functions
const d = new Date();
// int socket
let socket = io.connect();

let testingID, secretID;

// setting cookie
const pageURL = window.location.href;
const pageArray = pageURL.split('/');
const pageID = pageArray[pageArray.length - 1];


let browser = function () {
	// Return cached result if avalible, else get result then cache it.
	if (browser.prototype._cachedResult)
		return browser.prototype._cachedResult;

	// Opera 8.0+
	var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

	// Firefox 1.0+
	var isFirefox = typeof InstallTrigger !== 'undefined';

	// Safari 3.0+ "[object HTMLElementConstructor]" 
	var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) {
		return p.toString() === "[object SafariRemoteNotification]";
	})(!window['safari'] || safari.pushNotification);

	// Internet Explorer 6-11
	var isIE = /*@cc_on!@*/ false || !!document.documentMode;

	// Edge 20+
	var isEdge = !isIE && !!window.StyleMedia;

	// Chrome 1+
	var isChrome = !!window.chrome && !!window.chrome.webstore;


	return browser.prototype._cachedResult =
		isOpera ? 'Opera' :
		isFirefox ? 'Firefox' :
		isSafari ? 'Safari' :
		isChrome ? 'Chrome' :
		isIE ? 'IE' :
		isEdge ? 'Edge' :
		"Don't know";
};


// for getting and setting a cookie
function cookieTest() {
	const name = "usableCookieTracking=";
	const decodedCookie = decodeURIComponent(document.cookie);
	const ca = decodedCookie.split(';');
	let c;
	let ourCookie;
	let cookieIsThere = false;
	for (let i = 0; i < ca.length; i++) {
		c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			cookieIsThere = true;
			ourCookie = c;
		}
	}
	// didnt find cookie
	if (cookieIsThere === false) {
		const initInformation = {
			'browserType': browser(),
			'windowHeight': window.innerHeight,
			'windowWidth': window.innerWidth,
			'intervalTime': 1,
			'initPage': pageID
		}
		socket.emit('initInformation', initInformation);
	} else {
		//found cookie and set it to first page ID
		globalCookie = ourCookie.substring(name.length, ourCookie.length);
		console.log(`Old Cookie: ${globalCookie}`);
		sendOutNewObject();
	}
}
cookieTest();
socket.on('testingID', (data) => {
	d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
	const expires = "expires=" + d.toUTCString();
	document.cookie = `usableCookieTracking=${data};${expires};path=/`;
	globalCookie = data;
	console.log(`New cookie set ${globalCookie}`);
	sendOutNewObject();
});


function sendOutNewObject() {
	// this emits once we find a new page and should push in a new object to our recMoves array
	let newPageObj = {
		page: pageID,
		cookie: globalCookie
	}
	socket.emit('newPageReached', newPageObj);
}

socket.on('returnSecret', (data) => {
	secretID = data
});


// ******************************
// ****** Tracking Section ******
// ******************************


let x, y;
let objectArray = [];
let time, scrollOnPage = 0;
let w = window.innerWidth;
let h = window.innerHeight;

// these are our event listeners for things we want to track
window.addEventListener("scroll", usableScrolling);
document.getElementById("usableBody").addEventListener("mouseup", usabelClicked);
document.getElementById("usableBody").addEventListener("mousemove", usableShowCoords);


// changing the x/y coords anytime that the mouse is moved
function usableShowCoords(event) {
	x = event.clientX;
	y = event.clientY;
}
// getting the x and y position in a percentage and returning the obj to the req
function screenPercents() {
	return object = {
		x: Math.round((x / w) * 10000) / 100,
		y: Math.round((y / h) * 10000) / 100
	}
}


// ****** Click ******

function usabelClicked() {
	// setting event to clicked on the current arrayObj
	objectArray[objectArray.length - 1].ev = 'clicked';
}

// ****** Scroll ******

let doneOnce = false;
let scrollSeconds;
let myTimeout;
let startScroll;

function usableScrolling() {
	if (!doneOnce) {
		doneOnce = true;
		startScroll = document.documentElement.scrollTop;
		let scrollObj = {
			type: 'start',
			// where we started scrolling
			sScroll: scrollOnPage
		}
		// setting event to object on the scroll event
		objectArray[objectArray.length - 1].ev = scrollObj;
	}

	// wait a half of a second before resetting so that we can get a new scroll time
	clearTimeout(myTimeout);
	myTimeout = setTimeout(function () {
		doneOnce = false;
		scrollOnPage = document.documentElement.scrollTop;
		let scrollObj = {
			type: 'end',
			// where we ended scrolling
			eScroll: scrollOnPage
		}
		// setting event to object on the scroll event
		objectArray[objectArray.length - 1].ev = scrollObj;
	}, 10);
}

// ****** Mouse Moves ******

setInterval(function () {
	let object = screenPercents();
	if (objectArray.length > 10) {
		let sendObj = {
			userID: globalCookie,
			recMoves: objectArray,
			page: pageID,
			secret: secretID
		};
		// push testArray to the app
		socket.emit('testingInfo', sendObj);
		// empty object array and begin again
		objectArray = [];
	}
	// push object to object array
	objectArray.push(object);
}, 100);





// get new date for when we opened the page
const startTime = d.getTime();

// get time since the page was opened function
function getTimeElapsed() {
	const e = new Date();
	const currentTime = e.getTime();
	const timeClicked = currentTime - startTime;
	const secondsClicked = timeClicked / 1000;
	return secondsClicked;
}





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
// 	let my_script = document.createElement('script');

// 	my_script.setAttribute('src','http://localhost:3000/recMove.js');

// 	document.head.appendChild(my_script);

// });