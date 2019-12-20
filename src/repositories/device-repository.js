'use strict'

const __ = require('../services/log-service')

const mongoose = require('mongoose')
const Device = mongoose.model('Device')
mongoose.model('Contract')

exports.save = async (data) => {
  if (data._id) {
    await data.save()
    return Device.findById(data._id)
  } else {
    return new Device(data).save()
  }
}

exports.create = async (data) => {
  var device = new Device(data)
  return device.save()
}

exports.update = async (data) => {
  await Device.update(data)
  return Device.findById(data._id)
}

exports.getAll = async () => {
  const res = await Device.find({ delete: false })
  return res
}

exports.getById = async (id) => {
  const res = await Device.findById(id)
  return res
}

exports.getByMac = async (mac) => {
  const res = await Device.findOne({
    mac: mac
  })
  return res
}
/*
exports.getAllUnsynced = async () => {
  return Device.find().or([{ syncedAt: undefined }, { hasToSync: true }])
}

exports.setSyncedByMac = async (mac) => {
  const device = await Device.find({ mac: mac })

  if (device) {
    return Device.findOneAndUpdate({ mac: mac }, { $set: { syncedAt: new Date(), hasToSync: false } })
  } else {
    throw Error('Device not found!')
  }
}
*/
exports.getByMacEnabled = async (mac) => {
  const res = await Device.findOne({
    mac: mac,
    enable: true,
    delete: false
  })
  return res
}

exports.enableByMac = async (mac) => {
  const res = await Device.findOneAndUpdate(
    { mac: mac, delete: false },
    { enable: true }
  )
  return res
}

exports.disableByMac = async (mac) => {
  const res = await Device.findOneAndUpdate(
    { mac: mac, delete: false },
    { enable: false }
  )
  return res
}

exports.authenticate = async (data) => {
  const res = await Device.findOne({
    mac: data.mac,
    enable: true,
    delete: false
  })
  return res
}

exports.deleteByMac = async (mac) => {
  __('Trying to delete ' + mac + '...')
  const res = await Device.findOneAndUpdate(
    { mac: mac },
    { enable: false, delete: true }
  )
  return res
}
