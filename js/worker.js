importScripts(
  "ray.js",
  "material.js",
  "camera.js",
  "vec3.js",
  "hittable.js",
  "globals.js",
  "generate.js",
  "render.js"
);
onmessage = function (e) {
  initialize(e.data.width, e.data.height);
  var t0 = performance.now();
  generate();
  var t1 = performance.now();
  console.log(`Generated in ${t1 - t0} ms`);
  postMessage(pixel);
  self.close();
};
