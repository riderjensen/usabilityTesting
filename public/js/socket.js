// socket script
// 
var socket = io.connect();

socket.on('connect', () => {
    socket.emit('beep');
});

// this will be used to AJAX request the URL 

// we can use this to monitor people testing a site but maybe create a different js file for that?