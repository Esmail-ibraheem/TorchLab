import {makeScene2D} from '@motion-canvas/2d';
import {all, sequence, waitFor} from '@motion-canvas/core';
import {dim, fadeIn} from '../lib/anim';
import {buildPipeline, resetPanel} from '../lib/hf';
import {addTitle} from '../lib/ui';
import {T} from '../theme';

/** rlhf3.png — the three RLHF phases, each lit up in turn. */
export default makeScene2D(function* (view) {
  const title = addTitle(view, 'RLHF — train models with three different techniques');
  const {node, pipe} = buildPipeline();
  view.add(node);
  pipe.root().y(40);

  const panels = [pipe.p1, pipe.p2, pipe.p3];
  for (const p of panels) {
    resetPanel(p);
    p.title().opacity(0);
  }
  for (const s of pipe.seps) s.opacity(0);

  yield* title.opacity(1, 0.5);
  yield* all(...pipe.seps.map(s => s.opacity(1, 0.5)));

  // draw every panel quickly, left to right
  for (const p of panels) {
    yield* p.title().opacity(1, 0.4);
    yield* all(
      sequence(0.1, ...p.items.map(n => n.opacity(1, 0.35))),
      sequence(0.08, ...p.arrows.map(a => a.end(1, 0.4))),
    );
  }
  yield* waitFor(0.8);

  // then highlight each phase in turn, like the four source figures
  for (let i = 0; i < 3; i++) {
    yield* all(
      ...panels.map((p, j) => (j === i ? p.root().opacity(1, 0.5) : dim(p.root(), 0.18, 0.5))),
      ...panels.map((p, j) => p.title().fill(j === i ? T.text : T.dim, 0.5)),
    );
    yield* waitFor(2.2);
  }
  yield* all(...panels.map(p => p.root().opacity(1, 0.5)), ...panels.map(p => p.title().fill(T.text, 0.5)));
  yield* waitFor(1.2);
});
