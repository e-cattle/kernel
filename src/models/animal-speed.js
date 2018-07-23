'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const animalSpeed = new Schema({
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
        max: 16,
        validate: /^\d{0,2}(\.\d{1,2})?$/,
        required:true
    },
    unity: {
        type:String,
        default: "m/s",
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
},{collection: "type-animal-speed"});

module.exports =  mongoose.model ('type-animal-speed', animalSpeed);