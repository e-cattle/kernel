'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const schema = new Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     branch: {
//         type: String,
//         required: true
//     },

//     model: {
//         type: String,
//         required: true
//     },

//     mac: {
//         type: String,
//         required: true,
        // index: true,
            // unique: true
//     },
    // schema: [
    //     {
    //         type:{
    //             type: String,
    //             required: true
    //         }, 
    //         descriptor:{
    //             type: String,
    //             required: true
    //         },
    //         unix:{
    //             type: String,
    //             required: true
    //         }

    //     }]
// });



const device = new Schema({
    name: {
        type: String,
        required: true
    },

    enable:{
        type: Boolean,
        default:true
       
    },
 
    mac: {
        type: String,
        required: true,  
        index: true,
        unique: true
    }, 
    // version:{
    //         type: Number,
    //         required:true
    // }, 
    sensors: [
        {
            type:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'SensorType',
                required: true
            }, 
            descriptor:{
                type: String,
                required: true
            },
            unix:{
                type: String,
                required: true
            }

        }]
       

});

module.exports = mongoose.model('Device', device);