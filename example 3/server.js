express = require('express');
var five = require("johnny-five");
var Galileo = require("galileo-io");

var board = new Galileo();
var LCD = require('jsupm_jhd1313m1');
var sensor = require('jsupm_light');
var grove = require('jsupm_grove');
var upm_button = require('jsupm_button');
var request = require('request');
var app = express();
var boardd = new five.Board({
    io: new Galileo()
  });
var light = new sensor.Light(0);
var temp = new grove.GroveTemp(1);
var buzzer = new five.Piezo(8);
var myLcd = new LCD.Jhd1313m1 (0, 0x3E, 0x62);
var buttonstop = new upm_button.Button(4)

var port=3000
app.set('port', process.env.PORT || port);


var isCardOn = true;
var seuil = 40;
var seuillum = 40
var int1,int2,int3,intseuil;
var urlsetAlert = "http://192.168.10.93:1337/insert_alert"
var isalertlum = false
var isalerttemp = false

//init 
int1 = setInterval(readLightSensorValue, 100);
int2 = setInterval(readTempSensorValue, 100);
int3 = setInterval(jeu, 10);
intseuil = setInterval(setseuil,100)


//----------------------------------------- LED ---------------------------------
  app.get('/ledon',function(request, response) {
   response.json("on");
   myLcd.clear();
  myLcd.setCursor(0,0);
  myLcd.setColor(0, 255, 0);
  myLcd.write('on');  
  isCardOn = true
  
  int1 = setInterval(readLightSensorValue, 100);
  int2 = setInterval(readTempSensorValue, 100);
  int3 = setInterval(jeu, 10);
  intseuil = setInterval(setseuil,100)
    
  });

app.get('/ledoff',function(request, response) {
   response.json("off ");
   myLcd.clear();
    myLcd.setCursor(0,0);
myLcd.setColor(255, 0 , 0);
myLcd.write('off');  
isCardOn = false
clearInterval(int1)
clearInterval(int2)
clearInterval(int3)
clearInterval(intseuil)
});

//----------------------------------------- Light ---------------------------------
 function readLightSensorValue() {
    console.log("light value:"+light.value());
    app.get('/getLum',function(request, response) {
        response.json({value:light.value(),etat:isCardOn?"on":"off",ip:"192.168.10.81"});
    });
    if(light.value()>seuillum && !isalertlum){
        isalertlum = true
        request.get(urlsetAlert+"?ip=192.168.10.81&valeur="+light.value()+"&capteur=Luminosite",function (error, responce, body){
            if(!error && responce.statusCode == 200 )
                {console.log(body)
                }
            });
            board.digitalWrite(13, (1));
    }
    else if(light.value()<=seuillum) {board.digitalWrite(13, (0)); isalertlum = false}
}
//----------------------------------------- Temperature ---------------------------------
function readTempSensorValue() {
    console.log("temp value:"+temp.value());
    app.get('/getTemp',function(request, response) {
        response.json({value:temp.value(),etat:isCardOn?"on":"off",ip:"192.168.10.81"});
    });
    if(temp.value()>seuil && !isalerttemp){
        isalerttemp = true
        request.get(urlsetAlert+"?ip=192.168.10.81&valeur="+temp.value()+"&capteur=Temperature",function (error, responce, body){
            if(!error && responce.statusCode == 200 )
                {console.log(body)
                }
            });
            board.digitalWrite(8, (1));
    }
    else if(temp.value()<=seuil) {board.digitalWrite(8, (0)); isalerttemp = false} 
}

//----------------------------------------- Services ---------------------------------
function testAlert() {
    request.get("http://192.168.40.1:2626/getTempSeuil",function (error, responce, body){
        if(!error && responce.statusCode == 200 )
            {console.log(body)
            }
        });
 }
 
 app.get('/valuelcd/:value', function (request, response) {
        myLcd.clear();
        myLcd.setCursor(0, 0);
        myLcd.setColor(255, 255, 0);
        myLcd.write(request.params.value);
        response.json({ message: "sent" });
    });

    app.get('/seuil/:seuil', function (request, response) {
        seuil = request.params.seuil;
        response.json({ message: seuil});

    });

    function setseuil(){
        if(temp.value()>seuil)  board.digitalWrite(8, (1));
        else board.digitalWrite(8, (0));
        console.log("seuil : "+seuil)   
    }

    app.get('/getEtat',function(request, response) {
        response.json(isCardOn?"on":"off");
     });

    setInterval(function() {  
        app.get('/info',function(request, response) {
            response.json({temperature:temp.value(),luminosite:light.value(),etat:isCardOn,ip:"192.168.10.81",name:"bitsplz"});
        });
    },50);

 /* bitsplz
    var x = 1
    var x1 =100
    var x2 = 200

    function jeu(){
        myLcd.setColor(x,x1,x2);

        x=x+6
        x1=x1+15
        x2=x2+10

        if (x>255) x= 1
        if (x1>255) x1= 1
        if (x2>255) x2= 1
    }*/


app.listen(app.get('port'), function () {
    console.log('Bot is running on port ',app.get('port'));
});