'use strict';
var sensor = require('jsupm_light');
var light = new sensor.Light(0);
function readLightSensorValue() {
    console.log("light value:"+light.value());
}
setInterval(readLightSensorValue, 1000);
