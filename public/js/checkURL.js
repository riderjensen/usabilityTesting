// socket script

let socket = io.connect();

const website = document.getElementById('homeURL');
const checkmark = document.querySelector('.checkmark');
website.onkeyup = () => {
	// send website to back end with a 1second delay
	if ((website.value != '')) {
		timeout = setTimeout(() => {
			socket.emit('website', website.value);
		}, 500);
	}
};
// good URL entered
socket.on('goodURL', () => {
	website.style.borderColor = "Green";
	website.style.borderWidth = "4px";
	checkmark.style.right = "0px";
	checkmark.style.opacity = "1";
	document.getElementById('submit').disabled = false;
});

// bad URL entered
socket.on('badURL', () => {
	website.style.borderColor = "Red";
	website.style.borderWidth = "4px";
	checkmark.style.right = "-40px";
	checkmark.style.opacity = "0";
	document.getElementById('submit').disabled = true;
});

// auto default the button to disabled
document.getElementById('submit').disabled = true;