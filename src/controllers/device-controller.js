'use strict';

const ValidationContract = require('../validators/fluent-validator');
const SensorTypeValidator = require('../validators/sensor-type-validator');
const deviceRepository = require('../repositories/device-repository');
const contractRepository = require('../repositories/contract-repository');
const authService = require('../services/auth-service');

/**
* Cadastra ou Altera o Device 
*/
exports.save = async(req, res, next) => {
    
    //1) Validacao 
    
    let contract = new ValidationContract();
    let sensorTypeValidator = new SensorTypeValidator();   
    
    try{
        
        sensorTypeValidator.validadeProperties(req.body);
        
        if (!sensorTypeValidator.isPropertiesValid()) {
            res.status(400).json(sensorTypeValidator.propertieErrors());
            return;
        }
        
        contract.hasMinLen(req.body.name, 3, 'O nome deve conter pelo menos 3 caracteres');
        contract.isMac(req.body.mac, 'Mac inválido');
        sensorTypeValidator.validadeSensors(req.body.sensors);
        
        if (!contract.isValid() || !sensorTypeValidator.isValid()) {
            console.log("Erro");
            res.status(400).json(contract.errors().concat(sensorTypeValidator.errors()));
            return;
        }
        
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Erro na validação dos dados sensoriais: Erro na validação dos tipos sensoriais"});
    }
    
    //2) Cadastra ou altera o dispositivo
    try {
        
        //Localiza o disposito caso já exista
        let device =  await deviceRepository.getByMac(req.body.mac);
        
        //senao existe cria um novo
        if (!device){
            device = {};
            device.version = 1;
            device.mac = req.body.mac;
        }else { //se existe
            //Pega a versão atual e gera uma nova
            device.version =  device.version + 1;
        }
        
        //Atualizando com os dados HTTP
        device.name = req.body.name;
        device.sensors= req.body.sensors;
        
        //Cadastra o Dispositivo
        let deviceCreated = await deviceRepository.create(device);
        
        //3)  Geração do Token
        //Gera o token valido para o dispositivo
        const token = await authService.generateToken({
            id: deviceCreated._id,
            name: deviceCreated.name,
            mac: deviceCreated.mac
        });
        
        //4) Gera o Contrato
        let contractCreated = await contractRepository.create({
            name: deviceCreated.name,
            mac: deviceCreated.mac,
            version: deviceCreated.version,
            sensors: deviceCreated.sensors
        });
        
        //Envia o novo token para o dispositivo
        res.status(201).send({
            token: token
        });
        
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