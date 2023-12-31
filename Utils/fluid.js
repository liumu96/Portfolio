class Fluid {
  constructor(density, numX, numY, h) {
    this.density = density;
    this.numX = numX + 2;
    this.numY = numY + 2;
    this.numCells = this.numX * this.numY;
    this.h = h;
    this.u = new Float32Array(this.numCells);
    this.v = new Float32Array(this.numCells);
    this.newU = new Float32Array(this.numCells);
    this.newV = new Float32Array(this.numCells);
    this.p = new Float32Array(this.numCells);
    this.s = new Float32Array(this.numCells);
    this.m = new Float32Array(this.numCells);
    this.newM = new Float32Array(this.numCells);
    this.m.fill(1.0);

    this.U_FIELD = 0;
    this.V_FIELD = 1;
    this.S_FIELD = 2;
  }

  integrate(dt, gravity) {
    const n = this.numY;
    for (let i = 1; i < this.numX; i++) {
      for (let j = 1; j < this.numY - 1; j++) {
        if (this.s[i * n + j] != 0.0 && this.s[i * n + j - 1] != 0.0)
          this.v[i * n + j] += gravity * dt;
      }
    }
  }

  solveIncompressibility(numIters, dt, overRelaxation) {
    const n = this.numY;
    const cp = (this.density * this.h) / dt;

    for (let iter = 0; iter < numIters; iter++) {
      for (let i = 1; i < this.numX - 1; i++) {
        for (let j = 1; j < this.numY - 1; j++) {
          // if current cell is solid
          if (this.s[i * n + j] == 0.0) continue;
          // if current cell is surrounded by solids
          const sx0 = this.s[(i - 1) * n + j];
          const sx1 = this.s[(i + 1) * n + j];
          const sy0 = this.s[i * n + j - 1];
          const sy1 = this.s[i * n + j + 1];
          const s = sx0 + sx1 + sy0 + sy1;
          if (s == 0.0) continue;
          // compute the divergence of velocity
          const div =
            this.u[(i + 1) * n + j] -
            this.u[i * n + j] +
            this.v[i * n + j + 1] -
            this.v[i * n + j];

          let p = -div / s;
          p *= overRelaxation; // for acceleration
          this.p[i * n + j] += cp * p; // update the pressure
          // update the velocity
          this.u[i * n + j] -= sx0 * p;
          this.u[(i + 1) * n + j] += sx1 * p;
          this.v[i * n + j] -= sy0 * p;
          this.v[i * n + j + 1] += sy1 * p;
        }
      }
    }
  }

  extrapolate() {
    const n = this.numY;
    for (let i = 0; i < this.numX; i++) {
      this.u[i * n + 0] = this.u[i * n + 1];
      this.u[i * n + this.numY - 1] = this.u[i * n + this.numY - 2];
    }
    for (let j = 0; j < this.numY; j++) {
      this.v[0 * n + j] = this.v[1 * n + j];
      this.v[(this.numX - 1) * n + j] = this.v[(this.numX - 2) * n + j];
    }
  }

  sampleField(x, y, field) {
    const n = this.numY;
    const h = this.h;
    const h1 = 1.0 / h;
    const h2 = 0.5 * h;

    x = Math.max(Math.min(x, this.numX * h), h);
    y = Math.max(Math.min(y, this.numY * h), h);

    let dx = 0.0;
    let dy = 0.0;

    let f;

    switch (field) {
      case this.U_FIELD:
        f = this.u;
        dy = h2;
        break;
      case this.V_FIELD:
        f = this.v;
        dx = h2;
        break;
      case this.S_FIELD:
        f = this.m;
        dx = h2;
        dy = h2;
        break;
    }

    const x0 = Math.min(Math.floor((x - dx) * h1), this.numX - 1);
    const tx = (x - dx - x0 * h) * h1;
    const x1 = Math.min(x0 + 1, this.numX - 1);

    const y0 = Math.min(Math.floor((y - dy) * h1), this.numY - 1);
    const ty = (y - dy - y0 * h) * h1;
    const y1 = Math.min(y0 + 1, this.numY - 1);

    const sx = 1.0 - tx;
    const sy = 1.0 - ty;

    const val =
      sx * sy * f[x0 * n + y0] +
      tx * sy * f[x1 * n + y0] +
      tx * ty * f[x1 * n + y1] +
      sx * ty * f[x0 * n + y1];

    return val;
  }

  avgU(i, j) {
    const n = this.numY;
    const u =
      (this.u[i * n + j - 1] +
        this.u[i * n + j] +
        this.u[(i + 1) * n + j - 1] +
        this.u[(i + 1) * n + j]) *
      0.25;
    return u;
  }

  avgV(i, j) {
    const n = this.numY;
    const v =
      (this.v[(i - 1) * n + j] +
        this.v[i * n + j] +
        this.v[(i - 1) * n + j + 1] +
        this.v[i * n + j + 1]) *
      0.25;
    return v;
  }

  advectVel(dt) {
    this.newU.set(this.u);
    this.newV.set(this.v);

    const n = this.numY;
    const h = this.h;
    const h2 = 0.5 * h;

    for (let i = 1; i < this.numX; i++) {
      for (let j = 1; j < this.numY; j++) {
        // u component
        if (
          this.s[i * n + j] != 0.0 &&
          this.s[(i - 1) * n + j] != 0.0 &&
          j < this.numY - 1
        ) {
          let x = i * h;
          let y = j * h + h2;
          let u = this.u[i * n + j];
          let v = this.avgV(i, j);
          x = x - dt * u;
          y = y - dt * v;
          u = this.sampleField(x, y, this.U_FIELD);
          this.newU[i * n + j] = u;
        }
        // v component
        if (
          this.s[i * n + j] != 0.0 &&
          this.s[i * n + j - 1] != 0.0 &&
          i < this.numX - 1
        ) {
          let x = i * h + h2;
          let y = j * h;
          let u = this.avgU(i, j);
          let v = this.v[i * n + j];
          x = x - dt * u;
          y = y - dt * v;
          v = this.sampleField(x, y, this.V_FIELD);
          this.newV[i * n + j] = v;
        }
      }
    }

    this.u.set(this.newU);
    this.v.set(this.newV);
  }

  advectSmoke(dt) {
    this.newM.set(this.m);

    const n = this.numY;
    const h = this.h;
    const h2 = 0.5 * h;

    for (let i = 1; i < this.numX - 1; i++) {
      for (let j = 1; j < this.numY - 1; j++) {
        if (this.s[i * n + j] != 0.0) {
          const u = (this.u[i * n + j] + this.u[(i + 1) * n + j]) * 0.5;
          const v = (this.v[i * n + j] + this.v[i * n + j + 1]) * 0.5;
          const x = i * h + h2 - dt * u;
          const y = j * h + h2 - dt * v;

          this.newM[i * n + j] = this.sampleField(x, y, this.S_FIELD);
        }
      }
    }
    this.m.set(this.newM);
  }

  // ----------------- end of simulator ------------------------------

  simulate(dt, gravity, numIters, overRelaxation) {
    this.integrate(dt, gravity);

    this.p.fill(0.0);
    this.solveIncompressibility(numIters, dt, overRelaxation);

    this.extrapolate();
    this.advectVel(dt);
    this.advectSmoke(dt);
  }
}

export default Fluid;
