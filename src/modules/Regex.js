export function Validators(){};
Validators.prototype = {
    name: v => /^[a-zA-Z]{2,}$/.test(v),
    email: v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v),
    message: v => v.trim().length >= 10,
    radio: v => [...v].some(r => r.checked),
    checkbox: v => v === true
}