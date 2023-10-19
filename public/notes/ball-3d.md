### Physics Background

The theory part is the same as the 2D ball.

### Key Code

```jsx
simulate(physicsScene) {
    this.vel.addScaledVector(physicsScene.gravity, physicsScene.dt);
    this.pos.addScaledVector(this.vel, physicsScene.dt);
    const { worldSize } = physicsScene;

    if (this.pos.x < -worldSize.x) {
      this.pos.x = -worldSize.x;
      this.vel.x = -this.vel.x;
    }
    if (this.pos.x > worldSize.x) {
      this.pos.x = worldSize.x;
      this.vel.x = -this.vel.x;
    }
    if (this.pos.z < -worldSize.z) {
      this.pos.z = -worldSize.z;
      this.vel.z = -this.vel.z;
    }
    if (this.pos.z > worldSize.z) {
      this.pos.z = worldSize.z;
      this.vel.z = -this.vel.z;
    }
    if (this.pos.y < this.radius) {
      this.pos.y = this.radius;
      this.vel.y = -this.vel.y;
    }

    this.visMesh.position.copy(this.pos);
    this.visMesh.geometry.computeBoundingSphere();
  }
```

s
