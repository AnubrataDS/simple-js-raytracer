class vec3 {
  constructor(e0, e1, e2) {
    this.e = [];
    this.e[0] = e0;
    this.e[1] = e1;
    this.e[2] = e2;
  }
  //I can't believe I'm saying this but right now I wish JS had operator overloading
  add(v) {
    this.e[0] += v.e[0];
    this.e[1] += v.e[1];
    this.e[2] += v.e[2];
    return this;
  }
  multiply(t) {
    this.e[0] += t;
    this.e[1] += t;
    this.e[2] += t;
    return this;
  }
  divide(t) {
    return this.multiply(1.0 / t);
  }
  negative() {
    return new vec3(-e[0], -e[1], -e[2]);
  }
  length_squared() {
    return e[0] * e[0] + e[1] * e[1] + e[2] * e[2];
  }
  length() {
    return Math.sqrt(this.length_squared());
  }
  toString() {
    return e[0] + " " + e[1] + " " + e[2];
  }
}

// aliasing for code readability later on
var point3 = vec3;
var color = vec3;

//utility functions for vectors
//again, global scoping is bad but I'm trying to follow along for now
//TODO : Remove global scoped material

function dot_product(u, v) {
  return u.e[0] * v.e[0] + u.e[1] * v.e[1] + u.e[2] * v.e[2];
}

function cross_product(u, v) {
  return new vec3(
    u.e[1] * v.e[2] - u.e[2] * v.e[1],
    u.e[2] * v.e[0] - u.e[0] * v.e[2],
    u.e[0] * v.e[1] - u.e[1] * v.e[0]
  );
}

function unit_vector(v) {
  return v / v.length();
}
