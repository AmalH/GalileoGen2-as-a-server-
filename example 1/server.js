

express = require('express');
const mraa = require('mraa');
var Galileo = require("galileo-io");
var five = require("johnny-five");
var board = new Galileo();
var app = express();
var port=3000
app.set('port', process.env.PORT || port);
board.on("ready", function() {
  this.pinMode(13, this.MODES.OUTPUT);
});

app.listen(app.get('port'), function () {
    console.log('Bot is running on port ',app.get('port'));
});
//------------------------end config------------------------------------------------//
//var board = new Galileo();
var boardd = new five.Board({
    io: new Galileo()
  });
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
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET'); 
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); 
    response.setHeader('Access-Control-Allow-Credentials', true);
	seuil=request.query.data
	response.send(seuil);
});
app.get('/buzzeron',function(request, response) {
    board.digitalWrite(3, (1));
	response.sendStatus(200);
});
app.get('/buzzeroff',function(request, response) {
    board.digitalWrite(3, (0));
	response.sendStatus(200);
});
app.get('/light',function(req,res){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET'); 
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); 
    res.setHeader('Access-Control-Allow-Credentials', true);
    analogPin = new mraa.Aio(1);
    analogValue = analogPin.read();
     console.log(analogValue);
          res.json(analogValue);
        });
 
        

app.get('/getdata',function(req,res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET'); 
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); 
  res.setHeader('Access-Control-Allow-Credentials', true);
temperature={}
B = 4275;               // B value of the thermistor
R0 = 100000;
analogPin = new mraa.Aio(1);
analogValue = analogPin.read();
R = 1023.0/analogValue-1.0;
R = R0*R;
temperature.val = 1.0/(Math.log(R/R0)/B+1/298.15)-273.15;
temperature.val=temperature.val.toFixed(2);
var light = board.analogRead("A1", function(data) {
  
       return data ; 
});
dataa = {
  "etat":1,
  "temp":temperature.val,
  "lum":500,
  "ip":"172.18.18.31"
}
res.json(dataa);
          
  });
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

/*
var touch = new five.Button(4);

  touch.on("press", function() {
    console.log("Pressed!");
  });
  touch.on("release", function() {
    console.log("Released!");
  });
*/
app.get('/button',function(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET'); 
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); 
    response.setHeader('Access-Control-Allow-Credentials', true);
    var touch = new five.Button(4);
    
     touch.on("press", function() {
        console.log("Pressed!");
        var lcd = new five.LCD({
        bus:1,
      controller: "JHD1313M1"
    });
    //lcd.bgColor(0,0,0);
    lcd.bgColor("red");
    //lcd.useChar("heart");
    lcd.cursor(0, 0).print("Mode 2");
  
    lcd.blink();
  
    ///////////////////////////
        response.send("press");
      });
      touch.on("release", function() {
        console.log("Released!");
        response.send("release");
      });
});
var touch = new five.Button(4);

  touch.on("press", function() {
	var lcd = new five.LCD({
        bus:1,
      controller: "JHD1313M1"
    });
    //lcd.bgColor(0,0,0);
    lcd.bgColor("red");
    //lcd.useChar("heart");
    lcd.cursor(0, 0).print("Mode 2");
  
    lcd.blink();
  });
  touch.on("release", function() {
    //board.digitalWrite(3, (0));
	
  });
  touch.on("hold", function() {
    board.digitalWrite(3, (1));
  });