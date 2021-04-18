class ray {
  //point3 origin, vec3 direction
  constructor(origin, direction) {
    this.origin = origin;
    this.direction = direction;
  }
  //return a point on the ray at given distance from origin
  at(t) {
    return origin.add(this.direction.multiply(t));
  }
}