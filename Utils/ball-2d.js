class Ball {
  constructor({ radius, pos, vel }) {
    this.radius = radius;
    this.pos = pos;
    this.vel = vel;
  }

  simulate({ ball, gravity, timeStep, simWidth, simHeight }) {
    ball.vel.x += gravity.x * timeStep;
    ball.vel.y += gravity.y * timeStep;
    ball.pos.x += ball.vel.x * timeStep;
    ball.pos.y += ball.vel.y * timeStep;

    if (ball.pos.x < ball.radius) {
      ball.pos.x = ball.radius;
      ball.vel.x = -ball.vel.x;
    }

    if (ball.pos.x > simWidth - ball.radius) {
      ball.pos.x = simWidth - ball.radius;
      ball.vel.x = -ball.vel.x;
    }

    if (ball.pos.y < ball.radius) {
      ball.pos.y = ball.radius;
      ball.vel.y = -ball.vel.y;
    }
    if (ball.pos.y > simHeight - ball.radius) {
      ball.pos.y = simHeight - ball.radius;
      ball.vel.y = -ball.vel.y;
    }
  }
}

export default Ball;
