Asteroid = function () {
  this.init("asteroid",
            [-10,   0,
              -5,   7,
              -3,   4,
               1,  10,
               5,   4,
              10,   0,
               5,  -6,
               2, -10,
              -4, -10,
              -4,  -5]);

  this.visible = true;
  this.scale = 6;
  this.postMove = this.wrapPostMove;
};
Asteroid.prototype = new Sprite();
