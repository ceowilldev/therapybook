'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

// --- Types ---
interface Vec2 { x: number; y: number; }
interface Bullet { pos: Vec2; active: boolean; }
interface Invader { pos: Vec2; alive: boolean; row: number; col: number; }
interface Particle { pos: Vec2; vel: Vec2; life: number; color: string; }
interface GameState {
  player: Vec2;
  bullets: Bullet[];
  enemyBullets: Bullet[];
  invaders: Invader[];
  particles: Particle[];
  score: number;
  lives: number;
  wave: number;
  gameOver: boolean;
  won: boolean;
  paused: boolean;
  shootCooldown: number;
  enemyDir: number;
  enemySpeed: number;
  enemyShootTimer: number;
  starField: { x: number; y: number; size: number; brightness: number }[];
}

// --- Constants ---
const COLS = 10;
const ROWS = 4;
const INVADER_W = 32;
const INVADER_H = 24;
const PLAYER_W = 40;
const PLAYER_H = 20;
const BULLET_SPEED = 10;
const ENEMY_BULLET_SPEED = 5;
const PLAYER_SPEED = 5;
const SHOOT_COOLDOWN = 18;
const STAR_COUNT = 80;

function makeStars(w: number, h: number) {
  return Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size: Math.random() * 1.5 + 0.5,
    brightness: Math.random() * 0.6 + 0.4,
  }));
}

function makeInvaders(canvasW: number): Invader[] {
  const startX = (canvasW - COLS * (INVADER_W + 10)) / 2;
  const invaders: Invader[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      invaders.push({
        pos: { x: startX + col * (INVADER_W + 10), y: 60 + row * (INVADER_H + 14) },
        alive: true,
        row,
        col,
      });
    }
  }
  return invaders;
}

function initState(w: number, h: number, wave: number, score: number, lives: number): GameState {
  const baseSpeed = 0.6 + wave * 0.3;
  return {
    player: { x: w / 2 - PLAYER_W / 2, y: h - 60 },
    bullets: [],
    enemyBullets: [],
    invaders: makeInvaders(w),
    particles: [],
    score,
    lives,
    wave,
    gameOver: false,
    won: false,
    paused: false,
    shootCooldown: 0,
    enemyDir: 1,
    enemySpeed: baseSpeed,
    enemyShootTimer: 0,
    starField: makeStars(w, h),
  };
}

// --- Drawing helpers ---
function drawPlayer(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  // Body
  ctx.fillStyle = '#00ff88';
  ctx.beginPath();
  ctx.moveTo(x + PLAYER_W / 2, y);
  ctx.lineTo(x + PLAYER_W, y + PLAYER_H);
  ctx.lineTo(x, y + PLAYER_H);
  ctx.closePath();
  ctx.fill();
  // Gun barrel
  ctx.fillStyle = '#00ffcc';
  ctx.fillRect(x + PLAYER_W / 2 - 3, y - 8, 6, 10);
  // Wings
  ctx.fillStyle = '#00cc66';
  ctx.fillRect(x, y + PLAYER_H - 6, 10, 6);
  ctx.fillRect(x + PLAYER_W - 10, y + PLAYER_H - 6, 10, 6);
  // Glow
  ctx.shadowColor = '#00ff88';
  ctx.shadowBlur = 12;
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

function drawInvader(ctx: CanvasRenderingContext2D, x: number, y: number, row: number, t: number) {
  const colors = ['#ff4444', '#ff8800', '#ffcc00', '#aa44ff'];
  const color = colors[row % colors.length];
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;

  const frame = Math.floor(t / 30) % 2;

  if (row < 2) {
    // Bug shape
    ctx.fillRect(x + 8, y + 2, 16, 10);
    ctx.fillRect(x + 4, y + 6, 24, 8);
    ctx.fillRect(x + 2, y + 10, 28, 6);
    if (frame === 0) {
      ctx.fillRect(x, y + 14, 8, 4);
      ctx.fillRect(x + 24, y + 14, 8, 4);
    } else {
      ctx.fillRect(x + 2, y + 16, 6, 4);
      ctx.fillRect(x + 24, y + 16, 6, 4);
    }
    ctx.fillRect(x + 4, y + 2, 4, 4);
    ctx.fillRect(x + 24, y + 2, 4, 4);
  } else {
    // Crab shape
    ctx.fillRect(x + 10, y + 2, 12, 8);
    ctx.fillRect(x + 6, y + 6, 20, 8);
    ctx.fillRect(x + 4, y + 10, 24, 6);
    if (frame === 0) {
      ctx.fillRect(x, y + 8, 6, 8);
      ctx.fillRect(x + 26, y + 8, 6, 8);
    } else {
      ctx.fillRect(x + 2, y + 10, 4, 8);
      ctx.fillRect(x + 26, y + 10, 4, 8);
    }
    ctx.fillRect(x + 8, y + 14, 4, 4);
    ctx.fillRect(x + 20, y + 14, 4, 4);
  }
  // Eyes
  ctx.fillStyle = '#000';
  ctx.fillRect(x + 10, y + 6, 4, 4);
  ctx.fillRect(x + 18, y + 6, 4, 4);
  ctx.restore();
}

function drawBullet(ctx: CanvasRenderingContext2D, x: number, y: number, isEnemy: boolean) {
  ctx.save();
  ctx.fillStyle = isEnemy ? '#ff4444' : '#00ffff';
  ctx.shadowColor = isEnemy ? '#ff4444' : '#00ffff';
  ctx.shadowBlur = 8;
  ctx.fillRect(x - 2, y, 4, isEnemy ? 12 : -12);
  ctx.restore();
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 6;
    ctx.fillRect(p.pos.x - 2, p.pos.y - 2, 4, 4);
    ctx.restore();
  }
}

