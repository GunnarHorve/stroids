var Sprite = require('./sprite');

Bullet = function () {
  this.init("bullet", [0, 0]);
  this.time = 0;
  this.bridgesH = false;
  this.bridgesV = false;
  this.postMove = this.wrapPostMove;
  // asteroid can look for bullets so doesn't have
  // to be other way around
  //this.collidesWith = ["asteroid"];

  this.configureTransform = function () {};
  // this.draw = function () {
  //   if (this.visible) {
  //     this.context.save();
  //     this.context.lineWidth = 2;
  //     this.context.beginPath();
  //     this.context.moveTo(this.x-1, this.y-1);
  //     this.context.lineTo(this.x+1, this.y+1);
  //     this.context.moveTo(this.x+1, this.y-1);
  //     this.context.lineTo(this.x-1, this.y+1);
  //     this.context.stroke();
  //     this.context.restore();
  //   }
  // };
  this.preMove = function (delta) {
    // console.log('moving '+this.visible+'  '+delta+'  '+this.time);
    if (this.visible) {
      this.time += delta;
    }
    if (this.time > 50) {
      this.die();
    }
  };
  this.collision = function (other) {
    this.time = 0;
    this.visible = false;
    this.currentNode.leave(this);
    this.currentNode = null;
  };
  this.transformedPoints = function (other) {
    return [this.x, this.y];
  };

};
Bullet.prototype = new Sprite();
module.exports = Bullet;
