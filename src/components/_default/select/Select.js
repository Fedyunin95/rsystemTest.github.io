import Choices from "choices.js";

export default function Select(SelectBlock) {

	const selectBaseClass = "select"; 
	const selectElement = SelectBlock.querySelector(".js-select");

	const selectChoices = new Choices(selectElement, {
		searchEnabled: false,
		shouldSort: false,
		classNames: {
			containerOuter: selectBaseClass + "__container",
			containerInner: selectBaseClass + "__inner",
			list: selectBaseClass + "__list",
			listSingle: selectBaseClass + "__label",
			listDropdown: selectBaseClass + "__dropdown",
			item: selectBaseClass + "__item",
			itemSelectable: selectBaseClass + "__item_selectable",
			itemChoice: selectBaseClass + "__dropdown-item",
			selectedState: selectBaseClass + "__dropdown-item_selected"
		}
	});

	selectElement.addEventListener("change", function() {
	});

}