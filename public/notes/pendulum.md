✨ Show how to handle hard distance constraints with position-based dynamics. They can be used for the simulation of a variety of objects like cloth, ropes, hair, fur, and even sand.

$$
\Delta x_1 = \frac{w_1}{w_1 + w_2}(l - l_0)\frac{x_2 - x_1}{|x_2 - x_1|} \\
\Delta x_2 = -\frac{w_2}{w_1 + w_2}(l - l_0)\frac{x_2 - x_1}{|x_2 - x_1|} \\
$$

- Algorithm

```cpp
while simulating
    for all particles i
        vi <- vi + g·dt
        pi <- xi
        xi <- xi + vi·dt
    for all distance constraints(i, j)
        solveConstraint(xi, xj)
    for all particles i
        vi <- (xi - pi)/dt
end
```

```javascript
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
}
```
