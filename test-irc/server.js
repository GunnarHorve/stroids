
// Our express expressApplication
var express = require('express'),
    path = require('path'),
    expressApp     = express(),
    irc = require('irc');
var http = require('http').Server(expressApp);
var io = require('socket.io')(http);
//var irc = require('irc');



var sessions = new Map();

// Express middleware
expressApp
    .use(express.static('./'))
    // Any request not matched so far, send to main.html
    .get('*', function(req, res){
        res.sendFile('views/index.html', {root: path.join(__dirname, './')});
    });


io.on('connection', function(socket){
  console.log('a user connected');

  // var client = new irc.Client('192.168.137.102', 'bot', {channels: ['#global']});
  // client.addListener('error', function(message) {
  //     console.log('error: ', message);
  // });
  // client.addListener('message', function(from, to, message){
  //   var msg = from + ' => ' + to + ': '+ message;
  //   console.log(msg);
  // });
  // sessions.set(socket.client, client);
    socket.on('disconnect', function(){
      var user = sessions.get(socket.id);
      if (typeof user !== 'undefined'){
        broadcastAll(user.un + " disconnected.");
      }
      console.log("Socket disocnnected.");
    });
    socket.on('login', function(response){
    //   var client = new irc.Client('192.168.137.102', response, {channels: ['#global']});
    //   client.addListener('error', function(message){
    //     //do nothing.
    //   });
    //   client.addListener('message', function(from, to, message){
    //     var msg = from + ' => ' + to + ': '+ message;
    //     socket.emit('chat message', msg);
    //   });
    //   sessions.set(socket.id, client);
    //
    var name;
    if (typeof response === 'undefined' || response.name === null ||response.name === "" ){

      name = "Player_F"+ Math.floor(Math.random()*100);

    } else {
      name = response.name;
    }
    var user = {'un':name};
    sessions.set(socket.id, user);
    console.log("User set name: "+ name);
    broadcastAll(name + " joined.");
    });
    socket.on('chat message', function(msg){
      var un = sessions.get(socket.id).un;
      broadcastAll(un + ': ' + msg);
    });
    var broadcastAll = function(message){
      io.emit('chat message', message);
    };
});

http.listen(3001, function(){
      console.log('Server is listening on port 3001');
});