function explode(particles: Particle[], x: number, y: number, color: string) {
  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.5;
    const speed = Math.random() * 3 + 1;
    particles.push({
      pos: { x, y },
      vel: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
      life: 1,
      color,
    });
  }
}

export default function SpaceInvaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const rafRef = useRef<number>(0);
  const tickRef = useRef(0);
  const touchRef = useRef<{ left: boolean; right: boolean; shoot: boolean }>({ left: false, right: false, shoot: false });
  const [displayScore, setDisplayScore] = useState(0);
  const [displayLives, setDisplayLives] = useState(3);
  const [displayWave, setDisplayWave] = useState(1);
  const [phase, setPhase] = useState<'playing' | 'gameover' | 'won'>('playing');

  const getSize = () => {
    const maxW = Math.min(window.innerWidth, 480);
    const maxH = Math.min(window.innerHeight * 0.85, 700);
    return { w: maxW, h: maxH };
  };

  const resetGame = useCallback(() => {
    const { w, h } = getSize();
    stateRef.current = initState(w, h, 1, 0, 3);
    tickRef.current = 0;
    setDisplayScore(0);
    setDisplayLives(3);
    setDisplayWave(1);
    setPhase('playing');
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { w, h } = getSize();
    canvas.width = w;
    canvas.height = h;
    stateRef.current = initState(w, h, 1, 0, 3);

    const onKey = (e: KeyboardEvent) => {
      if (e.type === 'keydown') keysRef.current.add(e.key);
      else keysRef.current.delete(e.key);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);

    const ctx = canvas.getContext('2d')!;

    function loop() {
      const gs = stateRef.current;
      if (!gs) { rafRef.current = requestAnimationFrame(loop); return; }
      if (gs.gameOver || gs.won) { rafRef.current = requestAnimationFrame(loop); return; }

      tickRef.current++;
      const t = tickRef.current;
      const { w, h } = { w: canvas!.width, h: canvas!.height };

      // Input
      const keys = keysRef.current;
      const touch = touchRef.current;
      const moveLeft = keys.has('ArrowLeft') || keys.has('a') || touch.left;
      const moveRight = keys.has('ArrowRight') || keys.has('d') || touch.right;
      const shooting = keys.has(' ') || keys.has('ArrowUp') || touch.shoot;

      if (moveLeft) gs.player.x = Math.max(0, gs.player.x - PLAYER_SPEED);
      if (moveRight) gs.player.x = Math.min(w - PLAYER_W, gs.player.x + PLAYER_SPEED);

      if (gs.shootCooldown > 0) gs.shootCooldown--;
      if (shooting && gs.shootCooldown === 0) {
        gs.bullets.push({ pos: { x: gs.player.x + PLAYER_W / 2, y: gs.player.y }, active: true });
        gs.shootCooldown = SHOOT_COOLDOWN;
      }

      // Move player bullets
      for (const b of gs.bullets) {
        b.pos.y -= BULLET_SPEED;
        if (b.pos.y < 0) b.active = false;
      }

      // Move enemy bullets
      for (const b of gs.enemyBullets) {
        b.pos.y += ENEMY_BULLET_SPEED;
        if (b.pos.y > h) b.active = false;
      }

      // Move invaders
      const alive = gs.invaders.filter(i => i.alive);
      if (alive.length === 0) {
        // Next wave
        const nextWave = gs.wave + 1;
        const next = initState(w, h, nextWave, gs.score, gs.lives);
        stateRef.current = next;
        setDisplayWave(nextWave);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      let hitWall = false;
      for (const inv of alive) {
        inv.pos.x += gs.enemySpeed * gs.enemyDir;
        if (inv.pos.x <= 0 || inv.pos.x + INVADER_W >= w) hitWall = true;
        // Game over if invader reaches player line
        if (inv.pos.y + INVADER_H >= gs.player.y) { gs.gameOver = true; }
      }
      if (hitWall) {
        gs.enemyDir *= -1;
        for (const inv of alive) inv.pos.y += 16;
      }

      // Enemy shooting
      gs.enemyShootTimer++;
      const shootInterval = Math.max(30, 90 - gs.wave * 8);
      if (gs.enemyShootTimer >= shootInterval) {
        gs.enemyShootTimer = 0;
        const shooters = alive.filter(inv => {
          const col = inv.col;
          const lowestInCol = alive.filter(a => a.col === col).sort((a, b) => b.pos.y - a.pos.y)[0];
          return lowestInCol === inv;
        });
        if (shooters.length > 0) {
          const shooter = shooters[Math.floor(Math.random() * shooters.length)];
          gs.enemyBullets.push({
            pos: { x: shooter.pos.x + INVADER_W / 2, y: shooter.pos.y + INVADER_H },
            active: true,
          });
        }
      }

      // Collision: player bullets vs invaders
      for (const b of gs.bullets) {
        if (!b.active) continue;
        for (const inv of gs.invaders) {
          if (!inv.alive) continue;
          if (b.pos.x > inv.pos.x && b.pos.x < inv.pos.x + INVADER_W &&
              b.pos.y > inv.pos.y && b.pos.y < inv.pos.y + INVADER_H) {
            inv.alive = false;
            b.active = false;
            gs.score += (ROWS - inv.row) * 10;
            const colors = ['#ff4444', '#ff8800', '#ffcc00', '#aa44ff'];
            explode(gs.particles, inv.pos.x + INVADER_W / 2, inv.pos.y + INVADER_H / 2, colors[inv.row % colors.length]);
          }
        }
      }

      // Collision: enemy bullets vs player
      const px = gs.player.x, py = gs.player.y;
      for (const b of gs.enemyBullets) {
        if (!b.active) continue;
        if (b.pos.x > px && b.pos.x < px + PLAYER_W &&
            b.pos.y > py && b.pos.y < py + PLAYER_H) {
          b.active = false;
          gs.lives--;
          explode(gs.particles, px + PLAYER_W / 2, py + PLAYER_H / 2, '#00ff88');
          if (gs.lives <= 0) gs.gameOver = true;
        }
      }

      // Cleanup
      gs.bullets = gs.bullets.filter(b => b.active);
      gs.enemyBullets = gs.enemyBullets.filter(b => b.active);
      gs.particles = gs.particles.filter(p => p.life > 0);
      for (const p of gs.particles) {
        p.pos.x += p.vel.x;
        p.pos.y += p.vel.y;
        p.life -= 0.03;
      }

      // Sync UI state sparingly
      if (t % 10 === 0) {
        setDisplayScore(gs.score);
        setDisplayLives(gs.lives);
      }

      if (gs.gameOver) { setPhase('gameover'); setDisplayScore(gs.score); }

      // --- Draw ---
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#000010';
      ctx.fillRect(0, 0, w, h);

      // Stars
      for (const s of gs.starField) {
        ctx.globalAlpha = s.brightness * (0.7 + 0.3 * Math.sin(t * 0.02 + s.x));
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(s.x, s.y, s.size, s.size);
      }
      ctx.globalAlpha = 1;

      // Ground line
      ctx.strokeStyle = '#00ff4420';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h - 40);
      ctx.lineTo(w, h - 40);
      ctx.stroke();

      // Draw invaders
      for (const inv of gs.invaders) {
        if (inv.alive) drawInvader(ctx, inv.pos.x, inv.pos.y, inv.row, t);
      }

      // Draw player
      drawPlayer(ctx, gs.player.x, gs.player.y);

      // Draw bullets
      for (const b of gs.bullets) drawBullet(ctx, b.pos.x, b.pos.y, false);
      for (const b of gs.enemyBullets) drawBullet(ctx, b.pos.x, b.pos.y, true);

      // Draw particles
      drawParticles(ctx, gs.particles);

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
    };
  }, []);

  // Touch handlers
  const onTouchLeft = (active: boolean) => { touchRef.current.left = active; };
  const onTouchRight = (active: boolean) => { touchRef.current.right = active; };
  const onTouchShoot = (active: boolean) => { touchRef.current.shoot = active; };

  return (
    <div className="flex flex-col items-center w-full select-none" style={{ background: '#000010', minHeight: '100vh' }}>
      {/* HUD */}
      <div className="flex justify-between w-full max-w-[480px] px-4 py-2 text-green-400 font-mono text-sm">
        <span>SCORE: {displayScore}</span>
        <span>WAVE: {displayWave}</span>
        <span>{'♥ '.repeat(Math.max(0, displayLives)).trim() || '—'}</span>
      </div>

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="block"
          style={{ imageRendering: 'pixelated', touchAction: 'none' }}
        />
        {phase === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
            <p className="text-red-500 text-3xl font-mono font-bold mb-2">GAME OVER</p>
            <p className="text-green-400 font-mono mb-6">Score: {displayScore}</p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-green-500 text-black font-mono font-bold rounded-lg text-lg active:bg-green-300"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Touch Controls */}
      <div className="flex justify-between items-end w-full max-w-[480px] px-4 pb-6 pt-2 gap-2 mt-2">
        {/* Left button */}
        <button
          className="w-20 h-16 rounded-xl bg-green-900/60 border border-green-500/40 text-green-400 text-2xl font-bold active:bg-green-700/60"
          onTouchStart={() => onTouchLeft(true)}
          onTouchEnd={() => onTouchLeft(false)}
          onMouseDown={() => onTouchLeft(true)}
          onMouseUp={() => onTouchLeft(false)}
          onMouseLeave={() => onTouchLeft(false)}
        >
          ◀
        </button>

        {/* Fire button */}
        <button
          className="w-24 h-16 rounded-xl bg-red-900/60 border border-red-500/40 text-red-400 text-sm font-bold active:bg-red-700/60"
          onTouchStart={() => onTouchShoot(true)}
          onTouchEnd={() => onTouchShoot(false)}
          onMouseDown={() => onTouchShoot(true)}
          onMouseUp={() => onTouchShoot(false)}
          onMouseLeave={() => onTouchShoot(false)}
        >
          FIRE
        </button>

        {/* Right button */}
        <button
          className="w-20 h-16 rounded-xl bg-green-900/60 border border-green-500/40 text-green-400 text-2xl font-bold active:bg-green-700/60"
          onTouchStart={() => onTouchRight(true)}
          onTouchEnd={() => onTouchRight(false)}
          onMouseDown={() => onTouchRight(true)}
          onMouseUp={() => onTouchRight(false)}
          onMouseLeave={() => onTouchRight(false)}
        >
          ▶
        </button>
      </div>

      <p className="text-gray-600 font-mono text-xs pb-2">Arrow keys / WASD + Space on desktop</p>
    </div>
  );
}
