import Ball from "./ball-2d";
import VectorBall from "./physics-ball";
import Vector2 from "./vector2";
import { AnalyticBead, Bead } from "./bead";
import Pendulum from "./pendulum";
import Fluid from "./fluid";
import FlipFluid from "./flip-fluid";
import {
  createShader,
  meshFragmentShader,
  meshVertexShader,
  pointFragmentShader,
  pointVertexShader,
} from "./shader";

class CanvasScene {
  constructor(canvas, type) {
    this.canvas = canvas;
    if (type == "webgl") {
      this.gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } else {
      this.context = canvas.getContext("2d");
    }

    canvas.width = window.innerWidth * 0.6;
    canvas.height = window.innerHeight - 300;

    const simMinWidth = 20.0;
    this.cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
    this.simWidth = canvas.width / this.cScale;
    this.simHeight = canvas.height / this.cScale;

    this.gravity = { x: 0.0, y: -10.0 };
    this.timeStep = 1.0 / 60.0;

    this.update.bind(this);
    this.drawBall.bind(this);
    window.addEventListener("resize", this.resize.bind(this));

    this.physicsScene = {
      gravity: new Vector2(0.0, -9.8),
      dt: 1.0 / 60.0,
      worldSize: new Vector2(this.simWidth, this.simHeight),
      paused: true,
      balls: [],
      restitution: 1.0,
      // for bead
      numSteps: 1000,
      wireCenter: new Vector2(),
      wireRadius: 0.0,
      beads: [],
      bead: null,
      analyticBead: null,
      // for pendulum
      numSubSteps: 10000,
      pendulumPBD: null,
      pendulumAnalytic: null,
    };

    this.simulate.bind(this);
    this.drawBalls.bind(this);
    this.run.bind(this);
  }

  addBall() {
    const radius = 2;
    const pos = { x: 0.2, y: 0.2 };
    const vel = { x: 10.0, y: 18.0 };
    this.ball = new Ball({ pos, radius, vel });
  }

  setupMultiBalls(numBalls) {
    this.physicsScene.balls = [];
    for (let i = 0; i < numBalls; i++) {
      const radius = 0.5 + Math.random() * 0.1;
      const mass = Math.PI * radius * radius;
      const pos = new Vector2(
        Math.random() * this.simWidth,
        Math.random() * this.simHeight
      );
      const vel = new Vector2(
        -4.0 + 4.0 * Math.random(),
        -4.0 + 4.0 * Math.random()
      );

      this.physicsScene.balls.push(new VectorBall({ radius, mass, pos, vel }));
    }
  }

  drawBalls() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = "rgb(192, 132, 252)";

