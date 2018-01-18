'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const app = express();
const router = express.Router();

// Connecta ao banco
mongoose.connect(config.connectionString);

// Carrega os Models
const Device = require('./models/device');

// Carrega as Rotas
const indexRoute = require('./routes/index-route');
const deviceRoute = require('./routes/device-route');

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


module.exports = app;