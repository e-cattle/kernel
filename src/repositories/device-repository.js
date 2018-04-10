'use strict';
const mongoose = require('mongoose');
const Device = mongoose.model('Device');
const Contract = mongoose.model('Contract');

exports.save = async(data) => {
    if(data._id){
        await Device.update(data);
        return await Device.findById(data._id);
    }
    else return await new Device(data).save();
}

exports.create = async(data) => {
    var device = new Device(data);
    return await device.save();
}

exports.update = async(data) => {
    await Device.update(data);
    return await Device.findById(data._id);
}

exports.getAll = async() => {
    const res = await Device.find({}, "name description branch model mac enable version sensors");
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

exports.getAllUnsynced = async() => {
    return await Device.find().or([{ syncedAt: undefined }, { hasToSync: true }]);
}

exports.setSyncedByMac = async(mac) => {
    return await Device.findOneAndUpdate( {mac: mac}, {syncedAt: new Date(), hasToSync: false} );
}

exports.getByMacEnabled = async(mac) => {
    const res = await Device.findOne({
        mac: mac,
        enable: true
    });
    return res;
}

exports.enableByMac = async(mac) => {
    const res = await Device.findOneAndUpdate(
        {mac: mac},
        {enable: true}
    );
    return res;
}

exports.disableByMac = async(mac) => {
    const res = await Device.findOneAndUpdate(
        {mac: mac},
        {enable: false}
    );
    return res;
}

exports.authenticate = async(data) => {
    const res = await Device.findOne({
        mac: data.mac,
        enable:true
    });
    return res;
}