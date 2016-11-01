function Turtle(canvas, origin) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.origin = origin;
  this.x = 0;
  this.y = 0;
  this.angle = 0;
  this.drawing = true;
}

Turtle.prototype.setPosition = function (x, y) {
  this.x = x;
  this.y = y;
};

Turtle.prototype.setAngle = function (angle) {
  this.angle = angle;
};

Turtle.prototype.normalizeAngle = function (angle) {
  angle -= Math.floor(angle / (2*Math.PI)) * 2*Math.PI;
  return angle;
};

Turtle.prototype.left = function (turn) {
  this.angle = this.normalizeAngle(this.angle + turn);
};

Turtle.prototype.right = function (turn) {
  this.left(-turn);
};

Turtle.prototype.penUp = function () {
  this.drawing = false;
};

Turtle.prototype.penDown = function () {
  this.drawing = true;
};

Turtle.prototype.forward = function (distance) {
  var x0 = this.x,
      y0 = this.y;
  this.x += Math.cos(this.angle) * distance;
  this.y += Math.sin(this.angle) * distance;
  if (this.drawing) {
    this.context.beginPath();
    this.context.moveTo(this.origin.left + x0, this.origin.top - y0);
    this.context.lineTo(this.origin.left + this.x, this.origin.top - this.y);
    this.context.closePath();
    this.context.stroke();
  }
};

