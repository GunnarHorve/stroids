GRID_SIZE = 60;

Matrix = function (rows, columns) {
  var i, j;
  this.data = new Array(rows);
  for (i = 0; i < rows; i++) {
    this.data[i] = new Array(columns);
  }

  this.configure = function (rot, scale, transx, transy) {
    var rad = (rot * Math.PI)/180;
    var sin = Math.sin(rad) * scale;
    var cos = Math.cos(rad) * scale;
    this.set(cos, -sin, transx,
             sin,  cos, transy);
  };

  this.set = function () {
    var k = 0;
    for (i = 0; i < rows; i++) {
      for (j = 0; j < columns; j++) {
        this.data[i][j] = arguments[k];
        k++;
      }
    }
  }

  this.multiply = function () {
    var vector = new Array(rows);
    for (i = 0; i < rows; i++) {
      vector[i] = 0;
      for (j = 0; j < columns; j++) {
        vector[i] += this.data[i][j] * arguments[j];
      }
    }
    return vector;
  };
};

GridNode = function () {
  this.north = null;
  this.south = null;
  this.east  = null;
  this.west  = null;

  this.nextSprite = null;

  this.dupe = {
    horizontal: null,
    vertical:   null
  };

  this.enter = function (sprite) {
    sprite.nextSprite = this.nextSprite;
    this.nextSprite = sprite;
  };

  this.leave = function (sprite) {
    var ref = this;
    while (ref && (ref.nextSprite != sprite)) {
      ref = ref.nextSprite;
    }
    if (ref) {
      ref.nextSprite = sprite.nextSprite;
      sprite.nextSprite = null;
    }
  };

  this.eachSprite = function(sprite, callback) {
    var ref = this;
    while (ref.nextSprite) {
      ref = ref.nextSprite;
      callback.call(sprite, ref);
    }
  };

  this.isEmpty = function (collidables) {
    var empty = true;
    var ref = this;
    while (ref.nextSprite) {
      ref = ref.nextSprite;
      empty = !ref.visible || collidables.indexOf(ref.name) == -1
      if (!empty) break;
    }
    return empty;
  };
};

module.exports = [GRID_SIZE, Matrix, GridNode];
