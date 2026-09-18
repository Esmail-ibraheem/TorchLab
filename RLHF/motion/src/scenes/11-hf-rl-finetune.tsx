import {Latex, Layout, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {dim} from '../lib/anim';
import {buildPipeline, resetPanel} from '../lib/hf';
import {addTitle} from '../lib/ui';
import {T} from '../theme';

/** Pasted image 20240429132323 — phase 3: fine-tuning with RL. */
export default makeScene2D(function* (view) {
  const title = addTitle(view, '3. Fine-tuning with RL');
  const {node, pipe} = buildPipeline();
  view.add(node);
  pipe.root().y(40);

  pipe.p1.root().opacity(0.18);
  pipe.p2.root().opacity(0.18);
  resetPanel(pipe.p3);

  yield* title.opacity(1, 0.5);
  yield* waitFor(0.4);
  yield* all(
    pipe.root().scale(1.7, 1.0, easeInOutCubic),
    pipe.root().position([-640 * 1.7 + 40, 60], 1.0, easeInOutCubic),
    ...pipe.seps.map(s => s.opacity(0, 0.6)),
  );
  yield* dim([pipe.p1.root(), pipe.p2.root()], 0, 0.3);

  const p = pipe.p3;
  const [dataset, initLM, tunedLM, rm, rlUpdate, klBox, plus] = p.items;
  const [toInit, toTuned, initOut, tunedOut, tunedToRM, baseToKL, tunedToKL, rmToPlus, klToPlus, plusToRL, rlToTuned] = p.arrows;

  yield* dataset.opacity(1, 0.4);
  yield* all(toInit.end(1, 0.5), toTuned.end(1, 0.5));
  yield* all(initLM.opacity(1, 0.4), tunedLM.opacity(1, 0.4));
  yield* all(initOut.end(1, 0.4), tunedOut.end(1, 0.4));
  yield* waitFor(0.3);
  yield* tunedToRM.end(1, 0.5);
  yield* rm.opacity(1, 0.4);
  yield* rmToPlus.end(1, 0.5);
  yield* plus.opacity(1, 0.4);
  yield* waitFor(0.3);
  yield* all(baseToKL.end(1, 0.6), tunedToKL.end(1, 0.6));
  yield* klBox.opacity(1, 0.5);
  yield* klToPlus.end(1, 0.5);
  yield* waitFor(0.3);
  yield* plusToRL.end(1, 0.8);
  yield* rlUpdate.opacity(1, 0.4);
  yield* rlToTuned.end(1, 0.6);
  yield* waitFor(0.8);

  const notes = createRef<Layout>();
  view.add(
    <Layout ref={notes} layout direction="column" gap={10} alignItems="start" position={[-930, 300]} offset={[-1, -1]} opacity={0}>
      <Layout layout gap={18} alignItems="center">
        <Txt text="Final reward sent to the RL update:" fontFamily={T.font} fontSize={27} fontWeight={700} fill={T.text} />
        <Latex tex="r = r_\theta - \lambda\, r_{\mathrm{KL}}" fill={T.reward} fontSize={38} />
      </Layout>
      <Txt text="•  policy = a copy of the initial LM, some parameters frozen (fine-tuning 10B–100B+ params is expensive → LoRA)" fontFamily={T.font} fontSize={24} fill={T.text} />
      <Txt text="•  action space = the vocabulary (~50k tokens) · observation space = all input token sequences" fontFamily={T.font} fontSize={24} fill={T.text} />
      <Txt text="•  the KL penalty keeps the policy near the frozen model — otherwise it emits gibberish that fools the reward model" fontFamily={T.font} fontSize={24} fill={T.text} />
      <Txt text="•  the initial model only produces probabilities for the KL term; it is never updated" fontFamily={T.font} fontSize={24} fill={T.muted} />
    </Layout>,
  );
  yield* all(pipe.root().position([-640 * 1.7 + 40, -90], 0.8, easeInOutCubic), pipe.root().scale(1.45, 0.8, easeInOutCubic));
  const rows = notes().children();
  for (const r of rows) r.opacity(0);
  notes().opacity(1);
  yield* sequence(0.35, ...rows.map(r => r.opacity(1, 0.4)));
  yield* waitFor(2);
});
