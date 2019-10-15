'use strict'

const mongoose = require('mongoose')
const Contract = mongoose.model('Contract')

exports.create = async (data) => {
  var contract = new Contract(data)
  return contract.save()
}

exports.getAll = async () => {
  return Contract.find({})
}

exports.getById = async (id) => {
  return Contract.findById(id)
}
