✨ Show how to simulate multiple-beads-on-wire

```jsx
function simulate() {
  const sdt = physicsScene.dt / physicsScene.numSteps;
  for (var i = 0; i < physicsScene.beads.length; i++)
    physicsScene.beads[i].startStep(sdt, physicsScene.gravity);

  for (var i = 0; i < physicsScene.beads.length; i++) {
    physicsScene.beads[i].keepOnWire(
      physicsScene.wireCenter,
      physicsScene.wireRadius
    );
  }

  for (var i = 0; i < physicsScene.beads.length; i++)
    physicsScene.beads[i].endStep(sdt);

  for (var i = 0; i < physicsScene.beads.length; i++) {
    for (var j = 0; j < i; j++) {
      physicsScene.beads[i].handleBeadBeadCollision(physicsScene.beads[j]);
    }
  }
}

class Bead {
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
```
