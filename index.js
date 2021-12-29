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
  x2: w,
  y2: h,
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
while (queue.length > 0 && i < queue.length) {
  const rect = queue[i];

  i++;

  if (size(rect) >= 100) {
    const r = (x) => x + 0.5 * (Math.random() - 0.5);
    const rw = rect.x2 - rect.x1;
    const rh = rect.y2 - rect.y1;
    const aw = Math.floor(rw * Math.random());
    const ah = Math.floor(rh * Math.random());
    const midx = rect.x1 + aw;
    const midy = rect.y1 + ah;
    const a1 = {
      x1: rect.x1,
      x2: midx,
      y1: rect.y1,
      y2: midy,
      color: {
        r: r(rect.color.r),
        g: r(rect.color.g),
        b: r(rect.color.b),
      },
    };
    const a2 = {
      x1: midx,
      x2: rect.x2,
      y1: rect.y1,
      y2: midy,
      color: {
        r: r(rect.color.r),
        g: r(rect.color.g),
        b: r(rect.color.b),
      },
    };
    const b1 = {
      x1: rect.x1,
      x2: midx,
      y1: midy,
      y2: rect.y2,
      color: {
        r: r(rect.color.r),
        g: r(rect.color.g),
        b: r(rect.color.b),
      },
    };
    const b2 = {
      x1: midx,
      x2: rect.x2,
      y1: midy,
      y2: rect.y2,
      color: {
        r: r(rect.color.r),
        g: r(rect.color.g),
        b: r(rect.color.b),
      },
    };

    queue.push(a1);
    queue.push(a2);
    queue.push(b1);
    queue.push(b2);
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
      if (x >= rect.x1 && x <= rect.x2 && y >= rect.y1 && y <= rect.y2) {
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
