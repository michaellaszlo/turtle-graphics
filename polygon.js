var Polygon = {};
Polygon.resize = function() {
  var g = Polygon,
      canvas = g.canvas;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
Polygon.load = function () {
  var g = Polygon,
      canvas = g.canvas = document.getElementById('surface'),
      context = canvas.getContext('2d'),
      display = { begin: document.getElementById('begin'),
                  end: document.getElementById('end') };
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
    numSides.innerHTML = parseInt(numSides.innerHTML, 10) - 1;
  };
  plus.onmousedown = function () {
    numSides.innerHTML = parseInt(numSides.innerHTML, 10) + 1;
  };
  var controls = [display.begin, display.end, numSides, minus, plus,
                  document.getElementById('options')];
  for (var i = 0; i < controls.length; ++i) {
    makeUnselectable(controls[i]);
  }
  var getPosition = function (event) {
    event = event || window.event;
    var rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  var x1, y1, x2, y2;
  canvas.onmousedown = function (event) {
    document.body.style.cursor = 'default';
    var position = getPosition(event);
    x1 = x2 = position.x;
    y1 = y2 = position.y;
    display.end.innerHTML = '';
    display.begin.innerHTML = '<span class="label">x1, y1 =</span> '+x1+', '+y1;
    context.lineWidth = 3;
    context.strokeStyle = '#96a93a';
    for (var i = 0; i < controls.length; ++i) {
      controls[i].style.zIndex = -10;
    }
    canvas.onmousemove = function (event) {
      var position = getPosition(event);
      x2 = position.x;
      y2 = position.y;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
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
    for (var i = 0; i < controls.length; ++i) {
      controls[i].style.zIndex = 0;
    }
    var position = getPosition(event);
    display.end.innerHTML = '<span class="label">x2, y2 =</span> '+x2+', '+y2;
    context.strokeStyle = '#2c562d';
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  };
};
window.onload = Polygon.load;
