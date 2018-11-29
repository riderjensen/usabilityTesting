// probably use AJAX to check the ID they enter against the database to see if there is a test with that id

let classname = document.getElementsByClassName("spanCheking");


Array.from(classname).forEach((element) => {
	element.addEventListener('click', () => {
		console.log(element.childNodes);
		document.getElementById('deleteTestID').value = element.childNodes[1].id;
		document.getElementById('copyTestID').value = element.childNodes[1].id;
		document.getElementById('deleteTestIDPrompt').innerHTML = `Do you really want to delete ${element.childNodes[1].innerText}?`
		document.getElementById('copyTestIDPrompt').innerHTML = `Do you really want to copy ${element.childNodes[1].innerText}?`
	});
});