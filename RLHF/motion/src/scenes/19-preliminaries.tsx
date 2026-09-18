import {Latex, Layout, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {fadeIn, fadeOut} from '../lib/anim';
import {Box, addTitle} from '../lib/ui';
import {T} from '../theme';

/** Preliminaries — the RLHF pipeline of Ziegler et al.: SFT → reward modelling → RL fine-tuning, with the equations. */
export default makeScene2D(function* (view) {
  const title = addTitle(view, 'Preliminaries — the RLHF pipeline (Ziegler et al. 2020)');
  yield* title.opacity(1, 0.5);

  /* phase strip */
  const phases = ['1) Supervised fine-tuning (SFT)', '2) Preference sampling & reward learning', '3) RL optimisation'];
  const colors = [T.policy, T.reward, T.agent];
  const boxes: Rect[] = [];
  const strip = createRef<Layout>();
  view.add(
    <Layout ref={strip} layout direction="row" gap={30} alignItems="center" position={[0, -420]} opacity={0}>
      {phases.map((p, i) => (
        <Layout layout gap={30} alignItems="center">
          <Box ref={b => boxes.push(b)} label={p} color={T.panel} stroke={T.panelStroke} fontSize={26} padding={[14, 26]} />
          {i < 2 ? <Latex tex="\longrightarrow" fill={T.muted} fontSize={36} /> : null}
        </Layout>
      ))}
    </Layout>,
  );
  yield* fadeIn(strip(), 0.5);

  function* focus(i: number) {
    yield* all(
      ...boxes.map((b, j) => b.stroke(j === i ? colors[i] : T.panelStroke, 0.4)),
      ...boxes.map((b, j) => b.opacity(j === i ? 1 : 0.45, 0.4)),
    );
  }

  const body = createRef<Node>();
  const eq = (tex: string, y: number, size = 36, color = T.text) => <Latex tex={tex} fill={color} fontSize={size} position={[0, y]} opacity={0} />;
  const txt = (lines: string[], y: number, color = T.text, size = 25) => (
    <Layout layout direction="column" alignItems="center" gap={4} position={[0, y]} opacity={0}>
      {lines.map(l => (
        <Txt text={l} fontFamily={T.font} fontSize={size} fill={color} />
      ))}
    </Layout>
  );

  /* ---- phase 1 ---- */
  yield* focus(0);
  const s1: Node[] = [
    txt(['RLHF typically begins by fine-tuning a pre-trained LM with supervised learning on high-quality data', 'for the downstream task(s) of interest (dialogue, summarisation, …) to obtain a model'], -280),
    eq('\\pi^{\\mathrm{SFT}}', -170, 52, T.policy),
  ];
  view.add(<Node ref={body}>{s1}</Node>);
  yield* sequence(0.5, ...s1.map(n => n.opacity(1, 0.4)));
  yield* waitFor(1.5);
  yield* fadeOut(body(), 0.4);
  body().remove();

  /* ---- phase 2 ---- */
  yield* focus(1);
  const s2: Node[] = [
    txt(['The SFT model is prompted with prompts x to produce pairs of answers'], -320, T.text, 24),
    eq('(y_1, y_2) \\sim \\pi^{\\mathrm{SFT}}(y \\mid x)', -265, 34),
    txt(['presented to human labelers, who express a preference for one answer:  y_w ≻ y_l | x   (preferred / dispreferred).', 'The preferences are assumed to come from a latent reward r*(y, x) we cannot access. The Bradley–Terry model stipulates'], -195, T.muted, 22),
    eq('p^*(y_1 \\succ y_2 \\mid x) = \\frac{\\exp\\big(r^*(x, y_1)\\big)}{\\exp\\big(r^*(x, y_1)\\big) + \\exp\\big(r^*(x, y_2)\\big)}', -95, 36),
    txt(['With a static dataset of comparisons sampled from p*, parametrise a reward model r_φ(x, y) and estimate it by maximum likelihood —', 'framed as binary classification, the negative log-likelihood loss is'], 10, T.muted, 22),
    eq('\\mathcal{D} = \\big\\{ x^{(i)}, y_w^{(i)}, y_l^{(i)} \\big\\}_{i=1}^{N}', 70, 30, T.muted),
    eq('\\mathcal{L}_R(r_\\phi, \\mathcal{D}) = -\\,\\mathbb{E}_{(x, y_w, y_l) \\sim \\mathcal{D}}\\Big[ \\log \\sigma\\big( r_\\phi(x, y_w) - r_\\phi(x, y_l) \\big) \\Big]', 150, 36, T.reward),
    txt(['σ is the logistic function. For LMs, r_φ(x, y) is initialised from the SFT model π^SFT(y|x) with a linear layer on top of the final', 'transformer layer producing a single scalar. To lower variance the rewards are normalised so that  E_{x,y∼D}[r_φ(x, y)] = 0  for all x.'], 250, T.muted, 22),
  ];
  const body2 = (<Node>{s2}</Node>) as Node;
  view.add(body2);
  yield* sequence(0.55, ...s2.map(n => n.opacity(1, 0.4)));
  yield* waitFor(2.5);
  yield* fadeOut(body2, 0.4);
  body2.remove();

  /* ---- phase 3 ---- */
  yield* focus(2);
  const s3: Node[] = [
    txt(['During the RL phase the learned reward function provides feedback to the language model. The optimisation problem is'], -320, T.text, 24),
    eq('\\max_{\\pi_\\theta}\\; \\mathbb{E}_{x \\sim \\mathcal{D},\\; y \\sim \\pi_\\theta(y \\mid x)}\\big[ r_\\phi(x, y) \\big] \\;-\\; \\beta\\, \\mathbb{D}_{\\mathrm{KL}}\\big[ \\pi_\\theta(y \\mid x)\\; \\|\\; \\pi_{\\mathrm{ref}}(y \\mid x) \\big]', -230, 38, T.agent),
    txt(['β controls the deviation from the base reference policy π_ref — the initial SFT model π^SFT; the policy π_θ is also initialised to π^SFT.', 'The constraint keeps the model where the reward model is accurate, maintains generation diversity and prevents mode-collapse', 'to single high-reward answers.'], -130, T.muted, 22),
    txt(['Language generation is discrete, so this objective is not differentiable → it is optimised with reinforcement learning:', 'construct the reward function'], -10, T.text, 24),
    eq('r(x, y) = r_\\phi(x, y) - \\beta\\big( \\log \\pi_\\theta(y \\mid x) - \\log \\pi_{\\mathrm{ref}}(y \\mid x) \\big)', 80, 38),
    txt(['and maximise it using PPO.'], 160, T.text, 26),
  ];
  const body3 = (<Node>{s3}</Node>) as Node;
  view.add(body3);
  yield* sequence(0.6, ...s3.map(n => n.opacity(1, 0.4)));
  yield* waitFor(3);
});
