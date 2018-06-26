'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const geographicCoordinate = new Schema({
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
        altitude:{
            type:Number,
            required:false
        },
        latitude:{
            type:String,
            required:false
        },
        longitude:{
            type:String,
            required:false
        }
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
},{collection: "type-geographic-coordinate"});

module.exports =  mongoose.model ('type-geographic-coordinate', geographicCoordinate);