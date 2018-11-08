const ourURL = 'http://localhost:3000/replay/';

function createScript(theURL) {
	let ourScript = document.createElement('script');
	ourScript.src = theURL;
	document.getElementsByTagName("body")[0].appendChild(ourScript)
}
createScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.4/plugins/ScrollToPlugin.min.js");
createScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/2.0.2/TweenMax.min.js");

// creating pointer and clicker
const usableBody = document.getElementById('usableBody');
const box = document.createElement('div');
box.id = "box";
box.setAttribute('style', "z-index: 100; position:fixed; top: 200px; left: 200px; width: 10px; height: 10px; background-color: tomato;");
const pointed = document.createElement('div');
pointed.id = "pointer";
pointed.setAttribute('style', "z-index: 100; position:absolute; height: 30px; width: 30px; background-color: rgba(255, 0, 0, 0.4); border-radius: 50%; display: inline-block;");
usableBody.insertAdjacentElement('afterbegin', box);
usableBody.insertAdjacentElement('afterbegin', pointed);


// get the test id for the user moves

let pageNum;
if (window.location.search == "") {
	pageNum = 1
} else {
	let pageArray = (window.location.search).split('=')
	let pageNumArray = pageArray[1].split('&');
	pageNum = parseInt(pageNumArray[0]);
	pageNum += 1;
}
let relatedTestId;
if (!document.getElementById('usableReqID')) {
	let pageArray = (window.location.search).split('=')
	relatedTestId = pageArray[pageArray.length - 1];
} else {
	relatedTestId = document.getElementById('usableReqID').innerHTML;
}

let sendingData = {
	testID: relatedTestId,
	pageNum: pageNum - 1
}
// send ourRelated Test idea
let socket = io.connect();
const getID = location.href.split('/');
socket.emit('replayInformationID', sendingData);

// get the moves back and go through them
socket.on('returnMoves', (data) => {
	let userMoves = data.moves;
	const pointer = document.getElementById('pointer');
	let scrollOnPage = 0;
	// 10 every second
	// we need to let the user be able to modify this and change it so that they can replay at their leaisure
	let interval = 100;

	// an array of all the positions where .ev is present. 
	// Every other occurance of .ev will be a start or a stop and therefore
	// we can get the time between those and tween the correct amount
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
	let intervalFunction = setInterval(replayFunction, interval)

	function replayFunction() {
		if (i >= (userMoves.length - 1)) {
			clearInterval(intervalFunction);
			// move us on to the next url
			window.location.href = `${ourURL}${data.nextURL}?pagenum=${pageNum}&testID=${relatedTestId}`;
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
			pointer.style.top = userMoves[i].y + '%';
			pointer.style.transform = `translateY(${scrollOnPage}px)`;
		}
		if (typeof userMoves[i].ev === "object") {
			let ourObject = userMoves[i].ev;
			if (ourObject.type == 'start') {
				let ourTime = (scrollIndexArray[j + 1] - scrollIndexArray[j]) / (interval / 10);
				let ourObj = userMoves[scrollIndexArray[j + 1]].ev;
				scrollOnPage = ourObj.eScroll;
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
	}
});