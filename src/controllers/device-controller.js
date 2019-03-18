'use strict';

const fetch = require('node-fetch');
const axios = require('axios');

const ValidationContract = require('../validators/fluent-validator');
const SensorTypeValidator = require('../validators/sensor-type-validator');
const deviceRepository = require('../repositories/device-repository');
const configRepository = require('../repositories/config-repository');
const contractRepository = require('../repositories/contract-repository');
const authService = require('../services/auth-service');
const infoService = require('../services/info-service');

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
            devices: deviceCreated._id,
            sensors: deviceCreated.sensors
        });
        
        deviceCreated.contractDate = contractCreated.date;
        //deviceCreated.contractId = contractCreated._id;
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

exports.syncDevices = async(req, res, next) => {
    try{
        let errors = "";
        let macaddress = await infoService.getMacAddress();
        let devices = await deviceRepository.getAllUnsynced();
        let config = await configRepository.getConfig();
        if(devices.length <= 0) res.status(200).send("Todos os dispositivos sincronizados.<br>");
        
        for (let i = 0; i < devices.length; i++) {
            
            let device = devices[i];
            device.kernelMac = macaddress;
            let body = { token: config.token, device: device, kernelMac: macaddress }
            console.log(`Sincronizando dispositivo: ${device.name}`)
            let response = await axios.post(`${config.apiAddressProtocol}${config.apiAddress}devices-sync/`, body);
            if(!response.data.syncedAt) errors += `Erro ao sincronizar dispositivo: ${device.name}`
            else setSynced(device.mac);
        }

        if(errors == "") res.send({message: "Todos os dispositivos foram sincronizados"});
        else res.status(500).send({errors: errors});
        
        return;

    }catch(e){
        res.status(500).send("Erro ao sincronizar devices");
        console.log(e);
    }
}

exports.setSynced =  async (req, res, next)=>{
    if(!req.params.mac){
        res.status(401).json({message: "MAC não fornecido"});
        return;
    }else{
        try {
            await setSynced(req.params.mac);
            res.send("Ok")
        } catch (error) {
            res.status(500).send("Erro ao atualizar device")            
        }

    }
   
};

async function setSynced(mac){
    try{
        let device = await deviceRepository.setSyncedByMac(mac);
        if (!device){
            throw "Erro ao atualizar dispositivo: " + mac;
        }
        return device;
    }catch(e){
        throw e;
    }
}

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