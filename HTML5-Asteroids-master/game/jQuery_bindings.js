$(function () {
  var canvas = $("#canvas");
  Game.canvasWidth  = canvas.width();
  Game.canvasHeight = canvas.height();

  var context = canvas[0].getContext("2d");

  Text.context = context;
  Text.face = vector_battle;

  var gridWidth = Math.round(Game.canvasWidth / GRID_SIZE);
  var gridHeight = Math.round(Game.canvasHeight / GRID_SIZE);
  var grid = new Array(gridWidth);
  for (var i = 0; i < gridWidth; i++) {
    grid[i] = new Array(gridHeight);
    for (var j = 0; j < gridHeight; j++) {
      grid[i][j] = new GridNode();
    }
  }

  // set up the positional references
  for (var i = 0; i < gridWidth; i++) {
    for (var j = 0; j < gridHeight; j++) {
      var node   = grid[i][j];
      node.north = grid[i][(j == 0) ? gridHeight-1 : j-1];
      node.south = grid[i][(j == gridHeight-1) ? 0 : j+1];
      node.west  = grid[(i == 0) ? gridWidth-1 : i-1][j];
      node.east  = grid[(i == gridWidth-1) ? 0 : i+1][j];
    }
  }

  // set up borders
  for (var i = 0; i < gridWidth; i++) {
    grid[i][0].dupe.vertical            =  Game.canvasHeight;
    grid[i][gridHeight-1].dupe.vertical = -Game.canvasHeight;
  }

  for (var j = 0; j < gridHeight; j++) {
    grid[0][j].dupe.horizontal           =  Game.canvasWidth;
    grid[gridWidth-1][j].dupe.horizontal = -Game.canvasWidth;
  }

  var sprites = [];
  Game.sprites = sprites;

  // so all the sprites can use it
  Sprite.prototype.context = context;
  Sprite.prototype.grid    = grid;
  Sprite.prototype.matrix  = new Matrix(2, 3);

  var ship = new Ship();

  ship.x = Game.canvasWidth / 2;
  ship.y = Game.canvasHeight / 2;


  sprites.push(ship);

  ship.bullets = [];
  for (var i = 0; i < 10; i++) {
    var bull = new Bullet();
    ship.bullets.push(bull);
    sprites.push(bull);
  }
  Game.ship = ship;

  var extraDude = new Ship();
  extraDude.scale = 0.6;
  extraDude.visible = true;
  extraDude.preMove = null;
  extraDude.children = [];

  var i, j = 0;

  var elapsedCounter = 0;

  var lastFrame = Date.now();
  var thisFrame;
  var elapsed;
  var delta;

  //message work
  var chatmode = false;
  var currentMessage = "";
  var messages = ["h", "i", "t", "h", "e", "r", "e", "!"];
  var messageTimer=[600, 500, 490, 300, 220, 210, 100, 10];
  //message work end


  var canvasNode = canvas[0];

  // shim layer with setTimeout fallback
  // from here:
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  window.requestAnimFrame = (function () {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function (/* function */ callback, /* DOMElement */ element) {
              window.setTimeout(callback, 1000 / 60);
            };
  })();

  var mainLoop = function () {
    context.clearRect(0, 0, Game.canvasWidth, Game.canvasHeight);

    Game.FSM.execute();

    thisFrame = Date.now();
    elapsed = thisFrame - lastFrame;
    lastFrame = thisFrame;
    delta = elapsed / 30;

    for (i = 0; i < sprites.length; i++) {

      sprites[i].run(delta);

      if (sprites[i].reap) {
        sprites[i].reap = false;
        sprites.splice(i, 1);
        i--;
      }
    }

    // score
    var score_text = ''+Game.score;
    Text.renderText(score_text, 18, Game.canvasWidth - 14 * score_text.length, 20);

    // extra dudes
    for (i = 0; i < Game.lives; i++) {
      context.save();
      extraDude.x = Game.canvasWidth - (8 * (i + 1));
      extraDude.y = 32;
      extraDude.configureTransform();
      extraDude.draw();
      context.restore();
    }

    elapsedCounter += elapsed;
    if (elapsedCounter > 1000) {
      elapsedCounter -= 1000;
    }

    if(chatmode){
      Text.renderText(currentMessage, 10, 10, Game.canvasHeight - 10);
      for(i = 0; i < messages.length; i++){
        textY = Game.canvasHeight - 30 - 15*i;
        Text.renderText(messages[i], 10, 10, textY);
      }
    }

    for(i = 0; i < messages.length; i++){
      if(messageTimer[i] > 0){
        textY = Game.canvasHeight - 30 - 15*i;
        Text.renderText(messages[i], 10, 10, textY);
        messageTimer[i]--;
      }
    }

      requestAnimFrame(mainLoop, canvasNode);
  };

  mainLoop();

  var addChatToScreen = function(string){
    var tempA = messages[0];
    var tempA2 = messageTimer[0];
    var tempB = "";
    var tempB2 = 0;
      for(var i = 1; i < messages.length; i++){
        tempB = messages[i];
        tempB2 = messageTimer[i];
        messages[i] = tempA;
        messageTimer[i] = tempA2;
        tempA = tempB;
        tempA2 = tempB2;
      }
      messages[0] = string;
      messageTimer[0] = 1000;
  }

  $(window).keydown(function (e) {

    if(chatmode && KEY_CODES[e.keyCode] != 'enter'){
      //talk
      var input = String.fromCharCode(e.keyCode).toLowerCase();
      if(/[a-zA-Z0-9-_ ]/.test(input)){
        currentMessage = currentMessage + input;
      }else if(e.keyCode == 8){//backspace
        currentMessage = currentMessage.substring(0, currentMessage.length - 1);
      }else{
        return;
      }
      return;
    }
    switch (KEY_CODES[e.keyCode]) {
      case 'm': // mute
        SFX.muted = !SFX.muted;
        break;
      case 't':
        if(!chatmode){
          chatmode = true;
          break;
        }
        break;
      case '/':
        if(!chatmode){
          chatmode = true;
          break;
        }
      break;
      case 'enter':
      if(!chatmode){
        break;
      }
      chatmode = false;
      console.log(currentMessage);
      addChatToScreen(currentMessage);
      currentMessage = "";
      break;
    }
  });
});
