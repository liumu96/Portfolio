import Ball from "./ball-2d";
import VectorBall from "./physcis-ball";
import Vector2 from "./vector2";
import { AnalyticBead, Bead } from "./bead";
import Pendulum from "./pendulum";

class CanvasScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
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

  resize() {
    this.canvas.width = window.innerWidth * 0.6;
    this.canvas.height = window.innerHeight - 300;

    const simMinWidth = 20.0;
    this.cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
    this.simWidth = canvas.width / this.cScale;
    this.simHeight = canvas.height / this.cScale;
  }

  cX(pos) {
    return pos.x * this.cScale;
  }

  cY(pos) {
    return this.canvas.height - pos.y * this.cScale;
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
}

export default CanvasScene;
