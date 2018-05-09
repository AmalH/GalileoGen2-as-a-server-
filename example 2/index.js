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
	sendData(1);
});
//------------------------end config------------------------------------------------//
//var board = new Galileo();
var boardd = new five.Board({
    io: new Galileo()
  });
  
function sendData(data)
{
	var http = new XMLHttpRequest();
	var url = "http://127.0.0.1:8000/device_connect";
	var params = "id=123";
	http.open("POST", url, true);

	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState == 4 && http.status == 200) {
			alert(http.responseText);
		}
	}
	http.send(params);
}