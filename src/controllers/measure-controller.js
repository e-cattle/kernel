'use strict';

const ValidationContract = require('../validators/fluent-validator');
const bodyTemperatureRepository = require('../repositories/body-temperature-repository');
const deviceRepository = require('../repositories/device-repository');

const contractRepository = require('../repositories/contract-repository');
const authService = require('../services/auth-service');


exports.create = async(req, res, next) => {
   
       
       //Le os dados do device e distribui para os sensores

};


exports.getAll =  async (req, res, next)=>{

    try{
            const devices = await deviceRepository.getAll();
            if (!devices){
               res.status(404).send({message:'Dipositivos não encontrados'});
               return;
            }
            res.status(200).send (devices);
    }catch(e){
            res.status(500).send({message:'Falha na requisição', data: e});
    }
};
