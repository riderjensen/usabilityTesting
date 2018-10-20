// take in array, screen size, clicks, scrolls, pages navigated to and iterate and move through them
// get ourIframe ID, pass it width and height, 

// let socket = io.connect();
// const getID = location.href.split('/');
// socket.emit('replayInformationID', getID[getID.length - 1]);

const pointer = document.getElementById('pointer');
let scrollOnPage = 0;

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
		pointer.style.left = userMoves[i].x+'%';
  		pointer.style.top = (userMoves[i].y + scrollOnPage ) + '%';
	}
    if (i === (userMoves.length - 1)) {
        // reset i to repeat the pattern
        i = -1;
    }
    i++;
}, 100);