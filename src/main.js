import { Validators } from "./modules/Regex.js";

class FormManager {
    constructor(form, validationHandler) {
        this.validator = validationHandler;
        this.form = form;
        this.formElements = {
            inputs: form.querySelectorAll('input[type="text"]'),
            firsNameContainer: form.querySelector('.fname-container'),
            lastNameContainer: form.querySelector('.Lname-container'),
            mailContainer: form.querySelector('.mail-container'),
            queryContainer: form.querySelector('.query-container'),
            messageContainer: form.querySelector('.message-container'),
            consentContainer: form.querySelector('.consent-container')
        }
    }
    showError(errContainer){
        errContainer.classList.add('error-active');
    }
    showValid(errContainer){
        errContainer.classList.remove('error-active');
    }
    showSuccessful(){
        const main = document.querySelector('main');
        main.classList.add('toast-is-active');
        setTimeout(()=>{main.classList.remove('toast-is-active')}, 4000)
    }
    validateFirstName(){
        const container = this.formElements.firsNameContainer;
        const firstName = container.querySelector('#firstName');
        firstName.addEventListener('blur', ()=>{
            const value = firstName.value.trim();
            if (value === '')return;
            if (!this.validator.name(value)) {
                this.showError(container);
            }else{
                this.showValid(container);
            }
        })
        firstName.addEventListener('input', ()=>{
            const value = firstName.value.trim();
            if (this.validator.name(value)) {
                this.showValid(container);
            }
        })
    }
    validateLastName(){
        const container = this.formElements.lastNameContainer;
        const lastName = container.querySelector('#lastName');
        lastName.addEventListener('blur', ()=>{
            const value = lastName.value.trim();
            if (value === '')return;
            if (!this.validator.name(value)) {
                this.showError(container);
            } 
        })
        lastName.addEventListener('input', ()=>{
            const value = lastName.value.trim();
            if (this.validator.name(value)) {
                this.showValid(container);
            }
        })
    }
    validateMail(){
        const container = this.formElements.mailContainer;
        const mail = container.querySelector('#email');
        mail.addEventListener('blur', ()=>{
            const value = mail.value.trim();
            if (value === '')return;
            if (!this.validator.email(value)) {
                this.showError(container);
            } 
        })
        mail.addEventListener('input', ()=>{
            const value = mail.value.trim();
            if (this.validator.email(value)) {
                this.showValid(container);
            }
        })
    }
    validateMessage(){
        const container = this.formElements.messageContainer;
        const message = container.querySelector('#message');
        message.addEventListener('blur', ()=>{
            const value = message.value.trim();
            if (value === '')return;
            if (!this.validator.message(value)) {
                this.showError(container);
            } 
        })
        message.addEventListener('input', ()=>{
            const value = message.value.trim();
            if (this.validator.message(value)) {
                this.showValid(container);
            }
        })
    }
    handleSubmit(e){
        e.preventDefault();
        let valid = true;
        // config them selectors, containers, validators to an array so we can loop through to check if all
        //conditions are meet before form submission
        const fields = [
            {
                container: this.formElements.firsNameContainer,
                selector: '#firstName',
                validator: this.validator.name
            },
            {
                container: this.formElements.lastNameContainer,
                selector: '#lastName',
                validator: this.validator.name
            },
            {
                container: this.formElements.mailContainer,
                selector: '#email',
                validator: this.validator.email
            },
            {
                container: this.formElements.messageContainer,
                selector: '#message',
                validator: this.validator.message
            },
            {
                container: this.formElements.consentContainer,
                selector: '#consentCheck',
                validator: this.validator.checkbox,
                isCheckbox: true // special case handling
            },
            {
                container: this.formElements.queryContainer,
                selector: 'input[name="query"]',
                validator: this.validator.radio,
                isRadio: true //special case handling
            }
        ]
        fields.forEach(field=>{
            const {container, selector, validator, isCheckbox, isRadio} = field;
            let value;
            if (isCheckbox) {
                value = container.querySelector(selector).checked;
            } else if(isRadio){
                value = container.querySelectorAll(selector); // nodeList
            } else{
                value = container.querySelector(selector).value.trim();
            }
            let scrolled = false;
            if (!validator(value)) {
                this.showError(container);
                setTimeout(()=>{container.classList.remove('error-active')}, 3000);
                // scroll into view of the invalid field also displaying the error.
                if (!scrolled) {
                    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    scrolled = true;
                }
                valid = false;
            }
        })
        if (valid) {
            this.showSuccessful();
            this.form.reset();
            // after submission scroll to top so the success message can be read.
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }
    keyboardNavigation(){
        document.addEventListener('keydown', (e)=>{
            // const items = [...document.querySelectorAll('.tabItem')], you can use the spread method or the array.from().
            const items = Array.from(document.querySelectorAll('.tabItem')),
            target = e.target,
            index = items.indexOf(target);
            if (!items.includes(target))return; 
            switch (e.key) {
                case 'ArrowDown':
                    {
                        e.preventDefault();
                        const nextIndex = (index + 1) % items.length;
                        items[nextIndex].focus();
                    }
                    break;

                case 'ArrowUp':
                    {
                        e.preventDefault();
                        const prevIndex = (index - 1 + items.length) % items.length;
                        items[prevIndex].focus();
                    }
                    break;
                case 'Enter':
                    {
                        e.preventDefault();
                        const input = target.querySelector('input[type="checkbox"], input[type="radio"]');
                        if (input) {
                            if (input.type === 'checkbox') {
                            input.checked = !input.checked;   // toggle logic
                            } else if (input.type === 'radio') {
                            input.checked = true; // select this radio and auto-uncheck others in the group
                            }
                        }
                        if (target.tagName === 'BUTTON') {
                            this.handleSubmit(e);
                        }
                    }
                    break;
            }

        })
    }
    init(){
        this.validateFirstName();
        this.validateLastName();
        this.validateMail();
        this.validateMessage();
        this.keyboardNavigation();
    }
};
const form = document.querySelector('form');
const validator = new Validators();
const formHandler = new FormManager(form, validator);
formHandler.init();
form.addEventListener('submit', (e)=>{
    formHandler.handleSubmit(e);
})