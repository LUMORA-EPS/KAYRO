# KYRON — Fase 1
Rodar (Linux): `cd kyron && python3 -m http.server 8000` e abrir http://localhost:8000 (Chromium/Firefox).
Precisa de internet só para carregar o Three.js do CDN; para offline total, baixe three.module.js para `vendor/` e ajuste o importmap.
Estrutura: engine.js (render/loop/qualidade), world.js (lobby/colisores), player.js (personagem/câmera/movimento), main.js (ligação + menu).
Próximas fases: Rapier, partidas/papéis, bots, inventário, economia, mapas, missões, multiplayer (Node).
