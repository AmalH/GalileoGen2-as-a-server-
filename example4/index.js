express = require('express');
var app = express();
var port=3000
app.set('port', process.env.PORT || port);

const mraa = require('mraa');
var five = require("johnny-five"),board, button;
var Galileo = require("galileo-io");
var board = new five.Board({io: new Galileo()});

on =0;
var lcd = new five.LCD({bus:1,controller: "JHD1313M1"});

board.on("ready", function() {
	board.repl.inject({
    button: button});
	button = new five.Button(3);
	board.repl.inject({
    button: button});
	button.on("up", function() {
    if(on ==0){
    console.log("System On");
    lcd.cursor(1, 0).clear().print("System On");
    on =1;}
    else{
    console.log("System Off");
    lcd.cursor(1, 0).clear().print("System Off");
    on =0;
    }
  });
});

app.get('/temperature',function(request, response) {
	response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET'); 
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); 
    response.setHeader('Access-Control-Allow-Credentials', true);
	temperature={}
	B = 4275;               // B value of the thermistor
	R0 = 100000;
	analogPin = new mraa.Aio(1);
	analogValue = analogPin.read();
	R = 1023.0/analogValue-1.0;
	R = R0*R;
	temperature.val = 1.0/(Math.log(R/R0)/B+1/298.15)-273.15;
	temperature.val=temperature.val.toFixed(2);
	response.json(temperature);
});

app.get('/lumiere',function(request, response) {
	response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET'); 
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); 
    response.setHeader('Access-Control-Allow-Credentials', true);
	lumiere={}
	analogPin = new mraa.Aio(2);
	analogValue = analogPin.read();
	lumiere.val=analogValue;
	response.json(lumiere);
});

app.get('/on',function(request, response) {
	board.digitalWrite(13, (1));
	response.sendStatus(200);
});
app.get('/off',function(request, response) {
	board.digitalWrite(13, (0));
	response.sendStatus(200);
});
seuil=null;
app.get('/seuil',function(request, response) {
	seuil=request.query.data
	response.send(seuil);
});
seuil_lum=null;
app.get('/seuil_lum',function(request, response) {
	seuil_lum=request.query.data
	response.send(seuil_lum);
});

board.analogRead("A1", function(data) {
  if(seuil!=null){
  	B = 4275;               // B value of the thermistor
	R0 = 100000;
	R = 1023.0/data-1.0;
	R = R0*R;
	temperature = 1.0/(Math.log(R/R0)/B+1/298.15)-273.15;
	temperature=temperature.toFixed(2);
  	if(temperature>parseFloat(seuil)){
  		console.log('alert '+temperature)
  	}
  }
})
board.analogRead("A2", function(data) {
  if(seuil_lum!=null){
  lumiere=data;
  	if(lumiere>parseFloat(seuil_lum)){
  		console.log('alert '+lumiere)
  	} 
  }
})

app.get('/message',function(request, response) {
	message=request.query.data;
  console.log(message);
  lcd.bgColor("red");
  lcd.cursor(1, 0).clear().print(message);
	response.send(message);
});

app.listen(app.get('port'), function () {
    console.log('Bot running on port ',app.get('port'));
});