'use strict';
const mongoose = require('mongoose');
const Device = mongoose.model('Device');

exports.create = async(data) => {
    var device = new Device(data);
   return await device.save();

}


exports.getAll = async() => {
    const res = await Device.find({}, "name  mac enable version");
    return res;
}

exports.getById = async(id) => {
    const res = await Device.findById(id);
    return res;
}

exports.getByMac = async(mac) => {
    const res = await Device.findOne({
        mac: mac
    });
    return res;
}


exports.authenticate = async(data) => {
    const res = await Device.findOne({
        mac: data.mac,
        enable:true
    });
    return res;
}