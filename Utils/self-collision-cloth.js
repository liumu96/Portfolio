import {
  vecSetDiff,
  vecDistSquared,
  vecAdd,
  vecCopy,
  vecLengthSquared,
  vecScale,
  vecSetSum,
} from "./vector-math";

import * as THREE from "three";

import Hash from "./hash";

class SelfCollisionCloth {
  constructor(scene, numX, numY, spacing, thickness, bendingCompliance = 1.0) {
    // particles

    var jitter = 0.001 * spacing;

    this.numParticles = numX * numY;
    this.pos = new Float32Array(3 * this.numParticles);
    this.prevPos = new Float32Array(3 * this.numParticles);
    this.restPos = new Float32Array(3 * this.numParticles);
    this.vel = new Float32Array(3 * this.numParticles);
    this.invMass = new Float32Array(this.numParticles);
    this.thickness = thickness;
    this.handleCollisions = true;
    this.vecs = new Float32Array(4 * 3);

    // particles

    var attach = false;

    for (var i = 0; i < numX; i++) {
      for (var j = 0; j < numY; j++) {
        var id = i * numY + j;
        this.pos[3 * id] = -numX * spacing * 0.5 + i * spacing;
        this.pos[3 * id + 1] = 0.2 + j * spacing;
        this.pos[3 * id + 2] = 0.0;
        this.invMass[id] = 1.0;
        if (attach && j == numY - 1 && (i == 0 || i == numX - 1))
          this.invMass[id] = 0.0;
      }
    }

    for (var i = 0; i < this.pos.length; i++)
      this.pos[i] += -jitter * 2.0 * jitter * Math.random();

    this.hash = new Hash(spacing, this.numParticles);

    this.restPos.set(this.pos);
    this.vel.fill(0.0);

    // constraints

    var numConstraintTypes = 6;

    this.ids = new Int32Array(this.numParticles * numConstraintTypes * 2);
    this.compliances = new Float32Array(this.numParticles * numConstraintTypes);
    var offsets = [
      0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 2, 0, 0, 2, 0,
    ];
    var num = 0;

    var stretchCompliance = 0.0;
    var shearCompliance = 0.0001;

    var compliances = [
      stretchCompliance,
      stretchCompliance,
      shearCompliance,
      shearCompliance,
      bendingCompliance,
      bendingCompliance,
    ];

    for (var constType = 0; constType < numConstraintTypes; constType++) {
      for (var i = 0; i < numX; i++) {
        for (var j = 0; j < numY; j++) {
          var p = 4 * constType;

          var i0 = i + offsets[p];
          var j0 = j + offsets[p + 1];
          var i1 = i + offsets[p + 2];
          var j1 = j + offsets[p + 3];
          if (i0 < numX && j0 < numY && i1 < numX && j1 < numY) {
            this.ids[num++] = i0 * numY + j0;
            this.ids[num++] = i1 * numY + j1;
            this.compliances[Math.floor(num / 2)] = compliances[constType];
          }
        }
      }
    }

    // randomize

    this.numConstraints = Math.floor(num / 2);

    // for (var i = 0; i < this.numConstraints; i++) {
    // 	var j = i + Math.floor(Math.random() * (this.numConstraints - i));
    // 	var c = this.compliances[i]; this.compliances[i] = this.compliances[j]; this.compliances[j] = c;
    // 	var id = this.ids[2 * i]; this.ids[2 * i] = this.ids[2 * j]; this.ids[2 * j] = id;
    // 	id = this.ids[2 * i + 1]; this.ids[2 * i + 1] = this.ids[2 * j + 1]; this.ids[2 * j + 1] = id;
    // }

    // pre-compute rest lengths

    this.restLens = new Float32Array(this.numConstraints);
    for (var i = 0; i < this.numConstraints; i++) {
      var id0 = this.ids[2 * i];
      var id1 = this.ids[2 * i + 1];
      this.restLens[i] = Math.sqrt(
        vecDistSquared(this.pos, id0, this.pos, id1)
      );
    }

    // visual meshes

    var triIds = [];
    var edgeIds = [];

    for (var i = 0; i < numX; i++) {
      for (var j = 0; j < numY; j++) {
        var id = i * numY + j;
        if (i < numX - 1 && j < numY - 1) {
          triIds.push(id + 1);
          triIds.push(id);
          triIds.push(id + 1 + numY);
          triIds.push(id + 1 + numY);
          triIds.push(id);
          triIds.push(id + numY);
        }
        if (i < numX - 1) {
          edgeIds.push(id);
          edgeIds.push(id + numY);
        }
        if (j < numY - 1) {
          edgeIds.push(id);
          edgeIds.push(id + 1);
        }
      }
    }

    geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(this.pos, 3));
    geometry.setIndex(triIds);
    var visMaterial = new THREE.MeshPhongMaterial({
      color: 0xf9a8d4,
      side: THREE.FrontSide,
    });
    this.triMesh = new THREE.Mesh(geometry, visMaterial);
    this.triMesh.castShadow = true;
    this.triMesh.userData = this; // for raycasting
    this.triMesh.layers.enable(1);
    scene.add(this.triMesh);

