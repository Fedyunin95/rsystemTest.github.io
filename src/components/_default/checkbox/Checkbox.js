export default function CheckBox(checkBoxBlock) {
	const checkElement = checkBoxBlock.querySelector(".js-checkbox-check"),
		input =  checkBoxBlock.querySelector(".js-checkbox__input"),
		label = checkBoxBlock.querySelector(".js-checkbox__label");

	label.addEventListener("click", checkedCheckBox);

	checkElement.addEventListener("click", checkedCheckBox);

	function checkedCheckBox() {
		const checkedAttr = input.attributes;

		checkElement.classList.toggle("checked");

		if ((checkedAttr.checked === undefined) || (checkedAttr.checked === false)) {
			checkedAttr.checked = true;
		} else {
			checkedAttr.checked = false;
		}
	}
}
