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
  // var unit_direction = unit_vector(r.direction);
  // //unit_direction is in range -1 to 1, map it to range 0 to 1
  // var t = (unit_direction.y() + 1.0) * 0.5;
  // var start = new color(1.0, 1.0, 1.0); //white
  // var end = new color(0.5, 0.7, 1.0); //sky blue
  // return lerp(start, end, t);
  return new color(0.2, 0.2, 0.3);
}

function random_unit_vec() {
  while (true) {
    var p = random_vector(-1, 1);
    if (p.length_squared() >= 1) continue;
    return p;
  }
}

//get color of ray at r
//returns in range 0 to 1
function ray_color(r, world, depth) {
  var rec = new hit_record();
  if (depth <= 0) return new color(0, 0, 0); //stack safety lol
  if (world.hit(r, 0.001, Number.MAX_SAFE_INTEGER, rec)) {
    var scattered = new ray();
    var emitted = rec.mat_ptr.emitted(rec.u, rec.v, rec.p);
    var attenuation = new color(0, 0, 0);
    if (!rec.mat_ptr.scatter(r, rec, attenuation, scattered)) return emitted;

    return add(
      emitted,
      multiplyVec(attenuation, ray_color(scattered, world, depth - 1))
    );
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

function generateWorld() {
  var world = new hittable_list();

  //ground
  var material_ground = new lambertian(
    new color(
      0.5 + random_ranged(-0.2, 0.2),
      0.5 + random_ranged(-0.2, 0.2),
      0.5 + random_ranged(-0.2, 0.2)
    )
  );
  world.add(new sphere(new point3(0.0, -1000, 0), 1000.0, material_ground));

  //small random spheres
  for (var i = 0; i < 10; i++) {
    var choose_mat = Math.random();
    var radius = random_ranged(0.1, 0.5);
    var center = new vec3(random_ranged(-5, 5), radius, random_ranged(0, 4));
    if (subtract(center, new point3(4, 0.2, 0)).length() > 0.9) {
      if (choose_mat < 0.4) {
        //light
        var col = new color(
          random_ranged(0.6, 5.0),
          random_ranged(0.6, 5.0),
          random_ranged(0.6, 5.0)
        );
        var sphere_material = new diffuse_light(col);
        world.add(new sphere(center, radius, sphere_material));
      } else if (choose_mat < 0.4) {
        // diffuse
        var albedo = new color(Math.random(), Math.random(), Math.random());
        var sphere_material = new lambertian(albedo);
        world.add(new sphere(center, radius, sphere_material));
      } else if (choose_mat < 0.8) {
        // metal
        var albedo = new color(
          random_ranged(0.5, 1),
          random_ranged(0.5, 1),
          random_ranged(0.5, 1)
        );
        var fuzz = random_ranged(0, 0.8);
        var sphere_material = new metal(albedo, fuzz);
        world.add(new sphere(center, radius, sphere_material));
      } else {
        // glass
        var sphere_material = new dielectric(1.5);
        world.add(new sphere(center, radius, sphere_material));
      }
    }
  }
  //big spheres
  var material_lambert = new lambertian(new color(0.1, 0.2, 0.5));
  var material_glass = new dielectric(1.5);
  var material_metal = new metal(new color(0.8, 0.6, 0.2), 0.1);
  var material_light = new diffuse_light(new color(1.8, 1.6, 1.6));
  world.add(new sphere(new point3(0, 1, 0), 1.0, material_glass));
  world.add(new sphere(new point3(-4, 1, 0), 1.0, material_lambert));
  world.add(new sphere(new point3(4, 1, 0), 1.0, material_metal));
  //world.add(new sphere(new point3(0, 2, -1.5), 1.0, material_light));

  return world;
}

function getCamera() {
  var lookfrom = new point3(13 * Math.sign(random_ranged(-1, 1)), 4, 5);
  var lookat = new point3(0, 0, 0);
  var vup = new point3(0, 1, 0);
  var dist_to_focus = subtract(lookfrom, lookat).length();
  var aperture = 0.1;
  var aspect_ratio = canvasWidth / canvasHeight;
  var cam = new camera(
    lookfrom,
    lookat,
    vup,
    25,
    aspect_ratio,
    aperture,
    dist_to_focus
  );
  return cam;
}
//Generate the image
//generates a smooth gradient for now
function generate(world, cam, sampleCount) {
  var max_depth = 15; //recursion depth for ray bouncing, more means less black spots

  for (var j = canvasHeight - 1; j >= 0; --j) {
    for (var i = 0; i < canvasWidth; ++i) {
      //var pixel_color = new color(0, 0, 0);
      var u = (i + Math.random()) / (canvasWidth - 1);
      var v = (j + Math.random()) / (canvasHeight - 1);
      var r = cam.getRay(u, v);
      var pixel_color = ray_color(r, world, max_depth);
      var final = reverse_write_color(pixel[i][j], sampleCount - 1);
      final = add(final, pixel_color);
      final = write_color(final, sampleCount);
      //cons;
      pixel[i][j] = final;
    }
  }
}

function reverse_write_color(col, sampleCount) {
  var res = multiplyConst(col, 1.0 / 256);
  res = new color(
    res.x() * res.x() * sampleCount,
    res.y() * res.y() * sampleCount,
    res.z() * res.z() * sampleCount
  );
  return res;
}
