let HTMLClickInput = document.getElementById('changeClickingColor')

HTMLClickInput.addEventListener('keyup', () => {
	document.getElementById('clickColorTest').style.backgroundColor = HTMLClickInput.value;
	document.cookie = `pointerColor=${HTMLClickInput.value}; path=/`;
})