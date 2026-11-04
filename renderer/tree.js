// Отрисовка пассивного дерева на canvas, как в Path of Building:
// узлы по орбитам групп, дуги между соседями на одной орбите, подсветка
// взятых узлов и тех, что добавились на этом этапе.
'use strict';

(function () {
  const R = { n: 27, N: 42, K: 60, M: 36, J: 36, S: 74, A: 34 }; // радиусы в единицах дерева
  const COL = {
    bg: '#120e0a',
    edge: '#3a2f22',
    edgeTaken: '#bf9a52',
    edgeNew: '#f2a44a',
    node: '#1a1510',
    nodeRing: '#6a583f',
    taken: '#d9b66c',
    takenRing: '#f4dfa6',
    fresh: '#f2a44a',
    freshRing: '#ffe0a8',
    label: '#efe3cc',
    classStart: '#5b4a33',
  };

  // Цвет класса — по его характеристикам, как принято в PoE:
  // сила — красный, ловкость — зелёный, интеллект — синий, смешанные — между ними
  const CLASS_COL = {
    0: '#efe6cf', // Scion — все три
    1: '#e0533f', // Marauder — сила
    2: '#5fc25a', // Ranger — ловкость
    3: '#5b8cf0', // Witch — интеллект
    4: '#e0a23a', // Duelist — сила и ловкость
    5: '#b46ae6', // Templar — сила и интеллект
    6: '#3fc2b8', // Shadow — ловкость и интеллект
  };

  class TreeView {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {object} data   window.TREE_DATA
     * @param {object} opts   { asc: 'Necromancer' | null (только узлы асценданта), interactive, onHover }
     */
    constructor(canvas, data, opts = {}) {
      this.c = canvas;
      this.ctx = canvas.getContext('2d');
      this.data = data;
      this.opts = opts;
      this.asc = opts.asc || null;
      this.ids = Object.keys(data.nodes).filter((id) => {
        const n = data.nodes[id];
        return this.asc ? n.asc === this.asc : !n.asc;
      });
      const set = new Set(this.ids);
      this.edges = data.edges.filter(([a, b]) => set.has(a) && set.has(b));
      this.taken = new Set();
      this.fresh = new Set();
      this.mastery = {};
      this.classId = null;
      this.scale = 0.05;
      this.ox = 0;
      this.oy = 0;
      this.hover = null;
      this.frame = 0;
      if (opts.interactive !== false) this.bindInput();
      this.resizeObs = new ResizeObserver(() => this.resize());
      this.resizeObs.observe(canvas.parentElement || canvas);
      this.resize();
    }

    // refit — подогнать камеру под этап. При смене этапа того же билда камера остаётся на месте.
    setStage({ nodes, prevNodes, mastery, classId }, refit = false) {
      this.taken = new Set(nodes);
      const prev = new Set(prevNodes || []);
      this.fresh = new Set(nodes.filter((id) => !prev.has(id) && (prevNodes || []).length));
      this.mastery = mastery || {};
      this.classId = classId;
      if (refit || !this.fittedStage) {
        this.fittedStage = true;
        this.fit();
      } else {
        this.draw();
      }
    }

    get takenCount() {
      return this.ids.filter((id) => this.taken.has(id) && !['S', 'A'].includes(this.data.nodes[id].t)).length;
    }

    get freshCount() {
      return this.ids.filter((id) => this.fresh.has(id) && !['S', 'A'].includes(this.data.nodes[id].t)).length;
    }

    // ------------------------------------------------------------ вид

    resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = this.c.getBoundingClientRect();
      this.w = Math.max(1, rect.width);
      this.h = Math.max(1, rect.height);
      this.c.width = Math.round(this.w * dpr);
      this.c.height = Math.round(this.h * dpr);
      this.dpr = dpr;
      if (!this.fitted) this.fit(); else this.draw();
    }

    // Подгоняем вид под взятые узлы (с запасом), иначе — под всё дерево
    fit() {
      let pts = this.ids.filter((id) => this.taken.has(id)).map((id) => this.data.nodes[id]);
      if (pts.length < 2) {
        const start = this.ids.map((id) => this.data.nodes[id]).find((n) => n.t === 'S' && n.cls === this.classId)
          || this.ids.map((id) => this.data.nodes[id]).find((n) => n.t === 'A');
        pts = start ? [start] : this.ids.map((id) => this.data.nodes[id]);
      }
      let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
      for (const p of pts) { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); }
      const min = this.asc ? 900 : 3200;
      const cx = (x0 + x1) / 2;
      const cy = (y0 + y1) / 2;
      const ww = Math.max(min, x1 - x0) * 1.25;
      const hh = Math.max(min, y1 - y0) * 1.25;
      this.scale = Math.min(this.w / ww, this.h / hh);
      this.ox = this.w / 2 - cx * this.scale;
      this.oy = this.h / 2 - cy * this.scale;
      this.fitted = true;
      this.draw();
    }

    toScreen(x, y) {
      return [x * this.scale + this.ox, y * this.scale + this.oy];
    }

    zoomAt(px, py, k) {
      const next = Math.min(0.6, Math.max(0.012, this.scale * k));
      k = next / this.scale;
      this.ox = px - (px - this.ox) * k;
      this.oy = py - (py - this.oy) * k;
      this.scale = next;
      this.draw();
    }

    bindInput() {
      let drag = null;
      this.c.addEventListener('wheel', (e) => {
        e.preventDefault();
        const r = this.c.getBoundingClientRect();
        this.zoomAt(e.clientX - r.left, e.clientY - r.top, e.deltaY < 0 ? 1.18 : 1 / 1.18);
      }, { passive: false });
      this.c.addEventListener('mousedown', (e) => { drag = { x: e.clientX, y: e.clientY, ox: this.ox, oy: this.oy }; this.c.classList.add('dragging'); });
      window.addEventListener('mouseup', () => { drag = null; this.c.classList.remove('dragging'); });
      this.c.addEventListener('mousemove', (e) => {
        const r = this.c.getBoundingClientRect();
        if (drag) {
          this.ox = drag.ox + (e.clientX - drag.x);
          this.oy = drag.oy + (e.clientY - drag.y);
          this.draw();
          return;
        }
        this.pick(e.clientX - r.left, e.clientY - r.top, e.clientX, e.clientY);
      });
      this.c.addEventListener('mouseleave', () => { this.hover = null; this.opts.onHover?.(null); this.draw(); });
      this.c.addEventListener('dblclick', () => this.fit());
    }

    // Сетка для быстрого поиска узла под мышью
    grid() {
      if (this._grid) return this._grid;
      const CELL = 400;
      const cells = new Map();
      for (const id of this.ids) {
        const n = this.data.nodes[id];
        const k = `${Math.floor(n.x / CELL)},${Math.floor(n.y / CELL)}`;
        if (!cells.has(k)) cells.set(k, []);
        cells.get(k).push(id);
      }
      this._grid = { CELL, cells };
      return this._grid;
    }

    pick(px, py, cx, cy) {
      const { CELL, cells } = this.grid();
      const wx = (px - this.ox) / this.scale;
      const wy = (py - this.oy) / this.scale;
      const reach = Math.max(R.S * 2.2, 10 / this.scale);
      const span = Math.ceil(reach / CELL);
      const gx = Math.floor(wx / CELL);
      const gy = Math.floor(wy / CELL);
      let best = null;
      let bestD = Infinity;
      for (let i = gx - span; i <= gx + span; i++) {
        for (let j = gy - span; j <= gy + span; j++) {
          for (const id of cells.get(`${i},${j}`) || []) {
            const n = this.data.nodes[id];
            const d = Math.hypot(n.x - wx, n.y - wy) * this.scale;
            const lim = Math.max(7, R[n.t] * (n.t === 'S' ? 2.2 : 1) * this.scale + 3);
            if (d < lim && d < bestD) { best = id; bestD = d; }
          }
        }
      }
      if (best !== this.hover) {
        this.hover = best;
        this.draw();
      }
      this.opts.onHover?.(best ? this.describe(best) : null, cx, cy);
    }

    describe(id) {
      const n = this.data.nodes[id];
      const kind = { n: 'Passive', N: 'Notable', K: 'Keystone', M: 'Mastery', J: 'Jewel socket', S: 'Class start', A: 'Ascendancy start' }[n.t];
      let stats = n.s || [];
      if (n.t === 'M' && n.me) {
        const eff = this.mastery[id];
        stats = eff && n.me[eff] ? n.me[eff] : [];
      }
      const name = n.t === 'S' ? (this.data.classes[n.cls]?.name || n.name) : n.name;
      return { id, name, kind, stats, taken: this.taken.has(id), fresh: this.fresh.has(id) };
    }

    // ------------------------------------------------------------ рисование

    draw() {
      if (this.frame) return;
      this.frame = requestAnimationFrame(() => { this.frame = 0; this.render(); });
    }

    // Видимая область в координатах дерева (с запасом на размер узлов и дуги)
    viewport(pad) {
      return [
        (-this.ox) / this.scale - pad,
        (-this.oy) / this.scale - pad,
        (this.w - this.ox) / this.scale + pad,
        (this.h - this.oy) / this.scale + pad,
      ];
    }

    render() {
      const { ctx, data } = this;
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.fillStyle = COL.bg;
      ctx.fillRect(0, 0, this.w, this.h);
      ctx.save();
      ctx.translate(this.ox, this.oy);
      ctx.scale(this.scale, this.scale);
      const px = 1 / this.scale; // один экранный пиксель в единицах дерева
      const [x0, y0, x1, y1] = this.viewport(900);
      const inView = (n) => n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1;

      // Рёбра: сначала обычные, поверх — взятые. Невидимые пропускаем.
      const layers = [[], [], []];
      for (const e of this.edges) {
        const A = data.nodes[e[0]];
        const B = data.nodes[e[1]];
        if (!inView(A) && !inView(B)) continue;
        const ta = this.taken.has(e[0]);
        const tb = this.taken.has(e[1]);
        if (ta && tb) layers[this.fresh.has(e[0]) || this.fresh.has(e[1]) ? 2 : 1].push(e);
        else layers[0].push(e);
      }
      const styles = [
        [COL.edge, Math.max(7, 1.4 * px)],
        [COL.edgeTaken, Math.max(13, 2.4 * px)],
        [COL.edgeNew, Math.max(15, 2.8 * px)],
      ];
      ctx.lineCap = 'round';
      layers.forEach((list, i) => {
        if (!list.length) return;
        ctx.strokeStyle = styles[i][0];
        ctx.lineWidth = styles[i][1];
        ctx.beginPath();
        for (const [a, b] of list) this.pathEdge(data.nodes[a], data.nodes[b]);
        ctx.stroke();
      });

      // Узлы рисуются пачками: один путь на каждое сочетание «форма + состояние».
      // Так на всё дерево уходит пара десятков команд отрисовки вместо тысяч.
      const buckets = new Map();
      const extras = []; // кольца keystone и подсветка под мышью
      const starts = [];
      for (const id of this.ids) {
        const n = data.nodes[id];
        if (!inView(n)) continue;
        const taken = this.taken.has(id);
        if (n.t === 'S') { starts.push([n, id]); continue; }
        if (R[n.t] * this.scale < 0.6 && !taken) continue;
        const state = this.fresh.has(id) ? 2 : taken ? 1 : 0;
        const key = `${n.t}${state}`;
        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key).push(n);
        if (n.t === 'K' || id === this.hover) extras.push([n, id, state]);
      }

      const order = ['M', 'n', 'J', 'N', 'A', 'K'];
      for (const state of [0, 1, 2]) {
        for (const t of order) {
          const list = buckets.get(`${t}${state}`);
          if (!list) continue;
          const r = R[t];
          ctx.beginPath();
          for (const n of list) this.pathNode(n, t, r);
          let fill = state === 2 ? COL.fresh : state === 1 ? COL.taken : COL.node;
          let ring = state === 2 ? COL.freshRing : state === 1 ? COL.takenRing : COL.nodeRing;
          if (t === 'M' && state === 0) { fill = null; ring = '#4a3d2c'; }
          ctx.lineWidth = Math.max(t === 'n' ? 4 : 7, (t === 'n' ? 1 : 1.6) * px);
          if (state === 2) { ctx.shadowColor = 'rgba(242,164,74,.8)'; ctx.shadowBlur = 14; } else ctx.shadowBlur = 0;
          if (fill) { ctx.fillStyle = fill; ctx.fill(); }
          ctx.strokeStyle = ring;
          ctx.stroke();
        }
      }
      ctx.shadowBlur = 0;

      for (const [n, id, state] of extras) {
        const r = R[n.t];
        if (n.t === 'K') {
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 14, 0, Math.PI * 2);
          ctx.lineWidth = Math.max(5, px);
          ctx.strokeStyle = state === 2 ? COL.freshRing : state === 1 ? COL.takenRing : '#4f4130';
          ctx.stroke();
        }
        if (id === this.hover) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 22, 0, Math.PI * 2);
          ctx.lineWidth = Math.max(6, 2 * px);
          ctx.strokeStyle = '#efe3cc';
          ctx.stroke();
        }
      }
      for (const [n, id] of starts) this.drawClassStart(n, id);

      ctx.restore();
    }

    pathNode(n, t, r) {
      const { ctx } = this;
      if (t === 'J') {
        ctx.moveTo(n.x, n.y - r); ctx.lineTo(n.x + r, n.y); ctx.lineTo(n.x, n.y + r); ctx.lineTo(n.x - r, n.y); ctx.closePath();
      } else if (t === 'M') {
        for (let k = 0; k < 6; k++) {
          const a = (Math.PI / 3) * k + Math.PI / 6;
          ctx[k ? 'lineTo' : 'moveTo'](n.x + Math.cos(a) * r, n.y + Math.sin(a) * r);
        }
        ctx.closePath();
      } else {
        ctx.moveTo(n.x + r, n.y);
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      }
    }

    pathEdge(A, B) {
      const { ctx, data } = this;
      // Соседи на одной орбите одной группы соединяются дугой
      if (A.arc && B.arc && A.arc[0] === B.arc[0] && A.arc[1] === B.arc[1]) {
        const g = data.groups[A.arc[0]];
        const r = data.orbitRadii[A.arc[1]];
        let a1 = A.arc[2] - Math.PI / 2;
        let a2 = B.arc[2] - Math.PI / 2;
        let d = a2 - a1;
        while (d > Math.PI) d -= Math.PI * 2;
        while (d < -Math.PI) d += Math.PI * 2;
        ctx.moveTo(g[0] + Math.cos(a1) * r, g[1] + Math.sin(a1) * r);
        ctx.arc(g[0], g[1], r, a1, a1 + d, d < 0);
        return;
      }
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(B.x, B.y);
    }

    drawClassStart(n, id) {
      const { ctx } = this;
      const mine = n.cls === this.classId;
      const col = CLASS_COL[n.cls] || COL.takenRing;
      const r = R.S * 2.2;
      ctx.shadowBlur = 0;
      if (mine) {
        // Свечение цвета класса вокруг своей стартовой точки
        const glow = ctx.createRadialGradient(n.x, n.y, r * 0.6, n.x, n.y, r * 2.6);
        glow.addColorStop(0, hexA(col, 0.38));
        glow.addColorStop(1, hexA(col, 0));
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 2.6, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = mine ? hexA(col, 0.22) : hexA(col, 0.05);
      ctx.fill();
      ctx.lineWidth = Math.max(mine ? 14 : 6, (mine ? 3 : 1.4) / this.scale);
      ctx.strokeStyle = mine ? col : hexA(col, 0.35);
      ctx.stroke();
      if (mine) {
        // Второе, тонкое кольцо — чтобы точку было видно и при сильном отдалении
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + Math.max(26, 6 / this.scale), 0, Math.PI * 2);
        ctx.lineWidth = Math.max(5, 1.2 / this.scale);
        ctx.strokeStyle = hexA(col, 0.7);
        ctx.stroke();
      }
      if (id === this.hover) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 24, 0, Math.PI * 2);
        ctx.lineWidth = Math.max(6, 2 / this.scale);
        ctx.strokeStyle = '#efe3cc';
        ctx.stroke();
      }
    }
  }

  function hexA(hex, a) {
    const v = parseInt(hex.slice(1), 16);
    return `rgba(${(v >> 16) & 255},${(v >> 8) & 255},${v & 255},${a})`;
  }

  window.TreeView = TreeView;
})();
