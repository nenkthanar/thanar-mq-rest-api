var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', (socket) => {
console.log("New device connected : "+socket.id);
socket.on('disconnect', function(){ 
console.log("Disconnect : ",socket.id);
});

socket.on('thanarmq/server', (message) => {//check connection server to mobile app
    let mess = JSON.parse(message);
    io.emit(mess.topic, mess.msg);  
    console.log("mobile connection:",mess.topic);
    });

socket.on('thanarmq/command', (message) => {
    let mess = JSON.parse(message);
    dev_topic = mess.topic + "/dev" ;
    io.emit(dev_topic, mess.msg); 
    console.log("app command",mess.topic) ;
    });

socket.on('thanarmq/response',(message)=>{
    let mess = JSON.stringify(message);
    let par = JSON.parse(mess);
    let app_topic = par.topic;
    io.emit(app_topic,par.msg);
    console.log("device : ",par.topic);
    });

});
//----------------------------------------------------------------------------------------------------------------
var port = process.env.PORT || 3000; 
http.listen(port, function(){
console.log('listening in http://localhost:' + port);
});
