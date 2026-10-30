import * as THREE from 'three';
// Lobby simples: chão, paredes (colisores AABB), portal e pilares. Materiais compartilhados = leve.
export function buildLobby(scene, shadows) {
  const colliders = [];
  const mat = (c, e = 0) => new THREE.MeshLambertMaterial({color: c, emissive: e});
  scene.add(new THREE.HemisphereLight(0x9f7aea, 0x1a0b2e, 0.8));
  const sun = new THREE.DirectionalLight(0xffffff, 0.9); sun.position.set(10, 20, 8);
  if (shadows) { sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, {left: -25, right: 25, top: 25, bottom: -25}); }
  scene.add(sun);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), mat(0x1e1236));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const box = (x, z, w, h, d, m) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, h / 2, z);
    b.castShadow = b.receiveShadow = true; scene.add(b);
    colliders.push({minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2});
  };
  const wall = mat(0x2d1b4e);
  box(0, -20, 40, 4, 1, wall); box(0, 20, 40, 4, 1, wall); box(-20, 0, 1, 4, 40, wall); box(20, 0, 1, 4, 40, wall);
  [[-8,-8],[8,-8],[-8,8],[8,8]].forEach(([x,z]) => box(x, z, 1.5, 3, 1.5, mat(0x4c1d95, 0x1a0540)));
  const portal = new THREE.Mesh(new THREE.TorusGeometry(2, 0.2, 8, 24), new THREE.MeshBasicMaterial({color: 0xb784ff}));
  portal.position.set(0, 2.2, -17); scene.add(portal);
  const light = new THREE.PointLight(0xb784ff, 2, 14); light.position.set(0, 2.5, -15); scene.add(light);
  return {colliders, animate: t => { portal.rotation.z = t; light.intensity = 2 + Math.sin(t * 3) * 0.5; }};
}
