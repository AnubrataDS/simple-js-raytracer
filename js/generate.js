//utility to map values from range 0-1 to range 0-255
function toneMap(col) {
  return new color(
    Math.floor(255.999 * col.x()),
    Math.floor(255.999 * col.y()),
    Math.floor(255.999 * col.z())
  );
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

//Generate the image
//generates a smooth gradient for now
function generate() {
  //world(scene)
  var world = new hittable_list();
  world.add(new sphere(new point3(0, 0, -1), 0.5));
  world.add(new sphere(new point3(0, -100.5, -1), 100));
  //camera settings
  var aspect_ratio = canvasWidth / canvasHeight;

  var viewport_height = 2.0;
  var viewport_width = aspect_ratio * viewport_height;
  var focal_length = 1.0;

  var origin = new point3(0, 0, 0);
  var horizontal = new vec3(viewport_width, 0, 0);
  var vertical = new vec3(0, viewport_height, 0);

  //lower_left_corner = origin - horizontal/2 - vertical/2 - vec3(0, 0, focal_length);
  //into the screen is -ve z
  //camera(eye) is at (0,0,0)
  //"virtual viewport" is a rectangular planar segment , normal to z-axis
  //with dimensions (viewport_width,viewport_height,0)
  //and is centered at (0,0,focal_length)
  //we find the lower left corner of this rectangle

  var lower_left_corner = subtract(origin, divide(horizontal, 2.0));
  lower_left_corner = subtract(lower_left_corner, divide(vertical, 2.0));
  lower_left_corner = subtract(lower_left_corner, new vec3(0, 0, focal_length));

  for (var j = canvasHeight - 1; j >= 0; --j) {
    for (var i = 0; i < canvasWidth; ++i) {
      var u = (i * 1.0) / (canvasWidth - 1);
      var v = (j * 1.0) / (canvasHeight - 1);

      //direction = lower_left_corner + u*horizontal + v*vertical - origin
      //current point is at (lower_left_corner + u*horizontal + v*vertical)
      //we subtract origin to find the direction vector from origin to current point
      //making it unit length is not necessary

      var direction = lower_left_corner;
      direction = add(direction, multiplyConst(horizontal, u));
      direction = add(direction, multiplyConst(vertical, v));
      direction = subtract(direction, origin);
      var r = new ray(origin, direction);
      pixel[i][j] = toneMap(ray_color(r, world));
    }
  }
}
