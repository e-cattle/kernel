'use strict'

const mongoose = require('mongoose')
// const moment = require('moment')

var capitalize = (str) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

exports.countByType = async (req, res, next) => {
  try {
    const models = mongoose.modelNames()

    var types = []

    for (var i = 0; i < models.length; i++) {
      if (models[i].substr(0, 4) !== 'type') continue

      const name = models[i].substr(5)

      const label = name.length > 4 ? capitalize(name.replace(/-/g, ' ')) : name.toUpperCase()

      const Sensor = mongoose.model(models[i])

      const total = await Sensor.count({})

      if (total === 0) continue

      types.push({
        name: name,
        label: label,
        total: total
      })
    }

    res.status(201).send(types)
  } catch (err) {
    res.status(500).json({ message: `${err}` })
  }
}
