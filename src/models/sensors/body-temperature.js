'use strict'

const mongoose =  require('mongoose');
const bodyTemperature =  new mongoose.Schema({
    mac:{
        type:String, 
        required:true
    }, 
    uid:{
        type:String,
        required:true
    }, 
    value:{
        type:Number,
        required:true
    },
    unity: {
        type:String,
        required:true
    },
    dateRegister:{
        type:Date,
        default: Date.now,
        required:true
    },
    dataStorage:{
        type:Date,
        required:true
    } 
});

module.exports =  mongoose.model ('BodyTemperature', bodyTemperature);