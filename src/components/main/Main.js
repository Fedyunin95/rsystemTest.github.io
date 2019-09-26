import InputValidator from "Modules/InputValidator.js";

function mainPageHandler(mainPage) {
  const serchForm = mainPage.querySelector(".js-search-form");
  serchForm.setAttribute("novalidate", true);
  const inputEmailElements = serchForm.querySelectorAll(".js-form-input");

  serchForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const isValid = validateForm(inputEmailElements);
      const url = serchForm.action;

        if (isValid) {
            const data = new FormData(serchForm);
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

export default mainPageHandler;