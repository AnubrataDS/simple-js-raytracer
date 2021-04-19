class material {
  scatter(r_in, rec, attenuation, scattered) {}
}

class lambertian extends material {
  constructor(a) {
    super();
    this.albedo = a;
  }
  scatter(r_in, rec, attenuation, scattered) {
    var scatter_direction = add(rec.normal, random_unit_vec());

    if (scatter_direction.near_zero()) scatter_direction = rec.normal;

    scattered.copy(new ray(rec.p, scatter_direction));
    attenuation.copy(this.albedo);
    return true;
  }
}

class metal extends material {
  constructor(a, fuzz) {
    super();
    this.albedo = a;
    this.fuzz = fuzz < 1 ? fuzz : 1;
  }
  scatter(r_in, rec, attenuation, scattered) {
    var reflected = reflect(unit_vector(r_in.direction), rec.normal);
    reflected = add(reflected, multiplyConst(random_unit_vec(), this.fuzz));
    scattered.copy(new ray(rec.p, reflected));
    attenuation.copy(this.albedo);
    return dot(scattered.direction, rec.normal) > 0;
  }
}

class dielectric extends material {
  constructor(index_of_refraction) {
    super();
    this.index_of_refraction = index_of_refraction;
  }
  scatter(r_in, rec, attenuation, scattered) {
    attenuation.copy(new color(1.0, 1.0, 1.0));
    var refraction_ratio = rec.front_face
      ? 1.0 / this.index_of_refraction
      : this.index_of_refraction;
    var unit_direction = unit_vector(r_in.direction);

    //if etai over etat > 1, snells law has no solution and material cannot refract
    //in that case reflection occurs
    //the random part is to approximate change in reflectivity of glass with varying angle
    var cos_theta = Math.min(dot(negative(unit_direction), rec.normal), 1.0);
    var sin_theta = Math.sqrt(1 - cos_theta * cos_theta);

    var cannot_refract = refraction_ratio * sin_theta > 1.0;
    var direction;
    if (
      cannot_refract ||
      this.reflectance(cos_theta, refraction_ratio) > Math.random()
    ) {
      direction = reflect(unit_direction, rec.normal);
    } else {
      direction = refract(unit_direction, rec.normal, refraction_ratio);
    }

    scattered.copy(new ray(rec.p, direction));
    return true;
  }
  reflectance(cosine, ref_idx) {
    // Use Schlick's approximation for reflectance.
    var r0 = (1 - ref_idx) / (1 + ref_idx);
    r0 = r0 * r0;
    return r0 + (1 - r0) * Math.pow(1 - cosine, 5);
  }
}
