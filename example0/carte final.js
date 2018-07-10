express = require('express');
const mraa = require('mraa');
var Galileo = require("galileo-io");
var five = require("johnny-five");
var board = new Galileo();
var req = require('request');
var app = express();
var port=3000
var seuil = 0;
app.set('port', process.env.PORT || port);
board.on("ready", function() {
  this.pinMode(13, this.MODES.OUTPUT);
});

app.listen(app.get('port'), function () {
    console.log('Bot is running on port ',app.get('port'));
});
//------------------------end config------------------------------------------------//


var boardd = new five.Board({
    io: new Galileo()
  });



//----------------------------------------- LED ----------------------------------------
app.get('/on',function(request, response) {
// turn led on
	board.digitalWrite(13, (1));
// change status in databas
// ?

 
  req.get("http://192.168.10.12:2626/setStatus",function (error, response, body){
            if(error){
            console.log(error);
            }
        if(!error && response.statusCode == 200 )
            {console.log(body)
            }
        });
        

response.sendStatus(200);
 
});
app.get('/off',function(request, response) {
	board.digitalWrite(13, (0));
	response.sendStatus(200);
});

//----------------------------------------- Temperature ---------------------------------
app.get('/temperature',function(request, response) {
	response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET'); 
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); 
    response.setHeader('Access-Control-Allow-Credentials', true);
	temperature={}
	B = 4275;               // B value of the thermistor
	R0 = 100000;
	analogPin = new mraa.Aio(0);
	analogValue = analogPin.read();
	R = 1023.0/analogValue-1.0;
	R = R0*R;
	temperature.val = 1.0/(Math.log(R/R0)/B+1/298.15)-273.15;
	temperature.val=temperature.val.toFixed(2);
	response.json(temperature);
 
 //####### SI TEMP > X ... ##### 
 if(temperature.val>30){
 board.digitalWrite(3, (1));
 }
});

//----------------------------------------- Buzzer ---------------------------------------
app.get('/buzzeron',function(request, response) {
board.digitalWrite(3, (1));
response.sendStatus(200);
});
app.get('/buzzeroff',function(request, response) {
  board.digitalWrite(3, (0));
response.sendStatus(200);
});

//----------------------------------------- LCD ---------------------------------------
app.get('/mytext',function(request,response){
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET'); 
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); 
  response.setHeader('Access-Control-Allow-Credentials', true);

  textt=request.query.data
  console.log(textt);
  var lcd = new five.LCD({
      bus:1,
    controller: "JHD1313M1"
  });
  //lcd.bgColor(0,0,0);
  lcd.bgColor("green");
  //lcd.useChar("heart");
  lcd.cursor(0, 0).print("Mode 1");
  lcd.blink();

  lcd.cursor(1, 0).print(textt);

});

//----------------------------------------- Button ---------------------------------------
app.get('/button',function(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET'); 
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); 
  response.setHeader('Access-Control-Allow-Credentials', true);
  
  
  var upm_button = require('jsupm_button');
var button = new upm_button.Button(4);
var ledSensor = require('jsupm_led');
var led = new ledSensor.Led(13);
var waiting = setInterval(function() {
        if (button.value() ) {
            led.on();
        } else {
            led.off();
        }
        }, 100);
  
  
  });

//----------------------------------------- SEUIL ------------------------------------------

app.get('/getSeuil',function(request, response) {

	temperature={}
	B = 4275;               // B value of the thermistor
	R0 = 100000;
	analogPin = new mraa.Aio(0);
	analogValue = analogPin.read();
	R = 1023.0/analogValue-1.0;
	R = R0*R;
	temperature.val = 1.0/(Math.log(R/R0)/B+1/298.15)-273.15;
	temperature.val=temperature.val.toFixed(2);
	response.json(temperature);

	req.get("http://192.168.10.12:2626/getTempSeuil",function (error, response, body){
            if(error){
            console.log(error);
            }
        if(!error && response.statusCode == 200 )
            {
            //response.json(body);
            if(body<temperature.val){
                board.digitalWrite(3, (1));
            }
            }
        });
});

var waiting = setInterval(function() {

	temperature={}
	B = 4275;               // B value of the thermistor
	R0 = 100000;
	analogPin = new mraa.Aio(0);
	analogValue = analogPin.read();
	R = 1023.0/analogValue-1.0;
	R = R0*R;
	temperature.val = 1.0/(Math.log(R/R0)/B+1/298.15)-273.15;
	temperature.val=temperature.val.toFixed(2);
	//response.json(temperature);
        
	req.get("http://192.168.10.12:2626/getTempSeuil",function (error, response, body){
            if(error){
            console.log(error);
            }
        if(!error && response.statusCode == 200 )
            {
            //response.json(body);
            if(body<temperature.val){
                board.digitalWrite(3, (1));
            }
            }
        });
        
        //i++;
       // if (i == 10) clearInterval(waiting);
       
        console.log(temperature);
        }, 5000);

