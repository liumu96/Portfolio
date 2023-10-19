import * as THREE from "three";

class WaterSurface {
  constructor(sizeX, sizeZ, depth, spacing, visMaterial, scene) {
    // physics data

    this.waveSpeed = 2.0;
    this.posDamping = 1.0;
    this.velDamping = 0.3;
    this.alpha = 0.5;
    this.time = 0.0;

    this.numX = Math.floor(sizeX / spacing) + 1;
    this.numZ = Math.floor(sizeZ / spacing) + 1;
    this.spacing = spacing;
    this.numCells = this.numX * this.numZ;
    this.heights = new Float32Array(this.numCells);
    this.bodyHeights = new Float32Array(this.numCells);
    this.prevHeights = new Float32Array(this.numCells);
    this.velocities = new Float32Array(this.numCells);
    this.heights.fill(depth);
    this.velocities.fill(0.0);

    // visual mesh

    let positions = new Float32Array(this.numCells * 3);
    let uvs = new Float32Array(this.numCells * 2);
    let cx = Math.floor(this.numX / 2.0);
    let cz = Math.floor(this.numZ / 2.0);

    for (let i = 0; i < this.numX; i++) {
      for (let j = 0; j < this.numZ; j++) {
        positions[3 * (i * this.numZ + j)] = (i - cx) * spacing;
        positions[3 * (i * this.numZ + j) + 2] = (j - cz) * spacing;

        uvs[2 * (i * this.numZ + j)] = i / this.numX;
        uvs[2 * (i * this.numZ + j) + 1] = j / this.numZ;
      }
    }

    var index = new Uint32Array((this.numX - 1) * (this.numZ - 1) * 2 * 3);
    let pos = 0;
    for (let i = 0; i < this.numX - 1; i++) {
      for (let j = 0; j < this.numZ - 1; j++) {
        let id0 = i * this.numZ + j;
        let id1 = i * this.numZ + j + 1;
        let id2 = (i + 1) * this.numZ + j + 1;
        let id3 = (i + 1) * this.numZ + j;

        index[pos++] = id0;
        index[pos++] = id1;
        index[pos++] = id2;

        index[pos++] = id0;
        index[pos++] = id2;
        index[pos++] = id3;
      }
    }
    var geometry = new THREE.BufferGeometry();

    //					var positions = new Float32Array([0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0]);
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

    //					geometry.setIndex(index);
    geometry.setIndex(new THREE.BufferAttribute(index, 1));

    this.visMesh = new THREE.Mesh(geometry, visMaterial);

    this.updateVisMesh();
    scene.add(this.visMesh);
  }

  simulateCoupling(objects, gravity, dt) {
    let cx = Math.floor(this.numX / 2.0);
    let cz = Math.floor(this.numZ / 2.0);
    let h1 = 1.0 / this.spacing;

    this.prevHeights.set(this.bodyHeights);
    this.bodyHeights.fill(0.0);

    for (let i = 0; i < objects.length; i++) {
      let ball = objects[i];
      let pos = ball.pos;
      let br = ball.radius;
      let h2 = this.spacing * this.spacing;

      let x0 = Math.max(0, cx + Math.floor((pos.x - br) * h1));
      let x1 = Math.min(this.numX - 1, cx + Math.floor((pos.x + br) * h1));
      let z0 = Math.max(0, cz + Math.floor((pos.z - br) * h1));
      let z1 = Math.min(this.numZ - 1, cz + Math.floor((pos.z + br) * h1));

      for (let xi = x0; xi <= x1; xi++) {
        for (let zi = z0; zi <= z1; zi++) {
          let x = (xi - cx) * this.spacing;
          let z = (zi - cz) * this.spacing;
          let r2 = (pos.x - x) * (pos.x - x) + (pos.z - z) * (pos.z - z);
          if (r2 < br * br) {
            let bodyHalfHeight = Math.sqrt(br * br - r2);
            let waterHeight = this.heights[xi * this.numZ + zi];

            let bodyMin = Math.max(pos.y - bodyHalfHeight, 0.0);
            let bodyMax = Math.min(pos.y + bodyHalfHeight, waterHeight);
            var bodyHeight = Math.max(bodyMax - bodyMin, 0.0);
            if (bodyHeight > 0.0) {
              ball.applyForce(-bodyHeight * h2 * gravity.y, dt);
              this.bodyHeights[xi * this.numZ + zi] += bodyHeight;
            }
          }
        }
      }
    }

    for (let iter = 0; iter < 2; iter++) {
      for (let xi = 0; xi < this.numX; xi++) {
        for (let zi = 0; zi < this.numZ; zi++) {
          let id = xi * this.numZ + zi;

          let num = xi > 0 && xi < this.numX - 1 ? 2 : 1;
          num += zi > 0 && zi < this.numZ - 1 ? 2 : 1;
          let avg = 0.0;
          if (xi > 0) avg += this.bodyHeights[id - this.numZ];
          if (xi < this.numX - 1) avg += this.bodyHeights[id + this.numZ];
          if (zi > 0) avg += this.bodyHeights[id - 1];
          if (zi < this.numZ - 1) avg += this.bodyHeights[id + 1];
          avg /= num;
          this.bodyHeights[id] = avg;
        }
      }
    }

    for (let i = 0; i < this.numCells; i++) {
      let bodyChange = this.bodyHeights[i] - this.prevHeights[i];
      this.heights[i] += this.alpha * bodyChange;
    }
  }

  simulateSurface(dt) {
    this.waveSpeed = Math.min(this.waveSpeed, (0.5 * this.spacing) / dt);
    let c = (this.waveSpeed * this.waveSpeed) / this.spacing / this.spacing;
    let pd = Math.min(this.posDamping * dt, 1.0);
    let vd = Math.max(0.0, 1.0 - this.velDamping * dt);

    for (let i = 0; i < this.numX; i++) {
      for (let j = 0; j < this.numZ; j++) {
        let id = i * this.numZ + j;
        let h = this.heights[id];
        let sumH = 0.0;
        sumH += i > 0 ? this.heights[id - this.numZ] : h;
        sumH += i < this.numX - 1 ? this.heights[id + this.numZ] : h;
        sumH += j > 0 ? this.heights[id - 1] : h;
        sumH += j < this.numZ - 1 ? this.heights[id + 1] : h;
        this.velocities[id] += dt * c * (sumH - 4.0 * h);
        this.heights[id] += (0.25 * sumH - h) * pd; // positional damping
      }
    }

    for (var i = 0; i < this.numCells; i++) {
      this.velocities[i] *= vd; // velocity damping
      this.heights[i] += this.velocities[i] * dt;
    }
  }

  simulate({ dt, objects, gravity }) {
    this.time += dt;
    this.simulateCoupling(objects, gravity, dt);
    this.simulateSurface(dt);
    this.updateVisMesh();
  }

  updateVisMesh() {
    const positions = this.visMesh.geometry.attributes.position.array;
    for (let i = 0; i < this.numCells; i++)
      positions[3 * i + 1] = this.heights[i];
    this.visMesh.geometry.attributes.position.needsUpdate = true;
    this.visMesh.geometry.computeVertexNormals();
    this.visMesh.geometry.computeBoundingSphere();
  }

  setVisible(visible) {
    this.visMesh.visible = visible;
  }
}

export default WaterSurface;
