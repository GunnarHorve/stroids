var Asteroid = require('./asteroid');
var Explosion = require('./explosion');

Game = {
  score: 0,
  totalAsteroids: 5,
  lives: 0,
  id: 1,

  canvasWidth: 2400,
  canvasHeight: 1800,

  sprites: [],
  ship: null,
  leaderNames: ['bob1','bob2','bob3','bob4','bob5'],
  leaderScores: [100,200,300,400,500],


  spawnAsteroids: function (count) {
    if (!count) count = this.totalAsteroids;
    for (var i = 0; i < count; i++) {
      var roid = new Asteroid();
      roid.x = Math.random() * this.canvasWidth;
      roid.y = Math.random() * this.canvasHeight;
      while (!roid.isClear()) {
        roid.x = Math.random() * this.canvasWidth;
        roid.y = Math.random() * this.canvasHeight;
      }
      roid.vel.x = Math.random() * 4 - 2;
      roid.vel.y = Math.random() * 4 - 2;
      if (Math.random() > 0.5) {
        roid.points.reverse();
      }
      roid.vel.rot = Math.random() * 2 - 1;
      roid.visible = true;
      roid.id = Game.id++;
      console.log(Game.id);
      Game.sprites.push(roid);
      var io = require('../bin/www');
      io.emit('data',[roid.x,roid.y,0],[roid.vel.x,roid.vel.y,roid.vel.rot],[roid.id,0,0],roid.scale,'asteroid');
    }
  },

  explosionAt: function (x, y) {
    var io = require('../bin/www');
    io.emit('data',[x,y,0],[0,0,0],[0,0,0],1,'explosion');
  },

  FSM: {
    boot: function () {
      this.state = 'waiting';
    },
    waiting: function () {
      Text.renderText('Press Space to Start', 36, Game.canvasWidth/2 - 270, Game.canvasHeight/2);
      if (KEY_STATUS.space || window.gameStart) {
        KEY_STATUS.space = false; // hack so we don't shoot right away
        window.gameStart = false;
        this.state = 'start';
      }
    },
    start: function () {
      for (var i = 0; i < Game.sprites.length; i++) {
        if (Game.sprites[i].name == 'asteroid') {
          Game.sprites[i].die();
        } else if (Game.sprites[i].name == 'bullet') {
          Game.sprites[i].visible = false;
        }
      }
      Game.totalAsteroids = 5;
      Game.spawnAsteroids();

      this.state = 'run';
    },
    spawn_ship: function () {
      console.log('spawning ship');
      Game.ship.x = 400;//Game.canvasWidth / 2;
      Game.ship.y = 300;//Game.canvasHeight / 2;
      console.log(Game.id)
      if (Game.ship.isClear()) {
        Game.ship.rot = 0;
        Game.ship.vel.x = 0;
        Game.ship.vel.y = 0;
        Game.ship.visible = true;
        this.state = 'run';
      }
    },
    run: function () {
      for (var i = 0; i < Game.sprites.length; i++) {
        if (Game.sprites[i].name == 'asteroid') {
          break;
        }
      }
      if (i == Game.sprites.length) {
        this.state = 'new_level';
      }
    },
    new_level: function () {
      if (this.timer == null) {
        this.timer = Date.now();
      }
      // wait a second before spawning more asteroids
      if (Date.now() - this.timer > 1000) {
        this.timer = null;
        Game.totalAsteroids++;
        if (Game.totalAsteroids > 12) Game.totalAsteroids = 12;
        Game.spawnAsteroids();
        this.state = 'run';
      }
    },
    player_died: function () {
      if (Game.lives < 0) {
        this.state = 'end_game';
      } else {
        if (this.timer == null) {
          this.timer = Date.now();
        }
        // wait a second before spawning
        if (Date.now() - this.timer > 1000) {
          this.timer = null;
          this.state = 'spawn_ship';
        }
      }
    },
    end_game: function () {
      Text.renderText('GAME OVER', 50, Game.canvasWidth/2 - 160, Game.canvasHeight/2 + 10);
      if (this.timer == null) {
        this.timer = Date.now();
      }
      // wait 5 seconds then go back to waiting state
      if (Date.now() - this.timer > 5000) {
        this.timer = null;
        this.state = 'waiting';
      }

      window.gameStart = false;
    },

    execute: function () {
      this[this.state]();
    },
    state: 'boot'
  },

  checkHighScore: function(name, score){
    var lowestHigh = Game.leaderScores[0];//scores are 0-4 lowest to highest
    if (score > lowestHigh){
      if(Game.alreadyOnBoard(name, score)){
        Game.forceHighScoreSort();
        return;
      }
      Game.leaderScores[0] = score;
      Game.leaderNames[0] = name;
      Game.forceHighScoreSort();
    }
  },
   alreadyOnBoard: function(name, score){
    for(var i = 0; i < Game.leaderNames.length; i++){
      if(Game.leaderNames[i] === name){
        Game.leaderScores[i] = score;
        return true;
      }
    }
    return false;
  },

  forceHighScoreSort: function(){
    var temp = "";
    var temp2 = 0;
    var j = 0;
    for(var i = 1; i < Game.leaderNames.length; i++){
      j = i;
      while(j > 0 && Game.leaderScores[j-1] > Game.leaderScores[j]){
        Game.swapScore(j,j-1);
        j--;
      }
    }
  },   swapScore: function(index1, index2){
    temp1 = Game.leaderNames[index1];
    temp2 = Game.leaderScores[index1];
    Game.leaderNames[index1] = Game.leaderNames[index2];
    Game.leaderScores[index1] = Game.leaderScores[index2];
    Game.leaderNames[index2] = temp1;
    Game.leaderScores[index2] = temp2;
  }

};

module.exports = function(){
  return Game;
};
