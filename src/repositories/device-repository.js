'use strict';
const mongoose = require('mongoose');
const Device = mongoose.model('Device');

exports.create = async(data) => {
    var device = new Device(data);
    await device.save();
}

exports.getById = async(id) => {
    const res = await Device.findById(id);
    return res;
}

exports.getByMac = async(mac) => {
    const res = await Device.findAll({mac:mac});
    return res;
}