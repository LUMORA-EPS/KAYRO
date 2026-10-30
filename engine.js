import * as THREE from 'three';
export const QUALITY = {
  low:  {pixelRatio: 0.6, shadows: false, fps: 30, fogFar: 40},
  high: {pixelRatio: Math.min(devicePixelRatio, 1.5), shadows: true, fps: 60, fogFar: 80},
};
export class Engine {
  constructor(quality) {
    this.q = quality;
    this.renderer = new THREE.WebGLRenderer({antialias: false, powerPreference: 'low-power'});
    this.renderer.setPixelRatio(quality.pixelRatio);
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.shadowMap.enabled = quality.shadows;
    document.body.prepend(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0710);
    this.scene.fog = new THREE.Fog(0x0a0710, 10, quality.fogFar);
    this.camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 200);
    this.clock = new THREE.Clock();
    this.updaters = [];
    this._acc = 0;
    addEventListener('resize', () => {
      this.camera.aspect = innerWidth / innerHeight; this.camera.updateProjectionMatrix();
      this.renderer.setSize(innerWidth, innerHeight);
    });
  }
  start() {
    const step = 1 / this.q.fps;
    const loop = () => {
      requestAnimationFrame(loop);
      this._acc += this.clock.getDelta();
      if (this._acc < step) return;
      const dt = Math.min(this._acc, 0.1); this._acc = 0;
      this.updaters.forEach(u => u(dt));
      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }
}
