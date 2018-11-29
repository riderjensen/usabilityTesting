let HTMLClickInput = document.getElementById('changeClickingColor')

HTMLClickInput.addEventListener('keyup', () => {
	document.getElementById('clickColorTest').style.backgroundColor = HTMLClickInput.value;
	document.cookie = `pointerColor=${HTMLClickInput.value}; path=/`;
})


// setting percentages

const newDate = new Date(document.getElementById('createdDate').innerText);

const deletionDate = new Date(newDate.setDate(newDate.getDate() + 30));
const ourDeleted = deletionDate.getTime();

const currentDate = new Date();
const currentTime = currentDate.getTime();

const testTimeRemaining = Math.ceil((ourDeleted - currentTime) / 86400000);
const testTimePercentage = Math.ceil((testTimeRemaining / 30) * 100);

document.getElementById('timeRemaining').innerHTML = `Time remaining: ${testTimeRemaining} days`;

const progressBar = document.getElementById('ourProgressBar');
progressBar.setAttribute('aria-valuenow', testTimePercentage);
progressBar.setAttribute('style', `style="min-width: 2em; width: ${testTimePercentage}`);
progressBar.innerHTML = `${testTimePercentage}%`;