// Import stylesheets
import './style.css';

const w = 400;
const h = 400;

const canvas = document.createElement('canvas');

canvas.width = w;
canvas.height = h;

document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

const data = ctx.createImageData(w, h);

const f = (x) => Math.max(0, Math.min(255.0, Math.floor(x * 255.0)));

let rect = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  color: {
    r: Math.random(),
    g: Math.random(),
    b: Math.random(),
  },
};

const size = (x) => (x.x2 - x.x1) * (x.y2 - x.y1);

const rects = [];

const queue = [rect];

let i = 0;
while (queue.length > 0 && i < 100 && i < queue.length) {
  const rect = queue[i];

  i++;

  if (size(rect) >= 40) {
    const rw = rect.x2 - rect.x1;
    const rh = rect.y2 - rect.y1;
    const aw = Math.floor(rw * 0.5);
    const ah = Math.foor(rh * 0.5);
    const a = {
      x1: rect.x1,
      x2: rect.x1 + aw,
      y1: rect.y1,
      y2: rect.y1 + ah,
      color: {
        r: 0.5 * (rect.color.r + Math.random()),
        g: 0.5 * (rect.color.g + Math.random()),
        b: 0.5 * (rect.color.b + Math.random()),
      },
    };
    const b = {
      x1: rect.x1 + aw,
      x2: rect.x2,
      y1: rect.y1 + ah,
      y2: rect.y2,
      color: {
        r: 0.5 * (rect.color.r - Math.random()),
        g: 0.5 * (rect.color.g - Math.random()),
        b: 0.5 * (rect.color.b - Math.random()),
      },
    };
    queue.push(a);
    queue.push(b);
  } else {
    rects.push(rect);
  }
}

for (let x = 0; x < w; x++) {
  for (let y = 0; y < h; y++) {
    const idx = 4 * (y * w + x);
    let r = 1;
    let g = 0;
    let b = 0;
    for (let i = 0; i < rects.length; i++) {
      const rect = rects[i];
      if (x >= rect.x1 && x <= rect.x2 && y >= rect.y2 && y <= rect.y2) {
        r = rect.color.r;
        g = rect.color.g;
        b = rect.color.b;
        break;
      }
    }
    data.data[idx + 0] = f(r);
    data.data[idx + 1] = f(g);
    data.data[idx + 2] = f(b);
    data.data[idx + 3] = f(1);
  }
}

ctx.putImageData(data, 0, 0);
