import * as THREE from "three";
import Ball from "./ball-3d";
import Grabber from "./grabber";
import SoftBody from "./soft-body";
import Cloth from "./cloth";
import bunnyMesh from "./objects/bunnyMesh";
import dragonTetMesh from "./objects/dragonTetMesh";
import dragonVisMesh from "./objects/dragonVisMesh";
import clothMeshes from "./objects/clothMesh";
import Balls from "./balls";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
class ThreeScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.physicsScene = {
      // gravity: new THREE.Vector3(0.0, -10.0, 0.0),
      gravity: [0.0, -9.8, 0.0],
      dt: 1.0 / 60.0,
      worldSize: { x: 1.5, z: 2.5, y: 2 },
      paused: true,
      objects: [],
      numSubsteps: 10,
      worldBounds: [-1.0, 0.0, -1.0, 1.0, 2.0, 1.0],
      balls: null,
      showEdges: false,
    };

    this.init();
    this.simulate.bind(this);
  }

  init() {
    this.threeScene = new THREE.Scene();
    this.initLight();
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(0.6 * window.innerWidth, window.innerHeight - 300);
    window.addEventListener("resize", this.resize.bind(this));

    this.camera = new THREE.PerspectiveCamera(
      45,
      (0.6 * window.innerWidth) / (window.innerHeight - 300),
      0.01,
      100
    );
    // this.camera.position.set(6, 1.5, 0);
    this.camera.position.set(4, 1.5, 5);
    this.camera.updateMatrixWorld();
    window.camera = this.camera;

    this.threeScene.add(this.camera);

    this.cameraControl = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.cameraControl.zoomSpeed = 2.0;
    this.cameraControl.panSpeed = 0.4;
    this.cameraControl.target = new THREE.Vector3(0.0, 0.8, 0.0);
    this.cameraControl.update();
  }

  initGrabber() {
    this.grabber = new Grabber(
      this.renderer,
      this.camera,
      this.threeScene,
      this.physicsScene
    );
    this.mouseDown = false;
    this.renderer.domElement.addEventListener(
      "pointerdown",
      this.onPointer.bind(this),
      false
    );
    this.renderer.domElement.addEventListener(
      "pointermove",
      this.onPointer.bind(this),
      false
    );
    this.renderer.domElement.addEventListener(
      "pointerup",
      this.onPointer.bind(this),
      false
    );
  }

  onPointer(evt) {
    evt.preventDefault();
    const { grabber, cameraControl } = this;
    if (evt.type == "pointerdown") {
      grabber.start(evt.clientX, evt.clientY);
      this.mouseDown = true;
      if (grabber.physicsObject) {
        cameraControl.saveState();
        cameraControl.enabled = false;
      }
    } else if (evt.type == "pointermove" && this.mouseDown) {
      grabber.move(evt.clientX, evt.clientY);
    } else if (evt.type == "pointerup") {
      if (grabber.physicsObject) {
        grabber.end();
        cameraControl.reset();
      }
      this.mouseDown = false;
      cameraControl.enabled = true;
    }
  }

  resize() {
    this.camera.aspect = (0.6 * window.innerWidth) / (window.innerHeight - 300);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(0.6 * window.innerWidth, window.innerHeight - 300);
  }

  initLight() {
    const { threeScene } = this;
    threeScene.add(new THREE.AmbientLight(0x505050));
    // threeScene.fog = new THREE.Fog(0xf9a8d4, 0, 20);
  }

  addSpotLight() {
    const { threeScene } = this;
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.angle = Math.PI / 5;
    spotLight.penumbra = 0.2;
    // spotLight.position.set(0, 3, 0);
    spotLight.position.set(2, 3, 3);
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 3;
    spotLight.shadow.camera.far = 10;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    threeScene.add(spotLight);
  }

  addDirLight() {
    const { threeScene } = this;
    const dirLight = new THREE.DirectionalLight(0x55505a, 1);
    dirLight.position.set(0, 3, 0);
    dirLight.castShadow = true;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 10;

    dirLight.shadow.camera.right = 1;
    dirLight.shadow.camera.left = -1;
    dirLight.shadow.camera.top = 1;
    dirLight.shadow.camera.bottom = -1;

    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    threeScene.add(dirLight);
  }

  addBox() {
    const { worldSize: boxSize } = this.physicsScene;
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(boxSize.x * 2, boxSize.y, boxSize.z * 2, 3, 3),
      new THREE.MeshPhongMaterial({
        // color: 0xc084fc,
        color: 0x60a5fa,
        shininess: 150,
        wireframe: true,
      })
    );
    box.position.y = boxSize.y / 2;
    this.threeScene.add(box);
  }

  addGround() {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20, 1, 1),
      new THREE.MeshPhongMaterial({ color: 0xd4bad4, shininess: 150 })
    );

    ground.rotation.x = -Math.PI / 2; // rotates X/Y to X/Z
    ground.receiveShadow = true;
    this.threeScene.add(ground);
  }

  addHelper() {
    const helper = new THREE.GridHelper(20, 20);
    helper.material.opacity = 1.0;
    helper.material.transparent = true;
    helper.position.set(0, 0.002, 0);
    this.threeScene.add(helper);
  }

  addBall3D() {
    const radius = 0.2;
    const pos = new THREE.Vector3(radius, radius, radius);
    const vel = new THREE.Vector3(2.0, 5.0, 3.0);
    const ball = new Ball(pos, radius, vel);
    this.physicsScene.objects.push(ball);
    this.threeScene.add(ball.visMesh);
  }

  addBalls() {
    const { physicsScene } = this;
    var radius = 0.025;

    var spacing = 3.0 * radius;
    var velRand = 0.2;

    var s = physicsScene.worldBounds;

    var numX = Math.floor((s[3] - s[0] - 2.0 * spacing) / spacing);
    var numY = Math.floor((s[4] - s[1] - 2.0 * spacing) / spacing);
    var numZ = Math.floor((s[5] - s[2] - 2.0 * spacing) / spacing);

    var pos = new Float32Array(3 * numX * numY * numZ);
    var vel = new Float32Array(3 * numX * numY * numZ);
    vel.fill(0.0);

    for (var xi = 0; xi < numX; xi++) {
      for (var yi = 0; yi < numY; yi++) {
        for (var zi = 0; zi < numZ; zi++) {
          var x = 3 * ((xi * numY + yi) * numZ + zi);
          var y = x + 1;
          var z = x + 2;
          pos[x] = s[0] + spacing + xi * spacing;
          pos[y] = s[1] + spacing + yi * spacing;
          pos[z] = s[2] + spacing + zi * spacing;

          vel[x] = -velRand + 2.0 * velRand * Math.random();
          vel[y] = -velRand + 2.0 * velRand * Math.random();
          vel[z] = -velRand + 2.0 * velRand * Math.random();
        }
      }
    }

    physicsScene.balls = new Balls(radius, pos, vel, this.threeScene);
  }

  addStaticBall() {
    const radius = 0.2;
    const pos = new THREE.Vector3(radius, 1.0, radius);
    const vel = new THREE.Vector3();
    const ball = new Ball(pos, radius, vel);
    this.physicsScene.objects.push(ball);
    this.threeScene.add(ball.visMesh);
  }

  addBunnyMesh() {
    const body = new SoftBody({
      tetMesh: bunnyMesh,
      scene: this.threeScene,
      edgeCompliance: 100.0,
    });
    if (this.physicsScene.objects.length) {
      body.translate(
        -1.0 + 2.0 * Math.random(),
        0.0,
        -1.0 + 2.0 * Math.random()
      );
    }
    this.physicsScene.objects.push(body);
  }

  addDragonMesh() {
    const body = new SoftBody({
      tetMesh: dragonTetMesh,
      visMesh: dragonVisMesh,
      scene: this.threeScene,
    });
    this.physicsScene.objects.push(body);
  }

  addCloth() {
    const mesh = clothMeshes[0];
    const body = new Cloth(mesh, this.threeScene);
    this.physicsScene.objects.push(body);
  }

  update(type) {
    if (type === "xpbd") {
      this.xpbdSimulate();
    } else {
      this.simulate();
    }

    this.renderer.render(this.threeScene, this.camera);
    this.cameraControl.update();

    requestAnimationFrame(this.update.bind(this, type));
  }

  simulate() {
    if (this.physicsScene.paused) return;
    if (this.physicsScene.balls) {
      this.physicsScene.balls.simulate(
        this.physicsScene.dt,
        this.physicsScene.gravity,
        this.physicsScene.worldBounds
      );
    } else {
      for (let i = 0; i < this.physicsScene.objects.length; i++) {
        this.physicsScene.objects[i].simulate(this.physicsScene);
      }
      if (this.grabber) {
        this.grabber.increaseTime(this.physicsScene.dt);
      }
    }
  }

  xpbdSimulate() {
    const { physicsScene } = this;
    if (physicsScene.paused) return;

    const sdt = physicsScene.dt / physicsScene.numSubsteps;

    for (let step = 0; step < physicsScene.numSubsteps; step++) {
      for (let i = 0; i < physicsScene.objects.length; i++)
        physicsScene.objects[i].preSolve(sdt, physicsScene.gravity);
      for (let i = 0; i < physicsScene.objects.length; i++)
        physicsScene.objects[i].solve(sdt);
      for (let i = 0; i < physicsScene.objects.length; i++)
        physicsScene.objects[i].postSolve(sdt);
    }
    for (var i = 0; i < physicsScene.objects.length; i++)
      physicsScene.objects[i].endFrame();

    if (this.grabber) {
      this.grabber.increaseTime(this.physicsScene.dt);
    }
  }

  run() {
    this.physicsScene.paused = false;
  }
  pause() {
    this.physicsScene.paused = true;
  }
  restart() {
    this.physicsScene.paused = true;
    location.reload();
  }
  squash() {
    const { physicsScene } = this;
    for (let i = 0; i < physicsScene.objects.length; i++)
      physicsScene.objects[i].squash();
    if (!physicsScene.paused) {
      this.pause();
    } else {
      this.run();
    }
  }
  showCollision() {
    if (this.physicsScene.balls)
      this.physicsScene.balls.showCollisions =
        !this.physicsScene.balls.showCollisions;
  }
  showEdges() {
    const { physicsScene } = this;
    physicsScene.showEdges = !physicsScene.showEdges;
    for (let i = 0; i < physicsScene.objects.length; i++) {
      physicsScene.objects[i].edgeMesh.visible = physicsScene.showEdges;
      physicsScene.objects[i].triMesh.visible = !physicsScene.showEdges;
    }
  }
}

export default ThreeScene;
