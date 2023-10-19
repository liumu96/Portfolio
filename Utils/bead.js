import Vector2 from "./vector2";
class Bead {
  constructor(radius, mass, pos) {
    this.radius = radius;
    this.mass = mass;
    this.pos = pos.clone();
    this.prevPos = pos.clone();
    this.vel = new Vector2();
  }
  startStep(dt, gravity) {
    this.vel.add(gravity, dt);
    this.prevPos.set(this.pos);
    this.pos.add(this.vel, dt);
  }
  keepOnWire(center, radius) {
    const dir = new Vector2();
    dir.subtractVectors(this.pos, center);
    const len = dir.length();
    if (len == 0.0) return;
    dir.scale(1.0 / len);
    const lambda = radius - len;
    this.pos.add(dir, lambda);
    return lambda;
  }
  endStep(dt) {
    this.vel.subtractVectors(this.pos, this.prevPos);
    this.vel.scale(1.0 / dt);
  }

  handleBeadBeadCollision(bead2) {
    const { pos: pos_1, radius: radius_1, mass: mass_1, vel: vel_1 } = this;
    const { pos: pos_2, radius: radius_2, mass: mass_2, vel: vel_2 } = bead2;

    const restitution = 1.0;
    const dir = new Vector2();
    dir.subtractVectors(pos_2, pos_1);
    const d = dir.length();
    if (d == 0.0 || d > radius_1 + radius_2) return;

    dir.scale(1.0 / d);

    const corr = (radius_1 + radius_2 - d) / 2.0;
    pos_1.add(dir, -corr);
    pos_2.add(dir, corr);

    const v1 = vel_1.dot(dir);
    const v2 = vel_2.dot(dir);

    const m1 = mass_1;
    const m2 = mass_2;

    const newV1 =
      (m1 * v1 + m2 * v2 - m2 * (v1 - v2) * restitution) / (m1 + m2);
    const newV2 =
      (m1 * v1 + m2 * v2 - m1 * (v2 - v1) * restitution) / (m1 + m2);

    vel_1.add(dir, newV1 - v1);
    vel_2.add(dir, newV2 - v2);
  }
}

class AnalyticBead {
  constructor(radius, beadRadius, mass, angle) {
    this.radius = radius;
    this.beadRadius = beadRadius;
    this.mass = mass;
    this.angle = angle;
    this.omega = 0.0;
  }
  simulate(dt, gravity) {
    var acc = (-gravity / this.radius) * Math.sin(this.angle);
    this.omega += acc * dt;
    this.angle += this.omega * dt;

    var centrifugalForce = this.omega * this.omega * this.radius;
    var force = centrifugalForce + Math.cos(this.angle) * Math.abs(gravity);
    return force;
  }
  getPos() {
    return new Vector2(
      Math.sin(this.angle) * this.radius,
      -Math.cos(this.angle) * this.radius
    );
  }
}

export { Bead, AnalyticBead };
