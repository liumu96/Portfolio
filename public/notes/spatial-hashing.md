✨ How to find neighbors among thousands of particles in a blazing fast way

![Alt text](/notes/spatial-hashing-01.png)
![Alt text](/notes/spatial-hashing-02.png)

### Coding

```jsx
class Hash {
  constructor(spacing, maxNumObjects) {
    this.spacing = spacing;
    this.tableSize = 2 * maxNumObjects;
    this.cellStart = new Int32Array(this.tableSize + 1);
    this.cellEntries = new Int32Array(maxNumObjects);
    this.queryIds = new Int32Array(maxNumObjects);
    this.querySize = 0;

    this.maxNumObjects = maxNumObjects;
    this.firstAdjId = new Int32Array(maxNumObjects + 1);
    this.adjIds = new Int32Array(10 * maxNumObjects);
  }

  hashCoords(xi, yi, zi) {
    var h = (xi * 92837111) ^ (yi * 689287499) ^ (zi * 283923481); // fantasy function
    return Math.abs(h) % this.tableSize;
  }

  intCoord(coord) {
    return Math.floor(coord / this.spacing);
  }

  hashPos(pos, nr) {
    return this.hashCoords(
      this.intCoord(pos[3 * nr]),
      this.intCoord(pos[3 * nr + 1]),
      this.intCoord(pos[3 * nr + 2])
    );
  }

  create(pos) {
    var numObjects = Math.min(pos.length / 3, this.cellEntries.length);

    // determine cell sizes

    this.cellStart.fill(0);
    this.cellEntries.fill(0);

    for (var i = 0; i < numObjects; i++) {
      var h = this.hashPos(pos, i);
      this.cellStart[h]++;
    }

    // determine cells starts

    var start = 0;
    for (var i = 0; i < this.tableSize; i++) {
      start += this.cellStart[i];
      this.cellStart[i] = start;
    }
    this.cellStart[this.tableSize] = start; // guard

    // fill in objects ids

    for (var i = 0; i < numObjects; i++) {
      var h = this.hashPos(pos, i);
      this.cellStart[h]--;
      this.cellEntries[this.cellStart[h]] = i;
    }
  }

  query(pos, nr, maxDist) {
    var x0 = this.intCoord(pos[3 * nr] - maxDist);
    var y0 = this.intCoord(pos[3 * nr + 1] - maxDist);
    var z0 = this.intCoord(pos[3 * nr + 2] - maxDist);

    var x1 = this.intCoord(pos[3 * nr] + maxDist);
    var y1 = this.intCoord(pos[3 * nr + 1] + maxDist);
    var z1 = this.intCoord(pos[3 * nr + 2] + maxDist);

    this.querySize = 0;

    for (var xi = x0; xi <= x1; xi++) {
      for (var yi = y0; yi <= y1; yi++) {
        for (var zi = z0; zi <= z1; zi++) {
          var h = this.hashCoords(xi, yi, zi);
          var start = this.cellStart[h];
          var end = this.cellStart[h + 1];

          for (var i = start; i < end; i++) {
            this.queryIds[this.querySize] = this.cellEntries[i];
            this.querySize++;
          }
        }
      }
    }
  }

  queryAll(pos, maxDist) {
    var num = 0;
    var maxDist2 = maxDist * maxDist;

    for (var i = 0; i < this.maxNumObjects; i++) {
      var id0 = i;
      this.firstAdjId[id0] = num;
      this.query(pos, id0, maxDist);

      for (var j = 0; j < this.querySize; j++) {
        var id1 = this.queryIds[j];
        if (id1 >= id0) continue;
        var dist2 = vecDistSquared(pos, id0, pos, id1);
        if (dist2 > maxDist2) continue;

        if (num >= this.adjIds.length) {
          var newIds = new Int32Array(2 * num); // dynamic array
          newIds.set(this.adjIds);
          this.adjIds = newIds;
        }
        this.adjIds[num++] = id1;
      }
    }

    this.firstAdjId[this.maxNumObjects] = num;
  }
}
```

```jsx
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
```
