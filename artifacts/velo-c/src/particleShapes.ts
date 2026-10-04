export type ShapeKey = 'sphere' | 'cube' | 'code' | 'chart' | 'dna';
export const COUNT = 900;
export const SHAPE_KEYS: ShapeKey[] = ['sphere', 'cube', 'code', 'chart', 'dna'];

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sphere(): Float32Array {
  const out = new Float32Array(COUNT * 3);
  const g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i / (COUNT - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = g * i;
    out[i * 3] = Math.cos(th) * r;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = Math.sin(th) * r;
  }
  return out;
}

function cube(): Float32Array {
  const out = new Float32Array(COUNT * 3);
  const r = rng(11);
  const s = 0.72;
  for (let i = 0; i < COUNT; i++) {
    const face = i % 6;
    const u = (r() * 2 - 1) * s;
    const v = (r() * 2 - 1) * s;
    const side = face % 2 === 0 ? s : -s;
    let p: [number, number, number];
    if (face < 2) p = [side, u, v];
    else if (face < 4) p = [u, side, v];
    else p = [u, v, side];
    out[i * 3] = p[0]; out[i * 3 + 1] = p[1]; out[i * 3 + 2] = p[2];
  }
  return out;
}

function code(): Float32Array {
  const out = new Float32Array(COUNT * 3);
  const r = rng(23);
  type P = [number, number];
  const segs: [P, P][] = [
    [[-0.45, 0.5], [-0.9, 0]], [[-0.9, 0], [-0.45, -0.5]],
    [[0.45, 0.5], [0.9, 0]], [[0.9, 0], [0.45, -0.5]],
    [[0.14, 0.7], [-0.14, -0.7]],
  ];
  const lens = segs.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]));
  const total = lens.reduce((x, y) => x + y, 0);
  for (let i = 0; i < COUNT; i++) {
    let pick = r() * total;
    let k = 0;
    while (k < segs.length - 1 && pick > lens[k]) { pick -= lens[k]; k++; }
    const [a, b] = segs[k];
    const t = r();
    out[i * 3] = a[0] + (b[0] - a[0]) * t + (r() - 0.5) * 0.06;
    out[i * 3 + 1] = a[1] + (b[1] - a[1]) * t + (r() - 0.5) * 0.06;
    out[i * 3 + 2] = (r() - 0.5) * 0.22;
  }
  return out;
}

function chart(): Float32Array {
  const out = new Float32Array(COUNT * 3);
  const r = rng(37);
  const heights = [0.45, 0.8, 0.6, 1.0, 0.75];
  for (let i = 0; i < COUNT; i++) {
    const b = i % heights.length;
    const cx = -0.8 + b * 0.4;
    out[i * 3] = cx + (r() - 0.5) * 0.24;
    out[i * 3 + 1] = -0.8 + r() * heights[b] * 1.6;
    out[i * 3 + 2] = (r() - 0.5) * 0.24;
  }
  return out;
}

function dna(): Float32Array {
  const out = new Float32Array(COUNT * 3);
  const r = rng(53);
  const strands = Math.floor(COUNT * 0.7);
  const pt = (t: number, s: number): [number, number, number] => {
    const a = t * Math.PI * 4 + s * Math.PI;
    return [Math.cos(a) * 0.55, t * 0.95, Math.sin(a) * 0.55];
  };
  for (let i = 0; i < COUNT; i++) {
    let p: [number, number, number];
    if (i < strands) {
      p = pt((i >> 1) / (strands / 2) * 2 - 1, i % 2);
    } else {
      const t = r() * 2 - 1;
      const a = pt(t, 0);
      const b = pt(t, 1);
      const u = r();
      p = [a[0] + (b[0] - a[0]) * u, a[1], a[2] + (b[2] - a[2]) * u];
    }
    out[i * 3] = p[0]; out[i * 3 + 1] = p[1]; out[i * 3 + 2] = p[2];
  }
  return out;
}

export const SHAPES: Record<ShapeKey, Float32Array> = {
  sphere: sphere(), cube: cube(), code: code(), chart: chart(), dna: dna(),
};

export const SHAPE_LABELS: Record<ShapeKey, string> = {
  sphere: 'Sphere', cube: 'Cube', code: 'Code', chart: 'Chart', dna: 'DNA',
};
