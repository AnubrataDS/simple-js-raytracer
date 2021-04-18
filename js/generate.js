//utility to map values from range 0-1 to range 0-255
function toneMap(col) {
  return new color(
    Math.floor(255.999 * col.x()),
    Math.floor(255.999 * col.y()),
    Math.floor(255.999 * col.z())
  );
}

//calculate ray-sphere intersection
function hit_sphere(center, radius, r) {
  var oc = subtract(r.origin, center);
  var a = dot(r.direction, r.direction);
  var b = 2.0 * dot(oc, r.direction);
  var c = dot(oc, oc) - radius * radius;
  var discriminant = b * b - 4 * a * c;
  return discriminant > 0;
}
//get color of ray at r
function ray_color(r) {
  if (hit_sphere(new point3(0, 0, -1), 0.5, r)) return new color(1, 0, 0);
  //generates a linear gradient along y-axis if nothing hit
  var unit_direction = unit_vector(r.direction);
  //skew the gradient a bit for more blue area on top
  var t = (unit_direction.y() + 1.0) * 0.5;
  var start = new color(1.0, 1.0, 1.0); //white
  var end = new color(0.5, 0.7, 1.0); //sky blue
  return lerp(start, end, t);
}

//Generate the image
//generates a smooth gradient for now
function generate() {
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
      pixel[i][j] = toneMap(ray_color(r));
    }
  }
}
