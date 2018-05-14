'use strict';
var Galileo = require("galileo-io");
   
var board = new Galileo();
var express = require("express");
var app = express();
var LCD = require('jsupm_jhd1313m1');
var myLcd = new LCD.Jhd1313m1 (0,0x3E, 0x62);
var sensor = require('jsupm_light');
myLcd.setCursor(0,0);
myLcd.setColor(124,157,24);
myLcd.clear();
myLcd.write("Publicite");
var upm_button = require('jsupm_button');
var button = new upm_button.Button(3);
var ledSensor = require('jsupm_led');
var led = new ledSensor.Led(13);
var temperatureSensor = require('jsupm_temperature');
var msg='Publicite';
var etat = 0;
var buzz = 0;
var temp = 0;
var seuilTemp = 300;
var seuilLum = 300;
var light = 0;
var lumiere = 0;
var dataa = {
          "etat":etat,
		  "buzz":buzz,
		  "lum":lumiere,
          "light":light,
          "message":msg,
		  "temp":temp
}

/------------------------------------------ SENARIO 1 -----------------------------/	
app.get("/getStatus",function(req,res){
	res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers',
    'X-Requested-With,contenttype');
  res.setHeader('Access-Control-Allow-Credentials', true);
 // msg='OMG! Accident :('
  //etat=1;
  
 
/** on button click **/
 /** check status from db if status == 0 **/
  /** 
     if tmp > seuil 
      buzzer on
	  msg to display: OMG! Tmp
	  
	  if light > seuilLum
      buzzer on
	  msg to display: OMG! light
  **/
 /** else if status == 1 **/
  /** reset all **/
 if ( button.value() == 1 ) {
	
   if(etat ==0) {
     etat = 1;
	 
	 temp = new temperatureSensor.Temperature(0).value();
	 if(temp > seuilTemp){
		msg='OMG! Temperature :('; 
		board.digitalWrite(4,1);
		buzz = 1;
	 }
	 light = new sensor.Light(1).value();
	 if(light > seuilLum){
		msg='OMG! Light :('; 
		board.digitalWrite(4,1);
		
	 }
	 
     led.on();
			
      myLcd.clear();
      myLcd.setColor(255,0,0);
      lumiere=1;
			myLcd.write(msg);
        dataa = {
          "etat":etat,
		  "buzz":buzz,
          "lum":lumiere,
		  "light":light,
          "message":msg,
		  "temp":temp}
   } else {
      etat = 0;
	  buzz = 0;
	  light = 0;
	  temp = 0;
      led.off();
			board.digitalWrite(3,1);
			myLcd.clear();
      msg='Publicite';
      myLcd.setColor(124,157,24);
      lumiere=0;
			myLcd.write(msg);
        dataa = {
          "etat":etat,
		  "buzz":buzz,
          "lum":lumiere,
		  "light":light,
          "message":msg,
		  "temp":temp}
   }  
} 
res.json(dataa);
});

/------------------------------------------ STOP all scenario -----------------------------/
app.get('/stop', function (req, res) {
		res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers',
    'X-Requested-With,contenttype');
  res.setHeader('Access-Control-Allow-Credentials', true);
            led.off();
            msg = 'Publicite';
            etat = 0;
            myLcd.setColor(124,157,24);
            lumiere=0;
			board.digitalWrite(3,0);
			myLcd.clear();
			myLcd.write(msg);
			dataa = {
          "etat":etat,
		  "buzz":buzz,
          "lum":lumiere,
		  "light":light,
          "message":msg,
		  "temp":temp
}
res.sendStatus(200);
res.json(dataa);
});

/------------------------------------------ STOP start all scenario -----------------------------/

app.get('/start', function (req, res) {
		res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers',
    'X-Requested-With,contenttype');
  res.setHeader('Access-Control-Allow-Credentials', true);
   etat = 1;
	 
	 temp = new temperatureSensor.Temperature(0).value();
	 if(temp > seuilTemp){
		msg='OMG! Temperature :('; 
		board.digitalWrite(4,1);
		buzz = 1;
	 }
	 light = new sensor.Light(1).value();
	 if(light > seuilLum){
		msg='OMG! Light :('; 
		board.digitalWrite(4,1);
		
	 }
	 
     led.on();
			
      myLcd.clear();
      myLcd.setColor(255,0,0);
      lumiere=1;
			myLcd.write(msg);
        dataa = {
          "etat":etat,
		  "buzz":buzz,
          "lum":lumiere,
		  "light":light,
          "message":msg,
		  "temp":temp}
res.sendStatus(200);
res.json(dataa);
});

/------------------------------------------ control sensors -----------------------------/


/-------- led ----------/
app.get('/stopLed', function (req, res) {
		res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers',
    'X-Requested-With,contenttype');
  res.setHeader('Access-Control-Allow-Credentials', true);
            led.off();
            lumiere=0;
			dataa = {
          "etat":etat,
		  "buzz":buzz,
          "lum":lumiere,
		  "light":light,
          "message":msg,
		  "temp":temp
}
res.sendStatus(200);
res.json(dataa);
});

app.get('/startLed', function (req, res) {
		res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers',
    'X-Requested-With,contenttype');
  res.setHeader('Access-Control-Allow-Credentials', true);
            led.on();
            lumiere=1;
			dataa = {
          "etat":etat,
		  "buzz":buzz,
          "lum":lumiere,
		  "light":light,
          "message":msg,
		  "temp":temp
}
res.sendStatus(200);
res.json(dataa);
});
/-------- buzzer ----------/
app.get('/stopBuzz', function (req, res) {
		res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers',
    'X-Requested-With,contenttype');
  res.setHeader('Access-Control-Allow-Credentials', true);
            
			board.digitalWrite(3,0);
			buzz = 0;
			dataa = {
          "etat":etat,
		  "buzz":buzz,
          "lum":lumiere,
		  "light":light,
          "message":msg,
		  "temp":temp
}
res.sendStatus(200);
res.json(dataa);
});

app.get('/startBuzz', function (req, res) {
		res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers',
    'X-Requested-With,contenttype');
  res.setHeader('Access-Control-Allow-Credentials', true);
            
			board.digitalWrite(3,1);
			buzz = 1;
			dataa = {
          "etat":etat,
		  "buzz":buzz,
          "lum":lumiere,
		  "light":light,
          "message":msg,
		  "temp":temp
}
res.sendStatus(200);
res.json(dataa);
});

/-------- LCD ----------/
app.get('/setMessage', function (req, res) {
		res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers',
    'X-Requested-With,contenttype');
  res.setHeader('Access-Control-Allow-Credentials', true);
			msg=req.query.message;
			myLcd.clear();
      myLcd.setColor(124,157,24);
			myLcd.write(msg);
      dataa = {
          "etat":etat,
		  "buzz":buzz,
          "lum":lumiere,
		  "light":light,
          "message":msg,
		  "temp":temp
}
  	  res.sendStatus(200);
       res.json(dataa);

});

/----------------------------------- services ( set seuil statically) ------------------------/
app.get('/setSeuilTemp', function (req, res) {
		res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers',
    'X-Requested-With,contenttype');
  res.setHeader('Access-Control-Allow-Credentials', true);
			seuilTemp=req.query.seuilT;


});

app.get('/setSeuilLum', function (req, res) {
		res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers',
    'X-Requested-With,contenttype');
  res.setHeader('Access-Control-Allow-Credentials', true);
			seuilLum=req.query.seuilL;


});
app.listen(3000);
     
