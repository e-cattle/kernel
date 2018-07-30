'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const soilWaterPotencial = new Schema({
    uid:{
        type:String,
        required:true,
        unique: true
    },
    value:{
        type:Number,
        min: 0,
        max: 100,
        validate: /^\d{0,3}?$/,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    resource: {
        type:String,
        required:false
    },
    dataStorage:{
        type:Date,
        default: Date.now,
        required:true
    },
    syncedAt:{
        type: Date        
    },
},{collection: "type-soil-water-potencial"});

module.exports =  mongoose.model ('type-soil-water-potencial', soilWaterPotencial);