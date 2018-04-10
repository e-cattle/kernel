'use strict';

const ValidationContract = require('../validators/fluent-validator');
const SensorTypeValidator = require('../validators/sensor-type-validator');
const deviceRepository = require('../repositories/device-repository');
const contractRepository = require('../repositories/contract-repository');
const authService = require('../services/auth-service');

async function validade(device){
    try{
        let contract = new ValidationContract();
        let sensorTypeValidator = new SensorTypeValidator();

        sensorTypeValidator.validadeProperties(device);
        
        if (!sensorTypeValidator.isPropertiesValid()) return sensorTypeValidator.propertieErrors();
        
        contract.hasMinLen(device.name, 3, 'O nome deve conter pelo menos 3 caracteres');
        contract.isMac(device.mac, 'Mac inválido');
        sensorTypeValidator.validadeSensors(device.sensors);
        
        if (!contract.isValid() || !sensorTypeValidator.isValid()) return contract.errors().concat(sensorTypeValidator.errors());

        return;
        
    }catch(err){
        return err;
        throw err;
    }
}

/**
* Cadastra ou Altera o Device 
*/
exports.save = async(req, res, next) => {
    
    try {
        
        //Localiza o disposito caso já exista
        let device =  await deviceRepository.getByMac(req.body.mac);
        
        //senao existe cria um novo
        if (!device){
            device = req.body;
            device.version = 1;
        }else { //se existe
            //Pega a versão atual e gera uma nova
            device.version =  device.version + 1;
            device.sensors = req.body.sensors;
            device.hasToSync = true;
        }

        //Validação
        let errors = await validade(device);
        if(errors){
            res.status(401).json({ message: errors })
            return;
        }
        
        //Cadastra o Dispositivo
        let deviceCreated = await deviceRepository.save(device);
        
        // Geração do Token
        //Gera o token valido para o dispositivo
        const token = await authService.generateToken({
            id: deviceCreated._id,
            name: deviceCreated.name,
            mac: deviceCreated.mac
        });
        
        // Gera o Contrato
        let contractCreated = await contractRepository.create({
            name: deviceCreated.name,
            mac: deviceCreated.mac,
            version: deviceCreated.version,
            sensors: deviceCreated.sensors
        });
        
        deviceCreated.contractDate = contractCreated.date;
        deviceCreated.contractId = contractCreated._id;
        await deviceRepository.save(deviceCreated);
        
        //Envia o novo token para o dispositivo
        res.status(201).send({
            token: token
        });
        
        return ;
        
    } catch (error) {
        res.status(500).send(error);
        throw error;
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

exports.getAllUnsynced =  async (req, res, next)=>{
    try{
        const devices = await deviceRepository.getAllUnsynced();
        if (!devices){
            res.status(404).send({message:'Dipositivos não encontrados'});
            return;
        }
        res.status(200).send (devices);
    }catch(e){
        res.status(500).send({message:'Falha na requisição', data: e});
    }
};

exports.setSynced =  async (req, res, next)=>{
    if(!req.params.mac){
        res.status(401).json({message: "MAC não fornecido"});
        return;
    }
    try{
        let mac = req.params.mac;
        let device = await deviceRepository.setSyncedByMac(mac);
        if (!device){
            res.status(404).json({message:'Dipositivo não encontrado'});
            return;
        }
        res.status(200).json(device);
    }catch(e){
        res.status(500).json({message:'Falha na requisição', data: e});
    }
};

exports.enable =  async (req, res, next)=>{
    if(!req.params.mac){
        res.status(401).json({message: "MAC não fornecido"});
        return;
    }
    try{
        const mac = req.params.mac;
        const device = await deviceRepository.enableByMac(mac);
        if (!device){
            res.status(404).json({message:'Dipositivo não encontrado'});
            return;
        }
        res.status(200).json(device);
    }catch(e){
        res.status(500).json({message:'Falha na requisição', data: e});
    }
};

exports.disable =  async (req, res, next)=>{
    if(!req.params.mac){
        res.status(401).json({message: "MAC não fornecido"});
        return;
    }
    try{
        const mac = req.params.mac;
        const device = await deviceRepository.disableByMac(mac);
        if (!device){
            res.status(404).json({message:'Dipositivo não encontrado'});
            return;
        }
        res.status(200).json(device);
    }catch(e){
        res.status(500).json({message:'Falha na requisição', data: e});
    }
};