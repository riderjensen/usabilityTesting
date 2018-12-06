// get the cookies stored
function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return false;
}

console.log(getCookie('feedbackArray'));
console.log(getCookie('userTestingArray'));
let userQuestionsArray = JSON.parse(getCookie('userTestingArray'));
let userFeedbackArray = JSON.parse(getCookie('feedbackArray'));

// display them on the page

let ourPageForm = document.getElementById('completedForm');
for (let i = 0; i < userQuestionsArray.length; i++) {
	let label = createElement('label');
	label.innerText = userQuestionsArray[i];
	let input = createElement('input');
	input.setAttribute('class', 'form-control');
	input.setAttribute('name', 'userResp' + i);
	input.setAttribute('value', userFeedbackArray[i]);
	label.appendChild(input);
	ourPageForm.appendChild(label);
}

function createElement(elemName) {
	return document.createElement(elemName);
}