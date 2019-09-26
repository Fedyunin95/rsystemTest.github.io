export default function InputValidator(options) {
    const self = this;
    this.element = options.domElement;
    this.errorClass = options.errorClass || "is-invalid";
    this.isValid = true;
    this.tag = this.element.tagName.toLowerCase();
    this.isTyped = "";
    const baseClass = this.element.getAttribute("data-base-class");
    const filledClass = baseClass + "_filled";

    this.isRequired = options.requiredFlag;

    if (typeof this.isRequired === "undefined") {
        this.isRequired = this.element.required;
    }

    if (this.tag == "input") {
        this.type = this.element.type;
        if (this.type == "text" || this.type == "email" || this.type == "tel" || this.type == "number" || this.type == "password" || this.type == "search" || this.type == "url") {
            this.category = "text-input";
        }
    } else if (this.tag == "textarea") {
        this.category = "text-input";
    } else {
        this.type = "";
    }

    if (this.category == "text-input") {
        this.minlength = this.element.getAttribute("minlength");
        if (this.minlength == "undefined" || this.minlength === null) {
            this.minlength = 0;
        } else {
            this.minlength = parseInt(this.minlength, 10);
        }
        this.element.addEventListener("input", function() {
            self.isTyped = "typed";
            if (this.value.length > 0) {
                self.element.classList.add(filledClass);
            } else {
                self.element.classList.remove(filledClass);
            }
        });

        ["change", "blur"].forEach(function(e) {
            self.element.addEventListener(e, function() {
                if (self.isTyped == "typed") {
                    self.isTyped = true;
                    // self.isValid = undefined;
                }
            });
        });

        ["change", "blur", "input"].forEach(function(e) {
            self.element.addEventListener(e, function() {
                if (self.isTyped === true) {
                    self.validate();
                }
            });
        });
    }

    if (options.isParentError) {
        this.errorElement = this.element.parentElement;
    } else {
        const errorBlockSelector = this.element.getAttribute("data-error-selector");
        this.errorElement = errorBlockSelector ? document.querySelector(errorBlockSelector) : this.element;
    }
}

InputValidator.prototype.setInvalid = function() {
    this.isValid = false;
    this.errorElement.classList.add(this.errorClass);
};

InputValidator.prototype.setValid = function() {
    this.isValid = true;
    this.errorElement.classList.remove(this.errorClass);
};

InputValidator.prototype.validate = function() {
    const self = this;

    if (this.isRequired && this.minlength < 1) {
        this.minlength = 1;
    }

    if (this.category == "text-input") {
        this.value = this.element.value;
        this.valueLength = this.value.length;
        if (this.valueLength < this.minlength && this.isValid) {
            this.setInvalid();
        } else if (this.valueLength >= this.minlength && !this.isValid) {
            this.setValid();
        }
        if (this.type == "email" && this.isValid) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const isEmailValid = re.test(String(self.value).toLowerCase());
            if (!isEmailValid) {
                this.setInvalid();
            }
        }
    } else if ( (this.type == "checkbox" || this.type == "radio") && this.isRequired) {
        if (!this.element.checked && this.isValid) {
            this.setInvalid();
        } else if (this.element.checked && !this.isValid) {
            this.setValid();
        }
    }

    return this.isValid;
};