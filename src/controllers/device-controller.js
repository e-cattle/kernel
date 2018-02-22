'use strict';

const ValidationContract = require('../validators/fluent-validator');
const deviceRepository = require('../repositories/device-repository');
const contractRepository = require('../repositories/contract-repository');
const sensorTypeRepository = require('../repositories/sensor-type-repository');

const authService = require('../services/auth-service');


/**
 * Cadastra o Device 
 */
exports.create = async(req, res, next) => {
   
    //1) Validacao 

        let contract = new ValidationContract();
        contract.hasMinLen(req.body.name, 3, 'O nome deve conter pelo menos 3 caracteres');
       // contract.isMac(req.body.mac, 'Mac inválido');
    
        if (!contract.isValid()) {
            res.status(400).send(contract.errors()).end();
            return;
        }

       
        // Validar o vetor de sensores (Sensor Type)
        for (let index = 0; index < req.body.sensors.length; index++) {
            let sensor = req.body.sensors[index];
            try {
                let result = await sensorTypeRepository.getBySensorName(sensor.type);
                if(result.length <= 0){

                    let error = {
                        errors:{
                           
                            message: `Sensor Type inválido: ${sensor.type}`,
                            name: 'ValidatorError'
                         }}

                    
                    res.status(400).send(error);
                    return;
                }
            } catch (error) {
                res.status(500).send(error);
                return;
            }
        }
        //2) Cadastro do Dispositivo
        try {

            //Cadastra o Dispositivo
            let devideCreated = await deviceRepository.create({
                name: req.body.name,
                mac: req.body.mac,
                version: req.body.version,
                sensors: req.body.sensors
            });

          //3)  Geração do Token


            //Gera o token valido para o dispositivo
            const token = await authService.generateToken({
                id: devideCreated._id,
                name: devideCreated.name
            
            });
        
            //Envia o token para o dispositivo
            res.status(201).send({
                token: token
               
            });

            return ;
            
        } catch (error) {
            res.status(500).send(error);
            return;
        }

    //     //Cadastra o  Contrato
    //    contractRepository.create({
    //         name:"contrato",
    //         enable:true,
    //         device:devideCreated
    
    //    })
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

/**
 * Autentica o Dispositivo pelo Mac Adress 
 */
exports.authenticate = async(req, res, next) => {
    try {
        //Le o mac do dispositivo e valida se existe
        const device = await deviceRepository.authenticate({
            mac: req.body.mac
        });
        //Envia mensagem de erro se não encontrar dispositivo
        if (!device) {
            res.status(404).send({
                message: 'Dispositivo Inválido ou Bloqueado'
            });
            return;
        }
        //Gera o token valido para o dispositivo
        const token = await authService.generateToken({
            id: device._id,
            name: device.name
         
        });
      
        //Envia o token para o dispositivo
        res.status(201).send({
            token: token,
            data: {
                id: device._id,
                name: device.name
              
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: 'Falha ao processar sua requisição', 
            data:e
        });
    }
};
/**
 * 
 * Atualiza o token a cada novo request
 */
exports.refreshToken = async(req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        const device = await deviceRepository.getById(data.id);

        if (!device) {
            res.status(404).send({
                message: 'Dispositivo não encontrado'
            });
            return;
        }

        const tokenData = await authService.generateToken({
            id: device._id,
            name: device.name
           
        });

        res.status(201).send({
            token: tokenData,
            data: {
                name: device.name
               
            }
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};