//Draw image to the canvas
//TODO : Profile this to see if imagedata is actually faster than drawing unit width rectangles at each point

function render() {
  var ctx = canvas.getContext("2d");
  var canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  for (var y = 0; y < canvasHeight; ++y) {
    for (var x = 0; x < canvasWidth; ++x) {
      //somehow image came out upside down so had to mirror along x axis on render
      //TODO : find out why this happens
      var index = (x + (canvasHeight - y) * canvasWidth) * 4;
      canvasData.data[index + 0] = pixel[x][y].e[0];
      canvasData.data[index + 1] = pixel[x][y].e[1];
      canvasData.data[index + 2] = pixel[x][y].e[2];
      canvasData.data[index + 3] = 255;
    }
  }

  ctx.putImageData(canvasData, 0, 0);
}
