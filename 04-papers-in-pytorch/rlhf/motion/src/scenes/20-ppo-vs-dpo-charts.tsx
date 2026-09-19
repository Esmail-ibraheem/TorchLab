import {Circle, Latex, Layout, Line, Node, Polygon, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {fadeIn} from '../lib/anim';
import {addTitle} from '../lib/ui';
import {T} from '../theme';

/**
 * Pasted image 20240501132016 — DPO paper, Figure 2.
 *  Left:  IMDb sentiment generation — expected reward vs KL to the reference policy (scatter).
 *  Right: TL;DR summarisation win rate vs sampling temperature (lines with error bars).
 * Values are read off the published figure. Series carry a marker shape as well as a colour,
 * because six categorical hues cannot be separated under colour-vision deficiency alone.
 */
export default makeScene2D(function* (view) {
  const title = addTitle(view, 'PPO vs DPO — reward/KL frontier and summarisation win rate');
  yield* title.opacity(1, 0.5);

  // fixed series identity: colour + marker shape
  const S = {
    dpo: {name: 'DPO (Ours)', color: '#d9a326', shape: 'circle'},
    unlike: {name: 'Unlikelihood', color: '#2a9d8f', shape: 'triangle'},
    ppo: {name: 'PPO (Our impl.)', color: '#e4508a', shape: 'square'},
    ppogt: {name: 'PPO-GT (Our impl.)', color: '#e06b2a', shape: 'diamond'},
    ppotrl: {name: 'PPO-GT (TRL)', color: '#8478ea', shape: 'cross'},
    pft: {name: 'Preferred-FT', color: '#6ab04c', shape: 'plus'},
    sft: {name: 'SFT', color: '#e06b2a', shape: 'diamond'},
    gptj: {name: 'GPT-J', color: '#2a9d8f', shape: 'triangle'},
    best: {name: 'Best of 128', color: '#8478ea', shape: 'cross'},
  } as const;

  const marker = (shape: string, color: string, size = 14) => {
    switch (shape) {
      case 'triangle':
        return <Polygon sides={3} size={size + 4} fill={color} />;
      case 'square':
        return <Rect size={size - 1} radius={2} fill={color} />;
      case 'diamond':
        return <Rect size={size - 1} radius={2} fill={color} rotation={45} />;
      case 'cross':
        return (
          <Node>
            <Line points={[[-size / 2, -size / 2], [size / 2, size / 2]]} stroke={color} lineWidth={4} lineCap="round" />
            <Line points={[[-size / 2, size / 2], [size / 2, -size / 2]]} stroke={color} lineWidth={4} lineCap="round" />
          </Node>
        );
      case 'plus':
        return (
          <Node>
            <Line points={[[-size / 2 - 1, 0], [size / 2 + 1, 0]]} stroke={color} lineWidth={4} lineCap="round" />
            <Line points={[[0, -size / 2 - 1], [0, size / 2 + 1]]} stroke={color} lineWidth={4} lineCap="round" />
          </Node>
        );
      default:
        return <Circle size={size} fill={color} />;
    }
  };

  /* ---------------- axes helper ---------------- */
  const axes = (
    x0: number, y0: number, w: number, h: number,
    xr: [number, number], yr: [number, number],
    xt: number[], yt: number[], xl: string, yl: string, ttl: string,
    xfmt: (v: number) => string = v => String(v),
  ) => {
    const sx = (v: number) => x0 + ((v - xr[0]) / (xr[1] - xr[0])) * w;
    const sy = (v: number) => y0 - ((v - yr[0]) / (yr[1] - yr[0])) * h;
    const node = (
      <Node opacity={0}>
        <Txt text={ttl} fontFamily={T.font} fontSize={30} fill={T.text} position={[x0 + w / 2, y0 - h - 50]} />
        <Line points={[[x0, y0], [x0 + w, y0]]} stroke={T.dim} lineWidth={2} />
        <Line points={[[x0, y0], [x0, y0 - h]]} stroke={T.dim} lineWidth={2} />
        {xt.map(v => (
          <Node>
            <Line points={[[sx(v), y0], [sx(v), y0 + 8]]} stroke={T.dim} lineWidth={2} />
            <Txt text={xfmt(v)} fontFamily={T.font} fontSize={20} fill={T.muted} position={[sx(v), y0 + 26]} />
          </Node>
        ))}
        {yt.map(v => (
          <Node>
            <Line points={[[x0 - 8, sy(v)], [x0, sy(v)]]} stroke={T.dim} lineWidth={2} />
            <Line points={[[x0, sy(v)], [x0 + w, sy(v)]]} stroke={T.panelStroke} lineWidth={1} />
            <Txt text={v.toFixed(1)} fontFamily={T.font} fontSize={20} fill={T.muted} position={[x0 - 34, sy(v)]} />
          </Node>
        ))}
        <Txt text={xl} fontFamily={T.font} fontSize={26} fill={T.text} position={[x0 + w / 2, y0 + 66]} />
        <Txt text={yl} fontFamily={T.font} fontSize={26} fill={T.text} position={[x0 - 80, y0 - h / 2]} rotation={-90} />
      </Node>
    ) as Node;
    return {node, sx, sy};
  };

  /* ---------------- left: IMDb scatter ---------------- */
  const L = axes(-820, 300, 700, 540, [0, 20], [0.4, 1.0], [0, 2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20], [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], 'KL(π_θ ‖ π_ref)', 'Reward', 'IMDb Sentiment Generation', v => String(v));
  view.add(L.node);

  const scatter: {key: keyof typeof S; pts: [number, number][]}[] = [
    {key: 'dpo', pts: [[0.5, 0.64], [1.1, 0.78], [1.6, 0.85], [2, 0.9], [2.4, 0.92], [3, 0.95], [3.5, 0.97], [4, 0.98], [4.5, 0.98], [5, 0.99], [5.6, 0.99], [6.2, 1.0], [7, 0.99], [7.6, 1.0], [8.3, 0.99], [9, 1.0], [10, 1.0], [11.5, 1.0], [12.5, 1.0], [13.5, 1.0], [15, 1.0], [16, 1.0], [17, 1.0], [18, 1.0], [19, 1.0], [19.7, 1.0]]},
    {key: 'unlike', pts: [[0.1, 0.64], [0.6, 0.6], [1, 0.58], [1.2, 0.59], [4, 0.77], [7, 0.87], [9.2, 0.98], [11, 0.94], [13, 0.95], [14, 0.92], [15, 0.93], [16, 0.93], [17, 0.92], [18, 0.92], [19, 0.94], [19.8, 0.95]]},
    {key: 'ppo', pts: [[0.1, 0.5], [1, 0.55], [2, 0.57], [3, 0.65], [3.5, 0.67], [4, 0.7], [4.5, 0.72], [5, 0.73], [5.5, 0.76], [6, 0.78], [6.6, 0.8], [7, 0.83], [7.7, 0.85], [8.4, 0.86], [9, 0.88], [9.6, 0.9], [10, 0.9], [10.5, 0.92], [11, 0.93], [11.6, 0.92], [12, 0.93]]},
    {key: 'ppogt', pts: [[0.2, 0.5], [1.5, 0.57], [2.3, 0.6], [3, 0.68], [3.8, 0.72], [4.5, 0.72], [5.2, 0.75], [6, 0.79], [7, 0.82], [8, 0.85], [9, 0.85], [10, 0.88], [11, 0.9], [12, 0.9], [15, 0.8], [17.5, 0.8]]},
    {key: 'ppotrl', pts: [[0.1, 0.48], [1, 0.53], [2, 0.55], [2.6, 0.54], [3.4, 0.56], [4, 0.55], [5, 0.65], [5.6, 0.63], [6.2, 0.68], [7, 0.7], [8, 0.66], [9, 0.72], [10, 0.73], [10.6, 0.7], [11.3, 0.74], [12, 0.73], [13, 0.78], [14, 0.76], [15, 0.77], [16, 0.8]]},
    {key: 'pft', pts: [[0.1, 0.45], [1, 0.5], [3, 0.63], [5, 0.65], [8, 0.58], [10, 0.65], [11, 0.61], [12, 0.63], [13, 0.6], [14, 0.6], [15, 0.65], [16, 0.62], [17, 0.6], [18, 0.62], [19, 0.62], [19.8, 0.62]]},
  ];
  const seriesNodes: Node[][] = [];
  const legendL = createRef<Rect>();
  view.add(
    <>
      {scatter.map(s => (
        <Node>
          {s.pts.map(([x, y]) => (
            <Node ref={n => (seriesNodes[scatter.indexOf(s)] ??= []).push(n)} position={[L.sx(x), L.sy(y)]} scale={0}>
              <Circle size={20} fill={T.bg} />
              {marker(S[s.key].shape, S[s.key].color)}
            </Node>
          ))}
        </Node>
      ))}
      <Rect ref={legendL} layout direction="row" gap={30} alignItems="start" padding={[12, 18]} radius={10} fill={T.panel} stroke={T.panelStroke} lineWidth={2} position={[L.sx(7.2), L.sy(0.548)]} offset={[-1, -1]} opacity={0}>
        <Layout layout direction="column" gap={8} alignItems="start">
          {(['dpo', 'unlike', 'ppo'] as const).map(k => (
            <Layout layout gap={12} alignItems="center">
              <Layout width={20} height={20}>{marker(S[k].shape, S[k].color)}</Layout>
              <Txt text={S[k].name} fontFamily={T.font} fontSize={19} fill={T.text} />
            </Layout>
          ))}
        </Layout>
        <Layout layout direction="column" gap={8} alignItems="start">
          {(['ppogt', 'ppotrl', 'pft'] as const).map(k => (
            <Layout layout gap={12} alignItems="center">
              <Layout width={20} height={20}>{marker(S[k].shape, S[k].color)}</Layout>
              <Txt text={S[k].name} fontFamily={T.font} fontSize={19} fill={T.text} />
            </Layout>
          ))}
        </Layout>
      </Rect>
    </>,
  );

  /* ---------------- right: TL;DR win rate ---------------- */
  const R = axes(150, 300, 580, 540, [0, 1], [0, 0.7], [0, 0.25, 0.5, 0.75, 1.0], [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7], 'Sampling temperature', 'Win rate', 'TL;DR Summarization Win Rate vs Reference', v => v.toFixed(2));
  view.add(R.node);
  const temps = [0, 0.25, 0.5, 0.75, 1.0];
  const lines: {key: keyof typeof S; ys: number[]; err: number}[] = [
    {key: 'dpo', ys: [0.62, 0.62, 0.59, 0.52, 0.39], err: 0.03},
    {key: 'ppo', ys: [0.57, 0.53, 0.4, 0.2, 0.07], err: 0.03},
    {key: 'best', ys: [0.42, 0.54, 0.57, 0.52, 0.47], err: 0.03},
    {key: 'pft', ys: [0.38, 0.39, 0.41, 0.37, 0.36], err: 0.03},
    {key: 'sft', ys: [0.41, 0.39, 0.39, 0.33, 0.28], err: 0.03},
    {key: 'gptj', ys: [0.06, 0.06, 0.1, 0.07, 0.06], err: 0.02},
  ];
  const lineNodes: Line[] = [];
  const errNodes: Node[] = [];
  const endLabels: Node[] = [];
  // end-label y positions, pushed apart so none overlap
  const labelY = lines.map(l => R.sy(l.ys[4]));
  const order = labelY.map((y, i) => i).sort((i, j) => labelY[i] - labelY[j]);
  for (let k = 1; k < order.length; k++) {
    const prev = order[k - 1], cur = order[k];
    if (labelY[cur] - labelY[prev] < 26) labelY[cur] = labelY[prev] + 26;
  }
  const half = createRef<Line>();
  view.add(
    <>
      <Line ref={half} points={[[R.sx(0), R.sy(0.5)], [R.sx(1), R.sy(0.5)]]} stroke={T.text} lineWidth={2} lineDash={[10, 8]} end={0} />
      {lines.map(l => (
        <Node>
          <Line ref={n => lineNodes.push(n)} points={temps.map((t, i) => [R.sx(t), R.sy(l.ys[i])])} stroke={S[l.key].color} lineWidth={4} lineJoin="round" end={0} />
          <Node ref={n => errNodes.push(n)} opacity={0}>
            {temps.map((t, i) => (
              <Node position={[R.sx(t), R.sy(l.ys[i])]}>
                <Line points={[[0, -(l.err / 0.7) * 540], [0, (l.err / 0.7) * 540]]} stroke={S[l.key].color} lineWidth={2} />
                <Line points={[[-7, -(l.err / 0.7) * 540], [7, -(l.err / 0.7) * 540]]} stroke={S[l.key].color} lineWidth={2} />
                <Line points={[[-7, (l.err / 0.7) * 540], [7, (l.err / 0.7) * 540]]} stroke={S[l.key].color} lineWidth={2} />
                <Circle size={16} fill={T.bg} />
                {marker(S[l.key].shape, S[l.key].color, 11)}
              </Node>
            ))}
          </Node>
          <Txt ref={n => endLabels.push(n)} text={S[l.key].name} fontFamily={T.font} fontSize={20} fill={T.text} position={[R.sx(1) + 16, labelY[lines.indexOf(l)]]} offset={[-1, 0]} opacity={0} />
        </Node>
      ))}
    </>,
  );

  /* ---------------- animate ---------------- */
  yield* fadeIn(L.node, 0.5);
  legendL().opacity(1);
  const legendRows = legendL().children().flatMap(c => c.children());
  for (const r of legendRows) r.opacity(0);
  for (let i = 0; i < scatter.length; i++) {
    yield* all(
      sequence(0.02, ...seriesNodes[i].map(n => n.scale(1, 0.25))),
      legendRows[i].opacity(1, 0.3),
    );
  }
  yield* waitFor(1.0);

  yield* fadeIn(R.node, 0.5);
  yield* half().end(1, 0.6);
  for (let i = 0; i < lines.length; i++) {
    yield* all(lineNodes[i].end(1, 0.8), errNodes[i].opacity(1, 0.6), endLabels[i].opacity(1, 0.5));
  }
  yield* waitFor(0.6);

  const caption = createRef<Layout>();
  view.add(
    <Layout ref={caption} layout direction="column" alignItems="center" gap={6} position={[0, 450]} opacity={0}>
      <Txt text="Left: the frontier of expected reward vs KL to the reference policy — DPO gives the highest reward at every KL, showing the quality of the optimisation." fontFamily={T.font} fontSize={22} fill={T.text} />
      <Txt text="Right: TL;DR summarisation win rates vs human-written summaries (GPT-4 as evaluator) — DPO exceeds PPO’s best case and is more robust to the sampling temperature." fontFamily={T.font} fontSize={22} fill={T.text} />
    </Layout>,
  );
  yield* fadeIn(caption(), 0.5);
  yield* waitFor(3);
});
