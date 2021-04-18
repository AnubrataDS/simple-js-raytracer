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
  subtract(v) {
    return this.add(v.negative());
  }
  multiply(t) {
    this.e[0] *= t;
    this.e[1] *= t;
    this.e[2] *= t;
    return this;
  }
  divide(t) {
    return this.multiply(1.0 / t);
  }
  negative() {
    return new vec3(-this.e[0], -this.e[1], -this.e[2]);
  }
  length_squared() {
    return (
      this.e[0] * this.e[0] + this.e[1] * this.e[1] + this.e[2] * this.e[2]
    );
  }
  length() {
    return Math.sqrt(this.length_squared());
  }
  toString() {
    return this.e[0] + " " + this.e[1] + " " + this.e[2];
  }
  x() {
    return this.e[0];
  }
  y() {
    return this.e[1];
  }
  z() {
    return this.e[2];
  }
}

// aliasing for code readability later on
var point3 = vec3;
var color = vec3;

//utility functions for vectors
//again, global scoping is bad but I'm trying to follow along for now
//TODO : Remove global scoped material

function add(u, v) {
  return new vec3(u.x() + v.x(), u.y() + v.y(), u.z() + v.z());
}
function subtract(u, v) {
  return new vec3(u.x() - v.x(), u.y() - v.y(), u.z() - v.z());
}
function multiplyConst(u, t) {
  return new vec3(u.x() * t, u.y() * t, u.z() * t);
}
function multiplyVec(u, v) {
  return new vec3(u.x() * v.x(), u.y() * v.y(), u.z() * v.z());
}
function divide(u, t) {
  return multiplyConst(u, 1.0 / t);
}

function dot(u, v) {
  return u.e[0] * v.e[0] + u.e[1] * v.e[1] + u.e[2] * v.e[2];
}

function cross(u, v) {
  return new vec3(
    u.e[1] * v.e[2] - u.e[2] * v.e[1],
    u.e[2] * v.e[0] - u.e[0] * v.e[2],
    u.e[0] * v.e[1] - u.e[1] * v.e[0]
  );
}

function unit_vector(v) {
  return divide(v, v.length());
}

//lerp : linear interpolation/linear blend
// valueAtT = (1-t).startValue + t.endValue
function lerp(start, end, t) {
  var a = multiplyConst(start, 1.0 - t);
  var b = multiplyConst(end, t);
  return add(a, b);
}
