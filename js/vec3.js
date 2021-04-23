class vec3 {
  constructor(e0, e1, e2) {
    this.e = [];
    this.e[0] = e0;
    this.e[1] = e1;
    this.e[2] = e2;
  }

  copy(vec) {
    this.e[0] = vec.e[0];
    this.e[1] = vec.e[1];
    this.e[2] = vec.e[2];
  }
}

// aliasing for code readability later on
var point3 = vec3;
var color = vec3;

//utility functions for vectors
//again, global scoping is bad but I'm trying to follow along for now
//TODO : Remove global scoped material
function length_squared(u) {
  return u.e[0] * u.e[0] + u.e[1] * u.e[1] + u.e[2] * u.e[2];
}
function length(u) {
  return Math.sqrt(length_squared(u));
}
function add(u, v) {
  return new vec3(u.e[0] + v.e[0], u.e[1] + v.e[1], u.e[2] + v.e[2]);
}
function subtract(u, v) {
  return new vec3(u.e[0] - v.e[0], u.e[1] - v.e[1], u.e[2] - v.e[2]);
}
function multiplyConst(u, t) {
  return new vec3(u.e[0] * t, u.e[1] * t, u.e[2] * t);
}
function multiplyVec(u, v) {
  return new vec3(u.e[0] * v.e[0], u.e[1] * v.e[1], u.e[2] * v.e[2]);
}
function divide(u, t) {
  return new vec3(u.e[0] / t, u.e[1] / t, u.e[2] / t);
}
function negative(u) {
  return new vec3(-u.e[0], -u.e[1], -u.e[2]);
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
function near_zero(u) {
  var s = 1e-8;
  return Math.abs(u.e[0]) < s && Math.abs(u.e[1]) < s && Math.abs(u.e[2]) < s;
}
function unit_vector(v) {
  return divide(v, length(v));
}

function reflect(v, n) {
  return subtract(v, multiplyConst(n, 2 * dot(v, n)));
}

function refract(uv, n, etai_over_etat) {
  var cos_theta = Math.min(1.0, dot(negative(uv), n));
  var r_out_perp = multiplyConst(
    add(uv, multiplyConst(n, cos_theta)),
    etai_over_etat
  );
  var r_out_parallel_constant_term = -Math.sqrt(
    Math.abs(1.0 - length_squared(r_out_perp))
  );
  var r_out_parallel = multiplyConst(n, r_out_parallel_constant_term);
  return add(r_out_perp, r_out_parallel);
}

function random_vector() {
  return new vec3(Math.random(), Math.random(), Math.random());
}
function random_in_unit_disk() {
  while (true) {
    var p = new vec3(random_ranged(-1, 1), random_ranged(-1, 1), 0);
    if (length_squared(p) >= 1) continue;
    return p;
  }
}

function random_vector(min, max) {
  return new vec3(
    random_ranged(min, max),
    random_ranged(min, max),
    random_ranged(min, max)
  );
}
function random_ranged(min, max) {
  return min + (max - min) * Math.random();
}
//lerp : linear interpolation/linear blend
// valueAtT = (1-t).startValue + t.endValue
function lerp(start, end, t) {
  var a = multiplyConst(start, 1.0 - t);
  var b = multiplyConst(end, t);
  return add(a, b);
}
