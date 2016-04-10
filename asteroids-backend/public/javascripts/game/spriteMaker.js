var socket = io.connect('http://localhost:3000');
socket.on('asteroid_data',function(data){
  for (var i = 0; i < data.length; i++) {
    var roid = new Asteroid();
    roid.x = data[i][0];
    roid.y = data[i][1];
    roid.vel.x = data[i][2];
    roid.vel.y = data[i][3];
    roid.vel.rot = data[i][4];
    Game.sprites.push(roid);
  }
});

socket.on('ship_data',function(data){
  Game.ship.x = data[0];
  Game.ship.y = data[1];
  Game.ship.rot = data[2];
  Game.ship.vel.x = data[3];
  Game.ship.vel.y = data[4];
  Game.ship.vel.rot = data[5];
})
