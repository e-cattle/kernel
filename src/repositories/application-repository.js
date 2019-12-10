'use strict'

const mongoose = require('mongoose')
const Application = mongoose.model('Application')

exports.save = async (data) => {
  if (data._id) {
    await data.save()
    return Application.findById(data._id)
  } else {
    return new Application(data).save()
  }
}

exports.create = async (data) => {
  return (new Application(data)).save()
}

exports.getAll = async () => {
  return Application.find({})
}

exports.getById = async (id) => {
  return Application.findById(id)
}

exports.enableById = async (id) => {
  const res = await Application.findById(id)
  return res.update({ enable: true })
}

exports.disableById = async (id) => {
  const res = await Application.findById(id)
  return res.update({ enable: false })
}