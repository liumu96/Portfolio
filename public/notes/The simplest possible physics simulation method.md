✨  Show how to simulate constraint dynamics in the simplest possible way.

- The algorithm for one Bead(PBD)

```cpp
while simulating
    v <- v + g·dt
    p <- x
    x <- x + v·dt
    satisfyConstraint(x)
    v <- (x - p)/dt
end
```

- Class Bead

```javascript
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
}
```

- Simulate

```jsx
function simulate() {
  physicsScene.bead.startStep(physicsScene.dt, physicsScene.gravity);

  physicsScene.bead.keepOnWire(
    physicsScene.wireCenter,
    physicsScene.wireRadius
  );

  physicsScene.bead.endStep(physicsScene.dt);
}
```

- Sub-Stepping

```jsx
function simulate() {
  const sdt = physicsScene.dt / physicsScene.numSteps;
  for (let step = 0; step < physicsScene.numSteps; step++) {
    physicsScene.bead.startStep(sdt, physicsScene.gravity);

    physicsScene.bead.keepOnWire(
      physicsScene.wireCenter,
      physicsScene.wireRadius
    );

    physicsScene.bead.endStep(sdt);
  }
}
```

- Analytic Bead

```jsx
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
  }
  getPos() {
    return new Vector2(
      Math.sin(this.angle) * this.radius,
      -Math.cos(this.angle) * this.radius
    );
  }
}
```
