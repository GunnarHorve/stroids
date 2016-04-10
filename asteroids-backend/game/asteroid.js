var Sprite = require('./sprite');

Asteroid = function () {
  this.init("asteroid",
            [-10,   0,
              -5,   7,
              -3,   4,
               1,  10,
               5,   4,
              10,   0,
               5,  -6,
               2, -10,
              -4, -10,
              -4,  -5]);

  this.visible = true;
  this.scale = 6;
  this.postMove = this.wrapPostMove;
  this.time = 0;

  this.collidesWith = ["ship", "bullet"];

  this.preMove = function(delta){
  this.time+=delta;
}

  this.collision = function (other) {
    console.log('asteroid explodes');
    // SFX.explosion();
    var Game = require('../game/game')();
    var io = require('../bin/www');
    if (other.name == "bullet") {
      for(i=0;i<Game.sprites.length;i++){
        if(other.id == Game.sprites[i].id && Game.sprites[i].name == 'ship'){
          Game.sprites[i].score += 120 / this.scale;
          console.log(Game.sprites[i].score);
          io.emit('new_score',Game.sprites[i].playerName,Game.sprites[i].score);
          Game.checkHighScore(Game.sprites[i].name,Game.sprites[i].score);
          break;
        }
      }
    }

    this.scale /= 3;
    if (this.scale > 0.5) {
      // break into fragments

      for (var i = 0; i < 3; i++) {
        var roid = new Asteroid();
        roid.x = this.x;
        roid.y = this.y;
        roid.rot = this.rot;
        roid.vel.x = Math.random() * 6 - 3;
        roid.vel.y = Math.random() * 6 - 3;
        roid.scale = this.scale;
        roid.vel.rot = Math.random() * 2 - 1;
        roid.move(roid.scale * 3); // give them a little push
        roid.id = Game.id++;
        io.emit('data',[roid.x,roid.y,roid.rot],[roid.vel.x,roid.vel.y,roid.vel.rot],
        [roid.id,0,0],roid.scale,'asteroid');
        Game.sprites.push(roid);
      }
    }
    Game.explosionAt(other.x, other.y);
    this.die();
    val density = 0;
    for(i=0;i<Game.sprites.length;i++){
      if(Game.sprites[i].name = 'asteroid'){
        density+=Game.sprites[i].scale;
      }
    }
    if(density < 100){
      Game.spawnAsteroids(3);
    }
  };

};
Asteroid.prototype = new Sprite();

module.exports = Asteroid;
