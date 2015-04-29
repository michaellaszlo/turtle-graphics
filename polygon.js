var Polygon = {
  color: {
    axes: '#ccc',
    side: {
       hover: { plain: '#e4e277', special: '#bab850' },
       final: { plain: '#b3e477', special: '#85a55e' }
    }
  }
};
Polygon.resize = function() {
  var g = Polygon,
      canvas = g.canvas,
      context = g.context,
      width = canvas.width = window.innerWidth,
      height = canvas.height = window.innerHeight;
  g.origin = { left: Math.floor(width/2), top: Math.floor(height/2) };
  g.drawAxes();
};
Polygon.drawAxes = function() {
  var g = Polygon,
      canvas = g.canvas,
      context = g.context,
      origin = g.origin,
      color = g.color;
  context.lineWidth = 2;
  context.strokeStyle = color.axes;
  context.beginPath();
  context.moveTo(origin.left, 0);
  context.lineTo(origin.left, canvas.height);
  context.moveTo(0, origin.top);
  context.lineTo(canvas.width, origin.top);
  context.stroke();
};
Polygon.turtle = { x: 0, y: 0, angle: 0 };
Polygon.turtle.setPosition = function (x, y) {
  var g = Polygon,
      turtle = g.turtle,
      context = g.context,
      origin = g.origin;
  turtle.x = x;
  turtle.y = y;
  context.moveTo(origin.left + turtle.x, origin.top - turtle.y);
};
Polygon.turtle.setAngle = function (angle) {
  var g = Polygon,
      turtle = g.turtle;
  turtle.angle = angle;
};
Polygon.turtle.left = function (turn) {
  var g = Polygon,
      turtle = g.turtle;
  g.turtle.angle = g.normalizeAngle(g.turtle.angle + turn);
};
Polygon.turtle.right = function (turn) {
  var g = Polygon,
      turtle = g.turtle;
  g.turtle.angle = g.normalizeAngle(g.turtle.angle - turn);
};
Polygon.turtle.forward = function (distance) {
  var g = Polygon,
      turtle = g.turtle,
      canvas = g.canvas,
      context = g.context,
      origin = g.origin;
  turtle.x += Math.cos(turtle.angle)*distance;
  turtle.y += Math.sin(turtle.angle)*distance;
  context.lineTo(origin.left + turtle.x, origin.top - turtle.y);
};
Polygon.normalizeAngle = function (angle) {
  angle -= Math.floor(angle/(2*Math.PI))*2*Math.PI;
  return angle;
};
Polygon.drawPolygon = function(x1, y1, x2, y2,
    strokeStyleWhole, strokeStyleFirst) {
  var g = Polygon,
      canvas = g.canvas,
      context = g.context,
      turtle = g.turtle,
      n = parseInt(document.getElementById('numSides').innerHTML, 10),
      turn = 2*Math.PI / n,
      dx = x2-x1,
      dy = y2-y1,
      length = Math.sqrt(dx*dx + dy*dy);
  if (dy >= 0) {
    var angle = Math.acos(dx/length);
  } else {
    var angle = 2*Math.PI - Math.acos(dx/length);
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
  g.drawAxes();
  context.lineWidth = 4;
  context.beginPath();
  if (strokeStyleWhole != undefined) {
    context.strokeStyle = strokeStyleWhole;
  }
  turtle.setPosition(x1, y1);
  turtle.setAngle(angle);
  for (var i = 0; i < n; ++i) {
    turtle.forward(length);
    turtle.left(turn);
  }
  context.stroke();
  if (strokeStyleFirst !== undefined) {
    context.strokeStyle = strokeStyleFirst;
    context.beginPath();
    turtle.setPosition(x1, y1);
    turtle.forward(length);
    context.stroke();
  }
}
Polygon.load = function () {
  var g = Polygon,
      canvas = g.canvas = document.getElementById('surface'),
      context = g.context = canvas.getContext('2d'),
      display = { begin: document.getElementById('begin'),
                  end: document.getElementById('end') },
      color = g.color;
  g.resize();
  window.onresize = g.resize;
  function makeUnselectable(element) {
    element.className += ' unselectable';
    element.ondragstart = element.onselectstart = function (event) {
      event.preventDefault();
    };
  }
  makeUnselectable(canvas);
  var numSides = document.getElementById('numSides'),
      minus = document.getElementById('minus'),
      plus = document.getElementById('plus');
  minus.onmousedown = function () {
    var current = parseInt(numSides.innerHTML, 10);
    if (current > 3) {
      numSides.innerHTML = current-1;
    }
  };
  plus.onmousedown = function () {
    var current = parseInt(numSides.innerHTML, 10);
    if (current < 20) {
      numSides.innerHTML = current+1;
    }
  };
  var controls = [display.begin, display.end, numSides, minus, plus,
                  document.getElementById('options')];
  for (var i = 0; i < controls.length; ++i) {
    makeUnselectable(controls[i]);
  }
  var getPosition = function (event) {
    event = event || window.event;
    var rect = canvas.getBoundingClientRect(),
        left = event.clientX - rect.left,
        top = event.clientY - rect.top,
        origin = g.origin,
        x = left - origin.left,
        y = origin.top - top;
    return { x: x, y: y };
  };
  var x1, y1, x2, y2;
  canvas.onmousedown = function (event) {
    document.body.style.cursor = 'default';
    var position = getPosition(event);
    x1 = x2 = position.x;
    y1 = y2 = position.y;
    display.begin.innerHTML = '<span class="label">x1, y1 =</span> '+x1+', '+y1;
    display.end.innerHTML = '';
    Polygon.drawPolygon(x1, y1, x2, y2,
                        color.side.hover.plain, color.side.hover.special);
    for (var i = 0; i < controls.length; ++i) {
      controls[i].style.zIndex = -10;
    }
    canvas.onmousemove = function (event) {
      var position = getPosition(event);
      x2 = position.x;
      y2 = position.y;
      display.end.innerHTML = '<span class="label">x2, y2 =</span> '+x2+', '+y2;
      Polygon.drawPolygon(x1, y1, x2, y2,
                          color.side.hover.plain, color.side.hover.special);
    };
  };
  function noop() {
  }
  canvas.onmousemove = noop;
  canvas.onmouseup = canvas.onmouseout = function (event) {
    if (canvas.onmousemove === noop) {
      return;
    }
    canvas.onmousemove = noop;
    Polygon.drawPolygon(x1, y1, x2, y2,
                        color.side.final.plain, color.side.final.special);
    for (var i = 0; i < controls.length; ++i) {
      controls[i].style.zIndex = 0;
    }
  };
};
window.onload = Polygon.load;
