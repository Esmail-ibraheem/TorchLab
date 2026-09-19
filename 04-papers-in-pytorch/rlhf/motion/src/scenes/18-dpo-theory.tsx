import {Latex, Layout, Node, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, sequence, waitFor} from '@motion-canvas/core';
import {fadeIn, fadeOut} from '../lib/anim';
import {addTitle} from '../lib/ui';
import {T} from '../theme';

/** DPO paper §5 — "Your language model is secretly a reward model" and the instability of actor-critic. */
export default makeScene2D(function* (view) {
  const title = addTitle(view, 'Theoretical analysis of DPO');
  yield* title.opacity(1, 0.5);

  const heading = (text: string, y: number, size = 34) => (
    <Txt text={text} fontFamily={T.font} fontSize={size} fontWeight={700} fill={T.text} position={[-880, y]} offset={[-1, 0]} opacity={0} />
  );
  const para = (lines: string[], y: number, color = T.text, size = 24) => (
    <Layout layout direction="column" alignItems="start" gap={4} position={[-880, y]} offset={[-1, 0]} opacity={0}>
      {lines.map(l => (
        <Txt text={l} fontFamily={T.font} fontSize={size} fill={color} />
      ))}
    </Layout>
  );
  const statement = (label: string, lines: string[], y: number, tex?: string) => (
    <Layout layout direction="column" alignItems="start" gap={4} position={[-880, y]} offset={[-1, 0]} opacity={0}>
      <Layout layout gap={12} alignItems="center">
        <Txt text={label} fontFamily={T.font} fontSize={26} fontWeight={700} fill={T.dpo} />
        <Txt text={lines[0]} fontFamily={T.font} fontSize={24} fontStyle="italic" fill={T.text} />
        {tex ? <Latex tex={tex} fill={T.text} fontSize={28} /> : null}
      </Layout>
      {lines.slice(1).map(l => (
        <Txt text={l} fontFamily={T.font} fontSize={24} fontStyle="italic" fill={T.text} />
      ))}
    </Layout>
  );

  /* ---------------- page 1: §5.1 ---------------- */
  const p1: Node[] = [
    heading('5   Theoretical Analysis of DPO', -440),
    para(['DPO bypasses both fitting an explicit reward and performing RL, using a single maximum-likelihood objective.'], -385, T.muted),
    heading('5.1   Your Language Model Is Secretly a Reward Model', -320, 30),
    (
      <Layout layout gap={16} alignItems="center" position={[-880, -245]} offset={[-1, 0]} opacity={0}>
        <Txt text="The DPO objective (Eq. 5) is a Bradley–Terry model with the reward parameterisation" fontFamily={T.font} fontSize={24} fill={T.text} />
        <Latex tex="r^*(x, y) = \beta \log \frac{\pi^*_\theta(y \mid x)}{\pi_{\mathrm{ref}}(y \mid x)}" fill={T.dpo} fontSize={32} />
      </Layout>
    ) as Node,
    para(['and we optimise the parametric model π_θ exactly as the reward-model optimisation in Eq. 2, under this change of variables.', 'Does the reparameterisation constrain the class of learned reward models? No — start with an equivalence relation:'], -160, T.muted),
    statement('Definition 1.', ['Two reward functions r(x, y) and r′(x, y) are equivalent iff'], -90, "r(x, y) - r'(x, y) = f(x) \\;\\text{ for some function } f."),
    statement('Lemma 1.', ['Under the Plackett–Luce, and in particular the Bradley–Terry, preference framework,', 'two reward functions from the same class induce the same preference distribution.'], -5),
    statement('Lemma 2.', ['Two reward functions from the same equivalence class induce the same optimal policy', 'under the constrained RL problem.'], 95),
    statement('Theorem 1.', ['Under mild assumptions, all reward classes consistent with the Plackett–Luce (and Bradley–Terry)', 'models can be represented with the reparameterisation'], 200, undefined),
    (
      <Layout layout gap={14} alignItems="center" position={[-880, 295]} offset={[-1, 0]} opacity={0}>
        <Latex tex="r(x, y) = \beta \log \frac{\pi(y \mid x)}{\pi_{\mathrm{ref}}(y \mid x)}" fill={T.dpo} fontSize={30} />
        <Txt text="for some model π(y | x) and a given reference model π_ref(y | x)." fontFamily={T.font} fontSize={24} fontStyle="italic" fill={T.text} />
      </Layout>
    ) as Node,
    para(['So the first lemma is the well-known under-specification of Plackett–Luce models; the second says every reward in a class yields', 'the same optimal policy — for the final objective we only need to recover an arbitrary reward function from the optimal class.'], 385, T.muted, 22),
  ];
  const page1 = (<Node>{p1}</Node>) as Node;
  view.add(page1);
  yield* sequence(0.55, ...p1.map(n => n.opacity(1, 0.45)));
  yield* waitFor(3);
  yield* fadeOut(page1, 0.5);

  /* ---------------- page 2: proof sketch, eq. 8–9, §5.2 ---------------- */
  const p2: Node[] = [
    heading('Proof sketch.', -440, 28),
    para(['Consider any reward function r(x, y) with optimal model π_r(y | x) (Eq. 4). Define the projection f as'], -395, T.text),
    (
      <Node position={[0, -320]} opacity={0}>
        <Latex tex="f(r; \pi_{\mathrm{ref}}, \beta)(x, y) = r(x, y) - \beta \log \sum_y \pi_{\mathrm{ref}}(y \mid x) \exp\Big(\frac{1}{\beta} r(x, y)\Big)" fill={T.text} fontSize={34} />
        <Txt text="(8)" fontFamily={T.font} fontSize={24} fill={T.muted} position={[860, 0]} />
      </Node>
    ) as Node,
    para(['f normalises the reward with the log of the partition function of π_r. The added term depends only on the prefix x, so f(r; π_ref, β)', 'is in the equivalence class of r. Replacing r with the RHS of Eq. 5 (which holds for any reward) gives'], -240, T.muted, 22),
    (
      <Layout layout gap={16} alignItems="center" position={[0, -160]} opacity={0}>
        <Latex tex="f(r; \pi_{\mathrm{ref}}, \beta)(x, y) = \beta \log \frac{\pi_r(y \mid x)}{\pi_{\mathrm{ref}}(y \mid x)}" fill={T.dpo} fontSize={32} />
        <Txt text="— the projection produces a member of the class of r with the desired form.  ∎" fontFamily={T.font} fontSize={23} fill={T.text} />
      </Layout>
    ) as Node,
    para(['Alternatively, Theorem 1 specifies exactly which reward within each equivalence class the DPO reparameterisation selects:'], -90, T.text),
    (
      <Node position={[0, -25]} opacity={0}>
        <Latex tex="\sum_y \pi_{\mathrm{ref}}(y \mid x) \exp\Big(\frac{1}{\beta} r(x, y)\Big) = 1" fill={T.text} fontSize={34} />
        <Txt text="(9)" fontFamily={T.font} fontSize={24} fill={T.muted} position={[860, 0]} />
        <Txt text="= π(y | x) using the Thm. 1 reparameterisation — i.e. π is a valid distribution (positive, sums to 1)" fontFamily={T.font} fontSize={21} fill={T.muted} y={62} />
      </Node>
    ) as Node,
    heading('5.2   Instability of Actor-Critic Algorithms', 90, 30),
    para(['Minimise D_KL[π_θ(y|x) ‖ π*(y|x)] with π* the optimal policy induced by r_φ (control as inference). With some algebra this gives the objective'], 136, T.muted, 22),
    (
      <Node position={[0, 225]} opacity={0}>
        <Layout layout direction="row" gap={8} alignItems="center">
          <Latex tex="\max_{\pi_\theta}\; \mathbb{E}_{\pi_\theta(y \mid x)}\Big[" fill={T.text} fontSize={32} />
          <Latex tex="r_\phi(x, y) - \beta \log \sum_y \pi_{\mathrm{ref}}(y \mid x) \exp\Big(\frac{1}{\beta} r_\phi(x, y)\Big)" fill={T.yellow} fontSize={32} />
          <Latex tex="-" fill={T.text} fontSize={32} />
          <Latex tex="\beta \log \frac{\pi_\theta(y \mid x)}{\pi_{\mathrm{ref}}(y \mid x)}" fill={T.reward} fontSize={32} />
          <Latex tex="\Big]" fill={T.text} fontSize={32} />
        </Layout>
        <Txt text="(10)" fontFamily={T.font} fontSize={24} fill={T.muted} position={[880, 0]} />
        <Txt text="f(r_φ, π_ref, β)" fontFamily={T.font} fontSize={22} fill={T.yellow} position={[-60, 62]} />
        <Txt text="KL" fontFamily={T.font} fontSize={22} fill={T.reward} position={[560, 62]} />
      </Node>
    ) as Node,
    para(['This is the same objective optimised with PPO, but with the reward normalised by the soft value function of the reference policy.', 'PPO must learn that baseline (a value function) to stabilise its gradients; DPO’s reparameterisation yields a reward that needs no baseline.'], 355, T.muted, 22),
  ];
  const page2 = (<Node>{p2}</Node>) as Node;
  view.add(page2);
  yield* sequence(0.6, ...p2.map(n => n.opacity(1, 0.45)));
  yield* waitFor(3.5);
});
