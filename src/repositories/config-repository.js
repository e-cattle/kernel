'use strict';
const mongoose = require('mongoose');
const Config = mongoose.model('Config');

exports.save = async (data) => {
    if(data._id) return update(data);
    else return create(data);
}

async function create (data) {
    var config = new Config(data);
    return await config.save();
}

async function update (data) {
    return await Config.update({_id: data._id}, data);
}

exports.getConfig = async () => {
    let configs = await Config.find({});
    return configs[0];
}