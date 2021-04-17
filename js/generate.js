function toneMap(val) {
  return Math.floor(255.999 * val);
}
function generate() {
  for (var j = canvasHeight - 1; j >= 0; --j) {
    for (var i = 0; i < canvasWidth; ++i) {
      r[i][j] = toneMap((i * 1.0) / (canvasWidth - 1));
      g[i][j] = toneMap((j * 1.0) / (canvasHeight - 1));
      b[i][j] = toneMap(0.25);
      a[i][j] = 255;
    }
  }
}
