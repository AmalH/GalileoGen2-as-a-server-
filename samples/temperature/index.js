'use strict';
var temperatureSensor = require('jsupm_temperature');
var temp = new temperatureSensor.Temperature(0);
var i = 0;
var waiting = setInterval(function() {
        var celsius = temp.value();
        console.log(celsius + " degrees Celsius");
        i++;
        if (i == 10) clearInterval(waiting);
        }, 1000);