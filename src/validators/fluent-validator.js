'use strict';

let errors = [];

function ValidationContract() {
    errors = [];
}

ValidationContract.prototype.isRequired = (value, message) => {
    if (!value || value.length <= 0)
        errors.push({ 
            message: message,
            name: "ValidatorError"
        });
}

ValidationContract.prototype.hasMinLen = (value, min, message) => {
    if (!value || value.length < min)
        errors.push({ 
            message: message,
            name: "ValidatorError"
        });
}

ValidationContract.prototype.hasMaxLen = (value, max, message) => {
    if (!value || value.length > max)
        errors.push({ 
            message: message,
            name: "ValidatorError"
        });
}

ValidationContract.prototype.isFixedLen = (value, len, message) => {
    if (value.length != len)
        errors.push({ 
            message: message,
            name: "ValidatorError"
        });
}

ValidationContract.prototype.isEmail = (value, message) => {
    var reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
    if (!reg.test(value))
        errors.push({ 
            message: message,
            name: "ValidatorError"
        });
}

//example: 00:27:0e:2a:b9:aa, ...
ValidationContract.prototype.isMac = (value, message) => {
    var reg = new RegExp(/^[0-9a-f]{1,2}([\.:-])(?:[0-9a-f]{1,2}\1){4}[0-9a-f]{1,2}$/);
    if (!reg.test(value))
        errors.push({ 
            message: message,
            name: "ValidatorError"
        });
}


ValidationContract.prototype.errors = () => { 
    return errors; 
}

ValidationContract.prototype.clear = () => {
    errors = [];
}

ValidationContract.prototype.isValid = () => {
    return errors.length == 0;
}

module.exports = ValidationContract;