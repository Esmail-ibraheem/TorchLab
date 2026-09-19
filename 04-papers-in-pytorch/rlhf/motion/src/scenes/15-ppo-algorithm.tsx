import {Latex, Layout, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {fadeIn} from '../lib/anim';
import {addTitle} from '../lib/ui';
import {T} from '../theme';

/** Algorithm 1 — PPO, Actor-Critic style: N actors × T timesteps, then K epochs of minibatch SGD. */
export default makeScene2D(function* (view) {
  const title = addTitle(view, 'RLHF — PPO, Actor-Critic style (Algorithm 1)');
  yield* title.opacity(1, 0.5);

  /* ---- the pseudocode, one line at a time ---- */
  const lines: {indent: number; parts: (string | {tex: string})[]}[] = [
    {indent: 0, parts: [{tex: '\\textbf{for } \\text{iteration} = 1, 2, \\ldots \\textbf{ do}'}]},
    {indent: 1, parts: [{tex: '\\textbf{for } \\text{actor} = 1, 2, \\ldots, N \\textbf{ do}'}]},
    {indent: 2, parts: [{tex: '\\text{Run policy } \\pi_{\\theta_{\\mathrm{old}}} \\text{ in environment for } T \\text{ timesteps}'}]},
    {indent: 2, parts: [{tex: '\\text{Compute advantage estimates } \\hat A_1, \\ldots, \\hat A_T'}]},
    {indent: 1, parts: [{tex: '\\textbf{end for}'}]},
    {indent: 1, parts: [{tex: '\\text{Optimize surrogate } L \\text{ wrt } \\theta, \\text{ with } K \\text{ epochs and minibatch size } M \\le NT'}]},
    {indent: 1, parts: [{tex: '\\theta_{\\mathrm{old}} \\leftarrow \\theta'}]},
    {indent: 0, parts: [{tex: '\\textbf{end for}'}]},
  ];
  const code = createRef<Node>();
  const rows: Node[] = [];
  view.add(
    <Node ref={code} position={[-900, -300]}>
      <Rect width={1000} height={4} fill={T.text} position={[500, -70]} />
      <Txt text="Algorithm 1  PPO, Actor-Critic Style" fontFamily={T.font} fontSize={30} fontWeight={700} fill={T.text} position={[0, -45]} offset={[-1, 0]} />
      <Rect width={1000} height={2} fill={T.text} position={[500, -20]} />
      {lines.map((l, i) => (
        <Node ref={n => rows.push(n)} position={[30 + l.indent * 50, 20 + i * 54]} opacity={0}>
          <Latex tex={(l.parts[0] as {tex: string}).tex} fill={T.text} fontSize={27} offset={[-1, 0]} />
        </Node>
      ))}
      <Rect width={1000} height={4} fill={T.text} position={[500, 20 + lines.length * 54 - 10]} />
    </Node>,
  );

  /* ---- N actors × T timesteps visual ---- */
  const N = 4, TT = 8;
  const CW = 44, CH = 36;
  const gx = 430, gy = -120;
  const cells: Rect[][] = [];
  const viz = createRef<Node>();
  const rowLabels: Node[] = [];
  view.add(
    <Node ref={viz} opacity={0}>
      <Txt text="N parallel actors, each collecting T timesteps" fontFamily={T.font} fontSize={24} fill={T.muted} position={[gx + (TT * CW) / 2, gy - 60]} />
      {Array.from({length: N}, (_, a) => (
        <Node>
          <Latex ref={n => rowLabels.push(n)} tex={`\\text{actor } ${a + 1}`} fill={T.text} fontSize={22} position={[gx - 90, gy + a * (CH + 10)]} />
          {Array.from({length: TT}, (_, t) => (
            <Rect
              ref={r => {
                cells[a] ??= [];
                cells[a][t] = r;
              }}
              width={CW - 6}
              height={CH - 6}
              radius={6}
              fill={T.panel}
              stroke={T.panelStroke}
              lineWidth={2}
              position={[gx + t * CW, gy + a * (CH + 10)]}
            />
          ))}
        </Node>
      ))}
      <Latex tex="T \text{ timesteps} \rightarrow" fill={T.muted} fontSize={22} position={[gx + (TT * CW) / 2, gy + N * (CH + 10) + 6]} />
      <Latex tex="NT \text{ samples}" fill={T.text} fontSize={26} position={[gx + (TT * CW) / 2, gy + N * (CH + 10) + 50]} />
    </Node>,
  );
  const batch = createRef<Node>();
  const epochLbl = createRef<Txt>();
  view.add(
    <Node ref={batch} opacity={0}>
      <Rect width={TT * CW + 20} height={N * (CH + 10) + 10} radius={12} stroke={T.policy} lineWidth={3} lineDash={[10, 8]} position={[gx + (TT * CW) / 2 - CW / 2, gy + ((N - 1) * (CH + 10)) / 2]} />
      <Txt ref={epochLbl} text="" fontFamily={T.font} fontSize={26} fill={T.policy} position={[gx + (TT * CW) / 2, gy + N * (CH + 10) + 100]} />
      <Txt text="surrogate loss on all NT samples — minibatch SGD / Adam" fontFamily={T.font} fontSize={22} fill={T.muted} position={[gx + (TT * CW) / 2, gy + N * (CH + 10) + 140]} />
    </Node>,
  );

  // walk through the algorithm twice (two iterations)
  yield* fadeIn(rows[0]);
  for (let it = 0; it < 2; it++) {
    yield* fadeIn(rows[1]);
    if (it === 0) yield* fadeIn(viz());
    yield* fadeIn(rows[2]);
    // actors collect T timesteps in parallel
    for (let t = 0; t < TT; t++) {
      yield* all(...cells.map(row => row[t].fill(T.env, 0.12)));
    }
    yield* fadeIn(rows[3]);
    yield* all(...cells.flat().map(c => c.fill(T.agent, 0.4)));
    yield* fadeIn(rows[4]);
    yield* fadeIn(rows[5]);
    yield* fadeIn(batch());
    for (let k = 1; k <= 3; k++) {
      epochLbl().text(`epoch ${k} / K  —  minibatches of size M ≤ NT`);
      // highlight a random minibatch
      const picks = cells.flat().filter((_, i) => (i * 7 + k * 5) % 3 === 0);
      yield* all(...picks.map(c => c.stroke(T.policy, 0.15)), ...picks.map(c => c.lineWidth(4, 0.15)));
      yield* waitFor(0.25);
      yield* all(...picks.map(c => c.stroke(T.panelStroke, 0.15)), ...picks.map(c => c.lineWidth(2, 0.15)));
    }
    yield* fadeIn(rows[6]);
    yield* waitFor(0.6);
    if (it === 0) {
      // reset for the next iteration
      yield* all(batch().opacity(0, 0.3), ...cells.flat().map(c => c.fill(T.panel, 0.3)));
      yield* all(...rows.slice(1, 7).map(r => r.opacity(0.35, 0.3)));
      epochLbl().text('');
    }
  }
  yield* fadeIn(rows[7]);
  yield* waitFor(2);
});
