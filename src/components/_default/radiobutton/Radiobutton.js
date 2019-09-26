
export default function RadioButton(radiobtn) {
	const	baseClass = radiobtn.getAttribute("base-class"),
			check = radiobtn.querySelector("." + baseClass + " .js-radiobtn-check"),
			input = radiobtn.querySelector("." + baseClass + " .js-radiobtn__input"),
			label = radiobtn.querySelector("." + baseClass + " .js-radiobtn__label");

	label.addEventListener("click", radioClick);
	check.addEventListener("click", radioClick);


	function radioClick() {
		var inputChecked = input.checked,
			radiobtns = document.querySelectorAll("." + baseClass + " .js-radiobtn-check");

		uncheckedAll(radiobtns, function() {
			check.classList.add("checked");
		});
					
		if ((inputChecked === undefined) || (!inputChecked)) {
			inputChecked = true;
		} else {
			inputChecked = false;
		}
	}

	function uncheckedAll(radiobtns, callback) {
		for (let i = 0, len = radiobtns.length; i < len; i++) {
			radiobtns[i].classList.remove("checked");
		}

		callback();
	}
}