import { Mongoose, SchemaType, SchemaTypes } from 'mongoose';

'use strict'

const mongoose =  require('mongoose');
const bodyTemperature =  new mongoose.Schema({

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
    } , 
    device:{
        type:Schema.Types.ObjectId,
        ref:'Device'
    }
});

module.exports =  mongoose.model ('BodyTemperature', bodyTemperature);