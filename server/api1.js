  var app = require('express')();
  var http = require('http').Server(app);
  var io = require('socket.io')(http);
  const express =require('express');
  const router=express.Router();

            router.get('/show',function(req,res){
            });

    module.exports=router;
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
 
    var port = process.env.PORT || 3000; 
    http.listen(port, function(){
    console.log('listening in http://localhost:' + port);
    });
   
