'use strict';
const mongoose = require('mongoose');
const Contract = mongoose.model('Contract');

exports.create = async(data) => {
    var contract = new Contract(data);
    return await contract.save();
}


exports.getAll = async() => {
    return await Contract.find({});
}

exports.getById = async(id) => {
    return await Contract.findById(id);
}