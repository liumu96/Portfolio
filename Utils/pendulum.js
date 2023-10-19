class Pendulum {
  constructor(usePBD, color, masses, lengths, angles) {
    this.usePBD = usePBD;
    this.color = color;
    this.masses = [0.0];
    this.lengths = [0.0];
    this.pos = [{ x: 0.0, y: 0.0 }];
    this.prevPos = [{ x: 0.0, y: 0.0 }];
    this.vel = [{ x: 0.0, y: 0.0 }];
    this.theta = [0.0];
    this.omega = [0.0];

    this.trail = new Int32Array(1000);
    this.trailFirst = 0;
    this.trailLast = 0;

    var x = 0.0,
      y = 0.0;
    for (var i = 0; i < masses.length; i++) {
      this.masses.push(masses[i]);
      this.lengths.push(lengths[i]);
      this.theta.push(angles[i]);
      this.omega.push(0.0);
      x += lengths[i] * Math.sin(angles[i]);
      y += lengths[i] * -Math.cos(angles[i]);
      this.pos.push({ x: x, y: y });
      this.prevPos.push({ x: x, y: y });
      this.vel.push({ x: 0, y: 0 });
    }
  }
  simulate(dt, gravity) {
    if (this.usePBD) this.simulatePBD(dt, gravity);
    else this.simulateAnalytic(dt, gravity);
  }
  simulatePBD(dt, gravity) {
    var p = this;
    for (var i = 1; i < p.masses.length; i++) {
      p.vel[i].y += dt * gravity;
      p.prevPos[i].x = p.pos[i].x;
      p.prevPos[i].y = p.pos[i].y;
      p.pos[i].x += p.vel[i].x * dt;
      p.pos[i].y += p.vel[i].y * dt;
    }
    for (var i = 1; i < p.masses.length; i++) {
      var dx = p.pos[i].x - p.pos[i - 1].x;
      var dy = p.pos[i].y - p.pos[i - 1].y;
      var d = Math.sqrt(dx * dx + dy * dy);
      var w0 = p.masses[i - 1] > 0.0 ? 1.0 / p.masses[i - 1] : 0.0;
      var w1 = p.masses[i] > 0.0 ? 1.0 / p.masses[i] : 0.0;
      var corr = (p.lengths[i] - d) / d / (w0 + w1);
      p.pos[i - 1].x -= w0 * corr * dx;
      p.pos[i - 1].y -= w0 * corr * dy;
      p.pos[i].x += w1 * corr * dx;
      p.pos[i].y += w1 * corr * dy;
    }
    for (var i = 1; i < p.masses.length; i++) {
      p.vel[i].x = (p.pos[i].x - p.prevPos[i].x) / dt;
      p.vel[i].y = (p.pos[i].y - p.prevPos[i].y) / dt;
    }
  }
  simulateAnalytic(dt, gravity) {
    var g = -gravity;
    var m1 = this.masses[1];
    var m2 = this.masses[2];
    var m3 = this.masses[3];
    var l1 = this.lengths[1];
    var l2 = this.lengths[2];
    var l3 = this.lengths[3];
    var t1 = this.theta[1];
    var t2 = this.theta[2];
    var t3 = this.theta[3];
    var w1 = this.omega[1];
    var w2 = this.omega[2];
    var w3 = this.omega[3];

    var b1 =
      g * l1 * m1 * Math.sin(t1) +
      g * l1 * m2 * Math.sin(t1) +
      g * l1 * m3 * Math.sin(t1) +
      m2 * l1 * l2 * Math.sin(t1 - t2) * w1 * w2 +
      m3 * l1 * l3 * Math.sin(t1 - t3) * w1 * w3 +
      m3 * l1 * l2 * Math.sin(t1 - t2) * w1 * w2 +
      m2 * l1 * l2 * Math.sin(t2 - t1) * (w1 - w2) * w2 +
      m3 * l1 * l2 * Math.sin(t2 - t1) * (w1 - w2) * w2 +
      m3 * l1 * l3 * Math.sin(t3 - t1) * (w1 - w3) * w3;

    var a11 = l1 * l1 * (m1 + m2 + m3);
    var a12 =
      m2 * l1 * l2 * Math.cos(t1 - t2) + m3 * l1 * l2 * Math.cos(t1 - t2);
    var a13 = m3 * l1 * l3 * Math.cos(t1 - t3);

    var b2 =
      g * l2 * m2 * Math.sin(t2) +
      g * l2 * m3 * Math.sin(t2) +
      w1 * w2 * l1 * l2 * Math.sin(t2 - t1) * (m2 + m3) +
      m3 * l2 * l3 * Math.sin(t2 - t3) * w2 * w3 +
      (m2 + m3) * l1 * l2 * Math.sin(t2 - t1) * (w1 - w2) * w1 +
      m3 * l2 * l3 * Math.sin(t3 - t2) * (w2 - w3) * w3;

    var a21 = (m2 + m3) * l1 * l2 * Math.cos(t2 - t1);
    var a22 = l2 * l2 * (m2 + m3);
    var a23 = m3 * l2 * l3 * Math.cos(t2 - t3);

    var b3 =
      m3 * g * l3 * Math.sin(t3) -
      m3 * l2 * l3 * Math.sin(t2 - t3) * w2 * w3 -
      m3 * l1 * l3 * Math.sin(t1 - t3) * w1 * w3 +
      m3 * l1 * l3 * Math.sin(t3 - t1) * (w1 - w3) * w1 +
      m3 * l2 * l3 * Math.sin(t3 - t2) * (w2 - w3) * w2;

    var a31 = m3 * l1 * l3 * Math.cos(t1 - t3);
    var a32 = m3 * l2 * l3 * Math.cos(t2 - t3);
    var a33 = m3 * l3 * l3;

    b1 = -b1;
    b2 = -b2;
    b3 = -b3;

    var det =
      a11 * (a22 * a33 - a23 * a32) +
      a21 * (a32 * a13 - a33 * a12) +
      a31 * (a12 * a23 - a13 * a22);
    if (det == 0.0) return;

    var a1 =
      b1 * (a22 * a33 - a23 * a32) +
      b2 * (a32 * a13 - a33 * a12) +
      b3 * (a12 * a23 - a13 * a22);
    var a2 =
      b1 * (a23 * a31 - a21 * a33) +
      b2 * (a33 * a11 - a31 * a13) +
      b3 * (a13 * a21 - a11 * a23);
    var a3 =
      b1 * (a21 * a32 - a22 * a31) +
      b2 * (a31 * a12 - a32 * a11) +
      b3 * (a11 * a22 - a12 * a21);

    a1 /= det;
    a2 /= det;
    a3 /= det;

    this.omega[1] += a1 * dt;
    this.omega[2] += a2 * dt;
    this.omega[3] += a3 * dt;
    this.theta[1] += this.omega[1] * dt;
    this.theta[2] += this.omega[2] * dt;
    this.theta[3] += this.omega[3] * dt;

    var x = 0.0,
      y = 0.0;
    for (var i = 1; i < this.masses.length; i++) {
      x += this.lengths[i] * Math.sin(this.theta[i]);
      y += this.lengths[i] * -Math.cos(this.theta[i]);
      this.pos[i].x = x;
      this.pos[i].y = y;
    }
  }
  updateTrail(cX, cY) {
    this.trail[this.trailLast] = cX(this.pos[this.pos.length - 1]);
    this.trail[this.trailLast + 1] = cY(this.pos[this.pos.length - 1]);
    this.trailLast = (this.trailLast + 2) % this.trail.length;
    if (this.trailLast == this.trailFirst)
      this.trailFirst = (this.trailFirst + 2) % this.trail.length;
  }
  draw(c, cX, cY, cScale) {
    c.strokeStyle = this.color;
    c.lineWidth = 2.0;
    if (this.trailLast != this.trailFirst) {
      var i = this.trailFirst;
      c.beginPath();
      c.moveTo(this.trail[i], this.trail[i + 1]);
      i = (i + 2) % this.trail.length;
      while (i != this.trailLast) {
        c.lineTo(this.trail[i], this.trail[i + 1]);
        i = (i + 2) % this.trail.length;
      }
      c.stroke();
    }

    var p = this;
    c.strokeStyle = "#60A5FA";
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(cX(p.pos[0]), cY(p.pos[0]));
    for (var i = 1; i < p.masses.length; i++)
      c.lineTo(cX(p.pos[i]), cY(p.pos[i]));
    c.stroke();
    c.lineWidth = 1;

    c.fillStyle = this.color;
    for (var i = 1; i < p.masses.length; i++) {
      var r = 0.03 * Math.sqrt(p.masses[i]);
      c.beginPath();
      c.arc(cX(p.pos[i]), cY(p.pos[i]), cScale * r, 0.0, 2.0 * Math.PI);
      c.closePath();
      c.fill();
    }
  }
}

export default Pendulum;
