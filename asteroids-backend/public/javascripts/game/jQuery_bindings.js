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

  // so all the sprites can use it
  Sprite.prototype.context = context;
  Sprite.prototype.grid    = grid;
  Sprite.prototype.matrix  = new Matrix(2, 3);

  var ship = new Ship();

  ship.x = Game.canvasWidth / 2;
  ship.y = Game.canvasHeight / 2;

  sprites.push(ship);
  Game.ship = ship;

  var i, j = 0;

  var lastFrame = Date.now();
  var thisFrame;
  var elapsed;
  var delta;

  var canvasNode = canvas[0];

  //message work
var chatmode = false;
var currentMessage = "";
var messages = ["h", "i", "t", "h", "e", "r", "e", "!"];
var messageTimer=[600, 500, 490, 300, 220, 210, 100, 10];
//message work end

//leaderboard work top 5
var leaderNames = ["bob1", "bob2", "bob3", "bob4", "bob5"];
var leaderScores = [100, 200, 300, 400, 500];
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

      sprites[i].run(delta);

      if (sprites[i].reap) {
        sprites[i].reap = false;
        sprites.splice(i, 1);
        i--;
      }
    }

    //leaderboard
    for(var i = 0; i < leaderNames.length; i++){
      textY = 20 + 20*(4-i);
      var boardRow = (5-i) + ": " + leaderNames[i] + " " + leaderScores[i];
      context.fillText(boardRow, Game.canvasWidth-8*boardRow.length, textY);
    }

    //chat
    if(chatmode){
      context.fillText(currentMessage, 10, Game.canvasHeight - 10);
      for(i = 0; i < messages.length; i++){
        textY = Game.canvasHeight - 30 - 15*i;
        context.fillText(messages[i], 10, textY);
      }
    }

    for(var i = 0; i < messages.length; i++){
      if(messageTimer[i] > 0){
        textY = Game.canvasHeight - 30 - 15*i;
        context.fillText(messages[i], 10, textY);
        messageTimer[i]--;
      }
    }

    // display score
    var score_text = ''+ Game.score;
    context.fillText(score_text, 15, 20);

    requestAnimFrame(mainLoop, canvasNode);
  };

  mainLoop();

  function addChatToScreen(string){
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

//checks the given score against the lowest score and adds to list if need be
  function checkHighScore(name, score){
    var lowestHigh = leaderScores[0];//scores are 0-4 lowest to highest
    if (score > lowestHigh){
      leaderScores[0] = score;
      leaderNames[0] = name;
      forceHighScoreSort();
    }
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
              ship.chatting = true;
              //Game.isChatting = true;
              break;
            }
            break;
          case '/':
            if(!chatmode){
              chatmode = true;
              ship.chatting = true;
              //Game.isChatting = true;
              break;
            }
          break;
          case 'enter':
          if(!chatmode){
            forceHighScoreSort();
            break;
          }
          chatmode = false;
          ship.chatting = false;
          //Game.isChatting = false;
          if(currentMessage == "" || currentMessage == " " || currentMessage == "  "){
            currentMessage = "";
            break;
          }
          addChatToScreen(currentMessage);
          currentMessage = "";
          break;
        }
  });
});
