'use strict';

const mongoose = require('mongoose');


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



const device = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'porque sem nome?']
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
    version:{
            type: Number,
            required:true
          
    }, 
    sensors: [
        
        {
           
            type:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'SensorType'
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

device.path('sensors').validate(function(v) {
    return v.length > 0;
  });


module.exports = mongoose.model('Device', device);