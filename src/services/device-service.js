'use strict';

exports.hasDeviceAccess = async (sensorName, device) => {
    for (let i = 0; i < device.sensors.length; i++) {
        let authorizedSensor = device.sensors[i];
        if(sensorName == authorizedSensor.type) return true;
        else if(i+1 == device.sensors.length) return false;
    }
}