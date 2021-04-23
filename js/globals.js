//don't judge the global variable pattern
//I'm just following along the tutorial right now, will cleanup later
//TODO : Replace global vars with something cleaner
var canvasWidth;
var canvasHeight;
var pixel;
function initialize(width, height) {
  pixel = [];
  canvasHeight = height;
  canvasWidth = width;
  for (var x = 0; x < canvasWidth; x++) {
    pixel[x] = [];
  }
  for (var x = 0; x < canvasWidth; x++) {
    for (var y = 0; y < canvasHeight; y++) {
      pixel[x][y] = new color(0.0, 0.0, 0.0);
    }
  }
}
