'use strict'

const mongoose = require('mongoose')
const Application = mongoose.model('Application')

exports.save = async (data) => {
  if (data.code) {
    await Application.findOneAndUpdate({ code: data.code }, data)

    return Application.find({ code: data.code })
  } else {
    return (new Application(data)).save()
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
  const res = await Application.findByIdAndUpdate({ _id: id }, { enable: true })
  return res
}

exports.disableById = async (id) => {
  const res = await Application.findByIdAndUpdate({ _id: id }, { enable: false })
  return res
}

exports.removeById = async (id) => {
  const res = await Application.findByIdAndDelete({ _id: id })
  return res
}
