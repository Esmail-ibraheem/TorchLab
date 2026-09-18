import {Circle, Latex, Layout, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {arcPoints, drawAll, fadeIn, fadeOut, popAll} from '../lib/anim';
import {Arrow, Grid, NeuralNet, addTitle} from '../lib/ui';
import {T} from '../theme';

/**
 * Let's talk about trajectories:
 *  A. Scheme of deep RL (robot arm, agent, reward function, trial & error)
 *  B. the seven equations, from π* = argmax J(π) to the policy-gradient update
 */
export default makeScene2D(function* (view) {
  const title = addTitle(view, 'Let’s talk about trajectories…');
  yield* title.opacity(1, 0.5);

  /* ------------------------------------------------------------ A */
  const partA = createRef<Node>();
  const boxes: Node[] = [];
  const arrows: Line[] = [];
  const orange = '#f0a24a', blue = '#4f8ef7', green = '#43c96b', pink = '#e07be0', darkRed = '#b03a3a';
  const armStroke = '#8ec2e8';
  const armFill = '#1d2a36';

  const dashedBox = (x: number, y: number, w: number, h: number, color: string, label: string, labelY: number, children?: any) => (
    <Node ref={n => boxes.push(n)} position={[x, y]} scale={0}>
      <Rect width={w} height={h} radius={26} stroke={color} lineWidth={4} lineDash={[18, 12]} />
      {children}
      <Txt text={label} fontFamily={T.font} fontSize={30} fill={T.text} y={labelY} />
    </Node>
  );
  const seg = (x: number, y: number, w: number, h: number, rot: number) => (
    <Rect position={[x, y]} width={w} height={h} radius={h / 2} rotation={rot} fill={armFill} stroke={armStroke} lineWidth={4} />
  );
  const joint = (x: number, y: number, s = 34) => <Circle position={[x, y]} size={s} fill={armFill} stroke={armStroke} lineWidth={4} />;

  view.add(
    <Node ref={partA}>
      {dashedBox(-360, 0, 640, 600, orange, 'Work Environment', 262, (
        <Node y={20}>
          {/* robot arm: base → column → upper arm → forearm → gripper */}
          <Rect width={200} height={30} radius={8} fill={armFill} stroke={armStroke} lineWidth={4} y={210} />
          {seg(0, 130, 60, 150, 0)}
          {joint(0, 60, 44)}
          {seg(-70, -20, 48, 212, -41)}
          {joint(-140, -100, 40)}
          {seg(-55, -137, 42, 186, 66)}
          {joint(30, -175, 36)}
          {seg(74, -126, 34, 131, -42)}
          <Rect width={40} height={26} radius={6} fill={armFill} stroke={armStroke} lineWidth={4} position={[118, -78]} rotation={-40} />
          {/* trajectory arc */}
          <Line points={arcPoints(60, 60, 180, -145, -20)} stroke={darkRed} lineWidth={4} lineDash={[12, 10]} endArrow arrowSize={16} />
          <Txt text="Trajectory" fontFamily={T.font} fontSize={28} fill={T.text} position={[130, -250]} />
        </Node>
      ))}
      {dashedBox(430, -170, 400, 250, blue, 'Agent', 92, <NeuralNet color={orange} width={220} height={140} y={-25} layers={[4, 4, 4, 4]} nodeSize={20} lineWidth={3} />)}
      {dashedBox(430, 230, 400, 250, green, 'Reward Function', 92, (
        <Node y={-20}>
          <Line points={[[-130, 0], [130, 0]]} stroke="#e04a4a" lineWidth={3} endArrow arrowSize={12} />
          <Line points={[[0, 90], [0, -90]]} stroke="#e04a4a" lineWidth={3} endArrow arrowSize={12} />
          <Line points={[[-120, 70], [-60, 40], [-8, 4], [8, -4], [60, -40], [120, -70]]} stroke="#e04a4a" lineWidth={4} lineJoin="round" />
        </Node>
      ))}
      {/* Action: agent → environment */}
      <Arrow ref={a => arrows.push(a)} points={[[230, -240], [-30, -240]]} stroke={blue} lineWidth={22} arrowSize={44} />
      <Txt text="Action" fontFamily={T.font} fontSize={30} fill={T.text} position={[100, -290]} />
      {/* State: environment → agent */}
      <Arrow ref={a => arrows.push(a)} points={[[-30, -140], [220, -140]]} stroke={orange} lineWidth={22} arrowSize={44} />
      <Txt text="State" fontFamily={T.font} fontSize={30} fill={T.text} position={[100, -190]} />
      {/* State: environment → reward function */}
      <Arrow ref={a => arrows.push(a)} points={[[-30, 200], [220, 200]]} stroke={orange} lineWidth={22} arrowSize={44} />
      <Txt text="State" fontFamily={T.font} fontSize={30} fill={T.text} position={[100, 150]} />
      {/* Reward: reward function → agent */}
      <Arrow ref={a => arrows.push(a)} points={[[430, 100], [430, -40]]} stroke={green} lineWidth={22} arrowSize={44} />
      <Txt text="Reward" fontFamily={T.font} fontSize={30} fill={T.text} position={[540, 30]} />
      {/* trial & error loop */}
      <Arrow ref={a => arrows.push(a)} points={arcPoints(110, 30, 70, 120, 420)} stroke={pink} lineWidth={14} arrowSize={30} />
      <Layout layout direction="column" alignItems="center" position={[110, 30]}>
        <Txt text="Trial" fontFamily={T.font} fontSize={24} fill={T.text} />
        <Txt text="&" fontFamily={T.font} fontSize={24} fill={T.text} />
        <Txt text="Error" fontFamily={T.font} fontSize={24} fill={T.text} />
      </Layout>
    </Node>,
  );
  const labels = partA().children().filter(c => c instanceof Txt || c instanceof Layout);
  for (const l of labels) l.opacity(0);

  yield* popAll(boxes, 0.2, 0.5);
  yield* all(drawAll(arrows, 0.15, 0.6), sequence(0.15, ...labels.map(l => l.opacity(1, 0.4))));
  yield* waitFor(2.5);
  yield* fadeOut(partA(), 0.5);

  /* ------------------------------------------------------------ B */
  const eqs: {cap: string; tex: string; x: number; y: number}[] = [
    {cap: 'The goal in RL: select the policy that maximizes the expected return', tex: '\\pi^* = \\arg\\max_\\pi J(\\pi)', x: -470, y: -360},
    {cap: 'The expected return of a policy is the expected return over all possible trajectories', tex: 'J(\\pi) = \\int_\\tau P(\\tau \\mid \\pi)\\, R(\\tau) = \\mathop{\\mathbb{E}}_{\\tau \\sim \\pi}\\big[R(\\tau)\\big]', x: -470, y: -195},
    {cap: 'A trajectory is a series of (action, state), starting from an initial state', tex: '\\tau = (s_0, a_0, s_1, a_1, \\ldots)', x: -470, y: -35},
    {cap: 'The next state is stochastic — suppose the cat is drunk and does not always move correctly', tex: 's_{t+1} \\sim P(\\cdot \\mid s_t, a_t)', x: -470, y: 125},
    {cap: 'So the probability of a trajectory is', tex: 'P(\\tau \\mid \\pi) = \\rho_0(s_0) \\prod_{t=0}^{T-1} P(s_{t+1} \\mid s_t, a_t)\\, \\pi(a_t \\mid s_t)', x: 470, y: -335},
    {cap: 'We always work with discounted rewards (we prefer immediate rewards to future ones)', tex: 'R(\\tau) = \\sum_{t=0}^{\\infty} \\gamma^t r_t', x: 470, y: -135},
    {cap: 'This is an expectation → approximate it with a sample mean over a set D of trajectories', tex: '\\hat g = \\frac{1}{|\\mathcal{D}|} \\sum_{\\tau \\in \\mathcal{D}} \\sum_{t=0}^{T} \\nabla_\\theta \\log \\pi_\\theta(a_t \\mid s_t)\\, R(\\tau)', x: 470, y: 70},
    {cap: 'and take a gradient-ascent step on the policy parameters', tex: '\\theta_{k+1} = \\theta_k + \\alpha\\, \\nabla_\\theta J(\\pi_\\theta)\\,\\rvert_{\\theta_k}', x: 470, y: 250},
  ];
  const eqNodes: Node[] = [];
  view.add(
    <>
      {eqs.map((e, i) => (
        <Node ref={n => eqNodes.push(n)} position={[e.x, e.y]} opacity={0}>
          <Txt text={e.cap} fontFamily={T.font} fontSize={21} fill={T.muted} y={i >= 4 && i <= 6 ? -100 : -72} />
          <Latex tex={e.tex} fill={T.text} fontSize={40} />
        </Node>
      ))}
    </>,
  );

  // a small grid with a trajectory drawn while τ is introduced
  const CELL = 60;
  const gridNode = createRef<Node>();
  const path = createRef<Line>();
  const cat = createRef<Txt>();
  const cells: [number, number][] = [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]];
  const cp = (c: number, r: number): [number, number] => [-660 + c * CELL, 250 + r * CELL];
  view.add(
    <Node ref={gridNode} opacity={0}>
      <Grid cols={4} rows={4} cell={CELL} position={[cp(1.5, 1.5)[0], cp(1.5, 1.5)[1]]} color="#33334a" />
      <Line ref={path} points={cells.map(([c, r]) => cp(c, r))} stroke={T.agent} lineWidth={5} radius={14} end={0} endArrow arrowSize={14} />
      <Txt ref={cat} text="🐈" fontSize={40} position={cp(0, 0)} />
      <Txt text="🥩" fontSize={36} position={cp(3, 3)} />
      {cells.map(([c, r], i) => (
        <Latex tex={`s_${i}`} fill={T.muted} fontSize={18} position={[cp(c, r)[0] + 18, cp(c, r)[1] - 20]} />
      ))}
      <Txt text="one trajectory τ of the cat" fontFamily={T.font} fontSize={20} fill={T.muted} position={[cp(1.5, 1.5)[0], cp(1.5, 1.5)[1] + 150]} />
    </Node>,
  );

  for (let i = 0; i < eqs.length; i++) {
    yield* fadeIn(eqNodes[i], 0.5);
    if (i === 2) {
      yield* fadeIn(gridNode(), 0.3);
      yield* all(path().end(1, 1.6, easeOutCubic), cat().position(cp(3, 2), 1.6, easeOutCubic));
    }
    yield* waitFor(i === 6 ? 1.4 : 1.0);
  }
  yield* waitFor(2);
});
