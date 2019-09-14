const express = require("express");
const app     = express();
const server  = require("http").createServer(app);
const io      = require("socket.io").listen(server);
var robot     = require("robotjs");
var ks        = require("node-key-sender");

var charm = require('charm')();
charm.pipe(process.stdout);
const port = 8000;
 server.listen(port,()=> {console.log("server run on port: " + port)});
 var screenSize = robot.getScreenSize();
 enter=()=>{
    robot.keyTap('enter');
    charm.position(1,21);
    charm.erase('line');
    charm.write("omad: ");
}
 console.log(screenSize);

io.on("connection", (socket) =>{
    var h,w,x,y;
    charm.erase("line");
    charm.position(1,1);
    charm.reset();
    charm.write("a user connected.");
    socket.on("toggledown",msg =>{
        robot.keyToggle(msg,'down');
        
        charm.position(1,21);
        charm.erase('line');
        charm.write("toggledown: "+msg);
    })
    socket.on("toggleup",msg =>{
        robot.keyToggle(msg,'up');

        charm.position(1,22);
        charm.erase('line');
        charm.write("toggleup: "+msg);
    })

    socket.on("chat message",msg =>{
        if(msg == 'close'){
            socket.disconnect();
            charm.position(1,23);
            charm.write("connection closed. ");
        }
        if(msg != 'close'){
            if(msg == 'LSHIFT' || msg == 'LCTRL' || msg == 'RCTRL'){
                ks.sendKey(msg); 
                charm.position(1,21);
                charm.erase("line");
                charm.write("pressed key: "+msg);
            }
            else{
                 robot.keyToggle(msg,'down');
                 charm.position(1,21);
                 charm.erase("line");
                 charm.write("pressed key: "+msg);
            }
             
        }
    });
    socket.on("position",msg =>{
        x = String(msg).split(' ')[0];
        y = String(msg).split(' ')[1];
        charm.position(1,2);
        charm.write("accelerometer X value: " + x);
        charm.position(1,3);
        charm.write("accelerometer Y value: " + y);
    });
    socket.on("width and hight",msg =>{
        h = String(msg).split(' ')[0];
        w = String(msg).split(' ')[1];
    });
    socket.on("mouse location",msg =>{
        var movex = String(msg).split(' ')[0];
        var movey = String(msg).split(' ')[1];
        
        var pos = robot.getMousePos();
        var x = Number(pos.x) +Number(movex)*1920/Number(w);
        var y = Number(pos.y) + Number(movey)*1080/Number(h);

        charm.position(1,5);
        charm.write("mouse X position is: " + pos.x);
        charm.position(1,6);
        charm.write("mouse Y position is: " + pos.y);

        charm.position(1,8);
        charm.write("mouse X movement is: " + movex);
        charm.position(1,9);
        charm.write("mouse Y movement is: " + movey);
        robot.moveMouse(x,y);
    });

    socket.on("input",msg =>{
        robot.typeString(msg);
        charm.position(1,11);
        charm.erase("line");
        charm.write("input received from client: " + msg);
        
    }),
    socket.on("volum",msg =>{
        if(msg == 'x'){
            charm.position(1,12);
            charm.erase("line");
            charm.write('mute');
            ks.sendCombination(['f7','windows']);
        }
        else if(msg == 'up'){
            ks.sendKey('f10');
            charm.position(1,12);
            charm.erase("line");
            charm.write('up');
            //robot.keyTap('f8');//,'control');
        }
        else if(msg == 'down'){
            ks.sendKey('f11');
            charm.position(1,12);
            charm.erase("line");
            charm.write('down');
           // robot.keyTap('f7');//,'control');
        }
    }),
    socket.on("brightness",msg =>{
        if(msg == 'up'){
            robot.keyTap('f12','control');
        }
        else if(msg == 'down'){
            robot.keyTap('f11','control');
        }
    }),
    socket.on("grant",msg =>{
        robot.mouseToggle("down");
    }),
    socket.on("release",msg =>{
        robot.mouseToggle("up");
    }),
    socket.on("scroll",msg =>{
        if(msg=="up"){
            robot.scrollMouse(0,50);
            charm.position(1,13);
            charm.erase("line");
            charm.write("mouse scroll: " +msg);
        }
        else if(msg=="down"){
            robot.scrollMouse(0,-50);
            charm.position(1,13);
            charm.erase("line");
            charm.write("mouse scroll: " +msg);
        }
    }),
   
    socket.on("click",msg =>{
        if(msg == "singleTap"){
            robot.mouseClick(); 
            charm.position(1,15);
            charm.erase("line");
            charm.write("mouse click: " +msg);
        }
        else if(msg == "doubleTap"){
            robot.mouseClick("left",true);
            charm.position(1,15);
            charm.erase("line");
            charm.write("mouse click: " +msg);
        }
        else if(msg == "rightClick"){
            robot.mouseClick("right"); 
            charm.position(1,15);
            charm.erase("line");
            charm.write("mouse click: " +msg);
        }
        else if(msg == "right"){
            robot.keyTap('right');
            charm.position(1,17);
            charm.erase("line");
            charm.write("go to : " +msg);
        }
        else if(msg == "left"){
            robot.keyTap('left'); 
            charm.position(1,17);
            charm.erase("line");
            charm.write("go to : " +msg);
        }
        else if(msg == "restart"){
            robot.keyTap('d','command'); 
            robot.keyTap('f4','alt');
            robot.keyTap('down');

            charm.position(1,19);
            charm.erase("line");
            charm.write("restart pc");
        }
        else if(msg == "shutdown"){
            robot.keyTap('d','command'); 
            robot.keyTap('f4','alt');

            charm.position(1,19);
            charm.erase("line");
            charm.write("shutdown pc");
        }
        else if(msg == "sleep"){
            robot.keyTap('d','command'); 
            robot.keyTap('f4','alt');
            robot.keyTap('up');
            charm.position(1,19);
            charm.erase("line");
            charm.write("sleep pc");
        }
        else if(msg == "delete"){
            robot.keyTap('delete');

            charm.position(1,19);
            charm.erase("line");
            charm.write("delete");
        }
        if(msg == "folder"){
            robot.keyTap('d','command'); 
            robot.keyTap('command'); 
            robot.typeString('file explorer');
            ks.sendKey('enter');
            charm.position(1,20);
            charm.erase("line");
            charm.write("open file explorer");
        }
        if(msg == "chrome"){
            robot.keyTap('d','command'); 
            robot.keyTap('command'); 
            robot.typeString('google chrome');
            ks.sendKey('enter');
            charm.position(1,20);
            charm.erase("line");
            charm.write("open google chrome");
        }
        if(msg == "enter"){
            robot.keyTap('enter'); 
            charm.position(1,20);
            charm.erase("line");
            charm.write("press enter");
        }
        if(msg == "close"){
            robot.keyTap('f4','alt');
            charm.position(1,20);
            charm.erase("line");
            charm.write("close window");
        }        
    });
});
