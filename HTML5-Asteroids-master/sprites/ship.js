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

  this.collidesWith = [];

  this.collision = function (other) {
    SFX.explosion();
    Game.explosionAt(other.x, other.y);
    Game.FSM.state = 'player_died';
    this.visible = false;
    this.currentNode.leave(this);
    this.currentNode = null;
    Game.lives--;
  };

};
Ship.prototype = new Sprite();
