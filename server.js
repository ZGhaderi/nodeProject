const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
var robot = require("robotjs");
var ks = require("node-key-sender");

var charm = require('charm')();
charm.pipe(process.stdout);
//charm.reset();
var first = true;
//io.set('transports', ['websocket']);
const port = 8000;
 server.listen(port,()=> {console.log("server run on port: " + port)});
 var screenSize = robot.getScreenSize();
 
 console.log(screenSize);
// robot.keyTap("f2");

   // ks.sendKey("print_screen");
    //robot.keyTap("f");
//     app.post('/thank', urlencodedParser, function (req, res){
//   var reply='';
//   reply += "Your name is" + req.body.name;
//   reply += "Your E-mail id is" + req.body.email; 
//   reply += "Your address is" + req.body.address;
//   reply += "Your mobile number is" + req.body.mobilno;
//   res.send(reply);
//  });

io.on("connection", (socket) =>{
    var h,w,x,y;
    charm.erase("line");
    charm.position(1,1);
    //if(first){
        charm.reset();
        first = false; 
    //}
    charm.write("a user connected.");
    //charm.reset();
    socket.on("chat message",msg =>{
        //console.log(msg);
        //io.emit("send","msg");
        //robot.keyTap('f1');
        if(msg == 'close'){
            socket.disconnect();
            charm.position(1,23);
            charm.write("connection closed. ");
        }
        if(msg != 'close'){
            // ks.setOption('startDelayMillisec',10);
            // ks.setOption('globalDelayBetweenMillisec', 10);
            // ks.setOption('globalDelayPressMillisec', 10);
            // ks.sendKeys(msg);
            //console.log(msg);
            if(msg == 'LSHIFT' || msg == 'LCTRL' || msg == 'RCTRL'){
                ks.sendKey(msg); 
                charm.position(1,21);
                charm.erase("line");
                charm.write("pressed key: "+msg);
            }
            else{
            // if(msg == 'up' || msg == 'p' || msg == 'q' || msg == 'm' || msg == 'l' || msg == 'x' || msg == 'r' ||  msg == 'down' || msg == 'left' || msg == 'right' || msg == 'space' || msg == 'right_shift'){
                 robot.keyTap(msg);
                 charm.position(1,21);
                 charm.erase("line");
                 charm.write("pressed key: "+msg);
            }
             
        }
    });
    socket.on("position",msg =>{
        x = String(msg).split(' ')[0];
        y = String(msg).split(' ')[1];
        // reply += "accelerometer X value: " + x;
        // reply += "accelerometer Y value: " + y;
        charm.position(1,2);
        charm.write("accelerometer X value: " + x);
        charm.position(1,3);
        charm.write("accelerometer Y value: " + y);
        // console.log("accelerometer X value: " + x);
        // console.log("accelerometer Y value: " + y);
        
        // console.log('h is ' +h+','+w);
    });
    socket.on("width and hight",msg =>{
        h = String(msg).split(' ')[0];
        w = String(msg).split(' ')[1];
        // console.log('h is ' +h+','+w);
    });
    socket.on("mouse location",msg =>{
        var movex = String(msg).split(' ')[0];
        var movey = String(msg).split(' ')[1];
        // console.log("movement:"+movex+","+movey);
        
        var pos = robot.getMousePos();
        // reply += "mouse X position is: " + pos.x;
        // reply += "mouse Y position is: " + pos.Y;
        var x = Number(pos.x) +Number(movex)*1920/Number(w);
        var y = Number(pos.y) + Number(movey)*1080/Number(h);

        charm.position(1,5);
        charm.write("mouse X position is: " + pos.x);
        charm.position(1,6);
        charm.write("mouse Y position is: " + pos.y);
        // console.log("mouse pos:"+pos.x+","+pos.y);

        // reply += "mouse X movement is: " + pos.x;
        // reply += "mouse Y position is: " + pos.y;
        charm.position(1,8);
        charm.write("mouse X movement is: " + movex);
        charm.position(1,9);
        charm.write("mouse Y movement is: " + movey);
        // console.log("new pos: "+Number(pos.x)+" " + Number(movex)*1280/Number(w)   );
        robot.moveMouse(x,y);
        //robot.mouseClick('right');
    });
//     socket.on("rec",msg =>{
//          console.log(msg);
//     });
//     socket.on("now",msg =>{
//         console.log("now :"+msg);
//     });
//    socket.on("text",msg =>{
//     console.log(msg);
//     });
    socket.on("input",msg =>{
        //ks.startBatch().batchTypeText(msg).sendBatch();
        // reply += "input received from client: " + msg;
        charm.position(1,11);
        charm.erase("line");
        charm.write("input received from client: " + msg);
        
    }),
    socket.on("volum",msg =>{
        if(msg == 'x'){
            charm.position(1,12);
        charm.erase("line");
        charm.write("volum off");
            //robot.keyTap('f1','alt');
        }
        else if(msg == 'up'){
            robot.keyTap('f2','control');
        }
        else if(msg == 'down'){
            robot.keyTap('f3','control');
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
            robot.scrollMouse(0,-50);
            //console.log("scrollUp");
            //reply += "mouse scroll up";
        charm.position(1,13);
        charm.erase("line");
        charm.write("mouse scroll: " +msg);
        
        }
        else if(msg=="down"){
            robot.scrollMouse(0,50);
            //console.log("scrollDown");
            //reply += "mouse scroll down";
        charm.position(1,13);
        charm.erase("line");
        charm.write("mouse scroll: " +msg);
        }
    }),
    socket.on("click",msg =>{
        if(msg == "singleTap"){
            robot.mouseClick();
            //reply += "mouse single tap";
            // console.log("singleTap");
            charm.position(1,15);
            charm.erase("line");
            charm.write("mouse click: " +msg);
        }
        else if(msg == "doubleTap"){
            robot.mouseClick("left",true);
            //reply += "mouse double tap";
            //robot.mouseClick();
            // console.log("doubleTap");
            charm.position(1,15);
            charm.erase("line");
            charm.write("mouse click: " +msg);
        }
        else if(msg == "rightClick"){
            robot.mouseClick("right"); 
            //reply += "mouse right click";
            charm.position(1,15);
            charm.erase("line");
            charm.write("mouse click: " +msg);
        }
        else if(msg == "right"){
            robot.keyTap('right');
            //reply += "go to right";
            charm.position(1,17);
            charm.erase("line");
            charm.write("go to : " +msg);
        }
        else if(msg == "left"){
            robot.keyTap('left'); 
            //reply += "go to left";
            charm.position(1,17);
            charm.erase("line");
            charm.write("go to : " +msg);
        }
        else if(msg == "restart"){
            robot.keyTap('d','command'); 
            robot.keyTap('f4','alt');
            robot.keyTap('down');
            //robot.keyTap('enter');
            //reply += "restart pc";
            charm.position(1,19);
            charm.erase("line");
            charm.write("restart pc");
        }
        else if(msg == "shutdown"){
            robot.keyTap('d','command'); 
            robot.keyTap('f4','alt');
            robot.keyTap('down');
            //robot.keyTap('enter');
            //reply += "shutdown pc";
            
            charm.position(1,19);
            charm.erase("line");
            charm.write("shutdown pc");
        }
        else if(msg == "delete"){
            robot.keyTap('delete');

            charm.position(1,19);
            charm.erase("line");
            charm.write("delete");
        }
        //robot.mouseClick();
        
    });
   // socket.on("disconnect", () => console.log("Client disconnected"));
});
// res.send(reply);
// });

