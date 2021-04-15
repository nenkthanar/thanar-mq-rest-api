var express = require('express'),
cluster = require('cluster'),
sio = require('socket.io');

var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.port|| 3001,
num_processes = require('os').cpus().length;

if (cluster.isMaster) {
for (var i = 0; i < num_processes; i++) {
    cluster.fork();
}
} 
else 
{
var app = new express();

var server = app.listen(port,function(){

}),

io = sio(server);
console.log('Connected on localhost:'+port);

io.on('connection', (socket) => {
    socket.on('disconnect', function(){  
    io.emit('return-message', 'Offline'); 
    });
    socket.on('control-message', (message) => {//Receive mesage from ionic
    io.emit('message', message);    
    console.log('Sent control:'+message)
    });

    socket.on('return-netstrix',function(data){//Receive return message from esp8266
    io.emit('return-message',data);//Sent return message to ionic
    console.log('Receive from esp8266:'+data);
    });
    });

}