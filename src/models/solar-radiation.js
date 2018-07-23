'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const solarRadiation = new Schema({
    uid:{
        type:String,
        required:true,
        unique: true
    }, 
    mac:{
        type:String,
        required:true
    },
    value:{
        type:Number,
        min: 0,
        max: 1500,
        validate: /^\d{0,4}?$/,
        required:true
    },
    unity: {
        type:String,
        default: "W/m2",
        required:true
    },
    dateRegister:{
        type:Date,
        required:true
    },
    dataStorage:{
        type:Date,
        default: Date.now,
        required:true
    },
    syncedAt:{
        type: Date        
    },
},{collection: "type-solar-radiation"});

module.exports =  mongoose.model ('type-solar-radiation', solarRadiation);