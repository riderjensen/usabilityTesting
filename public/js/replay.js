const usableBody = document.getElementById('usableBody');

const box = document.createElement('div');
box.id = "box";
box.setAttribute('style', "z-index: 100; position:fixed; top: 200px; left: 200px; width: 10px; height: 10px; background-color: tomato;");

const pointed = document.createElement('div');
pointed.id = "pointer";
pointed.setAttribute('style', "z-index: 100; position:absolute; height: 30px; width: 30px; background-color: rgba(255, 0, 0, 0.4); border-radius: 50%; display: inline-block;");

usableBody.insertAdjacentElement('afterbegin', box);
usableBody.insertAdjacentElement('afterbegin', pointed);

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
// iterator for userMoves
let i = 0;
// iterator for scrolling object
let j = 0;
setInterval(function () {
	if (i >= (userMoves.length - 1)) {
		// reset i and j to repeat the pattern
		i = 0;
		j = 0;
	}
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
		let ourObject = userMoves[i].ev;
		if (ourObject.type == 'start') {
			let ourTime = (scrollIndexArray[j + 1] - scrollIndexArray[j]) / (interval / 10);
			// this should get the start usermove object
			// userMoves[scrollIndexArray[j]]
			// this should get the end usermove object
			// userMoves[scrollIndexArray[j+1]]
			let ourObj = userMoves[scrollIndexArray[j + 1]].ev;
			TweenLite.to(window, ourTime, {
				scrollTo: {
					y: ourObj.eScroll,
					x: 0
				},
				ease: Power2.easeInOut
			});
			j += 2;
		}

	}
	i++;

}, interval);