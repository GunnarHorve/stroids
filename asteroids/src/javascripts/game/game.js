Game = {
  score: 0,
  totalAsteroids: 5,
  lives: 0,

  canvasWidth: 800,
  canvasHeight: 600,

  xScale: 1.0,
  yScale: 1.0,

  sprites: [],
  ship: null,

  //message work
  chatmode: false,
  currentMessage: ">",
  messages: ["SURVIVE.","I LIED.  YOU HAVE NO CHOICE.", "I MEAN YOUR SHIP", "PICK YOUR WEAPON","WELCOME TO THE WORLD OF WARCRAFT"],
  messageTimer: [600, 500, 490, 300, 220, 210, 100, 10],
  //message work end

  explosionAt: function (x, y) {
    var splosion = new Explosion();
    splosion.x = x;
    splosion.y = y;
    splosion.visible = true;
    Game.sprites.push(splosion);
  },

  resizeThings: function(width, height){
    console.log(this.xScale);
    canvasWidth = width*0.9;
    canvasHeight = height*0.9;

    this.xScale = canvasWidth/800;
    this.yScale = canvasWidth/600;
    console.log(this.xScale);

    var can = document.getElementById("canvas");
    can.style.width = canvasWidth;
    can.style.height = canvasHeight;

    console.log("--------------");
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
      socket.emit('start');
      socket.emit('player_join');
      this.state = 'spawn_ship';
    },
    spawn_ship: function () {
      // if (Game.ship.isClear()) {
        // Game.ship.visible = true;
        this.state = 'run';
      // }
    },
    run: function () {
      for (var i = 0; i < Game.sprites.length; i++) {
        if (Game.sprites[i].name == 'asteroid') {
          break;
        }
      }
    },
    execute: function () {
     this[this.state]();
   },
   state: 'boot'
 }
};
