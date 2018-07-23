'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gateOpened = new Schema({
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
        type:Boolean,
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
},{collection: "type-gate-opened"});

module.exports =  mongoose.model ('type-gate-opened', gateOpened);