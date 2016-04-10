var socket = io.connect('http://localhost:3000');

socket.on('data',function(pos,vel,acc,scale,type) {
  var toAdd;
  if(type === 'asteroid') {
    toAdd = new Asteroid();
    toAdd.id = acc[0]; //no tears only dreams now
    toAdd.scale = scale;
  } else if (type === 'ship') {
    toAdd = new Ship();
    toAdd.id = scale; //id if ship (shhhhhhhhhhhh)
    toAdd.acc.x = acc[0]; toAdd.acc.y = acc[1];toAdd.vel.rot = vel[2];
  } else if (type === 'bullet') {
    toAdd = new Bullet();
  } else if (type === 'explosion'){
    toAdd = new Explosion();
  }
  toAdd.x = pos[0]; toAdd.y = pos[1]; toAdd.rot = pos[2];
  toAdd.vel.x = vel[0]; toAdd.vel.y = vel[1]; toAdd.vel.rot = vel[2];
  toAdd.visible = true;
  console.log(toAdd.id);
  Game.sprites.push(toAdd);
  if(Game.ship ==null && toAdd.name == 'ship'){
    Game.ship = toAdd;
    console.log('I have a ship');
  }
});

socket.on('update',function(pos,vel,acc,scale,type){
  var id;
  if(type ==='ship'){
    id = scale
  }else{
    console.log('NOT SUPPORTED (YET?)');
    return;
  }

  var thing;
  for(i=0;i<Game.sprites.length;i++){
    if(Game.sprites[i].id == id){
      thing = Game.sprites[i];
    }
  }

  if(Game.ship.id === id) {
    doTeleports(pos,vel);
}

  thing.x = pos[0]; thing.y = pos[1]; thing.rot = pos[2];
  thing.vel.x = vel[0]; thing.vel.y = vel[1]; thing.vel.rot = vel[2];
  thing.acc.x = acc[0]; thing.acc.y = acc[1]; thing.acc.rot = acc[2];
});

socket.on('despawn', function(index) { //please call this for ALL despawns, including bullets & explosions
  var thing;
  console.log('despawning');
  for(i=0;i<Game.sprites.length;i++){
    if(Game.sprites[i].id == index){
      thing = Game.sprites[i];
    }
  }
  console.log(thing.name+'  '+thing.id);

  if(thing.name === "ship" || thing.name === "asteroid"){
    var boomSound = document.getElementById("kaboomSound");
    boomSound.load();
    boomSound.play();
}
  thing.die();
});

$(window).keydown(function (e) {
  if(KEY_STATUS[KEY_CODES[e.keyCode]]) {
    return;
  }

  if(KEY_CODES[e.keyCode]==='up') { //please sync ship && turn on burner
    var rad = ((Game.ship.rot-90) * Math.PI)/180;
    Game.ship.children.exhaust.visible = true;
    console.log('trying to move');
    socket.emit('move',[0.5 * Math.cos(rad), 0.5 * Math.sin(rad)]);
  }else if(KEY_CODES[e.keyCode]==='left') { //please sync ship
    socket.emit('turn',[true,false]);
  }else if(KEY_CODES[e.keyCode]==='right'){
    socket.emit('turn',[false,true]);
  }else if(KEY_CODES[e.keyCode]==='space') { //please populate & send bullet object on other side
    socket.emit('bullet fire');
    var laserSound = document.getElementById("pewPewSound");
    laserSound.load();
    laserSound.play();
  }

  KEY_STATUS[KEY_CODES[e.keyCode]] = true

}).keyup(function (e) {
    if(KEY_CODES[e.keyCode]==='up'){
      Game.ship.children.exhaust.visible = false;
      socket.emit('move',[0,0]);
    } else if(KEY_CODES[e.keyCode]==='left' || KEY_CODES[e.keyCode]==='right') {
      console.log(KEY_STATUS.left+'  '+KEY_STATUS.right);
      socket.emit('turn',[KEY_STATUS.left,KEY_STATUS.right]);
    }

    KEY_STATUS[KEY_CODES[e.keyCode]] = false;

  }
);

doTeleports = function(pos,vel) {
  var c=document.getElementById("canvas");
  var ctx=c.getContext("2d");
  if(vel[0] > 0) { //heading towards right walls
    if(pos[0] > pos[0]%800 + 800*Game.xCount) { //went through normal wall
      if(Game.xCount === 0 || Game.xCount === 1) {
        Game.xCount++;
        ctx.translate(-800*1,0); //go 1 right
      }
    } else if(Game.xCount === 2 && pos[0] < 800) { //went through far wall
        Game.xCount=0;
        ctx.translate(800*2,0); //go 2 left
      }
  } else { //heading towards left walls
    if(Game.xCount === 0 && pos[0] > 1600) { //went through far wall
      Game.xCount = 2;
      ctx.translate(-800*2,0); //go 2 right
    } else if(Game.xCount === 2 && pos[0] < 1600) {
      Game.xCount = 1;
      ctx.translate(800,0); //go 1 right
    } else if(Game.xCount === 1 && pos[0] < 800) {
      Game.xCount = 0;
      ctx.translate(800,0);
    }
  }

  if(vel[1] > 0) { //heading towards bottom walls
    console.log("%d,%d",pos[1],pos[1]%600);
    if(pos[1] > pos[1]%600 + 600*Game.yCount) { //went through normal wall
      if(Game.yCount === 0 || Game.yCount === 1) {
        Game.yCount++;
        ctx.translate(0,-600*1); //go 1 down
      }
    } else if(Game.yCount === 2 && pos[1] < 600) { //went through far wall
        Game.yCount=0;
        ctx.translate(0,600*2); //go 2 up
      }
  } else { //heading towards right walls
    if(Game.yCount === 0 && pos[1] > 1200) { //went through far wall
      Game.yCount = 2;
      ctx.translate(0,-600*2); //go 2 down
    } else if(Game.yCount === 2 && pos[1] < 1200) {
      Game.yCount = 1;
      ctx.translate(0,600); //go 1 up
    } else if(Game.yCount === 1 && pos[1] < 600) {
      Game.yCount = 0;
      ctx.translate(0,600);
    }
  }
}
