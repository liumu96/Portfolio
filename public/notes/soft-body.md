✨ How to simulate soft bodies in an unbreakable and very simple way.

#### Algorithm

```cpp
delta_t_s <- delta_t / n
while simulating
    for n substeps
        for all particles i
            vi <- vi + g·delta_t_s
            pi <- xi
            xi <- xi + vi·delta_t_s
        for all distance constraints C
            solveConstraint(C, delta_t_s)
        for all particles i
            vi <- (xi - pi)/delta_t_s
end
```

```cpp
solveConstraint(C, delta_t)

for all particles i of C
    compute delta_x_i
    x_ <- x_i + delta x_i
```

- Solving a General Constraint

Compute the scalar value $\lambda$ (same for all participating particles):

$$
\lambda = \frac{-C}{w_1|\nabla C_1|^2 + w_2|\nabla C_2|^2 + ... + w_n|\nabla C_n|^2 + \frac{\alpha}{\Delta t^2}}
$$

Compute correction for point $\bold x_i$ as: $\Delta \bold x_i = \lambda w_i \nabla C_i$

- C: Constraint function, zero if the constraint is satisfied
- $\nabla C_i$: Gradient to C, how to move $\bold x_i$ for a maximal increase of C
- $w_i$: Inverse mass of particle i
- $\alpha$: Inverse of physical stiffness, stable for infinite stiffness($\alpha$ = 0)

#### Distance Constraint

$$
C = l - l_0 \\
\nabla C_1 = \frac{\bold x_2 - \bold x_1}{|\bold x_2 - \bold x_1|} \\
\nabla C_2 = -\frac{\bold x_2 - \bold x_1}{|\bold x_2 - \bold x_1|}
$$

#### Volume Conservation Constraint

$$
C = 6(V - V_{rest}) \\
V = \frac{1}{6}((\bold x_2 - \bold x_1) \times (\bold x_3 - \bold x_1)\cdot (\bold x_4 - \bold x_1)) \\
\nabla_1 C = (\bold x_4 - \bold x_2) \times (\bold x_3 - \bold x_2) \\
\nabla_2 C = (\bold x_3 - \bold x_1) \times (\bold x_4 - \bold x_2) \\
\nabla_3 C = (\bold x_4 - \bold x_1) \times (\bold x_2 - \bold x_1) \\
\nabla_4 C = (\bold x_2 - \bold x_1) \times (\bold x_3 - \bold x_1) \\
$$

### Coding

```jsx
xpbdSimulate() {
    const { physicsScene } = this;
    if (physicsScene.paused) return;

    const sdt = physicsScene.dt / physicsScene.numSubsteps;

    for (let step = 0; step < physicsScene.numSubsteps; step++) {
      for (let i = 0; i < physicsScene.objects.length; i++)
        physicsScene.objects[i].preSolve(sdt, physicsScene.gravity);
      for (let i = 0; i < physicsScene.objects.length; i++)
        physicsScene.objects[i].solve(sdt);
      for (let i = 0; i < physicsScene.objects.length; i++)
        physicsScene.objects[i].postSolve(sdt);
    }
    for (var i = 0; i < physicsScene.objects.length; i++)
      physicsScene.objects[i].endFrame();

    if (this.grabber) {
      this.grabber.increaseTime(this.physicsScene.dt);
    }
}
```

```jsx
preSolve(dt, gravity) {
    for (var i = 0; i < this.numParticles; i++) {
        if (this.invMass[i] == 0.0) continue;
        vecAdd(this.vel, i, gravity, 0, dt);
        vecCopy(this.prevPos, i, this.pos, i);
        vecAdd(this.pos, i, this.vel, i, dt);
        var y = this.pos[3 * i + 1];
        if (y < 0.0) {
            vecCopy(this.pos, i, this.prevPos, i);
            this.pos[3 * i + 1] = 0.0;
        }
    }
}
solve(dt) {
    this.solveEdges(this.edgeCompliance, dt);
    this.solveVolumes(this.volCompliance, dt);
}

postSolve(dt) {
    for (var i = 0; i < this.numParticles; i++) {
      if (this.invMass[i] == 0.0) continue;
      vecSetDiff(this.vel, i, this.pos, i, this.prevPos, i, 1.0 / dt);
    }
}
```

- Solve Constraints

```jsx
solveEdges(compliance, dt) {
    var alpha = compliance / dt / dt;

    for (var i = 0; i < this.edgeLengths.length; i++) {
      var id0 = this.edgeIds[2 * i];
      var id1 = this.edgeIds[2 * i + 1];
      var w0 = this.invMass[id0];
      var w1 = this.invMass[id1];
      var w = w0 + w1;
      if (w == 0.0) continue;

      vecSetDiff(this.grads, 0, this.pos, id0, this.pos, id1);
      var len = Math.sqrt(vecLengthSquared(this.grads, 0));
      if (len == 0.0) continue;
      vecScale(this.grads, 0, 1.0 / len);
      var restLen = this.edgeLengths[i];
      var C = len - restLen;
      var s = -C / (w + alpha);
      vecAdd(this.pos, id0, this.grads, 0, s * w0);
      vecAdd(this.pos, id1, this.grads, 0, -s * w1);
    }
  }

  solveVolumes(compliance, dt) {
    var alpha = compliance / dt / dt;

    for (var i = 0; i < this.numTets; i++) {
      var w = 0.0;

      for (var j = 0; j < 4; j++) {
        var id0 = this.tetIds[4 * i + this.volIdOrder[j][0]];
        var id1 = this.tetIds[4 * i + this.volIdOrder[j][1]];
        var id2 = this.tetIds[4 * i + this.volIdOrder[j][2]];

        vecSetDiff(this.temp, 0, this.pos, id1, this.pos, id0);
        vecSetDiff(this.temp, 1, this.pos, id2, this.pos, id0);
        vecSetCross(this.grads, j, this.temp, 0, this.temp, 1);
        vecScale(this.grads, j, 1.0 / 6.0);

        w +=
          this.invMass[this.tetIds[4 * i + j]] *
          vecLengthSquared(this.grads, j);
      }
      if (w == 0.0) continue;

      var vol = this.getTetVolume(i);
      var restVol = this.restVol[i];
      var C = vol - restVol;
      var s = -C / (w + alpha);

      for (var j = 0; j < 4; j++) {
        var id = this.tetIds[4 * i + j];
        vecAdd(this.pos, id, this.grads, j, s * this.invMass[id]);
      }
    }
}
```
