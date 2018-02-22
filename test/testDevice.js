//http://www.scotchmedia.com/tutorials/express/authentication/3/01

var should = require('chai').expect
var utils = require('../test/utils');
var Device = require('../src/models/device');
var SensorType = require('../src/models/sensor-type');


describe("#Device#", function () {
    it('Deve salvar um device', function (done) {
        var sensorBodyTemperature = new SensorType({
            name: 'BodyTemperature',
            description: 'Temperatura corporal do animal'
        });
        //Salvando um tipo de Sensor 
        sensorBodyTemperature.save(function (err, sensorTypePersistido) {
           
           //Salvando um dispositivo com array de sensores
           //permitidos e relacionados com o tipo de sensor recem
           //criado 
            var device = new Device(
                {
                    name: "dev 1",
                    mac: "mac 1",
                    version: 1,
                    sensors: [
                        { type:sensorTypePersistido,  descriptor: "body-temperature", unix: "bt-1" },
                        { type:sensorTypePersistido,  descriptor: "body-temperature", unix: "bt-2" }
                    ]
                });

            device.save(done);

        })
    })
})