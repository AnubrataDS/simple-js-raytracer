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
  for (var i = 0; i < height * width * 4; i++) {
    pixel.push(0);
  }
}
