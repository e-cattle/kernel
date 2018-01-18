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
//     schema: [
//         {
//             type:{
//                 type: String,
//                 required: true
//             }, 
//             descriptor:{
//                 type: String,
//                 required: true
//             },
//             unix:{
//                 type: String,
//                 required: true
//             }

//         }]
// });



const schema = new Schema({
    name: {
        type: String,
        required: true
    },
 
    mac: {
        type: String,
        required: true,  
        index: true,
        unique: true
    }
});

module.exports = mongoose.model('Device', schema);