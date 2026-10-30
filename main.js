import {Engine, QUALITY} from './engine.js';
import {buildLobby} from './world.js';
import {Player} from './player.js';
let low = false;
const $ = id => document.getElementById(id);
$('low').onclick = () => { low = !low; $('lowv').textContent = low ? 'ON' : 'OFF'; };
$('play').onclick = () => {
  const engine = new Engine(low ? QUALITY.low : QUALITY.high);
  const lobby = buildLobby(engine.scene, engine.q.shadows);
  const player = new Player(engine.scene, engine.camera, lobby.colliders);
  let t = 0, frames = 0, last = performance.now();
  engine.updaters.push(dt => {
    t += dt; player.update(dt); lobby.animate(t); frames++;
    const n = performance.now(); if (n - last > 1000) { $('fps').textContent = frames + ' FPS'; frames = 0; last = n; }
  });
  $('menu').style.opacity = 0; setTimeout(() => $('menu').remove(), 400);
  engine.start();
};
