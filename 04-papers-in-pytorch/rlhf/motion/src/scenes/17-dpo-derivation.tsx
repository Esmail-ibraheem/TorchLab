import {Latex, Layout, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {fadeIn, fadeOut} from '../lib/anim';
import {addTitle} from '../lib/ui';
import {T} from '../theme';

/**
 * Deriving the DPO objective: closed-form optimal policy → reward reparameterisation →
 * Bradley–Terry → Z(x) cancels → L_DPO, the implicit reward and the gradient (Pasted 142641 / 142731).
 */
export default makeScene2D(function* (view) {
  const title = addTitle(view, 'Deriving the DPO objective');
  yield* title.opacity(1, 0.5);

  const step = (cap: string, tex: string, y: number, size = 36, capY = -58) => (
    <Node position={[0, y]} opacity={0}>
      <Txt text={cap} fontFamily={T.font} fontSize={23} fill={T.muted} y={capY} />
      <Latex tex={tex} fill={T.text} fontSize={size} />
    </Node>
  );

  /* ---- part 1: from the RL objective to a preference model over policies ---- */
  const s1 = step(
    'The optimal solution to the KL-constrained reward-maximisation objective (Eq. 3) takes the form',
    '\\pi_r(y \\mid x) = \\frac{1}{Z(x)}\\, \\pi_{\\mathrm{ref}}(y \\mid x)\\, \\exp\\Big(\\frac{1}{\\beta} r(x, y)\\Big), \\qquad Z(x) = \\sum_y \\pi_{\\mathrm{ref}}(y \\mid x)\\, \\exp\\Big(\\frac{1}{\\beta} r(x, y)\\Big)',
    -330,
    34,
    -82,
  );
  const s1note = (
    <Txt text="Z(x) is the partition function — expensive to estimate, which makes this hard to use in practice" fontFamily={T.font} fontSize={22} fill={T.reward} position={[0, -262]} opacity={0} />
  );
  const s2 = step(
    'Take the logarithm of both sides and rearrange: the reward in terms of its optimal policy, the reference policy and Z',
    'r(x, y) = \\beta \\log \\frac{\\pi_r(y \\mid x)}{\\pi_{\\mathrm{ref}}(y \\mid x)} + \\beta \\log Z(x)',
    -110,
    36,
    -72,
  );
  const s3 = step(
    'The Bradley–Terry model depends only on the difference of rewards between two completions',
    'p^*(y_1 \\succ y_2 \\mid x) = \\sigma\\big(r^*(x, y_1) - r^*(x, y_2)\\big)',
    90,
  );
  const s4 = step(
    'Substitute the reparameterisation into the preference model — the partition function cancels:',
    'p^*(y_1 \\succ y_2 \\mid x) = \\frac{1}{1 + \\exp\\Big(\\beta \\log \\frac{\\pi^*(y_2 \\mid x)}{\\pi_{\\mathrm{ref}}(y_2 \\mid x)} - \\beta \\log \\frac{\\pi^*(y_1 \\mid x)}{\\pi_{\\mathrm{ref}}(y_1 \\mid x)}\\Big)}',
    320,
    34,
    -100,
  );
  const zCancel = (
    <Txt text="Z(x) is gone — the human preference probability now depends only on the optimal policy π* and π_ref" fontFamily={T.font} fontSize={22} fill={T.dpo} position={[0, 420]} opacity={0} />
  );
  const part1 = (<Node>{s1}{s1note}{s2}{s3}{s4}{zCancel}</Node>) as Node;
  view.add(part1);

  yield* fadeIn(s1 as Node, 0.5);
  yield* waitFor(1.2);
  yield* fadeIn(s1note as Node, 0.4);
  yield* waitFor(1.0);
  yield* fadeIn(s2 as Node, 0.5);
  yield* waitFor(1.4);
  yield* fadeIn(s3 as Node, 0.5);
  yield* waitFor(1.4);
  yield* fadeIn(s4 as Node, 0.5);
  yield* waitFor(0.8);
  yield* fadeIn(zCancel as Node, 0.4);
  yield* waitFor(2.2);
  yield* fadeOut(part1, 0.5);

  /* ---- part 2: L_DPO, the implicit reward, the gradient ---- */
  const s5 = step(
    'With the preference probability in terms of the policy, the maximum-likelihood objective for a parametrised policy π_θ is',
    '\\mathcal{L}_{\\mathrm{DPO}}(\\pi_\\theta; \\pi_{\\mathrm{ref}}) = -\\,\\mathbb{E}_{(x, y_w, y_l) \\sim \\mathcal{D}}\\Big[ \\log \\sigma\\Big( \\beta \\log \\frac{\\pi_\\theta(y_w \\mid x)}{\\pi_{\\mathrm{ref}}(y_w \\mid x)} - \\beta \\log \\frac{\\pi_\\theta(y_l \\mid x)}{\\pi_{\\mathrm{ref}}(y_l \\mid x)} \\Big) \\Big]',
    -330,
    34,
    -84,
  );
  const s6 = step(
    'the reward implicitly defined by the language model π_θ and the reference model π_ref',
    '\\hat r_\\theta(x, y) = \\beta \\log \\frac{\\pi_\\theta(y \\mid x)}{\\pi_{\\mathrm{ref}}(y \\mid x)}',
    -150,
    36,
    -70,
  );
  view.add(s5);
  view.add(s6);

  // the gradient, as coloured pieces with labels underneath
  const grad = createRef<Layout>();
  const gLabels: Node[] = [];
  const piece = (tex: string, color: string) => <Latex tex={tex} fill={color} fontSize={32} />;
  view.add(
    <Node position={[0, 60]}>
      <Txt text="What does the DPO update do?  The gradient of the loss with respect to θ:" fontFamily={T.font} fontSize={23} fill={T.muted} y={-70} />
      <Layout ref={grad} layout direction="row" gap={6} alignItems="center" opacity={0}>
        {piece('\\nabla_\\theta \\mathcal{L}_{\\mathrm{DPO}}(\\pi_\\theta; \\pi_{\\mathrm{ref}}) = -\\beta\\, \\mathbb{E}_{(x, y_w, y_l) \\sim \\mathcal{D}}\\Big[', T.text)}
        {piece('\\sigma\\big(\\hat r_\\theta(x, y_l) - \\hat r_\\theta(x, y_w)\\big)', T.yellow)}
        {piece('\\Big[', T.text)}
        {piece('\\nabla_\\theta \\log \\pi(y_w \\mid x)', T.env)}
        {piece('-', T.text)}
        {piece('\\nabla_\\theta \\log \\pi(y_l \\mid x)', T.reward)}
        {piece('\\Big]\\Big]', T.text)}
      </Layout>
      <Txt ref={n => gLabels.push(n)} text="higher weight when the reward estimate is wrong" fontFamily={T.font} fontSize={21} fill={T.yellow} position={[-170, 70]} opacity={0} />
      <Txt ref={n => gLabels.push(n)} text="increase likelihood of y_w" fontFamily={T.font} fontSize={21} fill={T.env} position={[330, 70]} opacity={0} />
      <Txt ref={n => gLabels.push(n)} text="decrease likelihood of y_l" fontFamily={T.font} fontSize={21} fill={T.reward} position={[690, 70]} opacity={0} />
    </Node>,
  );
  const summary = createRef<Layout>();
  view.add(
    <Layout ref={summary} layout direction="column" alignItems="start" gap={10} position={[-880, 250]} offset={[-1, -1]} opacity={0}>
      <Txt text="•  the gradient increases the likelihood of the preferred completions y_w and decreases the likelihood of the dispreferred y_l" fontFamily={T.font} fontSize={24} fill={T.text} />
      <Txt text="•  each example is weighed by how much the implicit reward model r̂_θ mis-orders the pair, scaled by β (the strength of the KL constraint)" fontFamily={T.font} fontSize={24} fill={T.text} />
      <Txt text="•  without this weighting a naïve probability-ratio objective makes the language model degenerate" fontFamily={T.font} fontSize={24} fill={T.text} />
      <Txt text="DPO pipeline:  1) sample y₁, y₂ ∼ π_ref(·|x) and label with human preferences → D   2) minimise L_DPO for the given π_ref, D and β" fontFamily={T.font} fontSize={23} fill={T.muted} />
      <Txt text="π_ref = π_SFT when available; otherwise π_ref = argmax_π E[log π(y_w | x)] to reduce the distribution shift" fontFamily={T.font} fontSize={23} fill={T.muted} />
    </Layout>,
  );

  yield* fadeIn(s5 as Node, 0.5);
  yield* waitFor(1.6);
  yield* fadeIn(s6 as Node, 0.5);
  yield* waitFor(1.2);
  yield* fadeIn(grad(), 0.5);
  yield* sequence(0.5, ...gLabels.map(l => l.opacity(1, 0.4)));
  yield* waitFor(0.6);
  const rows = summary().children();
  for (const r of rows) r.opacity(0);
  summary().opacity(1);
  yield* sequence(0.4, ...rows.map(r => r.opacity(1, 0.4)));
  yield* waitFor(2.5);
});
