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

function random_unit_vec_in_unit_sphere() {
  while (true) {
    var p = random_vector(-1, 1);
    if (p.length_squared() >= 1) continue;
    return unit_vector(p);
  }
}

//get color of ray at r
//returns in range 0 to 1
function ray_color(r, world, depth) {
  var rec = new hit_record();
  if (depth <= 0) return new color(0, 0, 0); //stack safety lol
  if (world.hit(r, 0.001, Number.MAX_SAFE_INTEGER, rec)) {
    //for each intersection, we 'bounce' the ray in a random point in unit sphere normal to the current point
    var target = add(rec.p, rec.normal);
    target = add(target, random_unit_vec_in_unit_sphere());

    var newRay = new ray(rec.p, subtract(target, rec.p));

    var col = ray_color(newRay, world, depth - 1);
    col = multiplyConst(col, 0.5);
    return col;
  }
  //if nothing hit
  return sky_gradient(r);
}

function write_color(col, samples_per_pixel) {
  var scale = 1.0 / samples_per_pixel;
  //gamma correction
  var newCol = new color(
    Math.sqrt(col.x() * scale),
    Math.sqrt(col.y() * scale),
    Math.sqrt(col.z() * scale)
  );
  return toneMap(newCol);
}
//Generate the image
//generates a smooth gradient for now
function generate() {
  //world(scene)
  var world = new hittable_list();
  world.add(new sphere(new point3(0, 0, -1), 0.5));
  world.add(new sphere(new point3(0, -100.5, -1), 100));
  //camera settings
  var samples_per_pixel = 20; //More makes image better but generation is much slower
  var max_depth = 20; //recursion depth for ray bouncing
  var cam = new camera();

  for (var j = canvasHeight - 1; j >= 0; --j) {
    for (var i = 0; i < canvasWidth; ++i) {
      var pixel_color = new color(0, 0, 0);
      for (var s = 0; s < samples_per_pixel; ++s) {
        var u = (i + Math.random()) / (canvasWidth - 1);
        var v = (j + Math.random()) / (canvasHeight - 1);
        var r = cam.getRay(u, v);
        pixel_color.add(ray_color(r, world, max_depth));
      }

      pixel[i][j] = write_color(pixel_color, samples_per_pixel);
    }
  }
}
