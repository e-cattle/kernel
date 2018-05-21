'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const app = express();
const router = express.Router();

// Connecta ao banco
mongoose.connect(config.db.development, {useMongoClient: true});
mongoose.Promise = Promise;

// Carrega os Models
const Device = require('./models/device');
const Constract = require('./models/contract');
const Config = require('./models/config');
const BodyTemperature = require('./models/body-temperature');

// Carrega as Rotas
const indexRoute = require('./routes/index-route'); //Rotas da pagina inicial
const deviceRoute = require('./routes/device-route'); //Cadastro de Dispositivos
const measureRoute = require('./routes/measure-route'); //Cadastro de dados dos Sensores
const infoRoute = require('./routes/info-route'); //Rota para envio de infromações sobre o kernel

//Conversor de Json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Habilita o CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

//Registrando as rotas
app.use('/', indexRoute);
app.use('/devices', deviceRoute);
app.use('/measures', measureRoute);
app.use('/info', infoRoute);

module.exports = app;