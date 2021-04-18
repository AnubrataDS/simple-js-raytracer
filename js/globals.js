//don't judge the global variable pattern
//I'm just following along the tutorial right now, will cleanup later
//TODO : Replace global vars with something cleaner

var canvas = document.getElementById("MainCanvas");
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var pixel;
function initialize() {
  pixel = [];
  for (var x = 0; x < canvasWidth; x++) {
    pixel[x] = [];
  }
  for (var x = 0; x < canvasWidth; x++) {
    for (var y = 0; y < canvasHeight; y++) {
      pixel[x][y] = new color(0.0, 0.0, 0.0);
    }
  }
}
