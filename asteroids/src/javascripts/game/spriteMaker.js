var socket = io.connect('http://localhost:3000');

var leaderNames = ['bob1','bob2','bob3','bob4','bob5'];
var leaderScores = [100,200,300,400,500];

socket.on('data',function(pos,vel,acc,scale,type) {
  var toAdd;
  if(type === 'asteroid') {
    toAdd = new Asteroid();
    toAdd.id = acc[0]; //no tears only dreams now
    toAdd.scale = scale;
    console.log('making asteroid');
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
  console.log(toAdd.x+'  '+toAdd.y);
  Game.sprites.push(toAdd);
  if(Game.ship ==null && toAdd.name == 'ship'){
    if(Game.sprites.length > 1){
      Game.start = false;
    }
    Game.ship = toAdd;
    console.log('I have a ship: '+Game.ship.id);
  }
});

socket.on('new_data',function(pos,vel,acc,id,scale,type){
  if(!Game.start){
    console.log('done getting new data');
    return;
  }

  if(type == 'end'){
    Game.start = false;
    return;
  }
  var toAdd;
  if(type === 'asteroid') {
    toAdd = new Asteroid();
  } else if (type === 'ship') {
    toAdd = new Ship();
  } else if (type === 'bullet') {
    toAdd = new Bullet();
  } else if (type === 'explosion'){
    toAdd = new Explosion();
  }
  toAdd.x = pos[0]; toAdd.y = pos[1]; toAdd.rot = pos[2];
  toAdd.vel.x = vel[0]; toAdd.vel.y = vel[1]; toAdd.vel.rot = vel[2];
  toAdd.scale = scale;
  toAdd.visible = true;
  toAdd.id = id; //id if ship (shhhhhhhhhhhh)
  toAdd.acc.x = acc[0]; toAdd.acc.y = acc[1];toAdd.vel.rot = vel[2];
  Game.sprites.push(toAdd);
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
  // console.log('updating');
  for(i=0;i<Game.sprites.length;i++){
    if(Game.sprites[i].id == id){
      thing = Game.sprites[i];
    }
  }
  thing.x = pos[0]; thing.y = pos[1]; thing.rot = pos[2];
  thing.vel.x = vel[0]; thing.vel.y = vel[1]; thing.vel.rot = vel[2];
  thing.acc.x = acc[0]; thing.acc.y = acc[1]; thing.acc.rot = acc[2];
});

socket.on('new_score',function(id,score){
  console.log('new score is: '+score)
  checkHighScore(id,score);
})

socket.on('scores',function(names, scores){
  leaderNames = names;
  leaderScores =scores
})

//leaderboard work top 5
//checks the given score against the lowest score and adds to list if need be

  var checkHighScore = function(name, score){
    if(name == Game.playerName){
      Game.score = score;
    }
    var lowestHigh = leaderScores[0];//scores are 0-4 lowest to highest
    if (score > lowestHigh){
      if(alreadyOnBoard(name, score)){
        forceHighScoreSort();
        return;
      }
      leaderScores[0] = score;
      leaderNames[0] = name;
      forceHighScoreSort();
    }
  }

  function alreadyOnBoard(name, score){
    for(var i = 0; i < leaderNames.length; i++){
      if(leaderNames[i] === name){
        leaderScores[i] = score;
        return true;
      }
    }
    return false;
  }

  function forceHighScoreSort(){
    var temp = "";
    var temp2 = 0;
    var j = 0;
    for(var i = 1; i < leaderNames.length; i++){
      j = i;
      while(j > 0 && leaderScores[j-1] > leaderScores[j]){
        swapScore(j,j-1);
        j--;
      }
    }
  }

  function swapScore(index1, index2){
    temp1 = leaderNames[index1];
    temp2 = leaderScores[index1];
    leaderNames[index1] = leaderNames[index2];
    leaderScores[index1] = leaderScores[index2];
    leaderNames[index2] = temp1;
    leaderScores[index2] = temp2;
  }

  function resetHighScores(){
    leaderNames = ["", "", "", "", ""];
    leaderScores = [0, 0, 0, 0, 0];
  }

socket.on('despawn', function(index) { //please call this for ALL despawns, including bullets & explosions
  var thing=null;
  // console.log('despawning');
  for(i=0;i<Game.sprites.length;i++){
    if(Game.sprites[i].id == index){
      thing = Game.sprites[i];
    }
  }
  // console.log(thing.name+'  '+thing.id);
  if(thing==null){return;}

  if(thing.name === "ship" || thing.name === "asteroid"){
    var boomSound = document.getElementById("kaboomSound");
    boomSound.load();
    boomSound.play();
}
  thing.die();
  if(thing.id == Game.ship.id){
    // Game.FSM.state = waiting;
    Game.FSM.boot();
  }
});

$(window).keydown(function (e) {
  if(KEY_STATUS[KEY_CODES[e.keyCode]]) {
    return;
  }

  if(KEY_CODES[e.keyCode]==='up') { //please sync ship && turn on burner
    var rad = ((Game.ship.rot-90) * Math.PI)/180;
    Game.ship.children.exhaust.visible = true;
    console.log('trying to move');
    socket.emit('move',[0.5 * Math.cos(rad), 0.5 * Math.sin(rad)],Game.ship.id);
  }else if(KEY_CODES[e.keyCode]==='left') { //please sync ship
    socket.emit('turn',[true,false],Game.ship.id);
  }else if(KEY_CODES[e.keyCode]==='right'){
    socket.emit('turn',[false,true],Game.ship.id);
  }else if(KEY_CODES[e.keyCode]==='space') { //please populate & send bullet object on other side
    if(Game.ship !=null){
    socket.emit('bullet fire',Game.ship.id);
    var laserSound = document.getElementById("pewPewSound");
    laserSound.load();
    laserSound.play();
  }
  }

  KEY_STATUS[KEY_CODES[e.keyCode]] = true

}).keyup(function (e) {
    if(KEY_CODES[e.keyCode]==='up'){
      Game.ship.children.exhaust.visible = false;
      socket.emit('move',[0,0],Game.ship.id);
    } else if(KEY_CODES[e.keyCode]==='left'){
      socket.emit('turn',[false,KEY_STATUS.right],Game.ship.id);
    }else if(KEY_CODES[e.keyCode]==='right'){
      socket.emit('turn',[KEY_STATUS.left,false],Game.ship.id);
    }

    KEY_STATUS[KEY_CODES[e.keyCode]] = false;

  }
);
