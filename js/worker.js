importScripts(
  "ray.js",
  "material.js",
  "camera.js",
  "vec3.js",
  "hittable.js",
  "globals.js",
  "generate.js",
  "texture.js"
);
onmessage = function (e) {
  initialize(e.data.width, e.data.height);
  var samples_per_pixel = 50; //More makes image better but generation is much slower
  var world = generateWorld();
  var camera = getCamera();
  for (var s = 1; s <= samples_per_pixel; s++) {
    var t0 = performance.now();
    generate(world, camera, s);
    var t1 = performance.now();
    postMessage({
      pixel: unwrapPixels,
      pass: s,
      time: t1 - t0,
    });
  }

  self.close();
};

function unwrapPixels() {
  var arr = [];
  for (var y = 0; y < canvasHeight; ++y) {
    for (var x = 0; x < canvasWidth; ++x) {
      //somehow image came out upside down so had to mirror along x axis on render
      //TODO : find out why this happens
      //var index = (x + (canvasHeight - y) * canvasWidth) * 4;
      arr.push(pixel[x][canvasHeight - y - 1].e[0]);
      arr.push(pixel[x][canvasHeight - y - 1].e[1]);
      arr.push(pixel[x][canvasHeight - y - 1].e[2]);
      arr.push(255);
    }
  }
  return arr;
}
