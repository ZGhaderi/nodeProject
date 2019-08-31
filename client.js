var express=require('express');
var http=require('http');
var app=express();
var server = http.createServer(app);
//Variables

var myemail = "email@gmail.com";
var device_id = '12345'; 

var io = require('socket.io-client');
var socket = io.connect('http://192.168.43.51:8000');
console.log(socket);
//Connect listener
socket.on('connect', function(){
   try {
      console.log('socket connect');
      socket.emit('configure', {email:myemail, deviceid:device_id});
   } catch(e) {
     console.log(e);
   }
});
socket.emit("/" + device_id, "45678");