'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ch4 = new Schema({
    deviceId: {
        type: Schema.Types.ObjectId,
        required:true
    },
    value:{
        type:Number,
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
},{collection: "type-ch4"});

module.exports =  mongoose.model ('type-ch4', ch4);