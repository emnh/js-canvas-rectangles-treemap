// Import stylesheets
import './style.css';

const w = 800;
const h = 800;

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
  // color: {
  //   r: Math.random() + 0.5,
  //   g: Math.random() + 0.5,
  //   b: Math.random() + 0.5,
  // },
  color: {
    r: 0.0,
    g: 0.0,
    b: 0.0,
  },
};

const size = (x) => (x.x2 - x.x1) * (x.y2 - x.y1);

const rects = [];

const queue = [rect];

const colors = {};

let i = 0;
while (queue.length > 0 && i < queue.length) {
  const rect = queue[i];

  i++;

  if (size(rect) >= 4) {
    const r = (x) => x + 0.12 * (Math.random() - 0.0);
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
    const dx = rect.x2 - rect.x1;
    const dy = rect.y2 - rect.y1;
    const r = Math.floor(Math.sqrt(dx * dx + dy * dy));

    for (let x = rect.x1 - r; x < rect.x2 + r; x++) {
      for (let y = rect.y1 - r; y < rect.y2 + r; y++) {
        const ddx = (x - Math.floor(0.5 * (rect.x1 + rect.x2))) / dx;
        const ddy = (y - Math.floor(0.5 * (rect.y1 + rect.y2))) / dy;
        const dd = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dd >= 1.0) {
          continue;
        }
        const t = [x + ',' + y];
        if (t in colors) {
          const k = 0.0;
          colors[t] = {
            r: k + colors[t].r * rect.color.r,
            g: k + colors[t].g * rect.color.g,
            b: k + colors[t].b * rect.color.b
          }
        } else {
          colors[t] = rect.color;
        }
      }
    }
  }
}

for (let x = 0; x < w; x++) {
  for (let y = 0; y < h; y++) {
    const idx = 4 * (y * w + x);
    const color =
      x + ',' + y in colors
        ? colors[x + ',' + y]
        : {
            r: 1,
            g: 0,
            b: 0,
          };
    let r = color.r;
    let g = color.g;
    let b = color.b;
    // for (let i = 0; i < rects.length; i++) {
    //   const rect = rects[i];
    //   if (x >= rect.x1 && x <= rect.x2 && y >= rect.y1 && y <= rect.y2) {
    //     r = rect.color.r;
    //     g = rect.color.g;
    //     b = rect.color.b;
    //     break;
    //   }
    // }
    data.data[idx + 0] = f(r);
    data.data[idx + 1] = f(g);
    data.data[idx + 2] = f(b);
    data.data[idx + 3] = f(1);
  }
}

ctx.putImageData(data, 0, 0);
