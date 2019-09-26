import Header from "components/_default/header/Header.js";
import Login from "components/login/Main.js";
import MainPage from "components/main/Main.js";

document.addEventListener("DOMContentLoaded", function() {

	const header = document.querySelector(".js-header");
	const popup = document.querySelector(".js-popup");
	const mainPage = document.querySelector(".js-main-page");

	if (header) {
		new Header(header, popup);
	}

	if (popup) {
		new Login(popup);
	}

	if (mainPage) {
		new MainPage(mainPage);
	}

});