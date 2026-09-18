import {Line, Node} from '@motion-canvas/2d';
import {ThreadGenerator, all, easeOutBack, sequence} from '@motion-canvas/core';

/** Scale a node from 0 to 1 with a small overshoot. */
export function* pop(node: Node, t = 0.5): ThreadGenerator {
  node.scale(0);
  node.opacity(1);
  yield* node.scale(1, t, easeOutBack);
}

/** Pop several nodes one after another. */
export function* popAll(nodes: Node[], gap = 0.15, t = 0.5): ThreadGenerator {
  for (const n of nodes) n.scale(0);
  yield* sequence(gap, ...nodes.map(n => pop(n, t)));
}

/** Grow an arrow (Line with end=0) to full length. */
export function* draw(line: Line, t = 0.6): ThreadGenerator {
  yield* line.end(1, t);
}

export function* drawAll(lines: Line[], gap = 0.12, t = 0.6): ThreadGenerator {
  yield* sequence(gap, ...lines.map(l => draw(l, t)));
}

export function* fadeIn(nodes: Node | Node[], t = 0.4): ThreadGenerator {
  const list = Array.isArray(nodes) ? nodes : [nodes];
  yield* all(...list.map(n => n.opacity(1, t)));
}

export function* fadeOut(nodes: Node | Node[], t = 0.4): ThreadGenerator {
  const list = Array.isArray(nodes) ? nodes : [nodes];
  yield* all(...list.map(n => n.opacity(0, t)));
}

/** Dim a group to a low opacity (used to de-emphasise inactive panels). */
export function* dim(nodes: Node | Node[], to = 0.22, t = 0.5): ThreadGenerator {
  const list = Array.isArray(nodes) ? nodes : [nodes];
  yield* all(...list.map(n => n.opacity(to, t)));
}

/** Points along a circular arc, for curved arrows. Angles in degrees. */
export function arcPoints(cx: number, cy: number, r: number, a0: number, a1: number, n = 24): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return pts;
}

/** Points along a quadratic bezier from a to b bending towards control c. */
export function bendPoints(a: [number, number], c: [number, number], b: [number, number], n = 24): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0];
    const y = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1];
    pts.push([x, y]);
  }
  return pts;
}
