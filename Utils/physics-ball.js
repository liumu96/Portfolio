import Vector2 from "./vector2";

class VectorBall {
  constructor({ radius, pos, vel, mass }) {
    this.radius = radius;
    this.pos = pos.clone();
    this.vel = vel.clone();
    this.mass = mass;
  }

  simulate(dt, gravity) {
    this.vel.add(gravity, dt);
    this.pos.add(this.vel, dt);
  }

  handleBallCollision(ball, restitution) {
    const { pos: pos_1, vel: vel_1, mass: mass_1, radius: radius_1 } = this;
    const { pos: pos_2, vel: vel_2, mass: mass_2, radius: radius_2 } = ball;
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

  handleWallCollision(worldSize) {
    const { pos, radius, vel } = this;
    if (pos.x < radius) {
      pos.x = radius;
      vel.x = -vel.x;
    }
    if (pos.x > worldSize.x - radius) {
      pos.x = worldSize.x - radius;
      vel.x = -vel.x;
    }
    if (pos.y < radius) {
      pos.y = radius;
      vel.y = -vel.y;
    }

    if (pos.y > worldSize.y - radius) {
      pos.y = worldSize.y - radius;
      vel.y = -vel.y;
    }
  }
}

export default VectorBall;
