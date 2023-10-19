import {
  vecSetDiff,
  vecSetCross,
  vecDot,
  vecDistSquared,
  vecAdd,
  vecCopy,
  vecLengthSquared,
  vecScale,
  matSetInverse,
  matSetMult,
  vecSetZero,
} from "./vector-math";
import * as THREE from "three";
import Hash from "./hash";

class Softbody {
  constructor({
    tetMesh,
    visMesh,
    scene,
    edgeCompliance = 0.0,
    volCompliance = 0.0,
  }) {
    // constructor(tetMesh, scene, edgeCompliance = 100.0, volCompliance = 0.0) {
    // physics

    this.numParticles = tetMesh.verts.length / 3;
    this.numTets = tetMesh.tetIds.length / 4;
    this.pos = new Float32Array(tetMesh.verts);
    this.prevPos = tetMesh.verts.slice();
    this.vel = new Float32Array(3 * this.numParticles);

    this.tetIds = tetMesh.tetIds;
    this.edgeIds = tetMesh.tetEdgeIds || tetMesh.edgeIds;
    this.restVol = new Float32Array(this.numTets);
    this.edgeLengths = new Float32Array(this.edgeIds.length / 2);
    this.invMass = new Float32Array(this.numParticles);

    this.edgeCompliance = edgeCompliance;
    this.volCompliance = volCompliance;

    this.temp = new Float32Array(4 * 3);
    this.grads = new Float32Array(4 * 3);

    this.grabId = -1;
    this.grabInvMass = 0.0;

    this.initPhysics();

    if (visMesh) {
      // visual tet mesh

      var geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(this.pos, 3));
      geometry.setIndex(tetMesh.edgeIds);
      var lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 2,
      });
      this.tetMesh = new THREE.LineSegments(geometry, lineMaterial);
      this.tetMesh.visible = true;
      scene.add(this.tetMesh);
      this.tetMesh.visible = false;

      // visual embedded mesh
      this.numVisVerts = visMesh.verts.length / 3;
      this.skinningInfo = new Float32Array(4 * this.numVisVerts);
      this.computeSkinningInfo(visMesh.verts);

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(3 * this.numVisVerts), 3)
      );
      geometry.setIndex(visMesh.triIds);
      var visMaterial = new THREE.MeshPhongMaterial({ color: 0xf78a1d });
      this.visMesh = new THREE.Mesh(geometry, visMaterial);
      this.visMesh.castShadow = true;
      this.visMesh.userData = this; // for raycasting
      this.visMesh.layers.enable(1);
      scene.add(this.visMesh);
      geometry.computeVertexNormals();
      this.updateVisMesh();

      this.volIdOrder = [
        [1, 3, 2],
        [0, 2, 3],
        [0, 3, 1],
        [0, 1, 2],
      ];
    } else {
      // surface tri mesh
      var geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(this.pos, 3));
      geometry.setIndex(tetMesh.tetSurfaceTriIds);
      // var material = new THREE.MeshPhongMaterial({ color: 0xf02000 });
      const material = new THREE.MeshPhongMaterial({ color: 0xc084fc });
      material.flatShading = true;
      this.surfaceMesh = new THREE.Mesh(geometry, material);
      this.surfaceMesh.geometry.computeVertexNormals();
      this.surfaceMesh.userData = this;
      this.surfaceMesh.layers.enable(1);
      scene.add(this.surfaceMesh);

      this.volIdOrder = [
        [1, 3, 2],
        [0, 2, 3],
        [0, 3, 1],
        [0, 1, 2],
      ];
    }
  }

  translate(x, y, z) {
    for (var i = 0; i < this.numParticles; i++) {
      vecAdd(this.pos, i, [x, y, z], 0);
      vecAdd(this.prevPos, i, [x, y, z], 0);
    }
  }

  updateMeshes() {
    this.surfaceMesh.geometry.computeVertexNormals();
    this.surfaceMesh.geometry.attributes.position.needsUpdate = true;
    this.surfaceMesh.geometry.computeBoundingSphere();
  }

  getTetVolume(nr) {
    var id0 = this.tetIds[4 * nr];
    var id1 = this.tetIds[4 * nr + 1];
    var id2 = this.tetIds[4 * nr + 2];
    var id3 = this.tetIds[4 * nr + 3];
    vecSetDiff(this.temp, 0, this.pos, id1, this.pos, id0);
    vecSetDiff(this.temp, 1, this.pos, id2, this.pos, id0);
    vecSetDiff(this.temp, 2, this.pos, id3, this.pos, id0);
    vecSetCross(this.temp, 3, this.temp, 0, this.temp, 1);
    return vecDot(this.temp, 3, this.temp, 2) / 6.0;
  }

  initPhysics() {
    this.invMass.fill(0.0);
    this.restVol.fill(0.0);

    for (var i = 0; i < this.numTets; i++) {
      var vol = this.getTetVolume(i);
      this.restVol[i] = vol;
      var pInvMass = vol > 0.0 ? 1.0 / (vol / 4.0) : 0.0;
      this.invMass[this.tetIds[4 * i]] += pInvMass;
      this.invMass[this.tetIds[4 * i + 1]] += pInvMass;
      this.invMass[this.tetIds[4 * i + 2]] += pInvMass;
      this.invMass[this.tetIds[4 * i + 3]] += pInvMass;
    }
    for (var i = 0; i < this.edgeLengths.length; i++) {
      var id0 = this.edgeIds[2 * i];
      var id1 = this.edgeIds[2 * i + 1];
      this.edgeLengths[i] = Math.sqrt(
        vecDistSquared(this.pos, id0, this.pos, id1)
      );
    }
  }

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
    // this.endFrame();
  }

  endFrame() {
    if (this.visMesh) {
      this.updateTetMesh();
      this.updateVisMesh();
    } else {
      this.updateMeshes();
    }
  }

  updateTetMesh() {
    const positions = this.tetMesh.geometry.attributes.position.array;
    for (let i = 0; i < this.pos.length; i++) positions[i] = this.pos[i];
    this.tetMesh.geometry.attributes.position.needsUpdate = true;
    this.tetMesh.geometry.computeBoundingSphere();
  }

  updateVisMesh() {
    const positions = this.visMesh.geometry.attributes.position.array;
    var nr = 0;
    for (let i = 0; i < this.numVisVerts; i++) {
      var tetNr = this.skinningInfo[nr++] * 4;
      if (tetNr < 0) {
        nr += 3;
        continue;
      }
      var b0 = this.skinningInfo[nr++];
      var b1 = this.skinningInfo[nr++];
      var b2 = this.skinningInfo[nr++];
      var b3 = 1.0 - b0 - b1 - b2;
      var id0 = this.tetIds[tetNr++];
      var id1 = this.tetIds[tetNr++];
      var id2 = this.tetIds[tetNr++];
      var id3 = this.tetIds[tetNr++];
      vecSetZero(positions, i);
      vecAdd(positions, i, this.pos, id0, b0);
      vecAdd(positions, i, this.pos, id1, b1);
      vecAdd(positions, i, this.pos, id2, b2);
      vecAdd(positions, i, this.pos, id3, b3);
    }
    this.visMesh.geometry.computeVertexNormals();
    this.visMesh.geometry.attributes.position.needsUpdate = true;
    this.visMesh.geometry.computeBoundingSphere();
  }

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

  squash() {
    for (var i = 0; i < this.numParticles; i++) {
      this.pos[3 * i + 1] = 0.5;
    }
    this.endFrame();
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

  computeSkinningInfo(visVerts) {
    // create a hash for all vertices of the visual mesh

    var hash = new Hash(0.05, this.numVisVerts);
    hash.create(visVerts);

    this.skinningInfo.fill(-1.0); // undefined

    var minDist = new Float32Array(this.numVisVerts);
    minDist.fill(Number.MAX_VALUE);
    var border = 0.05;

    // each tet searches for containing vertices

    var tetCenter = new Float32Array(3);
    var mat = new Float32Array(9);
    var bary = new Float32Array(4);

    for (var i = 0; i < this.numTets; i++) {
      // compute bounding sphere of tet

      tetCenter.fill(0.0);
      for (var j = 0; j < 4; j++)
        vecAdd(tetCenter, 0, this.pos, this.tetIds[4 * i + j], 0.25);

      var rMax = 0.0;
      for (var j = 0; j < 4; j++) {
        var r2 = vecDistSquared(tetCenter, 0, this.pos, this.tetIds[4 * i + j]);
        rMax = Math.max(rMax, Math.sqrt(r2));
      }

      rMax += border;

      hash.query(tetCenter, 0, rMax);
      if (hash.queryIds.length == 0) continue;

      var id0 = this.tetIds[4 * i];
      var id1 = this.tetIds[4 * i + 1];
      var id2 = this.tetIds[4 * i + 2];
      var id3 = this.tetIds[4 * i + 3];

      vecSetDiff(mat, 0, this.pos, id0, this.pos, id3);
      vecSetDiff(mat, 1, this.pos, id1, this.pos, id3);
      vecSetDiff(mat, 2, this.pos, id2, this.pos, id3);

      matSetInverse(mat);

      for (var j = 0; j < hash.queryIds.length; j++) {
        var id = hash.queryIds[j];

        // we already have skinning info

        if (minDist[id] <= 0.0) continue;

        if (vecDistSquared(visVerts, id, tetCenter, 0) > rMax * rMax) continue;

        // compute barycentric coords for candidate

        vecSetDiff(bary, 0, visVerts, id, this.pos, id3);
        matSetMult(mat, bary, 0, bary, 0);
        bary[3] = 1.0 - bary[0] - bary[1] - bary[2];

        var dist = 0.0;
        for (var k = 0; k < 4; k++) dist = Math.max(dist, -bary[k]);

        if (dist < minDist[id]) {
          minDist[id] = dist;
          this.skinningInfo[4 * id] = i;
          this.skinningInfo[4 * id + 1] = bary[0];
          this.skinningInfo[4 * id + 2] = bary[1];
          this.skinningInfo[4 * id + 3] = bary[2];
        }
      }
    }
  }
  updateVisMesh() {
    const positions = this.visMesh.geometry.attributes.position.array;
    var nr = 0;
    for (let i = 0; i < this.numVisVerts; i++) {
      var tetNr = this.skinningInfo[nr++] * 4;
      if (tetNr < 0) {
        nr += 3;
        continue;
      }
      var b0 = this.skinningInfo[nr++];
      var b1 = this.skinningInfo[nr++];
      var b2 = this.skinningInfo[nr++];
      var b3 = 1.0 - b0 - b1 - b2;
      var id0 = this.tetIds[tetNr++];
      var id1 = this.tetIds[tetNr++];
      var id2 = this.tetIds[tetNr++];
      var id3 = this.tetIds[tetNr++];
      vecSetZero(positions, i);
      vecAdd(positions, i, this.pos, id0, b0);
      vecAdd(positions, i, this.pos, id1, b1);
      vecAdd(positions, i, this.pos, id2, b2);
      vecAdd(positions, i, this.pos, id3, b3);
    }
    this.visMesh.geometry.computeVertexNormals();
    this.visMesh.geometry.attributes.position.needsUpdate = true;
    this.visMesh.geometry.computeBoundingSphere();
  }
}

export default Softbody;
