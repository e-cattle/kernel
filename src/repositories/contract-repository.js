'use strict';
const mongoose = require('mongoose');
const Contract = mongoose.model('Contract');

exports.create = async(data) => {
    var contract = new Contract(data);
    await contract.save();
}


exports.getAll = async() => {
    const res = await Contract.find({});
    return res;
}

exports.getById = async(id) => {
    const res = await Contract.findById(id);
    return res;
}