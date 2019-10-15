'use strict'

const mongoose = require('mongoose')
const Sensor = mongoose.model('Sensor')

exports.create = async (data) => {
  return (new Sensor(data)).save()
}

exports.getAll = async () => {
  return Sensor.find({})
}

exports.getById = async (id) => {
  return Sensor.findById(id)
}

exports.getBySensorName = async (name) => {
  const res = await Sensor.find({ name: name })
  return res
}
