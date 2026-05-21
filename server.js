// ============================================================================
//  TERRA — server
//  Lightweight & authoritative. The world is DETERMINISTIC from a shared seed:
//  the server never sends geometry, only (a) player positions and (b) events
//  (a "bloom" happened at x,z). Every client regenerates the identical world
//  from the seed. This scales to many players with tiny bandwidth.
// ============================================================================
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
app.use(express.static(path.join(__dirname, 'public')));

const rooms = {};

function makeCode() {
  const c = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 4; i++) s += c[Math.floor(Math.random() * c.length)];
  return s;
}

function createRoom(hostId) {
  const code = makeCode();
  rooms[code] = {
    code,
    hostId,
    seed: Math.floor(Math.random() * 1e9),     // shared world seed
    players: {},                                // id -> {x,z,vx,vz,singing,name,hue}
    blooms: [],                                 // {x,z,power,t} — life awakened here
    life: 0,                                    // global world-life 0..1
    climax: false,
    startedAt: Date.now()
  };
  return rooms[code];
}

// Resonance check: a bloom is valid only if >=2 players are close AND singing
function tryResonance(room) {
  const ps = Object.values(room.players).filter(p => p.singing);
  if (ps.length < 2) return null;
  // find any cluster of >=2 singing players within RESONANCE_R
  const R = 12.0;
  for (let i = 0; i < ps.length; i++) {
    const near = [ps[i]];
    for (let j = 0; j < ps.length; j++) {
      if (i === j) continue;
      const dx = ps[i].x - ps[j].x, dz = ps[i].z - ps[j].z;
      if (dx * dx + dz * dz < R * R) near.push(ps[j]);
    }
    if (near.length >= 2) {
      // bloom at the centroid of the cluster
      let cx = 0, cz = 0;
      near.forEach(p => { cx += p.x; cz += p.z; });
      cx /= near.length; cz /= near.length;
      // power scales super-linearly with how many resonate together
      const power = Math.min(6, near.length) ** 1.6;
      return { x: cx, z: cz, power, n: near.length };
    }
  }
  return null;
}

function tick(room) {
  // accumulate resonance into blooms (with a cooldown so it pulses, not spams)
  room._rc = (room._rc || 0) + 1;
  if (room._rc >= 18) { // ~ every 0.6s at 30Hz
    room._rc = 0;
    const r = tryResonance(room);
    if (r) {
      const b = { x: r.x, z: r.z, power: r.power, t: Date.now() };
      room.blooms.push(b);
      if (room.blooms.length > 400) room.blooms.shift();
      // world life grows; bigger clusters grow it faster
      room.life = Math.min(1, room.life + 0.012 * r.power);
      io.to(room.code).emit('bloom', { x: b.x, z: b.z, power: b.power, n: r.n, life: room.life });

      if (room.life >= 1 && !room.climax) {
        room.climax = true;
        io.to(room.code).emit('climax', { seed: room.seed, blooms: room.blooms.length });
      }
    }
  }
  // gentle entropy: world-life slowly decays if nobody resonates,
  // but never below what the blooms already secured (floor scales w/ blooms)
  const floor = Math.min(0.9, room.blooms.length * 0.004);
  if (room.life > floor) room.life = Math.max(floor, room.life - 0.0006);
}

setInterval(() => {
  for (const code in rooms) {
    const room = rooms[code];
    if (Object.keys(room.players).length === 0) continue;
    tick(room);
    io.to(code).emit('state', {
      players: room.players,
      life: room.life,
      hostId: room.hostId
    });
  }
}, 1000 / 30);

io.on('connection', socket => {
  let code = null, id = socket.id;

  socket.on('create', ({ name }) => {
    const room = createRoom(id);
    code = room.code;
    socket.join(code);
    room.players[id] = { x: 0, z: 0, vx: 0, vz: 0, singing: false,
      name: (name || 'Voyageur').slice(0, 14), hue: Math.random() };
    socket.emit('joined', { code, id, seed: room.seed, isHost: true });
  });

  socket.on('join', ({ code: c, name }) => {
    const room = rooms[(c || '').toUpperCase()];
    if (!room) { socket.emit('errmsg', 'Monde introuvable'); return; }
    code = room.code;
    socket.join(code);
    const n = Object.keys(room.players).length;
    room.players[id] = {
      x: Math.cos(n) * 3, z: Math.sin(n) * 3, vx: 0, vz: 0, singing: false,
      name: (name || 'Voyageur').slice(0, 14), hue: Math.random()
    };
    socket.emit('joined', { code, id, seed: room.seed, isHost: false });
    // send existing blooms so a late joiner sees the world as it is
    socket.emit('sync_blooms', room.blooms.map(b => ({ x: b.x, z: b.z, power: b.power })));
    io.to(code).emit('peer_count', Object.keys(room.players).length);
  });

  socket.on('input', ({ x, z, singing }) => {
    if (!code || !rooms[code]) return;
    const p = rooms[code].players[id];
    if (!p) return;
    if (typeof x === 'number' && typeof z === 'number') { p.x = x; p.z = z; }
    p.singing = !!singing;
  });

  socket.on('disconnect', () => {
    if (code && rooms[code]) {
      delete rooms[code].players[id];
      if (rooms[code].hostId === id) {
        const rest = Object.keys(rooms[code].players);
        if (rest.length) rooms[code].hostId = rest[0];
      }
      io.to(code).emit('peer_count', Object.keys(rooms[code].players).length);
      if (Object.keys(rooms[code].players).length === 0) {
        setTimeout(() => {
          if (rooms[code] && Object.keys(rooms[code].players).length === 0) delete rooms[code];
        }, 60000);
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`TERRA listening on ${PORT}`));
