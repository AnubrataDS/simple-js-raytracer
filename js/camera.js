class camera {
  constructor(vfov, aspect_ratio) {
    this.aspect_ratio = aspect_ratio;

    var theta = this.degrees_to_radians(vfov);
    var h = Math.tan(theta / 2.0);
    this.viewport_height = 2.0 * h;
    this.viewport_width = this.aspect_ratio * this.viewport_height;
    this.focal_length = 1.0;

    this.origin = new point3(0, 0, 0);
    this.horizontal = new vec3(this.viewport_width, 0, 0);
    this.vertical = new vec3(0, this.viewport_height, 0);
    //lower_left_corner = origin - horizontal/2 - vertical/2 - vec3(0, 0, focal_length);
    //into the screen is -ve z
    //camera(eye) is at (0,0,0)
    //"virtual viewport" is a rectangular planar segment , normal to z-axis
    //with dimensions (viewport_width,viewport_height,0)
    //and is centered at (0,0,focal_length)
    //we find the lower left corner of this rectangle

    this.lower_left_corner = subtract(
      this.origin,
      divide(this.horizontal, 2.0)
    );
    this.lower_left_corner = subtract(
      this.lower_left_corner,
      divide(this.vertical, 2.0)
    );
    this.lower_left_corner = subtract(
      this.lower_left_corner,
      new vec3(0, 0, this.focal_length)
    );
  }
  getRay(u, v) {
    //direction = lower_left_corner + u*horizontal + v*vertical - origin
    //current point is at (lower_left_corner + u*horizontal + v*vertical)
    //we subtract origin to find the direction vector from origin to current point
    //making it unit length is not necessary

    var direction = this.lower_left_corner;
    direction = add(direction, multiplyConst(this.horizontal, u));
    direction = add(direction, multiplyConst(this.vertical, v));
    direction = subtract(direction, this.origin);
    return new ray(this.origin, direction);
  }
  degrees_to_radians(degrees) {
    return (degrees * Math.PI) / 180.0;
  }
}
