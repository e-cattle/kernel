'use strict';
const jwt = require('jsonwebtoken');

/*
    Gera o token baseado nos dados "data", junto coma a chave privada global.SALT_KEY
*/
exports.generateToken = async (data) => {
    return jwt.sign(data, global.SALT_KEY, { expiresIn: '1d' });
}
/**
 *  Retorna os dados decodificados inseridos no token  
 */
exports.decodeToken = async (token) => {
    var data = await jwt.verify(token, global.SALT_KEY);
    return data;
}
/*
valida se o token é valido
*/
exports.authorize = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        res.status(401).json({
            message: 'Acesso Restrito'
        });
    } else {
        jwt.verify(token, global.SALT_KEY, function (error, decoded) {
            if (error) {
                res.status(401).json({
                    message: 'Token Inválido'
                });
            } else {
                next();
            }
        });
    }
};



/*
valida se o token é valido e se Device tem permissão sobre o Schema
*/
exports.authorize = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        res.status(401).json({
            message: 'Acesso Restrito'
        });
    } else {
        jwt.verify(token, global.SALT_KEY, function (error, decoded) {
            if (error) {
                res.status(401).json({
                    message: 'Token Inválido'
                });
            } else {
                //Verifica se Dispositivo tem permissão.

                devide



                next();
            }
        });
    }
};

exports.deviceValidade =  function (){
     
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
                        
                        return error;  //retorna o primeiro que falhar e não uma lista com todos 
                  
                }
            } catch (error) {
                //erro de execucao da busca por sensor
                return error; 
            }
        }
}