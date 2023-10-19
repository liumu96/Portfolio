import * as THREE from "three";
import Hash from "./hash";
import {
  vecSetDiff,
  vecDot,
  vecAdd,
  vecCopy,
  vecLengthSquared,
  vecScale,
} from "./vector-math";
class Balls {
  constructor(radius, pos, vel, threeScene) {
    // physics data

    this.radius = radius;
    this.pos = pos;
    this.prevPos = pos;
    this.vel = vel;
    this.matrix = new THREE.Matrix4();
    this.numBalls = Math.floor(pos.length / 3);
    this.hash = new Hash(2.0 * radius, this.numBalls);
    this.showCollisions = false;

    this.normal = new Float32Array(3);

    // visual mesh

    var geometry = new THREE.SphereGeometry(radius, 8, 8);
    var material = new THREE.MeshPhongMaterial();

    this.visMesh = new THREE.InstancedMesh(geometry, material, this.numBalls);
    this.visMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    this.ballColor = new THREE.Color(0xf9a8d4);
    this.ballCollisionColor = new THREE.Color(0xc084fc);

    var colors = new Float32Array(3 * this.numBalls);
    this.visMesh.instanceColor = new THREE.InstancedBufferAttribute(
      colors,
      3,
      false,
      1
    );
    for (var i = 0; i < this.numBalls; i++)
      this.visMesh.setColorAt(i, this.ballColor);

    this.threeScene = threeScene;
    this.threeScene.add(this.visMesh);

    this.updateMesh();
  }

  updateMesh() {
    for (var i = 0; i < this.numBalls; i++) {
      this.matrix.makeTranslation(
        this.pos[3 * i],
        this.pos[3 * i + 1],
        this.pos[3 * i + 2]
      );
      this.visMesh.setMatrixAt(i, this.matrix);
    }
    this.visMesh.instanceMatrix.needsUpdate = true;
    this.visMesh.instanceColor.needsUpdate = true;
  }

  simulate(dt, gravity, worldBounds) {
    var minDist = 2.0 * this.radius;

    // integrate

    for (var i = 0; i < this.numBalls; i++) {
      vecAdd(this.vel, i, gravity, 0, dt);
      vecCopy(this.prevPos, i, this.pos, i);
      vecAdd(this.pos, i, this.vel, i, dt);
    }

    this.hash.create(this.pos);

    // handle collisions

    for (var i = 0; i < this.numBalls; i++) {
      this.visMesh.setColorAt(i, this.ballColor);

      // world collision

      for (var dim = 0; dim < 3; dim++) {
        var nr = 3 * i + dim;
        if (this.pos[nr] < worldBounds[dim] + this.radius) {
          this.pos[nr] = worldBounds[dim] + this.radius;
          this.vel[nr] = -this.vel[nr];
          if (this.showCollisions)
            this.visMesh.setColorAt(i, this.ballCollisionColor);
        } else if (this.pos[nr] > worldBounds[dim + 3] - this.radius) {
          this.pos[nr] = worldBounds[dim + 3] - this.radius;
          this.vel[nr] = -this.vel[nr];
          if (this.showCollisions)
            this.visMesh.setColorAt(i, this.ballCollisionColor);
        }
      }

      //  interball collision

      this.hash.query(this.pos, i, 2.0 * this.radius);

      for (var nr = 0; nr < this.hash.querySize; nr++) {
        var j = this.hash.queryIds[nr];

        vecSetDiff(this.normal, 0, this.pos, i, this.pos, j);
        var d2 = vecLengthSquared(this.normal, 0);

        // are the balls overlapping?

        if (d2 > 0.0 && d2 < minDist * minDist) {
          var d = Math.sqrt(d2);
          vecScale(this.normal, 0, 1.0 / d);

          // separate the balls

          var corr = (minDist - d) * 0.5;

          vecAdd(this.pos, i, this.normal, 0, corr);
          vecAdd(this.pos, j, this.normal, 0, -corr);

          // reflect velocities along normal

          var vi = vecDot(this.vel, i, this.normal, 0);
          var vj = vecDot(this.vel, j, this.normal, 0);

          vecAdd(this.vel, i, this.normal, 0, vj - vi);
          vecAdd(this.vel, j, this.normal, 0, vi - vj);

          if (this.showCollisions)
            this.visMesh.setColorAt(i, this.ballCollisionColor);
        }
      }
    }
    this.updateMesh();
  }
}

export default Balls;
