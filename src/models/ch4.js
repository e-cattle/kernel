'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ch4 = new Schema({
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
        required:true
    },
    unity: {
        type:String,
        default: "ppm",
        required:true
    },
    dateRegister:{
        type:Date,
        default: Date.now,
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
},{collection: "type-ch4"});

module.exports =  mongoose.model ('type-ch4', ch4);