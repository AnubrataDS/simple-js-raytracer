class camera {
  constructor(lookfrom, lookat, vup, vfov, aspect_ratio, aperture, focus_dist) {
    this.aspect_ratio = aspect_ratio;

    var theta = this.degrees_to_radians(vfov);
    var h = Math.tan(theta / 2.0);
    this.viewport_height = 2.0 * h;
    this.viewport_width = this.aspect_ratio * this.viewport_height;

    this.w = unit_vector(subtract(lookfrom, lookat));
    this.u = unit_vector(cross(vup, this.w));
    this.v = cross(this.w, this.u);

    this.origin = lookfrom;
    this.horizontal = multiplyConst(this.u, focus_dist * this.viewport_width);
    this.vertical = multiplyConst(this.v, focus_dist * this.viewport_height);
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
      multiplyConst(this.w, focus_dist)
    );
    this.lens_radius = aperture / 2.0;
  }
  getRay(s, t) {
    //the offset part is to move things a little bit for forced DOF/ defocus blur effect
    var rd = multiplyConst(random_in_unit_disk(), this.lens_radius);
    var offset = add(
      multiplyConst(this.u, rd.x()),
      multiplyConst(this.v, rd.y())
    );

    //direction = lower_left_corner + u*horizontal + v*vertical - origin
    //current point is at (lower_left_corner + s*horizontal + t*vertical)
    //we subtract origin to find the direction vector from origin to current point
    //making it unit length is not necessary

    var direction = this.lower_left_corner;
    direction = add(direction, multiplyConst(this.horizontal, s));
    direction = add(direction, multiplyConst(this.vertical, t));
    direction = subtract(direction, this.origin);
    direction = subtract(direction, offset);
    return new ray(add(this.origin, offset), direction);
  }
  degrees_to_radians(degrees) {
    return (degrees * Math.PI) / 180.0;
  }
}
