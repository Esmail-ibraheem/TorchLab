import {Latex, Layout, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {dim} from '../lib/anim';
import {buildPipeline, resetPanel} from '../lib/hf';
import {addTitle} from '../lib/ui';
import {T} from '../theme';

/** rlhf_step22 — phase 2: reward model training. */
export default makeScene2D(function* (view) {
  const title = addTitle(view, '2. Reward Model Training');
  const {node, pipe} = buildPipeline();
  view.add(node);
  pipe.root().y(40);

  pipe.p1.root().opacity(0.18);
  pipe.p3.root().opacity(0.18);
  resetPanel(pipe.p2);

  yield* title.opacity(1, 0.5);
  yield* waitFor(0.4);
  yield* all(
    pipe.root().scale(1.7, 1.0, easeInOutCubic),
    pipe.root().position([0, 60], 1.0, easeInOutCubic),
    ...pipe.seps.map(s => s.opacity(0, 0.6)),
  );
  yield* dim([pipe.p1.root(), pipe.p3.root()], 0, 0.3);

  const p = pipe.p2;
  // items: 0 dataset, 1 "sample many prompts", 2 initial LM, 3 generated text, 4 human scoring, 5 ranked bars, 6 reward model, 7 "train on pairs"
  // arrows: 0-5 sampling arrows, 6-12 fan-out to bars, 13 train curve
  yield* p.items[0].opacity(1, 0.4);
  yield* all(p.items[1].opacity(1, 0.3), sequence(0.06, ...p.arrows.slice(0, 6).map(a => a.end(1, 0.4))));
  yield* p.items[2].opacity(1, 0.4);
  yield* p.items[3].opacity(1, 0.5);
  yield* p.items[4].opacity(1, 0.4);
  yield* all(p.items[5].opacity(1, 0.5), sequence(0.05, ...p.arrows.slice(6, 13).map(a => a.end(1, 0.35))));
  yield* waitFor(0.3);
  yield* all(p.arrows[13].end(1, 0.8), p.items[7].opacity(1, 0.5));
  yield* p.items[6].opacity(1, 0.5);
  yield* waitFor(0.8);

  // the point of the phase
  const notes = createRef<Layout>();
  view.add(
    <Layout ref={notes} layout direction="column" gap={12} alignItems="start" position={[-930, 305]} offset={[-1, -1]} opacity={0}>
      <Layout layout gap={16} alignItems="center">
        <Txt text="Goal:  a model that maps" fontFamily={T.font} fontSize={28} fontWeight={700} fill={T.text} />
        <Latex tex="\text{input text} \;\longrightarrow\; \text{scalar reward}" fill={T.reward} fontSize={34} />
      </Layout>
      <Txt text="•  humans rank outputs instead of scoring them — direct scores are uncalibrated and noisy" fontFamily={T.font} fontSize={25} fill={T.text} />
      <Txt text="•  head-to-head comparisons → Elo → normalised into a scalar reward signal" fontFamily={T.font} fontSize={25} fill={T.text} />
      <Txt text="•  reward LMs vary in size: OpenAI 175B LM / 6B RM · Anthropic 10B – 52B · DeepMind 70B Chinchilla for both" fontFamily={T.font} fontSize={24} fill={T.muted} />
    </Layout>,
  );
  yield* all(pipe.root().position([0, -85], 0.8, easeInOutCubic), pipe.root().scale(1.45, 0.8, easeInOutCubic));
  const rows = notes().children();
  for (const r of rows) r.opacity(0);
  notes().opacity(1);
  yield* sequence(0.35, ...rows.map(r => r.opacity(1, 0.4)));
  yield* waitFor(2);
});
