// Get main URL input on top of home page
const homeUrl = document.getElementById('homeURL');
const testUrl = document.getElementById('webURL');


homeUrl.addEventListener('keyup', (e) => {
  testUrl.value = e.target.value;
});