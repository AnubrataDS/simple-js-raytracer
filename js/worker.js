importScripts(
  "ray.js",
  "material.js",
  "camera.js",
  "vec3.js",
  "hittable.js",
  "globals.js",
  "generate.js"
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
      pixel: pixel,
      pass: s,
      time: t1 - t0,
    });
  }

  self.close();
};
