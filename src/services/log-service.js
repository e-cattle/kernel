'use strict'

const log = function () {
  const original = Error.prepareStackTrace

  let callerfile

  try {
    var err = new Error()
    var currentfile

    Error.prepareStackTrace = function (_err, stack) { return stack }

    currentfile = err.stack.shift().getFileName()

    while (err.stack.length) {
      callerfile = err.stack.shift().getFileName()

      if (currentfile !== callerfile) break
    }
  } catch (e) { }

  Error.prepareStackTrace = original

  const args = []

  args.push('[' + callerfile.split(/[\\/]/).pop() + ']')

  for (var i = 0; i < arguments.length; i++) { args.push(arguments[i]) }

  console.log(...args)
}

module.exports = log
