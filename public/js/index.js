// AJAX request to see if the website they put in gives back a good response

const inputBox = document.getElementById('webURL');

let timeout = null;
inputBox.onkeyup = () => {
	clearTimeout(timeout);
	timeout = setTimeout(() => {
		loadPage();
	}, 1000);
};

// currently broken because CORS, check on passing url with websockets and checking with request

let req = new XMLHttpRequest();

function loadPage() {
	var currentURL = inputBox.value;
	console.log(currentURL);
	req.open("POST", currentURL, true);
	req.send(null);

	req.onreadystatechange = () => {
		if (this.status == 200) {
			console.log('This is a good resource');
		} else {
			console.log('This is a bad resource');
		}
	};

};