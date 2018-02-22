'use strict';
const mongoose = require('mongoose');
const SensorType = mongoose.model('SensorType');

exports.create = async(data) => {
    var device = new SensorType(data);
   return await device.save();
}

exports.getAll = async() => {
    const res = await SensorType.find({}, "name  mac enable version");
    return res;
}

exports.getById = async(id) => {
    const res = await SensorType.findById(id);
    return res;
}

exports.getBySensorName = async(name) => {
    const res = await SensorType.find({name: name});
    return res;
}