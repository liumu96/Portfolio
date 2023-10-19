import * as THREE from "three";

class Ball {
  constructor(pos, radius, vel) {
    // physics data
    this.pos = pos;
    this.radius = radius;
    this.vel = vel;
    this.grabbed = false;

    // visual mesh

    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: 0xc084fc });
    this.visMesh = new THREE.Mesh(geometry, material);
    this.visMesh.position.copy(pos);
    this.visMesh.userData = this; // for raycasting
    this.visMesh.layers.enable(1);
  }

  simulate(physicsScene) {
    if (this.grabbed) return;
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
