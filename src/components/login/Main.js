import InputValidator from "Modules/InputValidator.js";

function popupHandler(popup) {
	const closeBtn = popup.querySelector(".js-close-popup");
	const loginForm = popup.querySelector(".js-popup-form");
	loginForm.setAttribute("novalidate", true);

	const inputEmailElements = popup.querySelectorAll(".js-form-input");

	closeBtn.addEventListener("click", () => {
		popup.classList.remove("popup_active");
	})

	loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const isValid = validateForm(inputEmailElements);
        const url = loginForm.action;

        if (isValid) {
            const data = new FormData(loginForm);
            data.append("ajax", "Y");
            makeRequest(url, data);
        }
    });
}

function makeRequest(url, data) {
    fetch(url, {
        method: "POST",
        body: data
    }).then(function(response) {
        if (response.ok) {
            return response.blob();
        }

        throw new Error("Network response was not ok.");
    }).then(function() {
        // handleResponse();
    });
}

 function validateTextInputs(inputsValidators) {
    let isValid = true;

    if (Array.isArray(inputsValidators)) {
        for (let i = 0, len = inputsValidators.length; i < len; i++) {
            const isFormElementValid = inputsValidators[i].validate();
            if (!isFormElementValid) {
                isValid = false;
            }
        }
    } else {
        const isFormElementValid = inputsValidators.validate();
        if (!isFormElementValid) {
            isValid = false;
        }
    }

    return isValid;
}


function validateForm(inputEmailElements) {
    let isValid = true;

    const inputEmailInvalidClass = "error";

    for (var i = 0, len = inputEmailElements.length; i < len; i++) {
        
        const inputEmailValidator = new InputValidator({
            "domElement": inputEmailElements[i],
            "requiredFlag": inputEmailElements[i].getAttribute("required"),
            "errorClass": inputEmailInvalidClass
        });

        const isTextInputsValid = validateTextInputs(inputEmailValidator);

        if (!isTextInputsValid) {
            isValid = false;
        }

    }


    return isValid;
}

export default popupHandler;