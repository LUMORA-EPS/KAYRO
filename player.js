import * as THREE from 'three';
export class Player {
  constructor(scene, camera, colliders) {
    this.cam = camera; this.colliders = colliders; this.r = 0.4;
    this.yaw = 0; this.pitch = 0.35; this.vy = 0; this.onGround = true;
    this.keys = {};
    const g = this.mesh = new THREE.Group();
    const m = c => new THREE.MeshLambertMaterial({color: c});
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.1, 0.5), m(0x7c3aed)); body.position.y = 1.15;
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), m(0xf1c9a5)); head.position.y = 2.0;
    const legs = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.4), m(0x1f1147)); legs.position.y = 0.3;
    [body, head, legs].forEach(x => { x.castShadow = true; g.add(x); }); this.parts = {body, head, legs};
    scene.add(g);
    addEventListener('keydown', e => this.keys[e.code] = true);
    addEventListener('keyup', e => this.keys[e.code] = false);
    addEventListener('mousemove', e => { if (document.pointerLockElement) this.look(e.movementX * 0.0025, e.movementY * 0.0025); });
    addEventListener('click', () => document.body.requestPointerLock?.());
  }
  look(dx, dy) { this.yaw -= dx; this.pitch = Math.max(-0.2, Math.min(1.2, this.pitch + dy)); }
  update(dt) {
    const k = this.keys;
    if (k.ArrowLeft) this.look(-2 * dt, 0); if (k.ArrowRight) this.look(2 * dt, 0);
    let fx = (k.KeyD ? 1 : 0) - (k.KeyA ? 1 : 0), fz = (k.KeyS ? 1 : 0) - (k.KeyW ? 1 : 0);
    const len = Math.hypot(fx, fz) || 1, speed = (k.ShiftLeft ? 9 : 5.5) * dt;
    const sin = Math.sin(this.yaw), cos = Math.cos(this.yaw);
    const dx = (fx * cos + fz * sin) / len * speed, dz = (fz * cos - fx * sin) / len * speed;
    this.tryMove(dx, 0); this.tryMove(0, dz);
    if (fx || fz) this.mesh.rotation.y = Math.atan2(dx, dz);
    if (k.Space && this.onGround) { this.vy = 7; this.onGround = false; }
    this.vy -= 20 * dt; this.mesh.position.y += this.vy * dt;
    if (this.mesh.position.y <= 0) { this.mesh.position.y = 0; this.vy = 0; this.onGround = true; }
    const p = this.mesh.position, d = 7;
    this.cam.position.set(p.x + Math.sin(this.yaw) * d * Math.cos(this.pitch), p.y + 1.6 + Math.sin(this.pitch) * d, p.z + Math.cos(this.yaw) * d * Math.cos(this.pitch));
    this.cam.lookAt(p.x, p.y + 1.5, p.z);
  }
  tryMove(dx, dz) {
    const p = this.mesh.position, nx = p.x + dx, nz = p.z + dz, r = this.r;
    for (const c of this.colliders)
      if (nx + r > c.minX && nx - r < c.maxX && nz + r > c.minZ && nz - r < c.maxZ) return;
    p.x = nx; p.z = nz;
  }
}
