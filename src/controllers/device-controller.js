'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/device-repository');
const authService = require('../services/auth-service');


/**
 * Cadastra o Device 
 */
exports.post = async(req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.name, 3, 'O nome deve conter pelo menos 3 caracteres');
    contract.isMac(req.body.mac, 'Mac inválido');
    //TODO: inserir todas validacoes aqui

    // Se os dados forem inválidos
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {

        //Cadastra o Dispositivo
        await repository.create({
            name: req.body.name,
            mac: req.body.mac
           
        });

        //Envia mensagem
        res.status(201).send({
            message: 'Dispositivo Cadastrado!'
        });
    } catch (e) {
        //Envia mensagem de falha
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};

/**
 * Autentica o Dispositivo pelo Mac Adress 
 */
exports.authenticate = async(req, res, next) => {
    try {
        //Le o mac do dispositivo e valida se existe
        const device = await repository.authenticate({
            mac: req.body.mac
        });
        //Envia mensagem de erro se não encontrar dispositivo
        if (!device) {
            res.status(404).send({
                message: 'Dispositivo Inválido'
            });
            return;
        }
        //Gera o token valido para o dispositivo
        const token = await authService.generateToken({
            id: device._id,
            name: device.name,
            mac: device.mac
        });
      
        //Envia o token para o dispositivo
        res.status(201).send({
            token: token,
            data: {
                name: device.name,
                mac: device.mac
            }
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
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

        const device = await repository.getById(data.id);

        if (!device) {
            res.status(404).send({
                message: 'Cliente não encontrado'
            });
            return;
        }

        const tokenData = await authService.generateToken({
            id: device._id,
            name: device.name,
            mac: device.mac
        });

        res.status(201).send({
            token: token,
            data: {
                name: device.name,
                mac: device.mac
            }
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};