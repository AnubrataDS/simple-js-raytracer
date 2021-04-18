class hit_record {
  constructor() {
    this.p = new point3();
    this.normal = new vec3();
    this.t = 0.0;
    this.front_face = false;
  }
  //can't overload constructor so need to make do with this method
  copy(rec) {
    this.p = rec.p;
    this.normal = rec.normal;
    this.t = rec.t;
    this.front_face = rec.front_face;
  }

  //determine and store whether the hit is on front face or not
  //make the normal always point against the ray
  set_face_normal(r, outward_normal) {
    this.front_face = dot(r.direction, outward_normal) < 0;
    this.normal = this.front_face ? outward_normal : negative(outward_normal);
  }
}

//this is a fake abstract class since there are no abstract classes in pure JS
//hittable != hit table. It is something that can be hit
class hittable {
  constructor() {}
  hit(r, tmin, tmax, rec) {
    return false;
  }
}

class sphere extends hittable {
  constructor(cen, r) {
    super();
    this.center = cen;
    this.radius = r;
  }
  hit(r, tmin, tmax, rec) {
    //ray-sphere intersection

    //let r = A + tb
    //sphere : (P-C).(P-c) = radius^2
    //ray : A + tb
    //substituting, simplifying, we get :
    //t^2b.b + 2tb.(A-C) + (A-c).(A-C) -radius^2 = 0

    //considering this as a quadratic equation on t
    //we can't get real solutions if discriminant < 0

    //also, for any vector X , X.X = squared length of x
    //also, b has a term of 2 so we can divide both numerator and denominator in result by 2 to simplify further

    //we return boolean based on whether ray hits, and modify rec with details if it hits

    var oc = subtract(r.origin, this.center);
    var a = r.direction.length_squared();
    var half_b = dot(oc, r.direction);
    var c = oc.length_squared() - this.radius * this.radius;
    var discriminant = half_b * half_b - a * c;
    if (discriminant < 0) return false;
    var sqrtd = Math.sqrt(discriminant);

    //find the first root which lies in accepted range
    var root = (-half_b - sqrtd) / a;
    if (root < tmin || tmax < root) {
      root = (-half_b + sqrtd) / a;
      if (root < tmin || tmax < root) return false;
    }

    //saving details of intersection
    rec.t = root;
    //we put solved value of t in ray equation to get point on surface where ray meets sphere
    rec.p = r.at(root);
    //Surface normal at a point for sphere = point - center
    //unit vector for surface normal = (point - center) / radius;
    var outward_normal = divide(subtract(rec.p, this.center), this.radius);
    rec.set_face_normal(r, outward_normal);
    return true;
  }
}

class hittable_list extends hittable {
  constructor() {
    super();
    this.objects = [];
  }
  clear() {
    this.objects = [];
  }
  add(object) {
    this.objects.push(object);
  }
  hit(r, tmin, tmax, rec) {
    var tmp_rec = new hit_record();
    var hit_anything = false;
    var closest_so_far = tmax;

    for (var ctr = 0; ctr < this.objects.length; ctr++) {
      var object = this.objects[ctr];
      if (object.hit(r, tmin, closest_so_far, tmp_rec)) {
        hit_anything = true;
        closest_so_far = tmp_rec.t;
        rec.copy(tmp_rec);
      }
    }
    return hit_anything;
  }
}
