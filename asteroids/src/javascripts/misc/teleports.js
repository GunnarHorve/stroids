doTeleports = function(pos,vel) {
  var c=document.getElementById("canvas");
  var ctx=c.getContext("2d");
  if(vel[0] >= 0) { //heading towards right walls
    if(pos[0] > pos[0]%800 + 800*Game.xCount) { //went through normal wall
      if(Game.xCount === 0 || Game.xCount === 1) {
        console.log("translated 1 tile right");
        Game.xCount++;
        ctx.translate(-800*1,0); //go 1 right
      }
    } else if(Game.xCount === 2 && pos[0] < 800) { //went through far wall
        Game.xCount=0;
        ctx.translate(800*2,0); //go 2 left
        console.log("translated 2 tiles left");

      }
  } else { //heading towards left walls
    if(Game.xCount === 0 && pos[0] > 1600) { //went through far wall
      Game.xCount = 2;
      ctx.translate(-800*2,0); //go 2 right
      console.log("translated 2 tiles right");

    } else if(Game.xCount === 2 && pos[0] < 1600) {
      Game.xCount = 1;
      ctx.translate(800,0); //go 1 left
      console.log("translated 1 tile left");
    } else if(Game.xCount === 1 && pos[0] < 800) {
      Game.xCount = 0;
      ctx.translate(800,0);
    }
  }

  if(vel[1] > 0) { //heading towards bottom walls
    if(pos[1] > pos[1]%600 + 600*Game.yCount) { //went through normal wall
      if(Game.yCount === 0 || Game.yCount === 1) {
        Game.yCount++;
        ctx.translate(0,-600*1); //go 1 down
        console.log("translated 1 tile down");
      }
    } else if(Game.yCount === 2 && pos[1] < 600) { //went through far wall
        Game.yCount=0;
        ctx.translate(0,600*2); //go 2 up
        console.log("translated 2 tiles up");
      }
  } else { //heading towards right walls
    if(Game.yCount === 0 && pos[1] > 1200) { //went through far wall
      Game.yCount = 2;
      ctx.translate(0,-600*2); //go 2 down
      console.log("translated 2 tiles down");
    } else if(Game.yCount === 2 && pos[1] < 1200) {
      Game.yCount = 1;
      ctx.translate(0,600); //go 1 up
      console.log("translated 1 tile up");
    } else if(Game.yCount === 1 && pos[1] < 600) {
      Game.yCount = 0;
      ctx.translate(0,600);
    }
  }
}
