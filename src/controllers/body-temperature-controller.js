'use strict';

const ValidationContract = require('../validators/fluent-validator');
const bodyTemperatureRepository = require('../repositories/body-temperature-repository');
const deviceRepository = require('../repositories/device-repository');

const contractRepository = require('../repositories/contract-repository');
const authService = require('../services/auth-service');

/**
 * Cadastra o Temperatura do Corpo 
 */
exports.create = async(req, res, next) => {
   
       
        //2) Cadastro do dado do Sensor de Temperatura
        try {

            //Identificar o Device
            let device =  deviceRepository.findByMac(macDevice);

            //Cadastra o Dispositivo
            let bodyTemperature = await deviceRepository.create({
                uid: req.body.uid,
                value:req.body.value, 
                unity: req.body.unit,
                dataStorage:req.body.dataStorage,
            });

            //Envia o token para o dispositivo
            res.status(201).send();

            return ;
            
        } catch (error) {
            res.status(500).send(error);
            return;
        }

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
