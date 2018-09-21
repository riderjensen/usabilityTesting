// socket script
// 
var socket = io.connect();

socket.on('connect', () => {
    socket.emit('beep');
});


const testWeb = document.getElementById('testWeb');
testWeb.onclick = () => {
    const website = document.getElementById('webURL').value;
    // send website to back end
    if ((website !== '')) {
        socket.emit('website', website);
    }
};
// this will be used to AJAX request the URL 

// we can use this to monitor people testing a site but maybe create a different js file for that?