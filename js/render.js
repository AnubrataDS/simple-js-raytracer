//Draw image to the canvas
//TODO : Profile this to see if imagedata is actually faster than drawing unit width rectangles at each point

function render() {
  var ctx = canvas.getContext("2d");
  var canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  for (var x = 0; x < canvasWidth; x++) {
    for (var y = 0; y < canvasHeight; y++) {
      var index = (x + y * canvasWidth) * 4;
      canvasData.data[index + 0] = r[x][y];
      canvasData.data[index + 1] = g[x][y];
      canvasData.data[index + 2] = b[x][y];
      canvasData.data[index + 3] = a[x][y];
    }
  }
  ctx.putImageData(canvasData, 0, 0);
}
