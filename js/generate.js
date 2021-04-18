//utility to map values from range 0-1 to range 0-255
function toneMap(col) {
  return new color(
    Math.floor(256 * clamp(col.x(), 0, 0.999)),
    Math.floor(256 * clamp(col.y(), 0, 0.999)),
    Math.floor(256 * clamp(col.z(), 0, 0.999))
  );
}

function clamp(x, min, max) {
  if (x < min) return min;
  if (x > max) return max;
  return x;
}

function sky_gradient(r) {
  //generates a linear gradient along y-axis
  var unit_direction = unit_vector(r.direction);
  //unit_direction is in range -1 to 1, map it to range 0 to 1
  var t = (unit_direction.y() + 1.0) * 0.5;
  var start = new color(1.0, 1.0, 1.0); //white
  var end = new color(0.5, 0.7, 1.0); //sky blue
  return lerp(start, end, t);
}
//get color of ray at r
//returns in range 0 to 1
function ray_color(r, world) {
  var rec = new hit_record();
  if (world.hit(r, 0, Number.MAX_SAFE_INTEGER, rec)) {
    //map from range -1 to 1 to range 0 to 1
    var col = add(rec.normal, new color(1, 1, 1));
    col = multiplyConst(col, 0.5);
    return col;
  }
  //if nothing hit
  return sky_gradient(r);
}

function write_color(col, samples_per_pixel) {
  var scale = 1.0 / samples_per_pixel;
  return toneMap(multiplyConst(col, scale));
}
//Generate the image
//generates a smooth gradient for now
function generate() {
  //world(scene)
  var world = new hittable_list();
  world.add(new sphere(new point3(0, 0, -1), 0.5));
  world.add(new sphere(new point3(0, -100.5, -1), 100));
  //camera settings
  var samples_per_pixel = 10; //anti-aliasing parameter. More is smoother but much slower
  var cam = new camera();

  for (var j = canvasHeight - 1; j >= 0; --j) {
    for (var i = 0; i < canvasWidth; ++i) {
      var pixel_color = new color(0, 0, 0);
      for (var s = 0; s < samples_per_pixel; ++s) {
        var u = (i + Math.random()) / (canvasWidth - 1);
        var v = (j + Math.random()) / (canvasHeight - 1);
        var r = cam.getRay(u, v);
        pixel_color.add(ray_color(r, world));
      }

      pixel[i][j] = write_color(pixel_color, samples_per_pixel);
    }
  }
}
