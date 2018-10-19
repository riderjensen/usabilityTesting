// take in array, screen size, clicks, scrolls, pages navigated to and iterate and move through them
// get ourIframe ID, pass it width and height, 

// let socket = io.connect();
// const getID = location.href.split('/');
// socket.emit('replayInformationID', getID[getID.length - 1]);


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
    if (i === (userMoves.length - 1)) {
        // reset i to repeat the pattern
        i = -1;
    }
    i++;
}, 100);