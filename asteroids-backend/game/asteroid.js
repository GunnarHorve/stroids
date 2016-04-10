var Sprite = require('./Sprite');

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
    var Game = require('../game/Game')();
    if (other.name == "bullet") {
      for(i=0;i<Game.sprites.length;i++){
        if(other.id == Game.sprites[i].id && Game.sprites.name = 'ship'){
          Game.spites[i].score += 120 / this.scale;
          break;
        }
      }

    }
    this.scale /= 3;
    if (this.scale > 0.5) {
      // break into fragments
      var io = require('../bin/www');
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
  };

};
Asteroid.prototype = new Sprite();

module.exports = Asteroid;
