import * as THREE from "three";

class Ball {
  constructor({ pos, radius, vel, density, color = 0xc084fc, scene }) {
    // physics data
    this.pos = pos;
    this.radius = radius;

    this.vel = vel || new THREE.Vector3(0.0, 0.0, 0.0);
    this.grabbed = false;

    if (density) {
      this.mass = ((4.0 * Math.PI) / 3.0) * radius * radius * radius * density;
      this.restitution = 0.1;
    }

    // visual mesh

    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: color });
    this.visMesh = new THREE.Mesh(geometry, material);
    this.visMesh.position.copy(pos);
    this.visMesh.userData = this; // for raycasting
    this.visMesh.layers.enable(1);
    scene.add(this.visMesh);
  }

  handleCollision(other) {
    let dir = new THREE.Vector3();
    dir.subVectors(other.pos, this.pos);
    let d = dir.length();

    let minDist = this.radius + other.radius;
    if (d >= minDist) return;

    dir.multiplyScalar(1.0 / d);
    let corr = (minDist - d) / 2.0;
    this.pos.addScaledVector(dir, -corr);
    other.pos.addScaledVector(dir, corr);

    let v1 = this.vel.dot(dir);
    let v2 = other.vel.dot(dir);

    let m1 = this.mass;
    let m2 = other.mass;

    let newV1 =
      (m1 * v1 + m2 * v2 - m2 * (v1 - v2) * this.restitution) / (m1 + m2);
    let newV2 =
      (m1 * v1 + m2 * v2 - m1 * (v2 - v1) * this.restitution) / (m1 + m2);

    this.vel.addScaledVector(dir, newV1 - v1);
    other.vel.addScaledVector(dir, newV2 - v2);
  }

  simulate(physicsScene) {
    if (this.grabbed) return;
    this.vel.addScaledVector(physicsScene.gravity, physicsScene.dt);

    this.pos.addScaledVector(this.vel, physicsScene.dt);
    const { worldSize, tankSize, tankBorder } = physicsScene;
    const wx = tankSize
      ? 0.5 * tankSize.x - this.radius - 0.5 * tankBorder
      : worldSize.x;
    const wz = tankSize
      ? 0.5 * tankSize.z - this.radius - 0.5 * tankBorder
      : worldSize.z;

    if (this.pos.x < -wx) {
      this.pos.x = -wx;
      this.vel.x = -this.vel.x;
    }
    if (this.pos.x > wx) {
      this.pos.x = wx;
      this.vel.x = -this.vel.x;
    }
    if (this.pos.z < -wz) {
      this.pos.z = -wz;
      this.vel.z = -this.vel.z;
    }
    if (this.pos.z > wz) {
      this.pos.z = wz;
      this.vel.z = -this.vel.z;
    }
    if (this.pos.y < this.radius) {
      this.pos.y = this.radius;
      this.vel.y = -this.vel.y;
    }

    this.visMesh.position.copy(this.pos);
    this.visMesh.geometry.computeBoundingSphere();
  }

  applyForce(force, dt) {
    this.vel.y += (dt * force) / this.mass;
    this.vel.multiplyScalar(0.999);
  }

  startGrab(pos) {
    this.grabbed = true;
    this.pos.copy(pos);
    this.visMesh.position.copy(pos);
  }

  moveGrabbed(pos) {
    this.pos.copy(pos);
    this.visMesh.position.copy(pos);
  }

  endGrab(vel) {
    this.grabbed = false;
    this.vel.copy(vel);
  }
}

export default Ball;
