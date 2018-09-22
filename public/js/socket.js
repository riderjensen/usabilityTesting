// socket script

let socket = io.connect();

const website = document.getElementById('webURL');
website.onkeyup = () => {
    // send website to back end with a 1second delay
    if ((website.value != '')) {
		clearTimeout(timeout);
    	timeout = setTimeout(() => {
			socket.emit('website', website.value);
    	}, 1000);
	}
};

socket.on('goodURL', () => {
	console.log('This is a good URL');
	website.style.borderColor = "Green";
	website.style.borderWidth = "4px";
	document.getElementById('submit').disabled = false;
});

socket.on('badURL', () => {
	console.log('This is a bad URL');
	website.style.borderColor = "Red";
	website.style.borderWidth = "4px";
	document.getElementById('submit').disabled = true;
});

// we can use this to monitor people testing a site but maybe create a different js file for that?