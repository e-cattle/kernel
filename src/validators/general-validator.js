'use strict'

let errors = []

function Validator () {
  errors = []
}

Validator.prototype.isRequired = (value, message) => {
  if (!value || value.length <= 0) {
    errors.push({
      message: message,
      name: 'ValidatorError'
    })
  }
}

Validator.prototype.hasMinLen = (value, min, message) => {
  if (!value || value.length < min) {
    errors.push({
      message: message,
      name: 'ValidatorError'
    })
  }
}

Validator.prototype.hasMaxLen = (value, max, message) => {
  if (!value || value.length > max) {
    errors.push({
      message: message,
      name: 'ValidatorError'
    })
  }
}

Validator.prototype.isFixedLen = (value, len, message) => {
  if (value.length !== len) {
    errors.push({
      message: message,
      name: 'ValidatorError'
    })
  }
}

Validator.prototype.isEmail = (value, message) => {
  var reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)

  if (!reg.test(value)) {
    errors.push({
      message: message,
      name: 'ValidatorError'
    })
  }
}

// Example: 00:27:0e:2a:b9:aa
Validator.prototype.isMac = (value, message) => {
  var reg = new RegExp(/^[0-9a-f]{1,2}([.:-])(?:[0-9a-f]{1,2}\1){4}[0-9a-f]{1,2}$/)

  if (!reg.test(value)) {
    errors.push({
      message: message,
      name: 'ValidatorError'
    })
  }
}

Validator.prototype.errors = () => {
  return errors
}

Validator.prototype.clear = () => {
  errors = []
}

Validator.prototype.isValid = () => {
  return errors.length === 0
}

module.exports = Validator
