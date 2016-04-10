$(function () {
  var canvas = $("#canvas");

  var context = canvas[0].getContext("2d");

  Text.context = context;
  Text.face = vector_battle;

  context.font = "15px Arial";

  var gridWidth = Math.round(canvas.width() / GRID_SIZE);
  var gridHeight = Math.round(canvas.height() / GRID_SIZE);
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
    grid[i][0].dupe.vertical            =  canvas.height();
    grid[i][gridHeight-1].dupe.vertical = -canvas.height();
  }

  for (var j = 0; j < gridHeight; j++) {
    grid[0][j].dupe.horizontal           =  canvas.width();
    grid[gridWidth-1][j].dupe.horizontal = -canvas.width();
  }

  var sprites = [];
  Game.sprites = sprites;

  Game.FSM.getName();

  // so all the sprites can use it
  Sprite.prototype.context = context;
  Sprite.prototype.grid    = grid;
  Sprite.prototype.matrix  = new Matrix(2, 3);

  var i, j = 0;

  var lastFrame = Date.now();
  var thisFrame;
  var elapsed;
  var delta;

  var canvasNode = canvas[0];


//leaderboard work end

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
    context.clearRect(0, 0, canvas.width(), canvas.height());

    Game.FSM.execute();

    thisFrame = Date.now();
    elapsed = thisFrame - lastFrame;
    lastFrame = thisFrame;
    delta = elapsed / 30;

    for (i = 0; i < sprites.length; i++) {

      Game.sprites[i].run(delta);

      if (Game.sprites[i].reap) {
        console.log('deleting');
        Game.sprites[i].reap = false;
        Game.sprites.splice(i, 1);
        i--;
      }
    }

    //chat
    if(Game.chatmode){
      context.fillText(Game.currentMessage, 10, Game.canvasHeight - 10);
      for(i = 0; i < Game.messages.length; i++){
        textY = Game.canvasHeight - 30 - 15*i;
        context.fillText(Game.messages[i], 10, textY);
      }
    }

    for(var i = 0; i < Game.messages.length; i++){
      if(Game.messageTimer[i] > 0){
        textY = Game.canvasHeight - 30 - 15*i;
        context.fillText(Game.messages[i], 10, textY);
        Game.messageTimer[i]--;
      }
    }
    //chat

    //leaderboard
    if(leaderNames != null){
    for(var i = 0; i < leaderNames.length; i++){
      textY = 20 + 20*(4-i);
      var boardRow = (5-i) + ": " + leaderNames[i] + " " + leaderScores[i];
      context.fillText(boardRow, Game.canvasWidth-8*boardRow.length, textY);
    }
  }

    // display score
    var score_text = ''+ Game.score;
    context.fillText(score_text, 15, 20);

    requestAnimFrame(mainLoop, canvasNode);
  };

  mainLoop();

});
