Ship = function () {
  this.init("ship",
            [-5,   4,
              0, -12,
              5,   4]);

  this.children.exhaust = new Sprite();
  this.children.exhaust.init("exhaust",
                             [-3,  6,
                               0, 11,
                               3,  6]);

  this.bulletCounter = 0;

  this.postMove = this.wrapPostMove;

}

Ship.prototype = new Sprite();
