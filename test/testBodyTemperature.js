var BodyTemperature = require('../src/models/sensors/body-temperature');

describe ("#BodyTemperature#",function (){
    it ('Deve Salvar BodyTemperature', function(done){
        var bt =  new BodyTemperature();
        bt.validate();
        done();
    })
})