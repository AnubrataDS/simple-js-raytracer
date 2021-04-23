class texture {
  value(u, v, p) {}
}

class solid_color extends texture {
  constructor(c) {
    super();
    this.c = c;
  }
  value(u, v, p) {
    return this.c;
  }
}
