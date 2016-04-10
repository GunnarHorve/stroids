$(window).keydown(function (e) {

  if(KEY_CODES[e.keyCode] == 't' || KEY_CODES[e.keyCode] == '/'){
    Game.chatmode = true;
    return;
  }
  if(Game.chatmode) {
    handleChat(e);
  }

  if(KEY_STATUS[KEY_CODES[e.keyCode]]) {
    return;
  }

  if(KEY_CODES[e.keyCode]==='up') { //please sync ship && turn on burner
    var rad = ((Game.ship.rot-90) * Math.PI)/180;
    Game.ship.children.exhaust.visible = true;
    socket.emit('move_start',[0.5 * Math.cos(rad), 0.5 * Math.sin(rad)]);
  } else if(KEY_CODES[e.keyCode]==='left' || KEY_CODES[e.keyCode]==='right') { //please sync ship
    socket.emit('turn',[KEY_STATUS.left,KEY_STATUS.right]);
  } else if(KEY_CODES[e.keyCode]==='space') { //please populate & send bullet object on other side
    socket.emit('bullet fire');
    var laserSound = document.getElementById("pewPewSound");
    laserSound.load();
    laserSound.play();
  }

  KEY_STATUS[KEY_CODES[e.keyCode]] = true

}).keyup(function (e) {
    if(KEY_CODES[e.keyCode]==='up'){
      Game.ship.children.exhaust.visible = false;
      socket.emit('move_finish');
    } else if(KEY_CODES[e.keyCode]==='left' || KEY_CODES[e.keyCode]==='right') {
      socket.emit('turn',[KEY_STATUS.left,KEY_STATUS.right]);
    }

    KEY_STATUS[KEY_CODES[e.keyCode]] = false;

  }
);

function handleChat(e){
    if(KEY_CODES[e.keyCode] === 'enter'){
      Game.currentMessage = Game.currentMessage.substring(1, Game.currentMessage.length);
      addChatToScreen(Game.currentMessage);
      Game.chatmode = false;
      Game.currentMessage = ">";
      return;
    }
        //talk
      var input = String.fromCharCode(e.keyCode).toLowerCase();
      if(/[a-zA-Z0-9-_ ]/.test(input)){
        Game.currentMessage = Game.currentMessage + input;
      }else if(e.keyCode == 8){//backspace
        Game.currentMessage = Game.currentMessage.substring(0, currentMessage.length - 1);
      }
    }
        //Game.isChatting = false;
        // if(currentMessage == "" || currentMessage == " " || currentMessage == "  "){
        //   currentMessage = "";
        //   break;
        //


function addChatToScreen(string){
  var tempA = Game.messages[0];
  var tempA2 = Game.messageTimer[0];
  var tempB = "";
  var tempB2 = 0;
    for(var i = 1; i < Game.messages.length; i++){
      tempB = Game.messages[i];
      tempB2 = Game.messageTimer[i];
      Game.messages[i] = tempA;
      Game.messageTimer[i] = tempA2;
      tempA = tempB;
      tempA2 = tempB2;
    }
    Game.messages[0] = string;
    Game.messageTimer[0] = 600;
}
