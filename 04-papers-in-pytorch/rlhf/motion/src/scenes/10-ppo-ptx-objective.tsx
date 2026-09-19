import {Latex, Layout, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {fadeIn} from '../lib/anim';
import {addTitle} from '../lib/ui';
import {T} from '../theme';

/** Pasted image 20240429125320 — the PPO-ptx objective, plus the KL penalty as two distributions. */
export default makeScene2D(function* (view) {
  const title = addTitle(view, 'Reinforcement learning — the InstructGPT (PPO-ptx) objective');
  yield* title.opacity(1, 0.5);

  const termA = createRef<Latex>();
  const termB = createRef<Latex>();
  const termC = createRef<Latex>();
  const note = createRef<Txt>();
  view.add(
    <>
      <Layout layout direction="column" gap={10} alignItems="center" position={[0, -340]}>
        <Layout layout direction="row" gap={14} alignItems="center">
          <Latex ref={termA} tex="\mathrm{objective}(\phi) = \mathbb{E}_{(x,y)\sim D_{\pi^{\mathrm{RL}}_\phi}}\Big[\, r_\theta(x,y)" fill={T.text} fontSize={38} opacity={0} />
          <Latex ref={termB} tex="-\, \beta \log\big(\pi^{\mathrm{RL}}_\phi(y \mid x) \,/\, \pi^{\mathrm{SFT}}(y \mid x)\big)\Big]" fill={T.text} fontSize={38} opacity={0} />
        </Layout>
        <Latex ref={termC} tex="+\, \gamma\, \mathbb{E}_{x \sim D_{\mathrm{pretrain}}}\Big[\log\big(\pi^{\mathrm{RL}}_\phi(x)\big)\Big]" fill={T.text} fontSize={38} opacity={0} marginLeft={520} />
      </Layout>
      <Txt ref={note} text="" fontFamily={T.font} fontSize={28} fill={T.muted} position={[0, -220]} />
    </>,
  );

  yield* fadeIn(termA());
  note().text('maximise the reward-model score of the policy’s own samples');
  yield* waitFor(1.5);
  yield* fadeIn(termB());
  note().text('minus a per-token KL penalty from the SFT model, to mitigate over-optimisation of the reward model');
  yield* waitFor(1.8);
  yield* fadeIn(termC());
  note().text('plus pretraining gradients mixed into the PPO gradients, to fix regressions on public NLP datasets (“PPO-ptx”)');
  yield* waitFor(1.6);

  /* legend */
  const legend = createRef<Layout>();
  const row = (tex: string, text: string) => (
    <Layout layout gap={16} alignItems="center">
      <Latex tex={tex} fill={T.agent} fontSize={30} />
      <Txt text={text} fontFamily={T.font} fontSize={25} fill={T.text} />
    </Layout>
  );
  view.add(
    <Layout ref={legend} layout direction="column" gap={10} alignItems="start" position={[40, -110]} offset={[-1, -1]} opacity={0}>
      {row('\\pi^{\\mathrm{RL}}_\\phi', 'the learned RL policy')}
      {row('\\pi^{\\mathrm{SFT}}', 'the supervised trained model')}
      {row('D_{\\mathrm{pretrain}}', 'the pretraining distribution')}
      {row('\\beta', 'KL reward coefficient — strength of the KL penalty')}
      {row('\\gamma', 'pretraining loss coefficient — strength of the pretraining gradients')}
      <Txt text="“PPO” models:  γ = 0      “PPO-ptx” models:  γ > 0  →  InstructGPT" fontFamily={T.font} fontSize={25} fill={T.muted} marginTop={6} />
      <Txt text="The environment is a bandit: a random customer prompt → one response" fontFamily={T.font} fontSize={23} fill={T.muted} />
      <Txt text="→ reward from the RM, episode over. The value function is initialised from the RM." fontFamily={T.font} fontSize={23} fill={T.muted} />
    </Layout>,
  );
  const rows = legend().children();
  for (const r of rows) r.opacity(0);
  legend().opacity(1);
  yield* sequence(0.3, ...rows.map(r => r.opacity(1, 0.4)));

  /* KL divergence between two distributions */
  const mu = createSignal(0);
  const sigma = 0.9;
  const W = 640, H = 260;
  const ox = -520, oy = 290; // chart origin (bottom-left corner in scene coords is ox - W/2, oy + H/2)
  const gauss = (m: number) => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= 80; i++) {
      const x = -4 + (8 * i) / 80;
      const y = Math.exp(-((x - m) ** 2) / (2 * sigma * sigma));
      pts.push([ox - W / 2 + ((x + 4) / 8) * W, oy + H / 2 - y * (H - 40)]);
    }
    return pts;
  };
  const kl = () => ((mu() ** 2) / (2 * sigma * sigma));
  const chart = createRef<Node>();
  view.add(
    <Node ref={chart} opacity={0}>
      <Line points={[[ox - W / 2, oy + H / 2], [ox + W / 2, oy + H / 2]]} stroke={T.dim} lineWidth={3} />
      <Line points={[[ox - W / 2, oy + H / 2], [ox - W / 2, oy - H / 2]]} stroke={T.dim} lineWidth={3} />
      <Line points={gauss(0)} stroke={T.env} lineWidth={5} lineJoin="round" />
      <Line points={() => gauss(mu())} stroke={T.agent} lineWidth={5} lineJoin="round" />
      <Latex tex="P = \pi^{\mathrm{SFT}}" fill={T.env} fontSize={28} position={[ox - W / 2 + 90, oy - H / 2 + 10]} />
      <Latex tex="Q = \pi^{\mathrm{RL}}_\phi" fill={T.agent} fontSize={28} position={[ox + W / 2 - 90, oy - H / 2 + 10]} />
      <Txt text={() => `D_KL(P ∥ Q) = ${kl().toFixed(2)}`} fontFamily={T.font} fontSize={30} fill={T.text} position={[ox, oy - H / 2 - 40]} />
      <Txt text="Kullback–Leibler divergence: distance between distributions" fontFamily={T.font} fontSize={23} fill={T.muted} position={[ox, oy + H / 2 + 34]} />
      <Txt text="the penalty keeps the RL model from drifting into gibberish that fools the RM" fontFamily={T.font} fontSize={22} fill={T.muted} position={[ox, oy + H / 2 + 66]} />
      <Txt text="(DeepMind put this in the RL loss, not the reward — see GopherCite)" fontFamily={T.font} fontSize={20} fill={T.dim} position={[ox, oy + H / 2 + 96]} />
    </Node>,
  );
  yield* fadeIn(chart());
  yield* mu(2.2, 1.6, easeInOutCubic);
  yield* waitFor(0.4);
  yield* mu(0.5, 1.2, easeInOutCubic);
  yield* waitFor(0.3);
  yield* mu(1.4, 0.9, easeInOutCubic);
  yield* waitFor(2);
});
