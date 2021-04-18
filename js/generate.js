//utility to map values from range 0-1 to range 0-255
function toneMap(col) {
  return new color(
    Math.floor(255.999 * col.x()),
    Math.floor(255.999 * col.y()),
    Math.floor(255.999 * col.z())
  );
}

//get background color
//generates a linear gradient along y-axis
function ray_color(r) {
  var unit_direction = unit_vector(r.direction);
  var t = (unit_direction.y() + 1.0) * 0.5; //
  var start = new color(1.0, 1.0, 1.0); //white
  var end = new color(0.5, 0.7, 1.0); //sky blue
  return toneMap(lerp(start, end, t));
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

  var lower_left_corner = subtract(origin, divide(horizontal, 2.0));
  lower_left_corner = subtract(lower_left_corner, divide(vertical, 2.0));
  lower_left_corner = subtract(lower_left_corner, new vec3(0, 0, focal_length));

  console.log(lower_left_corner);
  for (var j = canvasHeight - 1; j >= 0; --j) {
    for (var i = 0; i < canvasWidth; ++i) {
      var u = (i * 1.0) / (canvasWidth - 1);
      var v = (j * 1.0) / (canvasHeight - 1);
      var direction = lower_left_corner;
      direction = add(direction, multiplyConst(horizontal, u));
      direction = add(direction, multiplyConst(vertical, v));
      direction = subtract(direction, origin);
      var r = new ray(origin, direction);
      pixel[i][j] = ray_color(r);
    }
  }
}
