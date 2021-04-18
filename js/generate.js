//utility to map values from range 0-1 to range 0-255
function toneMap(val) {
  return Math.floor(255.999 * val);
}

//Generate the image
//generates a smooth gradient for now
function generate() {
  for (var j = canvasHeight - 1; j >= 0; --j) {
    for (var i = 0; i < canvasWidth; ++i) {
      pixel[i][j] = new color(
        toneMap((i * 1.0) / (canvasWidth - 1)),
        toneMap((j * 1.0) / (canvasHeight - 1)),
        toneMap(0.25)
      );
    }
  }
}
