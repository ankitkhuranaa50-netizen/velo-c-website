import { useEffect, useRef, useState } from 'react';
import { SHAPES, SHAPE_KEYS, COUNT, type ShapeKey } from './particleShapes';

export default function ParticleShowcase() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapeRef = useRef<ShapeKey>('sphere');
  const manualRef = useRef(false);
  const [, setShape] = useState<ShapeKey>('sphere');

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pos = new Float32Array(SHAPES.sphere);
    const colors: [number, number, number][] = [];
    for (let i = 0; i < COUNT; i++) {
      const m = i / COUNT;
      const g = Math.round(255 - 90 * m);
      colors.push([g, g, g]);
    }

    let size = 0, dpr = 1, raf = 0, visible = true;
    let rotY = 0, rotX = 0.35, boost = 0;
    let dragging = false, lastX = 0, lastY = 0;
    let lastSwitch = performance.now();

    const resize = () => {
      size = Math.max(200, wrap.clientWidth);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      canvas.style.height = size + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const io = new IntersectionObserver((e) => { visible = e[0].isIntersecting; });
    io.observe(wrap);

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;

      if (!manualRef.current && !reduce && t - lastSwitch > 5000) {
        lastSwitch = t;
        const next = SHAPE_KEYS[(SHAPE_KEYS.indexOf(shapeRef.current) + 1) % SHAPE_KEYS.length];
        shapeRef.current = next;
        setShape(next);
      }

      const target = SHAPES[shapeRef.current];
      for (let i = 0; i < COUNT * 3; i++) pos[i] += (target[i] - pos[i]) * 0.07;

      if (!dragging && !reduce) rotY += 0.004 + boost;
      boost *= 0.95;

      const cy = Math.cos(rotY), sy = Math.sin(rotY);
      const cx = Math.cos(rotX), sx = Math.sin(rotX);
      const half = size / 2;
      const scale = size * 0.34;
      const cam = 3.2;
      const dot = Math.max(1, size / 380);

      ctx.clearRect(0, 0, size, size);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < COUNT; i++) {
        const x = pos[i * 3], y = pos[i * 3 + 1], z = pos[i * 3 + 2];
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y2 = y * cx - z1 * sx;
        const z2 = y * sx + z1 * cx;
        const p = cam / (cam - z2);
        const depth = (z2 + 1.2) / 2.4;
        const a = 0.25 + 0.75 * Math.min(1, Math.max(0, depth));
        const c = colors[i];
        ctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a.toFixed(2) + ')';
        const r = dot * (0.6 + 1.3 * depth) * p;
        ctx.beginPath();
        ctx.arc(half + x1 * scale * p, half + y2 * scale * p, r, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    };
    raf = requestAnimationFrame(draw);

    const down = (e: PointerEvent) => {
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      rotY += dx * 0.01;
      rotX = Math.max(-1.2, Math.min(1.2, rotX + dy * 0.01));
      boost = Math.max(-0.05, Math.min(0.05, dx * 0.002));
    };
    const up = () => { dragging = false; };
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
    };
  }, []);

  return (
    <section className="px-6 pb-24 max-w-4xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-6">
        Explore the Velo C Universe
      </h2>
      <div ref={wrapRef} className="w-full max-w-md mx-auto">
        <canvas
          ref={canvasRef}
          style={{ width: '100%', display: 'block', touchAction: 'pan-y' }}
          aria-label="Interactive 3D particle shape"
        />
      </div>
    </section>
  );
}
