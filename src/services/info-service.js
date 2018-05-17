'use strict';

const isOnline = require('is-online');
const macaddress = require('macaddress');

exports.isOnline = async (to, subject, body) => {
    return await isOnline();
}

exports.getMacAddress = () =>{
    return new Promise((resolve, reject)=>{
        macaddress.one((err, mac) =>{
            resolve(mac);
        });
    });
}