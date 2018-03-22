'use strict';

let errors = [];
let propertieErrors = [];

function SensorTypeValidator() {
    errors = [];
    propertieErrors = [];
}

function getTypeSensors (){
    //importando mongoose
    var mongoose = require('mongoose');
    //lendo todas as collections crias pelo mongoose
    var collections = mongoose.connections[0].collections;
    var names = [];
    //Filtrando as collection em array com as collection que iniciam com o 
    //prefixo 'type-'
    Object.keys(collections).forEach(function(k) {
        if (k.indexOf("type-")==0){
            names.push(k);
        }
    });
    
    return names;
}

SensorTypeValidator.prototype.validadeMeasures = (sensors) => {
    let validCollections = getTypeSensors();
    
    // Validar o vetor de sensores vindo no json requestm(Sensor Type)
    for (let index = 0; index < sensors.length; index++) {
        let sensor = sensors[index];
        
        try {
            //Valida se o Json tem os sensores validos (função contains)
            let found =  false;
            for (let i=0 ; i< validCollections.length ; i++ ){
                if (sensor.type == validCollections[i]){
                    found= true;
                    break;
                }
            }
            //Resposta quando não encontra ou dá algum erro
            if(!found){
                // Resposta quando não encontra o tipo informado na coleção valida
                errors.push({
                    message: `Sensor Type inválido: ${sensor.type}`,
                    name: 'ValidatorError'
                });
            }
        } catch (error) {
            throw error;
        }
    }
}

SensorTypeValidator.prototype.validadeProperties = (obj) => { 
    if(!('name' in obj)){
        propertieErrors.push({
            message: `Propriedade name não encontrada`,
            name: 'PropertiesError'
        });
    }
    if(!('description' in obj)){
        propertieErrors.push({
            message: `Propriedade description não encontrada`,
            name: 'PropertiesError'
        });
    }
    if(!('branch' in obj)){
        propertieErrors.push({
            message: `Propriedade branch não encontrada`,
            name: 'PropertiesError'
        });
    }
    if(!('model' in obj)){
        propertieErrors.push({
            message: `Propriedade model não encontrada`,
            name: 'PropertiesError'
        });
    }
    if(!('mac' in obj)){
        propertieErrors.push({
            message: `Propriedade mac não encontrada`,
            name: 'PropertiesError'
        });
    }
    if(!('sensors' in obj)){
        propertieErrors.push({
            message: `Propriedade sensors não encontrada`,
            name: 'PropertiesError'
        });
    }else{
        for (let i = 0; i < obj.sensors.length; i++) {
            let sensor = obj.sensors[i];
            if(!('type' in sensor)){
                propertieErrors.push({
                    message: `Propriedade type não encontrada na coleção sensors[${i}]`,
                    name: 'PropertiesError'
                });
            }
            if(!('descriptor' in sensor)){
                propertieErrors.push({
                    message: `Propriedade descriptor não encontrada na coleção sensors[${i}]`,
                    name: 'PropertiesError'
                });
            }
            if(!('unix' in sensor)){
                propertieErrors.push({
                    message: `Propriedade unix não encontrada na coleção sensors[${i}]`,
                    name: 'PropertiesError'
                });
            }
        }
    }
}

SensorTypeValidator.prototype.errors = () => { 
    return errors; 
}

SensorTypeValidator.prototype.propertieErrors = () => { 
    return propertieErrors; 
}

SensorTypeValidator.prototype.clear = () => {
    errors = [];
    propertieErrors = [];
}

SensorTypeValidator.prototype.isValid = () => {
    return errors.length == 0;
}

SensorTypeValidator.prototype.isPropertiesValid = () => {
    return propertieErrors.length == 0;
}

module.exports = SensorTypeValidator;