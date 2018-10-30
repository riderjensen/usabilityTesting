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


const result = userMoves.filter((move, i) => {
	move.ev ? i : false
});

let i = 0;
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
	if (userMoves[i].ev) {
		let ourObj = userMoves[i].ev;
		console.log(ourObj);
		if (ourObj.type == 'start') {
			// window.scrollTo(0, ourObj.sScroll)
			TweenLite.to(window, 1, {
				scrollTo: {
					y: ourObj.sScroll,
					x: 0
				},
				ease: Power2.easeInOut
			});
		} else if (ourObj.type == 'end') {
			// window.scrollTo(0, ourObj.eScroll)
			TweenLite.to(window, 1, {
				scrollTo: {
					y: ourObj.eScroll,
					x: 0
				},
				ease: Power2.easeInOut
			});
		} else {
			console.log('missing scroll event');
		}
	}
	if (i >= (userMoves.length - 1)) {
		// reset i to repeat the pattern
		i = -1;
	}
	i++;
}, interval);