    for (let i = 0; i < this.physicsScene.balls.length; i++) {
      const ball = this.physicsScene.balls[i];
      this.context.beginPath();
      this.context.arc(
        this.cX(ball.pos),
        this.cY(ball.pos),
        this.cScale * ball.radius,
        0.0,
        2.0 * Math.PI
      );
      this.context.closePath();
      this.context.fill();
    }
  }

  drawBall() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = "rgb(192, 132, 252)";
    const { ball } = this;

    this.context.beginPath();
    this.context.arc(
      this.cX(ball.pos),
      this.cY(ball.pos),
      this.cScale * ball.radius,
      0.0,
      2.0 * Math.PI
    );

    this.context.closePath();
    this.context.fill();
  }

  // For Bead
  setupBeadScene() {
    const { physicsScene } = this;
    const simMinWidth = 2.0;
    this.cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
    this.simWidth = canvas.width / this.cScale;
    this.simHeight = canvas.height / this.cScale;
    physicsScene.wireCenter.x = this.simWidth / 2.0;
    physicsScene.wireCenter.y = this.simHeight / 2.0;
    physicsScene.wireRadius = simMinWidth * 0.4;

    const pos = new Vector2(
      physicsScene.wireCenter.x + physicsScene.wireRadius,
      physicsScene.wireCenter.y
    );

    physicsScene.bead = new Bead(0.1, 1.0, pos);

    physicsScene.analyticBead = new AnalyticBead(
      physicsScene.wireRadius,
      0.1,
      1.0,
      0.5 * Math.PI
    );
  }

  setupMultiBeadsScene() {
    const { physicsScene, canvas } = this;
    const simMinWidth = 2.0;
    this.cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
    this.simWidth = canvas.width / this.cScale;
    this.simHeight = canvas.height / this.cScale;
    physicsScene.wireCenter.x = this.simWidth / 2.0;
    physicsScene.wireCenter.y = this.simHeight / 2.0;
    physicsScene.wireRadius = simMinWidth * 0.4;

    const numBeads = 5;

    let r = 0.1;
    let angle = 0.0;
    for (let i = 0; i < numBeads; i++) {
      const mass = Math.PI * r * r;
      const pos = new Vector2(
        physicsScene.wireCenter.x + physicsScene.wireRadius * Math.cos(angle),
        physicsScene.wireCenter.y + physicsScene.wireRadius * Math.sin(angle)
      );

      physicsScene.beads.push(new Bead(r, mass, pos));
      angle += Math.PI / numBeads;
      r = 0.05 + Math.random() * 0.1;
    }
  }

  drawCircle(pos, radius, filled) {
    this.context.beginPath();
    this.context.arc(
      this.cX(pos),
      this.cY(pos),
      this.cScale * radius,
      0.0,
      2.0 * Math.PI
    );
    this.context.closePath();
    if (filled) this.context.fill();
    else this.context.stroke();
  }

  // For Pendulum
  setupPendulumScene(sceneNr) {
    const { physicsScene, canvas } = this;
    var simMinWidth = 1.0;
    this.cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
    this.simWidth = canvas.width / this.cScale;
    this.simHeight = canvas.height / this.cScale;

    var angles = [0.5 * Math.PI, Math.PI, Math.PI, Math.PI, Math.PI];
    var lengths = [];
    var masses = [];
    console.log(Math.floor(sceneNr % 6));
    switch (Math.floor(sceneNr % 6)) {
      case 0: {
        lengths = [0.15, 0.15, 0.15];
        masses = [1.0, 1.0, 1.0];
        break;
      }
      case 1: {
        lengths = [0.06, 0.15, 0.2];
        masses = [1.0, 0.5, 0.1];
        break;
      }
      case 2: {
        lengths = [0.15, 0.15, 0.15];
        masses = [1.0, 0.01, 1.0];
        break;
      }
      case 3: {
        lengths = [0.15, 0.15, 0.15];
        masses = [0.01, 1.0, 0.01];
        break;
      }
      case 4: {
        lengths = [0.2, 0.133, 0.04];
        masses = [0.3, 0.3, 0.3];
        break;
      }
      case 5: {
        lengths = [0.1, 0.12, 0.1, 0.15, 0.05];
        masses = [0.2, 0.6, 0.4, 0.3, 0.2];
        break;
      }
    }

    physicsScene.pendulumAnalytic = null;

    physicsScene.pendulumPBD = new Pendulum(
      true,
      "#f9a8d4",
      masses,
      lengths,
      angles
    );
    if (masses.length <= 3)
      physicsScene.pendulumAnalytic = new Pendulum(
        false,
        "#c084fc",
        masses,
        lengths,
        angles
      );
    physicsScene.paused = true;

    // sceneNr++;
  }

  // For Fluid
  initFluidScene() {
    const simMinWidth = 1.1;
    this.cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
    this.simWidth = canvas.width / this.cScale;
    this.simHeight = canvas.height / this.cScale;

    this.fluidScene = {
      gravity: -9.81,
      dt: 1.0 / 120.0,
      numIters: 100,
      frameNr: 0,
      overRelaxation: 1.9,
      obstacleX: 0.0,
      obstacleY: 0.0,
      obstacleRadius: 0.15,
      paused: false,
      sceneNr: 0,
      showObstacle: false,
      showStreamlines: false,
      showVelocities: false,
      showPressure: false,
      showSmoke: true,
      fluid: null,
    };
  }

  setupFluidScene(sceneNr = 0) {
    const { fluidScene, simWidth, simHeight } = this;
    fluidScene.sceneNr = sceneNr;
    fluidScene.obstacleRadius = 0.15;
    fluidScene.overRelaxation = 1.9;

    fluidScene.dt = 1.0 / 60.0;
    fluidScene.numIters = 40;

    let res = 100;

    if (sceneNr == 0) res = 50;
    else if (sceneNr == 3) res = 200;

    var domainHeight = 1.0;
    var domainWidth = (domainHeight / simHeight) * simWidth;
    var h = domainHeight / res;

    var numX = Math.floor(domainWidth / h);
    var numY = Math.floor(domainHeight / h);

    var density = 1000.0;

    const f = (fluidScene.fluid = new Fluid(density, numX, numY, h));

    var n = f.numY;

    if (sceneNr == 0) {
      // tank

      for (var i = 0; i < f.numX; i++) {
        for (var j = 0; j < f.numY; j++) {
          var s = 1.0; // fluid
          if (i == 0 || i == f.numX - 1 || j == 0) s = 0.0; // solid
          f.s[i * n + j] = s;
        }
      }
      fluidScene.gravity = -9.81;
      fluidScene.showPressure = true;
      fluidScene.showSmoke = false;
      fluidScene.showStreamlines = false;
      fluidScene.showVelocities = false;
    } else if (sceneNr == 1 || sceneNr == 3) {
      // vortex shedding

      var inVel = 2.0;
      for (var i = 0; i < f.numX; i++) {
        for (var j = 0; j < f.numY; j++) {
          var s = 1.0; // fluid
          if (i == 0 || j == 0 || j == f.numY - 1) s = 0.0; // solid
          f.s[i * n + j] = s;

          if (i == 1) {
            f.u[i * n + j] = inVel;
          }
        }
      }

      var pipeH = 0.1 * f.numY;
      var minJ = Math.floor(0.5 * f.numY - 0.5 * pipeH);
      var maxJ = Math.floor(0.5 * f.numY + 0.5 * pipeH);

      for (var j = minJ; j < maxJ; j++) f.m[j] = 0.0;

      this.setObstacle(0.4, 0.5, true);

      fluidScene.gravity = 0.0;
      fluidScene.showPressure = false;
      fluidScene.showSmoke = true;
      fluidScene.showStreamlines = false;
      fluidScene.showVelocities = false;

      if (sceneNr == 3) {
        fluidScene.dt = 1.0 / 120.0;
        fluidScene.numIters = 100;
        fluidScene.showPressure = true;
      }
    } else if (sceneNr == 2) {
      // paint

      fluidScene.gravity = 0.0;
      fluidScene.overRelaxation = 1.0;
      fluidScene.showPressure = false;
      fluidScene.showSmoke = true;
      fluidScene.showStreamlines = false;
      fluidScene.showVelocities = false;
      fluidScene.obstacleRadius = 0.1;
    }
  }

  setColor(r, g, b) {
    this.context.fillStyle = `rgb(
			${Math.floor(255 * r)},
			${Math.floor(255 * g)},
			${Math.floor(255 * b)})`;
    this.context.strokeStyle = `rgb(
			${Math.floor(255 * r)},
			${Math.floor(255 * g)},
			${Math.floor(255 * b)})`;
  }

  drawFluid() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = "#FF0000";
    const f = this.fluidScene.fluid;
    n = f.numY;

    const cellScale = 1.1;

    const h = f.h;

    let minP = f.p[0];
    let maxP = f.p[0];

    for (let i = 0; i < f.numCells; i++) {
      minP = Math.min(minP, f.p[i]);
      maxP = Math.max(maxP, f.p[i]);
    }

    const id = this.context.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    let color = [255, 255, 255, 255];

    const { fluidScene } = this;

    for (let i = 0; i < f.numX; i++) {
      for (let j = 0; j < f.numY; j++) {
        if (fluidScene.showPressure) {
          const p = f.p[i * n + j];
          const s = f.m[i * n + j];
          color = getSciColor(p, minP, maxP);
          if (fluidScene.showSmoke) {
            color[0] = Math.max(0.0, color[0] - 255 * s);
            color[1] = Math.max(0.0, color[1] - 255 * s);
            color[2] = Math.max(0.0, color[2] - 255 * s);
          }
        } else if (fluidScene.showSmoke) {
          const s = f.m[i * n + j];
          color[0] = 255 * s;
          color[1] = 255 * s;
          color[2] = 255 * s;
          if (fluidScene.sceneNr == 2) color = getSciColor(s, 0.0, 1.0);
        } else if (f.s[i * n + j] == 0.0) {
          color[0] = 0;
          color[1] = 0;
          color[2] = 0;
        }

        const x = Math.floor(this.cX(i * h));
        const y = Math.floor(this.cY((j + 1) * h));
        const cx = Math.floor(this.cScale * cellScale * h) + 1;
        const cy = Math.floor(this.cScale * cellScale * h) + 1;

        const r = color[0];
        const g = color[1];
        const b = color[2];
        // console.log(r, g, b);

        for (let yi = y; yi < y + cy; yi++) {
          let p = 4 * (yi * this.canvas.width + x);

          for (let xi = 0; xi < cx; xi++) {
            id.data[p++] = r;
            id.data[p++] = g;
            id.data[p++] = b;
            id.data[p++] = 255;
          }
        }
      }
    }

    this.context.putImageData(id, 0, 0);

    if (fluidScene.showVelocities) {
      this.context.strokeStyle = "#000000";
      scale = 0.02;

      for (var i = 0; i < f.numX; i++) {
        for (var j = 0; j < f.numY; j++) {
          var u = f.u[i * n + j];
          var v = f.v[i * n + j];

          this.context.beginPath();

          x0 = cX(i * h);
          x1 = cX(i * h + u * scale);
          y = cY((j + 0.5) * h);

          this.context.moveTo(x0, y);
          this.context.lineTo(x1, y);
          this.context.stroke();

          x = cX((i + 0.5) * h);
          y0 = cY(j * h);
          y1 = cY(j * h + v * scale);

          this.context.beginPath();
          this.context.moveTo(x, y0);
          this.context.lineTo(x, y1);
          this.context.stroke();
        }
      }
    }

    if (fluidScene.showStreamlines) {
      var segLen = f.h * 0.2;
      var numSegs = 15;

      this.context.strokeStyle = "#000000";

      for (var i = 1; i < f.numX - 1; i += 5) {
        for (var j = 1; j < f.numY - 1; j += 5) {
          var x = (i + 0.5) * f.h;
          var y = (j + 0.5) * f.h;

          this.context.beginPath();
          this.context.moveTo(cX(x), cY(y));

          for (var n = 0; n < numSegs; n++) {
            var u = f.sampleField(x, y, U_FIELD);
            var v = f.sampleField(x, y, V_FIELD);
            l = Math.sqrt(u * u + v * v);
            // x += u/l * segLen;
            // y += v/l * segLen;
            x += u * 0.01;
            y += v * 0.01;
            if (x > f.numX * f.h) break;

            this.context.lineTo(cX(x), cY(y));
          }
          this.context.stroke();
        }
      }
    }

    if (fluidScene.showObstacle) {
      this.context.strokeW;
      const r = fluidScene.obstacleRadius + f.h;
      if (fluidScene.showPressure) this.context.fillStyle = "#000000";
      else this.context.fillStyle = "#DDDDDD";
      this.context.beginPath();
      this.context.arc(
        this.cX(fluidScene.obstacleX),
        this.cY(fluidScene.obstacleY),
        this.cScale * r,
        0.0,
        2.0 * Math.PI
      );
      this.context.closePath();
      this.context.fill();

      this.context.lineWidth = 3.0;
      this.context.strokeStyle = "#000000";
      this.context.beginPath();
      this.context.arc(
        this.cX(fluidScene.obstacleX),
        this.cY(fluidScene.obstacleY),
        this.cScale * r,
        0.0,
        2.0 * Math.PI
      );
      this.context.closePath();
      this.context.stroke();
      this.context.lineWidth = 1.0;
    }

    if (fluidScene.showPressure) {
      var s = "pressure: " + minP.toFixed(0) + " - " + maxP.toFixed(0) + " N/m";
      this.context.fillStyle = "#000000";
      this.context.font = "16px Arial";
      this.context.fillText(s, 10, 35);
    }
  }

  // For flip fluid
  intiFlipFluidScene() {
    this.simHeight = 3.0;
    this.cScale = this.canvas.height / this.simHeight;
    this.simWidth = this.canvas.width / this.cScale;
    this.fluidScene = {
      gravity: -9.81,
      dt: 1.0 / 120.0,
      flipRatio: 0.9,
      numPressureIters: 100,
      numParticleIters: 2,
      frameNr: 0,
      overRelaxation: 1.9,
      compensateDrift: true,
      separateParticles: true,
      obstacleX: 0.0,
      obstacleY: 0.0,
      obstacleRadius: 0.15,
      paused: true,
      showObstacle: true,
      obstacleVelX: 0.0,
      obstacleVelY: 0.0,
      showParticles: true,
      showGrid: false,
      fluid: null,
    };
    this.fluidShader = {
      pointShader: null,
      meshShader: null,

      pointVertexBuffer: null,
      pointColorBuffer: null,

      gridVertBuffer: null,
      gridColorBuffer: null,

      diskVertBuffer: null,
      diskIdBuffer: null,
    };
  }

  setupFlipSluidScene() {
    const { fluidScene: scene, simHeight, simWidth } = this;
    scene.obstacleRadius = 0.15;
    scene.overRelaxation = 1.9;

    scene.dt = 1.0 / 60.0;
    scene.numPressureIters = 50;
    scene.numParticleIters = 2;

    var res = 100;

    var tankHeight = 1.0 * simHeight;
    var tankWidth = 1.0 * simWidth;
    var h = tankHeight / res;
    var density = 1000.0;

    var relWaterHeight = 0.8;
    var relWaterWidth = 0.6;

    // dam break

    // compute number of particles

    var r = 0.3 * h; // particle radius w.r.t. cell size
    var dx = 2.0 * r;
    var dy = (Math.sqrt(3.0) / 2.0) * dx;

    var numX = Math.floor((relWaterWidth * tankWidth - 2.0 * h - 2.0 * r) / dx);
    var numY = Math.floor(
      (relWaterHeight * tankHeight - 2.0 * h - 2.0 * r) / dy
    );
    var maxParticles = numX * numY;

    // create fluid

    const f = (scene.fluid = new FlipFluid(
      density,
      tankWidth,
      tankHeight,
      h,
      r,
      maxParticles
    ));

    // create particles

    f.numParticles = numX * numY;
    var p = 0;
    for (var i = 0; i < numX; i++) {
      for (var j = 0; j < numY; j++) {
        f.particlePos[p++] = h + r + dx * i + (j % 2 == 0 ? 0.0 : r);
        f.particlePos[p++] = h + r + dy * j;
      }
    }

    // setup grid cells for tank

    var n = f.fNumY;

    for (var i = 0; i < f.fNumX; i++) {
      for (var j = 0; j < f.fNumY; j++) {
        var s = 1.0; // fluid
        if (i == 0 || i == f.fNumX - 1 || j == 0) s = 0.0; // solid
        f.s[i * n + j] = s;
      }
    }

    this.setObstacle(3.0, 2.0, true);
  }

  drawFlipFluid() {
    const { gl } = this;
    // gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // prepare shaders
    if (this.fluidShader.pointShader == null)
      this.fluidShader.pointShader = createShader(
        gl,
        pointVertexShader,
        pointFragmentShader
      );
    if (this.fluidShader.meshShader == null)
      this.fluidShader.meshShader = createShader(
        gl,
        meshVertexShader,
        meshFragmentShader
      );

    // grid
    const { fluidScene: scene, simWidth, simHeight } = this;
    const { pointShader, meshShader } = this.fluidShader;
    if (this.fluidShader.gridVertBuffer == null) {
      var f = scene.fluid;
      this.fluidShader.gridVertBuffer = gl.createBuffer();
      var cellCenters = new Float32Array(2 * f.fNumCells);
      var p = 0;

      for (var i = 0; i < f.fNumX; i++) {
        for (var j = 0; j < f.fNumY; j++) {
          cellCenters[p++] = (i + 0.5) * f.h;
          cellCenters[p++] = (j + 0.5) * f.h;
        }
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, this.fluidShader.gridVertBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, cellCenters, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    if (this.fluidShader.gridColorBuffer == null)
      this.fluidShader.gridColorBuffer = gl.createBuffer();

    if (scene.showGrid) {
      var pointSize = ((0.9 * scene.fluid.h) / simWidth) * this.canvas.width;

      gl.useProgram(this.fluidShader.pointShader);
      gl.uniform2f(
        gl.getUniformLocation(pointShader, "domainSize"),
        simWidth,
        simHeight
      );
      gl.uniform1f(gl.getUniformLocation(pointShader, "pointSize"), pointSize);
      gl.uniform1f(gl.getUniformLocation(pointShader, "drawDisk"), 0.0);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.fluidShader.gridVertBuffer);
      var posLoc = gl.getAttribLocation(pointShader, "attrPosition");
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.fluidShader.gridColorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, scene.fluid.cellColor, gl.DYNAMIC_DRAW);

      var colorLoc = gl.getAttribLocation(pointShader, "attrColor");
      gl.enableVertexAttribArray(colorLoc);
      gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, scene.fluid.fNumCells);

      gl.disableVertexAttribArray(posLoc);
      gl.disableVertexAttribArray(colorLoc);

      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    // water

    if (scene.showParticles) {
      gl.clear(gl.DEPTH_BUFFER_BIT);

      var pointSize =
        ((2.0 * scene.fluid.particleRadius) / simWidth) * this.canvas.width;

      gl.useProgram(pointShader);
      gl.uniform2f(
        gl.getUniformLocation(pointShader, "domainSize"),
        simWidth,
        simHeight
      );
      gl.uniform1f(gl.getUniformLocation(pointShader, "pointSize"), pointSize);
      gl.uniform1f(gl.getUniformLocation(pointShader, "drawDisk"), 1.0);

      if (this.fluidShader.pointVertexBuffer == null)
        this.fluidShader.pointVertexBuffer = gl.createBuffer();
      if (this.fluidShader.pointColorBuffer == null)
        this.fluidShader.pointColorBuffer = gl.createBuffer();

      gl.bindBuffer(gl.ARRAY_BUFFER, this.fluidShader.pointVertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, scene.fluid.particlePos, gl.DYNAMIC_DRAW);

      var posLoc = gl.getAttribLocation(pointShader, "attrPosition");
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.fluidShader.pointColorBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        scene.fluid.particleColor,
        gl.DYNAMIC_DRAW
      );

      var colorLoc = gl.getAttribLocation(pointShader, "attrColor");
      gl.enableVertexAttribArray(colorLoc);
      gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, scene.fluid.numParticles);

      gl.disableVertexAttribArray(posLoc);
      gl.disableVertexAttribArray(colorLoc);

      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    // disk

    // prepare disk mesh

    var numSegs = 50;

    if (this.fluidShader.diskVertBuffer == null) {
      this.fluidShader.diskVertBuffer = gl.createBuffer();
      var dphi = (2.0 * Math.PI) / numSegs;
      var diskVerts = new Float32Array(2 * numSegs + 2);
      var p = 0;
      diskVerts[p++] = 0.0;
      diskVerts[p++] = 0.0;
      for (var i = 0; i < numSegs; i++) {
        diskVerts[p++] = Math.cos(i * dphi);
        diskVerts[p++] = Math.sin(i * dphi);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, this.fluidShader.diskVertBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, diskVerts, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);

      this.fluidShader.diskIdBuffer = gl.createBuffer();
      var diskIds = new Uint16Array(3 * numSegs);
      p = 0;
      for (var i = 0; i < numSegs; i++) {
        diskIds[p++] = 0;
        diskIds[p++] = 1 + i;
        diskIds[p++] = 1 + ((i + 1) % numSegs);
      }

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.fluidShader.diskIdBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, diskIds, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    gl.clear(gl.DEPTH_BUFFER_BIT);

    var diskColor = [0.75, 0.52, 0.98];

    gl.useProgram(meshShader);
    gl.uniform2f(
      gl.getUniformLocation(meshShader, "domainSize"),
      simWidth,
      simHeight
    );
    gl.uniform3f(
      gl.getUniformLocation(meshShader, "color"),
      diskColor[0],
      diskColor[1],
      diskColor[2]
    );
    gl.uniform2f(
      gl.getUniformLocation(meshShader, "translation"),
      scene.obstacleX,
      scene.obstacleY
    );
    gl.uniform1f(
      gl.getUniformLocation(meshShader, "scale"),
      scene.obstacleRadius + scene.fluid.particleRadius
    );

    posLoc = gl.getAttribLocation(meshShader, "attrPosition");
    gl.enableVertexAttribArray(posLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.fluidShader.diskVertBuffer);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.fluidShader.diskIdBuffer);
    gl.drawElements(gl.TRIANGLES, 3 * numSegs, gl.UNSIGNED_SHORT, 0);

    gl.disableVertexAttribArray(posLoc);
  }

  resize() {
    this.canvas.width = window.innerWidth * 0.6;
    this.canvas.height = window.innerHeight - 300;

    const simMinWidth = 20.0;
    this.cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
    this.simWidth = canvas.width / this.cScale;
    this.simHeight = canvas.height / this.cScale;
  }

  cX(pos) {
    if (pos.x) {
      return pos.x * this.cScale;
    } else {
      return pos * this.cScale;
    }
  }

  cY(pos) {
    if (pos.y) {
      return this.canvas.height - pos.y * this.cScale;
    } else {
      return this.canvas.height - pos * this.cScale;
    }
  }

  // position correction for pendulum
  cX_center(pos) {
    return this.canvas.width / 2 + pos.x * this.cScale;
  }

  cY_center(pos) {
    return 0.4 * this.canvas.height - pos.y * this.cScale;
  }

  update() {
    const { ball, gravity, timeStep, simWidth, simHeight } = this;
    this.ball.simulate({
      ball: ball,
      gravity,
      timeStep,
      simWidth,
      simHeight,
    });
    this.drawBall();
    requestAnimationFrame(this.update.bind(this));
  }

  simulate() {
    for (let i = 0; i < this.physicsScene.balls.length; i++) {
      const ball_1 = this.physicsScene.balls[i];
      ball_1.simulate(this.physicsScene.dt, this.physicsScene.gravity);

      for (let j = i + 1; j < this.physicsScene.balls.length; j++) {
        const ball_2 = this.physicsScene.balls[j];
        ball_1.handleBallCollision(ball_2, this.physicsScene.restitution);
      }

      ball_1.handleWallCollision(this.physicsScene.worldSize);
    }
  }

  // pbd scene
  drawScene() {
    const { physicsScene } = this;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = "#c084fc";
    this.context.lineWidth = 2.0;
    this.drawCircle(physicsScene.wireCenter, physicsScene.wireRadius, false);

    this.context.fillStyle = "#f9a8d4";

    if (physicsScene.beads.length) {
      for (let i = 0; i < physicsScene.beads.length; i++) {
        const bead = physicsScene.beads[i];
        this.drawCircle(bead.pos, bead.radius, true);
      }
    } else if (physicsScene.bead) {
      const bead = physicsScene.bead;
      this.drawCircle(bead.pos, bead.radius, true);

      this.context.fillStyle = "#c084fc";

      const analyticBead = physicsScene.analyticBead;
      const pos = analyticBead.getPos();
      pos.add(physicsScene.wireCenter);
      this.drawCircle(pos, analyticBead.beadRadius, true);
    } else if (physicsScene.pendulumPBD) {
      physicsScene.pendulumPBD.draw(
        this.context,
        this.cX_center.bind(this),
        this.cY_center.bind(this),
        this.cScale
      );
      if (physicsScene.numSubSteps >= 100) {
        if (physicsScene.pendulumAnalytic)
          physicsScene.pendulumAnalytic.draw(
            this.context,
            this.cX_center.bind(this),
            this.cY_center.bind(this),
            this.cScale
          );
      }
    }
  }

  updateNew() {
    this.simulate();
    this.drawBalls();
    requestAnimationFrame(this.updateNew.bind(this));
  }

  run() {
    this.physicsScene.paused = false;
  }

  pbdSimulate() {
    const { physicsScene } = this;
    if (physicsScene.paused) return;

    if (physicsScene.pendulumPBD) {
      const sdt = physicsScene.dt / physicsScene.numSubSteps;
      const trailGap = physicsScene.numSubSteps / 10;
      for (let step = 0; step < physicsScene.numSubSteps; step++) {
        physicsScene.pendulumPBD.simulate(sdt, physicsScene.gravity.y);
        if (step % trailGap == 0)
          physicsScene.pendulumPBD.updateTrail(
            this.cX_center.bind(this),
            this.cY_center.bind(this)
          );
        if (physicsScene.pendulumAnalytic) {
          physicsScene.pendulumAnalytic.simulate(sdt, physicsScene.gravity.y);
          physicsScene.pendulumAnalytic.updateTrail(
            this.cX_center.bind(this),
            this.cY_center.bind(this)
          );
        }
      }
    } else {
      const sdt = physicsScene.dt / physicsScene.numSteps;
      for (let step = 0; step < physicsScene.numSteps; step++) {
        if (physicsScene.bead) {
          physicsScene.bead.startStep(sdt, physicsScene.gravity);

          const lambda = physicsScene.bead.keepOnWire(
            physicsScene.wireCenter,
            physicsScene.wireRadius
          );

          const force = Math.abs(lambda / sdt / sdt);

          physicsScene.bead.endStep(sdt);

          const analyticForce = physicsScene.analyticBead.simulate(
            sdt,
            -physicsScene.gravity.y
          );
        } else {
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
              physicsScene.beads[i].handleBeadBeadCollision(
                physicsScene.beads[j]
              );
            }
          }
        }
      }
    }
  }

  step() {
    this.physicsScene.paused = false;
    this.pbdSimulate();
    this.physicsScene.paused = true;
  }

  pbdUpdate() {
    this.pbdSimulate();
    this.drawScene();
    requestAnimationFrame(this.pbdUpdate.bind(this));
  }

  // for fluid
  updateFluid(type) {
    if (type == "flip") {
      this.simulateFlipFluid();
      this.drawFlipFluid();
    } else {
      this.simulateFluid();
      this.drawFluid();
    }

    requestAnimationFrame(this.updateFluid.bind(this, type));
  }

  simulateFluid() {
    const { fluidScene } = this;
    if (!fluidScene.paused)
      fluidScene.fluid.simulate(
        fluidScene.dt,
        fluidScene.gravity,
        fluidScene.numIters,
        fluidScene.overRelaxation
      );
    fluidScene.frameNr++;
  }

  simulateFlipFluid() {
    const { fluidScene: scene } = this;
    if (!scene.paused)
      scene.fluid.simulate(
        scene.dt,
        scene.gravity,
        scene.flipRatio,
        scene.numPressureIters,
        scene.numParticleIters,
        scene.overRelaxation,
        scene.compensateDrift,
        scene.separateParticles,
        scene.obstacleX,
        scene.obstacleY,
        scene.obstacleRadius,
        scene.colorFieldNr,
        scene.obstacleVelX,
        scene.obstacleVelY,
        scene.fluid
      );

    scene.frameNr++;
  }

  setObstacle(x, y, reset) {
    const { fluidScene } = this;
    var vx = 0.0;
    var vy = 0.0;

    if (!reset) {
      vx = (x - fluidScene.obstacleX) / fluidScene.dt;
      vy = (y - fluidScene.obstacleY) / fluidScene.dt;
    }

    fluidScene.obstacleX = x;
    fluidScene.obstacleY = y;
    var r = fluidScene.obstacleRadius;
    var f = fluidScene.fluid;
    var n = f.numY;
    var cd = Math.sqrt(2) * f.h;

    for (var i = 1; i < f.numX - 2; i++) {
      for (var j = 1; j < f.numY - 2; j++) {
        f.s[i * n + j] = 1.0;

        const dx = (i + 0.5) * f.h - x;
        const dy = (j + 0.5) * f.h - y;

        if (dx * dx + dy * dy < r * r) {
          f.s[i * n + j] = 0.0;
          if (fluidScene.sceneNr == 2)
            f.m[i * n + j] = 0.5 + 0.5 * Math.sin(0.1 * fluidScene.frameNr);
          else f.m[i * n + j] = 1.0;
          f.u[i * n + j] = vx;
          f.u[(i + 1) * n + j] = vx;
          f.v[i * n + j] = vy;
          f.v[i * n + j + 1] = vy;
        }
      }
    }

    fluidScene.showObstacle = true;
    fluidScene.obstacleVelX = vx;
    fluidScene.obstacleVelY = vy;
  }

  startDrag(x, y) {
    let bounds = this.canvas.getBoundingClientRect();

    let mx = x - bounds.left - this.canvas.clientLeft;
    let my = y - bounds.top - this.canvas.clientTop;
    this.mouseDown = true;

    x = mx / this.cScale;
    y = (this.canvas.height - my) / this.cScale;

    this.setObstacle(x, y, true);
    this.fluidScene.paused = false;
  }

  drag(x, y) {
    if (this.mouseDown) {
      let bounds = this.canvas.getBoundingClientRect();
      let mx = x - bounds.left - this.canvas.clientLeft;
      let my = y - bounds.top - this.canvas.clientTop;
      x = mx / this.cScale;
      y = (this.canvas.height - my) / this.cScale;
      this.setObstacle(x, y, false);
    }
  }
  endDrag() {
    this.mouseDown = false;
    this.fluidScene.obstacleVelX = 0.0;
    this.fluidScene.obstacleVelY = 0.0;
  }
}

export default CanvasScene;
