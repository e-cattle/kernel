'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();

// Entity Models
const Device = require('./models/device');
const Constract = require('./models/contract');
const Config = require('./models/config');

// Sensors Models
const Accelerometer = require('./models/sensors/accelerometer');
const AirTemperature = require('./models/sensors/air-temperature');
const AnimalSpeed = require('./models/sensors/animal-speed');
const AnimalWeight = require('./models/sensors/animal-weight');
const BlackGlobeTemperature = require('./models/sensors/black-globe-temperature');
const BodyTemperature = require('./models/sensors/body-temperature');
const CH4 = require('./models/sensors/ch4');
const CO2 = require('./models/sensors/co2');
const DewPointTemperature = require('./models/sensors/dew-point-temperature');
const DryBulbTemperature = require('./models/sensors/dry-bulb-temperature');
const GateOpened = require('./models/sensors/gate-opened');
const GDOP = require('./models/sensors/gdop');
const GeographicCoordinate = require('./models/sensors/geographic-coordinate');
const Gyroscope = require('./models/sensors/gyroscope');
const HeartRate = require('./models/sensors/heart-rate');
const Magnetometer = require('./models/sensors/magnetometer');
const PH = require('./models/sensors/ph');
const Precipitation = require('./models/sensors/precipitation');
const RelativeHumidity = require('./models/sensors/relative-humidity');
const RespiratoryFrequency = require('./models/sensors/respiratory-frequency');
const RetalTemperature = require('./models/sensors/retal-temperature');
const SoilMoisture = require('./models/sensors/soil-moisture');
const SoilNitrogen = require('./models/sensors/soil-nitrogen');
const SoilTemperature = require('./models/sensors/soil-temperature');
const SoilWaterPotencial = require('./models/sensors/soil-water-potencial');
const SolarRadiation = require('./models/sensors/solar-radiation');
const WaterTemperature = require('./models/sensors/water-temperature');
const WetBulbTemperature = require('./models/sensors/wet-bulb-temperature');
const WindSpeed = require('./models/sensors/wind-speed');

// Carrega as Rotas
const indexRoute = require('./routes/index-route');
const deviceRoute = require('./routes/device-route');
const measureRoute = require('./routes/measure-route');
const infoRoute = require('./routes/info-route');
const totemRoute = require('./routes/totem-route');

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
app.use('/totem', totemRoute);

module.exports = app;
