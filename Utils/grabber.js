import * as THREE from "three";

class Grabber {
  constructor(gRenderer, gCamera, gThreeScene, gPhysicsScene) {
    this.raycaster = new THREE.Raycaster();
    this.raycaster.layers.set(1);
    this.raycaster.params.Line.threshold = 0.1;
    this.physicsObject = null;
    this.distance = 0.0;
    this.prevPos = new THREE.Vector3();
    this.vel = new THREE.Vector3();
    this.time = 0.0;
    this.gRenderer = gRenderer;
    this.gCamera = gCamera;
    this.gThreeScene = gThreeScene;
    this.gPhysicsScene = gPhysicsScene;
  }
  increaseTime(dt) {
    this.time += dt;
  }
  updateRaycaster(x, y) {
    var rect = this.gRenderer.domElement.getBoundingClientRect();
    this.mousePos = new THREE.Vector2();
    this.mousePos.x = ((x - rect.left) / rect.width) * 2 - 1;
    this.mousePos.y = -((y - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mousePos, this.gCamera);
  }
  start(x, y) {
    this.physicsObject = null;
    this.updateRaycaster(x, y);
    var intersects = this.raycaster.intersectObjects(this.gThreeScene.children);
    if (intersects.length > 0) {
      var obj = intersects[0].object.userData;
      if (obj) {
        this.physicsObject = obj;
        this.distance = intersects[0].distance;
        var pos = this.raycaster.ray.origin.clone();
        pos.addScaledVector(this.raycaster.ray.direction, this.distance);
        this.physicsObject.startGrab(pos);
        this.prevPos.copy(pos);
        this.vel.set(0.0, 0.0, 0.0);
        this.time = 0.0;
        // if (this.gPhysicsScene.paused) run();
      }
    }
  }
  move(x, y) {
    if (this.physicsObject) {
      this.updateRaycaster(x, y);
      var pos = this.raycaster.ray.origin.clone();
      pos.addScaledVector(this.raycaster.ray.direction, this.distance);

      this.vel.copy(pos);
      this.vel.sub(this.prevPos);
      if (this.time > 0.0) this.vel.divideScalar(this.time);
      else this.vel.set(0.0, 0.0, 0.0);
      this.prevPos.copy(pos);
      this.time = 0.0;

      this.physicsObject.moveGrabbed(pos);
    }
  }
  end() {
    if (this.physicsObject) {
      this.physicsObject.endGrab(this.vel);
      this.physicsObject = null;
    }
  }
}

export default Grabber;
