// take in array, screen size, clicks, scrolls, pages navigated to and iterate and move through them
// get ourIframe ID, pass it width and height, 

// let socket = io.connect();
// const getID = location.href.split('/');
// socket.emit('replayInformationID', getID[getID.length - 1]);


const pointer = document.getElementById('pointer');
let scrollOnPage = 0;
// 10 every second
// we need to let the user be able to modify this and change it so that they can replay at their leaisure
let interval = 100;

// an array of all the positions where .ev is present. Every other occurance of .ev will be a start or a stop and therefore we can get the time between those and tween the correct amount
let scrollIndexArray = [];
userMoves.forEach((move, i) => {
	if (typeof move.ev === "object") {
		scrollIndexArray.push(i);
	}
});
console.log(scrollIndexArray);
// iterator for userMoves
let i = 0;
// iterator for scrolling object
let j = 0;
setInterval(function () {
	TweenLite.to('#box', 1, {
		ease: Power2.easeNone,
		left: userMoves[i].x + '%'
	});
	TweenLite.to('#box', 1, {
		ease: Power2.easeNone,
		top: userMoves[i].y + '%'
	});

	if (userMoves[i].ev == "clicked") {
		pointer.style.left = userMoves[i].x + '%';
		pointer.style.top = (userMoves[i].y + scrollOnPage) + '%';
	}
	if (typeof userMoves[i].ev === "object") {
		// if the start scroll is here then do tween otherwise if it is just end scroll then dont do anything?
		let ourTime = scrollIndexArray[j + 1] - scrollIndexArray[j];
		console.log(ourTime);
		// this should get the start usermove object
		// userMoves[scrollIndexArray[j]]
		// this should get the end usermove object
		// userMoves[scrollIndexArray[j+1]]
		let ourObj = userMoves[scrollIndexArray[j + 1]].ev;
		console.log(ourObj);
		TweenLite.to(window, ourTime, {
			scrollTo: {
				y: ourObj.eScroll,
				x: 0
			},
			ease: Power2.easeInOut
		});
	}
	if (i >= (userMoves.length - 1)) {
		// reset i to repeat the pattern
		i = -1;
	}
	i++;

}, interval);