$(function () {
  var canvas = $("#canvas");

  var context = canvas[0].getContext("2d");

  Text.context = context;
  Text.face = vector_battle;

  context.font = "15px Arial";

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
    context.clearRect(0, 0, Game.canvasWidth, Game.canvasHeight);
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
      context.fillText(Game.currentMessage, 10 + Game.xCount*800, (Game.yCount+1)*600 - 10);
      for(i = 0; i < Game.messages.length; i++){
        textX = 10 + Game.xCount*800;
        textY = (Game.yCount+1)*600 - 30 - 15*i;

        context.fillText(Game.messages[i], 10, textY);
      }
    }

    for(var i = 0; i < Game.messages.length; i++){
      if(Game.messageTimer[i] > 0){
        textX = 10 + Game.xCount*800;
        textY = (Game.yCount+1)*600 - 30 - 15*i;
        context.fillText(Game.messages[i], 10, textY);
        Game.messageTimer[i]--;
      }
    }
    //chat

    //leaderboard
    if(leaderNames != null){
    for(var i = 0; i < leaderNames.length; i++){
      textY = 20 + 20*(4-i) + Game.yCount * 600;
      var boardRow = (5-i) + ": " + leaderNames[i] + " " + leaderScores[i];
      textX = ((Game.xCount + 1)*800)-8*boardRow.length;
      context.fillText(boardRow, textX, textY);
    }
  }

    //display markers
    context.beginPath();
    context.moveTo(0,0);//top left
    context.lineTo(30, 30);
    context.stroke();
    context.moveTo(2400, 0);//top right
    context.lineTo(2370, 30);
    context.stroke();
    context.moveTo(0, 1800);//bottom left
    context.lineTo(30, 1770);
    context.stroke();
    context.moveTo(2400, 1800);//bottom right
    context.lineTo(2370, 1770);
    context.stroke();

    // display score
    var score_text = ''+ Game.score;
    textY = 20 + (Game.yCount) * 600;
    textX = ((Game.xCount)*800) + 15;
    context.fillText(score_text, textX, textY);

    requestAnimFrame(mainLoop, canvasNode);
  };

  mainLoop();

});
