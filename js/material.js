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
