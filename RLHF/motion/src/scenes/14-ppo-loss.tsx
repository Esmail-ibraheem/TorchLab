import {Circle, Latex, Layout, Line, Node, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {fadeIn} from '../lib/anim';
import {addTitle} from '../lib/ui';
import {T} from '../theme';

/** The PPO loss: combined objective, then L_POLICY / L_VF / L_ENTROPY / L_PPO, with the clipped-ratio plots. */
export default makeScene2D(function* (view) {
  const title = addTitle(view, 'RLHF — Proximal Policy Optimization: the PPO loss');
  yield* title.opacity(1, 0.5);

  /* combined objective (Schulman et al. 2017, eq. 9) */
  const combined = createRef<Node>();
  view.add(
    <Node ref={combined} opacity={0}>
      <Txt text="Combining the policy surrogate, a value-function error term and an entropy bonus, the objective maximised each iteration is" fontFamily={T.font} fontSize={23} fill={T.muted} y={-430} />
      <Latex tex="L_t^{\mathrm{CLIP}+\mathrm{VF}+S}(\theta) = \hat{\mathbb{E}}_t\Big[ L_t^{\mathrm{CLIP}}(\theta) - c_1 L_t^{\mathrm{VF}}(\theta) + c_2 S[\pi_\theta](s_t) \Big]" fill={T.text} fontSize={42} y={-360} />
      <Layout layout gap={40} alignItems="center" y={-290}>
        <Txt text="c₁, c₂ are coefficients" fontFamily={T.font} fontSize={24} fill={T.muted} />
        <Txt text="S denotes an entropy bonus" fontFamily={T.font} fontSize={24} fill={T.muted} />
        <Layout layout gap={10} alignItems="center">
          <Latex tex="L_t^{\mathrm{VF}}" fill={T.muted} fontSize={26} />
          <Txt text="is a squared-error loss" fontFamily={T.font} fontSize={24} fill={T.muted} />
          <Latex tex="\big(V_\theta(s_t) - V_t^{\mathrm{targ}}\big)^2" fill={T.muted} fontSize={26} />
        </Layout>
      </Layout>
    </Node>,
  );
  yield* fadeIn(combined(), 0.6);
  yield* waitFor(2);

  /* the four losses */
  const eqs = [
    'L_{\\mathrm{POLICY}} = \\min\\Big( \\frac{\\pi_\\theta(a_t \\mid s_t)}{\\pi_{\\theta_{old}}(a_t \\mid s_t)}\\hat A_t,\\; \\mathrm{clip}\\Big(\\frac{\\pi_\\theta(a_t \\mid s_t)}{\\pi_{\\theta_{old}}(a_t \\mid s_t)},\\, 1-\\epsilon,\\, 1+\\epsilon\\Big)\\hat A_t \\Big)',
    'L_{\\mathrm{VF}} = \\frac{1}{2}\\, \\lVert\\, V_{\\theta}(s) - \\Big( \\sum_{t=0}^{T} \\gamma^t r_t \\;\\vert\\; s_0 = s \\Big) \\rVert_2^2',
    'L_{\\mathrm{ENTROPY}} = -\\sum_x p(x) \\log p(x)',
    'L_{PPO} = L_{\\mathrm{POLICY}} + c_1 L_{\\mathrm{VF}} + c_2 L_{\\mathrm{ENTROPY}}',
  ];
  const captions = [
    'clipped surrogate: the probability ratio is kept within [1−ε, 1+ε], so one update cannot move the policy too far',
    'value-function loss: the critic predicts the discounted return from state s',
    'entropy bonus: keeps the policy from collapsing, ensures exploration',
    'the full PPO loss',
  ];
  const eqNodes: Node[] = [];
  const ys = [-150, 30, 185, 315];
  view.add(
    <>
      {eqs.map((tex, i) => (
        <Node ref={n => eqNodes.push(n)} position={[-330, ys[i]]} opacity={0}>
          <Latex tex={tex} fill={T.text} fontSize={i === 0 ? 34 : 36} />
          <Txt text={captions[i]} fontFamily={T.font} fontSize={21} fill={T.muted} y={i === 0 ? 70 : i === 1 ? 84 : i === 2 ? 56 : 44} />
        </Node>
      ))}
    </>,
  );

  /* clipped-ratio plots (PPO paper, figure 1) */
  const plots = createRef<Node>();
  const eps = 0.2;
  const PW = 260, PH = 170;
  const ratio = createSignal(1);
  const plot = (x: number, y: number, positive: boolean) => {
    const toX = (r: number) => x - PW / 2 + ((r - 0.4) / 1.2) * PW;
    const toY = (v: number) => y + PH / 2 - ((v + 1.4) / 2.8) * PH;
    const f = (r: number) => {
      const A = positive ? 1 : -1;
      const clipped = Math.min(Math.max(r, 1 - eps), 1 + eps);
      return Math.min(r * A, clipped * A);
    };
    const pts: [number, number][] = [];
    for (let i = 0; i <= 60; i++) {
      const r = 0.4 + (1.2 * i) / 60;
      pts.push([toX(r), toY(f(r))]);
    }
    return (
      <Node>
        <Line points={[[x - PW / 2, toY(0)], [x + PW / 2, toY(0)]]} stroke={T.dim} lineWidth={2} />
        <Line points={[[toX(1), y + PH / 2], [toX(1), y - PH / 2]]} stroke={T.dim} lineWidth={2} lineDash={[6, 6]} />
        <Line points={[[toX(1 - eps), y + PH / 2], [toX(1 - eps), y - PH / 2]]} stroke={T.reward} lineWidth={2} lineDash={[4, 6]} opacity={0.7} />
        <Line points={[[toX(1 + eps), y + PH / 2], [toX(1 + eps), y - PH / 2]]} stroke={T.reward} lineWidth={2} lineDash={[4, 6]} opacity={0.7} />
        <Line points={pts} stroke={positive ? T.env : T.agent} lineWidth={5} lineJoin="round" />
        <Circle size={18} fill={T.yellow} position={() => [toX(ratio()), toY(f(ratio()))]} />
        <Txt text="1" fontFamily={T.font} fontSize={20} fill={T.muted} position={[toX(1), y + PH / 2 + 18]} />
        <Txt text="1−ε" fontFamily={T.font} fontSize={18} fill={T.reward} position={[toX(1 - eps), y + PH / 2 + 18]} />
        <Txt text="1+ε" fontFamily={T.font} fontSize={18} fill={T.reward} position={[toX(1 + eps), y + PH / 2 + 18]} />
        <Latex tex={positive ? '\\hat A > 0' : '\\hat A < 0'} fill={positive ? T.env : T.agent} fontSize={28} position={[x + PW / 2 - 30, y - PH / 2 + 10]} />
      </Node>
    );
  };
  view.add(
    <Node ref={plots} opacity={0}>
      <Layout layout gap={10} alignItems="center" position={[600, -170]}>
        <Latex tex="r_t(\theta) = \dfrac{\pi_\theta(a_t \mid s_t)}{\pi_{\theta_{old}}(a_t \mid s_t)}" fill={T.text} fontSize={30} />
      </Layout>
      <Txt text="the probability ratio, plotted against the clipped objective" fontFamily={T.font} fontSize={21} fill={T.muted} position={[600, -95]} />
      {plot(600, 40, true)}
      {plot(600, 290, false)}
      <Txt text="L^CLIP" fontFamily={T.font} fontSize={20} fill={T.muted} position={[440, -40]} />
      <Txt text="L^CLIP" fontFamily={T.font} fontSize={20} fill={T.muted} position={[440, 210]} />
    </Node>,
  );

  yield* fadeIn(eqNodes[0], 0.5);
  yield* fadeIn(plots(), 0.5);
  yield* ratio(1.35, 1.2, easeInOutCubic);
  yield* ratio(0.6, 1.4, easeInOutCubic);
  yield* ratio(1.0, 0.8, easeInOutCubic);
  yield* waitFor(0.3);
  for (let i = 1; i < eqNodes.length; i++) {
    yield* fadeIn(eqNodes[i], 0.5);
    yield* waitFor(1.0);
  }
  yield* waitFor(2);
});
