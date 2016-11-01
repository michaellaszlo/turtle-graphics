var Polygon = (function () {
  var color = {
        axis: '#ccc',
        side: {
           hover: { plain: '#dddfa4', special: '#9d9c64' },
           final: { plain: '#b0c598', special: '#4f7337' }
        }
      },
      display = {},
      points = {},
      canvas,
      context,
      origin = {},
      turtle;

  function resize() {
    var g = Polygon,
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight;
    origin.left = Math.floor(width/2);
    origin.top = Math.floor(height/2);
    drawAxes();
  }

  function drawAxes() {
    var g = Polygon;
    context.lineWidth = 2;
    context.strokeStyle = color.axis;
    context.beginPath();
    context.moveTo(origin.left, 0);
    context.lineTo(origin.left, canvas.height);
    context.moveTo(0, origin.top);
    context.lineTo(canvas.width, origin.top);
    context.stroke();
  }

  function drawPolygon(status) {
    var g = Polygon,
        n = parseInt(document.getElementById('numSides').innerHTML, 10),
        turn = 2*Math.PI / n,
        x1 = points.x1, y1 = points.y1, x2 = points.x2, y2 = points.y2,
        dx = x2 - x1,
        dy = y2 - y1,
        length = Math.sqrt(dx*dx + dy*dy);
    if (dy >= 0) {
      var angle = Math.acos(dx/length);
    } else {
      var angle = 2*Math.PI - Math.acos(dx/length);
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawAxes();
    context.lineWidth = 4;
    context.lineCap = 'round';
    context.beginPath();
    context.strokeStyle = color.side[status].plain;
    turtle.setPosition(x1, y1);
    turtle.setAngle(angle);
    for (var i = 0; i < n; ++i) {
      turtle.forward(length);
      turtle.left(turn);
    }
    context.closePath();
    context.stroke();
    context.strokeStyle = color.side[status].special;
    context.beginPath();
    turtle.setPosition(x1, y1);
    turtle.forward(length);
    context.stroke();
  }

  function makeUnselectable(element) {
    element.className += ' unselectable';
    element.ondragstart = element.onselectstart = function (event) {
      event.preventDefault();
    };
  }

  function getPosition (event) {
    event = event || window.event;
    var rect = canvas.getBoundingClientRect(),
        left = event.clientX - rect.left,
        top = event.clientY - rect.top,
        x = left - origin.left,
        y = origin.top - top;
    return { x: x, y: y };
  }

  function load() {
    var numSides = document.getElementById('numSides'),
        minus = document.getElementById('minus'),
        plus = document.getElementById('plus'),
        controls, i;
    canvas = document.getElementById('surface');
    context = canvas.getContext('2d');
    display.begin = document.getElementById('begin');
    display.end = document.getElementById('end');
    resize();
    turtle = new Turtle(canvas, origin);
    window.onresize = resize;
    makeUnselectable(canvas);
    minus.onmousedown = function () {
      var current = parseInt(numSides.innerHTML, 10);
      if (current == 3) {
        return;
      }
      numSides.innerHTML = current-1;
      drawPolygon('final');
    };
    plus.onmousedown = function () {
      var current = parseInt(numSides.innerHTML, 10);
      if (current == 20) {
        return;
      }
      numSides.innerHTML = current+1;
      drawPolygon('final');
    };
    controls = [ display.begin, display.end, numSides, minus, plus,
                 document.getElementById('options') ];
    for (i = 0; i < controls.length; ++i) {
      makeUnselectable(controls[i]);
    }
    canvas.onmousedown = function (event) {
      document.body.style.cursor = 'default';
      var position = getPosition(event);
      points.x1 = points.x2 = position.x;
      points.y1 = points.y2 = position.y;
      display.begin.innerHTML = '<span class="label">x1, y1 =</span> ' +
          points.x1 + ', ' + points.y1;
      display.end.innerHTML = '';
      drawPolygon('hover');
      for (var i = 0; i < controls.length; ++i) {
        controls[i].style.zIndex = -10;
      }
      canvas.onmousemove = function (event) {
        var position = getPosition(event);
        points.x2 = position.x;
        points.y2 = position.y;
        display.end.innerHTML = '<span class="label">x2, y2 =</span> ' +
            points.x2 + ', ' + points.y2;
        drawPolygon('hover');
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
      drawPolygon('final');
      for (var i = 0; i < controls.length; ++i) {
        controls[i].style.zIndex = 0;
      }
    };
  };

  return {
    load: load
  };
})();

onload = Polygon.load;
