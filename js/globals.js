//don't judge the global variable pattern
//I'm just following along the tutorial right now, will cleanup later
//TODO : Replace global vars with something cleaner
//TODO : Replace the 4 arrays with a single hex array maybe

var canvas = document.getElementById("MainCanvas");
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var r, g, b, a;
function initialize() {
  r = [];
  g = [];
  b = [];
  a = [];
  for (var x = 0; x < canvasWidth; x++) {
    r[x] = [];
    g[x] = [];
    b[x] = [];
    a[x] = [];
  }
  for (var x = 0; x < canvasWidth; x++) {
    for (var y = 0; y < canvasHeight; y++) {
      r[x][y] = 0.0;
      g[x][y] = 0.0;
      b[x][y] = 0.0;
      a[x][y] = 0.0;
    }
  }
}

initialize();
