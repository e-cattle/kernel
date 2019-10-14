'use strict';
const jwt = require('jsonwebtoken');
const DeviceRepository = require('../repositories/device-repository');

/*
Gera o token baseado nos dados "data", junto com a chave privada global.SALT_KEY
*/
var generateToken = async (data) => {
  return jwt.sign(data, global.SALT_KEY, { expiresIn: '1d' });
}

exports.generateToken = generateToken;

/**
*  Retorna os dados decodificados inseridos no token
*/
var decodeToken = async (token) => {
  var data = await jwt.verify(token, global.SALT_KEY);
  return data;
}

exports.decodeToken = decodeToken;

/*
valida se o token é valido
*/
exports.authorize = async function (req, res, next) {
  let token = req.body.token || req.query.token || req.headers['x-access-token'];
  let mac = req.body.mac || req.query.mac;

  if (!token || !mac) {
    res.status(401).json({
      message: 'Acesso Restrito'
    });
  } else {
    jwt.verify(token, global.SALT_KEY, function (error, decoded) {
      if (error) {
        res.status(401).json({
          message: 'Token inválido'
        });
      } else {
        let device = decodeToken(token).then((device) => {
          if (mac == device.mac) next();
          else {
            res.status(401).json({
              message: 'MAC não confere com o token: ' + mac + ' | ' + device.mac
            });
          }
        }).catch((err) => {
          res.status(500).json({
            message: `Erro ao extrair o MAC do token: ${err}`
          });
        });
      }
    });
  }
};

/*
renova o token é de um device cadastrado e ativo, quando o token
estiver expirado
*/
exports.renewToken = async function (req, res) {
  var mac = req.body.mac;

  if (!mac) {
    res.status(401).json({
      message: 'O MAC do dispositivo deve ser informado'
    });
    return;
  }

  var device = await DeviceRepository.getByMacEnabled(mac);

  if (!device) {
    res.status(401).json({
      message: 'Dispositivo não encontrado ou não habilitado'
    });
    return;
  }

  var token = await generateToken({
    id: device._id,
    name: device.name,
    mac: device.mac
  });

  res.json({ token: token });
};
