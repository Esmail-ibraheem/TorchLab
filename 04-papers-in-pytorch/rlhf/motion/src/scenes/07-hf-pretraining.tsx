import {Layout, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {dim, fadeIn} from '../lib/anim';
import {buildPipeline, resetPanel} from '../lib/hf';
import {addTitle} from '../lib/ui';
import {T} from '../theme';

/** rlhf_step11 — phase 1: language model pretraining. */
export default makeScene2D(function* (view) {
  const title = addTitle(view, '1. Language Model Pretraining');
  const {node, pipe} = buildPipeline();
  view.add(node);
  pipe.root().y(40);

  // start from the full figure with phases 2 & 3 dimmed…
  pipe.p2.root().opacity(0.18);
  pipe.p3.root().opacity(0.18);
  resetPanel(pipe.p1);

  yield* title.opacity(1, 0.5);
  yield* waitFor(0.4);
  // …then zoom into phase 1
  yield* all(
    pipe.root().scale(1.7, 1.0, easeInOutCubic),
    pipe.root().position([640 * 1.7 - 40, 60], 1.0, easeInOutCubic),
    ...pipe.seps.map(s => s.opacity(0, 0.6)),
  );
  yield* dim([pipe.p2.root(), pipe.p3.root()], 0, 0.3);

  const p = pipe.p1;
  yield* p.items[0].opacity(1, 0.4); // dataset
  yield* p.arrows[0].end(1, 0.7);
  yield* p.items[1].opacity(1, 0.4); // initial LM
  yield* waitFor(0.4);
  yield* p.arrows[1].end(1, 0.6);
  yield* p.items[2].opacity(1, 0.4); // human augmented text (optional)
  yield* p.arrows[2].end(1, 0.6);
  yield* waitFor(0.6);

  // notes from the text
  const notes = createRef<Layout>();
  view.add(
    <Layout ref={notes} layout direction="column" gap={12} alignItems="start" position={[-930, 305]} offset={[-1, -1]} opacity={0}>
      <Txt text="Common training techniques in NLP:" fontFamily={T.font} fontSize={28} fontWeight={700} fill={T.text} />
      <Txt text="•  unsupervised sequence prediction" fontFamily={T.font} fontSize={26} fill={T.text} />
      <Txt text="•  data scraped from the web" fontFamily={T.font} fontSize={26} fill={T.text} />
      <Txt text="•  no single answer on the “best” model size — industry examples range 10B – 280B parameters" fontFamily={T.font} fontSize={26} fill={T.text} />
      <Txt text="   (OpenAI: a smaller GPT-3 for InstructGPT · Anthropic: 10M – 52B · DeepMind: 280B Gopher)" fontFamily={T.font} fontSize={24} fill={T.muted} />
    </Layout>,
  );
  yield* all(pipe.root().position([640 * 1.7 - 40, -85], 0.8, easeInOutCubic), pipe.root().scale(1.45, 0.8, easeInOutCubic));
  const rows = notes().children();
  for (const r of rows) r.opacity(0);
  notes().opacity(1);
  yield* sequence(0.35, ...rows.map(r => r.opacity(1, 0.4)));
  yield* waitFor(2);
});
