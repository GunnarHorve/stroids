var socket = io.connect('http://localhost:3000');

socket.on('data',function(pos,vel,acc,scale,type) {
  var toAdd;
  if(type === 'asteroid') {
    toAdd = new Asteroid();
  } else if (type === 'ship') {
    toAdd = new Ship();
  } else if (type === 'bullet') {
    toAdd = new Bullet()
  } else if (type === 'explosion'){
    toAdd = new Explosion();
  }
  toAdd.x = pos[0]; toAdd.y = pos[1]; toAdd.rot = pos[2];
  toAdd.vel.x = vel[0]; toAdd.vel.y = vel[1]; toAdd.vel.rot = vel[2];
  toAdd.acc.x = acc[0]; toAdd.acc.y = acc[1];toAdd.vel.rot = vel[2];
  toAdd.scale = scale;
  toAdd.visible = true;
  Game.sprites.push(toAdd);
});

despawn = function(index) { //please call this for ALL despawns, including bullets & explosions
  if(Game.sprites[index].name === "ship" || Game.sprites[index].name === "asteroid"){
    var boomSound = document.getElementById("kaboomSound");
    boomSound.load();
    boomSound.play();
  }
  Game.sprites[index].die();
}
