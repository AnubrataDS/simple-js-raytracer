function render(pixel) {
  var canvas = document.getElementById("MainCanvas");
  var ctx = canvas.getContext("2d");
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;
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
var worker;
function main() {
  worker = new Worker("js/worker.js");
  var canvas = document.getElementById("MainCanvas");
  worker.postMessage({ width: canvas.width, height: canvas.height });
  worker.onmessage = function (e) {
    render(e.data.pixel);
    document.getElementById("status").innerHTML = `Pass ${e.data.pass} took ${
      e.data.time
    }ms , remaining : ${50 - e.data.pass} passes`;
  };
}
document.addEventListener("DOMContentLoaded", function () {
  main();
});

function newImage() {
  worker.terminate();
  main();
}
