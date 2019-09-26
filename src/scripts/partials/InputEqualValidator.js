import InputValidator from "./InputValidator.js";

export default function InputEqualValidator(options) {
    const self = this;
    this.basicElement = options.domElement;
    this.isRequired = options.requiredFlag;
    this.elements = [];
    this.elements.push(this.basicElement);
    this.elements = this.elements.concat(Array.prototype.slice.call(document.querySelectorAll(self.basicElement.getAttribute("data-equal-selectors"))));
    this.elementsLength = this.elements.length;
    this.elementsObjects = [];
    const inputOptions = options;

    for (let i = 0, len = this.elementsLength; i < len; i++) {
        inputOptions.domElement = this.elements[i];
        this.elementsObjects.push(new InputValidator(inputOptions));
    }
}

ValidatingInputEqual.prototype.setInvalid = function() {
    this.isValidFlag = false;
    for (let i = 0, len = this.elementsLength; i < len; i++) {
        this.elementsObjects[i].setInvalid();
    }
};

ValidatingInputEqual.prototype.validate = function() {
    let i, len;
    this.isValidFlag = true;

    const basicValue = this.basicElement.value;

    for (i = 1, len = this.elementsLength; i < len; i++) {
        if (this.elements[i].value != basicValue) {
            this.setInvalid();
            return this.isValidFlag;
        }
    }

    if (this.isRequired) {
        for (i = 0, len = this.elementsLength; i < len; i++) {
            const elementIsValid = this.elementsObjects[i].validate();
            if (!elementIsValid) {
                this.isValidFlag = false;
            }
        }
    }

    return this.isValidFlag;
};