    var backMaterial = new THREE.MeshPhongMaterial({
      color: 0xc084fc,
      side: THREE.BackSide,
    });
    this.backMesh = new THREE.Mesh(geometry, backMaterial);
    this.backMesh.userData = this; // for raycasting
    this.backMesh.layers.enable(1);

    scene.add(this.backMesh);
    geometry.computeVertexNormals();

    // visual edge mesh

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(this.pos, 3));
    geometry.setIndex(edgeIds);
    var lineMaterial = new THREE.LineBasicMaterial({
      color: 0x60a5fa,
      linewidth: 2,
    });
    this.edgeMesh = new THREE.LineSegments(geometry, lineMaterial);
    this.edgeMesh.visible = false;
    scene.add(this.edgeMesh);

    this.updateVisMeshes();
  }

  simulate(frameDt, numSubSteps, gravity) {
    var dt = frameDt / numSubSteps;
    var maxVelocity = (0.2 * this.thickness) / dt;

    if (this.handleCollisions) {
      this.hash.create(this.pos);
      var maxTravelDist = maxVelocity * frameDt;
      this.hash.queryAll(this.pos, maxTravelDist);
    }

    for (var step = 0; step < numSubSteps; step++) {
      // integrate

      for (var i = 0; i < this.numParticles; i++) {
        if (this.invMass[i] > 0.0) {
          vecAdd(this.vel, i, gravity, 0, dt);
          var v = Math.sqrt(vecLengthSquared(this.vel, i));
          var maxV = (0.2 * this.thickness) / dt;
          if (v > maxV) {
            vecScale(this.vel, i, maxV / v);
          }
          vecCopy(this.prevPos, i, this.pos, i);
          vecAdd(this.pos, i, this.vel, i, dt);
        }
      }

      // solve

      this.solveGroundCollisions();

      this.solveConstraints(dt);
      if (this.handleCollisions) this.solveCollisions(dt);

      // update velocities

      for (var i = 0; i < this.numParticles; i++) {
        if (this.invMass[i] > 0.0)
          vecSetDiff(this.vel, i, this.pos, i, this.prevPos, i, 1.0 / dt);
      }
    }

    this.updateVisMeshes();
  }

  solveConstraints(dt) {
    for (var i = 0; i < this.numConstraints; i++) {
      var id0 = this.ids[2 * i];
      var id1 = this.ids[2 * i + 1];
      var w0 = this.invMass[id0];
      var w1 = this.invMass[id1];
      var w = w0 + w1;
      if (w == 0.0) continue;

      vecSetDiff(this.vecs, 0, this.pos, id0, this.pos, id1);
      var len = Math.sqrt(vecLengthSquared(this.vecs, 0));
      if (len == 0.0) continue;
      vecScale(this.vecs, 0, 1.0 / len);
      var restLen = this.restLens[i];
      var C = len - restLen;
      var alpha = this.compliances[i] / dt / dt;
      var s = -C / (w + alpha);
      vecAdd(this.pos, id0, this.vecs, 0, s * w0);
      vecAdd(this.pos, id1, this.vecs, 0, -s * w1);
    }
    var done = 0;
  }

  solveGroundCollisions() {
    for (var i = 0; i < this.numParticles; i++) {
      if (this.invMass[i] == 0.0) continue;
      var y = this.pos[3 * i + 1];
      if (y < 0.5 * this.thickness) {
        var damping = 1.0;
        vecSetDiff(this.vecs, 0, this.pos, i, this.prevPos, i);
        vecAdd(this.pos, i, this.vecs, 0, -damping);
        this.pos[3 * i + 1] = 0.5 * this.thickness;
      }
    }
  }

  solveCollisions(dt) {
    var thickness2 = this.thickness * this.thickness;

    for (var i = 0; i < this.numParticles; i++) {
      if (this.invMass[i] == 0.0) continue;
      var id0 = i;
      var first = this.hash.firstAdjId[i];
      var last = this.hash.firstAdjId[i + 1];

      for (var j = first; j < last; j++) {
        var id1 = this.hash.adjIds[j];
        if (this.invMass[id1] == 0.0) continue;

        vecSetDiff(this.vecs, 0, this.pos, id1, this.pos, id0);

        var dist2 = vecLengthSquared(this.vecs, 0);
        if (dist2 > thickness2 || dist2 == 0.0) continue;
        var restDist2 = vecDistSquared(this.restPos, id0, this.restPos, id1);

        var minDist = this.thickness;
        if (dist2 > restDist2) continue;
        if (restDist2 < thickness2) minDist = Math.sqrt(restDist2);

        // position correction
        var dist = Math.sqrt(dist2);
        vecScale(this.vecs, 0, (minDist - dist) / dist);
        vecAdd(this.pos, id0, this.vecs, 0, -0.5);
        vecAdd(this.pos, id1, this.vecs, 0, 0.5);

        // velocities
        vecSetDiff(this.vecs, 0, this.pos, id0, this.prevPos, id0);
        vecSetDiff(this.vecs, 1, this.pos, id1, this.prevPos, id1);

        // average velocity
        vecSetSum(this.vecs, 2, this.vecs, 0, this.vecs, 1, 0.5);

        // velocity corrections
        vecSetDiff(this.vecs, 0, this.vecs, 2, this.vecs, 0);
        vecSetDiff(this.vecs, 1, this.vecs, 2, this.vecs, 1);

        // add corrections
        var friction = 0.0;
        vecAdd(this.pos, id0, this.vecs, 0, friction);
        vecAdd(this.pos, id1, this.vecs, 1, friction);
      }
    }
  }

  updateVisMeshes() {
    this.triMesh.geometry.computeVertexNormals();
    this.triMesh.geometry.attributes.position.needsUpdate = true;
    this.triMesh.geometry.computeBoundingSphere();

    this.edgeMesh.geometry.attributes.position.needsUpdate = true;
  }

  startGrab(pos) {
    var p = [pos.x, pos.y, pos.z];
    var minD2 = Number.MAX_VALUE;
    this.grabId = -1;
    for (let i = 0; i < this.numParticles; i++) {
      var d2 = vecDistSquared(p, 0, this.pos, i);
      if (d2 < minD2) {
        minD2 = d2;
        this.grabId = i;
      }
    }

    if (this.grabId >= 0) {
      this.grabInvMass = this.invMass[this.grabId];
      this.invMass[this.grabId] = 0.0;
      vecCopy(this.pos, this.grabId, p, 0);
    }
  }

  moveGrabbed(pos) {
    if (this.grabId >= 0) {
      var p = [pos.x, pos.y, pos.z];
      vecCopy(this.pos, this.grabId, p, 0);
    }
  }

  endGrab(vel) {
    if (this.grabId >= 0) {
      this.invMass[this.grabId] = this.grabInvMass;
      var v = [vel.x, vel.y, vel.z];
      vecCopy(this.vel, this.grabId, v, 0);
    }
    this.grabId = -1;
  }
}

export default SelfCollisionCloth;
