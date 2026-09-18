import {Latex, Layout, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {draw, fadeIn, pop} from '../lib/anim';
import {Token} from '../lib/icons';
import {DocIcon, HumanIcon, NeuralNet, addTitle} from '../lib/ui';
import {T} from '../theme';

/** The reward-model loss: K ranked responses → (K choose 2) comparisons → log σ(r_w − r_l). */
export default makeScene2D(function* (view) {
  const title = addTitle(view, 'Reward modeling — the loss function');
  yield* title.opacity(1, 0.5);

  const K = 4;
  const prompt = createRef<Node>();
  const docs: Node[] = [];
  const human = createRef<Node>();
  const ranking = createRef<Latex>();
  const pairs: Node[] = [];
  const arrows: Line[] = [];
  const rm = createRef<Rect>();
  const kLabel = createRef<Txt>();
  const pairsLabel = createRef<Txt>();
  const sampleLabel = createRef<Latex>();

  const pairList: [number, number][] = [];
  for (let i = 0; i < K; i++) for (let j = i + 1; j < K; j++) pairList.push([i, j]);

  view.add(
    <>
      {/* prompt */}
      <Node ref={prompt} position={[-780, -300]} scale={0}>
        <Token text="prompt  x" color={T.env} />
      </Node>
      <Line ref={a => arrows.push(a)} points={[[-680, -300], [-600, -300]]} stroke={T.line} lineWidth={4} endArrow arrowSize={14} end={0} />
      {/* K responses */}
      {Array.from({length: K}, (_, i) => (
        <Node ref={n => docs.push(n)} position={[-520 + i * 120, -300]} scale={0}>
          <DocIcon color={T.policy} width={60} height={76} />
          <Latex tex={`y_${i + 1}`} fill={T.text} fontSize={30} y={62} />
        </Node>
      ))}
      <Txt ref={kLabel} text="K = 4 … 9 responses per prompt" fontFamily={T.font} fontSize={24} fill={T.muted} position={[-340, -390]} opacity={0} />
      {/* labeler ranks */}
      <Line ref={a => arrows.push(a)} points={[[-70, -300], [20, -300]]} stroke={T.line} lineWidth={4} endArrow arrowSize={14} end={0} />
      <Node ref={human} position={[90, -300]} scale={0}>
        <HumanIcon color={T.purple} size={80} />
      </Node>
      <Latex ref={ranking} tex="y_2 \succ y_4 \succ y_1 \succ y_3" fill={T.purple} fontSize={40} position={[330, -300]} opacity={0} />

      {/* pairs */}
      <Txt ref={pairsLabel} text={`all  (K choose 2) = ${pairList.length}  comparisons  →  one batch element`} fontFamily={T.font} fontSize={26} fill={T.text} position={[-420, -160]} opacity={0} />
      {pairList.map(([i, j], k) => {
        // preferred is whichever ranks higher in y2 ≻ y4 ≻ y1 ≻ y3
        const order = [2, 4, 1, 3];
        const a = i + 1, b = j + 1;
        const w = order.indexOf(a) < order.indexOf(b) ? a : b;
        const l = w === a ? b : a;
        return (
          <Node ref={n => pairs.push(n)} position={[-820 + k * 150, -80]} scale={0}>
            <Rect width={130} height={60} radius={12} fill={T.panel} stroke={T.panelStroke} lineWidth={2} />
            <Latex tex={`y_${w} \\succ y_${l}`} fill={T.text} fontSize={28} />
          </Node>
        );
      })}
      <Latex ref={sampleLabel} tex="(x,\; y_w,\; y_l) \sim \mathcal{D}" fill={T.muted} fontSize={32} position={[240, -80]} opacity={0} />

      {/* reward model */}
      <Rect ref={rm} position={[720, -110]} width={310} height={190} radius={22} fill={T.panel} stroke={T.reward} lineWidth={4} scale={0}>
        <Txt text="Reward model" fontFamily={T.font} fontSize={26} fill={T.reward} y={-64} />
        <NeuralNet color={T.reward} width={110} height={80} x={-55} y={0} layers={[3, 4, 1]} />
        <Txt text="SFT model, unembedding layer removed" fontFamily={T.font} fontSize={16} fill={T.muted} y={70} />
        <Latex tex="r_\theta(x, y)" fill={T.text} fontSize={28} x={75} y={0} />
      </Rect>
    </>,
  );

  const eq = createRef<Latex>();
  view.add(<Latex ref={eq} tex="{{r_\theta(x, y)}}" fill={T.text} fontSize={52} position={[0, 110]} opacity={0} />);
  const note = createRef<Txt>();
  view.add(<Txt ref={note} text="" fontFamily={T.font} fontSize={28} fill={T.muted} position={[0, 200]} />);
  const legend = createRef<Layout>();
  view.add(
    <Layout ref={legend} layout direction="column" gap={10} alignItems="start" position={[-900, 300]} offset={[-1, -1]} opacity={0}>
      <Layout layout gap={14} alignItems="center"><Latex tex="r_\theta(x,y)" fill={T.text} fontSize={30} /><Txt text="scalar output of the reward model for prompt x and completion y, parameters θ" fontFamily={T.font} fontSize={25} fill={T.text} /></Layout>
      <Layout layout gap={14} alignItems="center"><Latex tex="y_w" fill={T.text} fontSize={30} /><Txt text="the preferred completion of the pair,  " fontFamily={T.font} fontSize={25} fill={T.text} /><Latex tex="y_l" fill={T.text} fontSize={30} /><Txt text="the dispreferred one" fontFamily={T.font} fontSize={25} fill={T.text} /></Layout>
      <Layout layout gap={14} alignItems="center"><Latex tex="\mathcal{D}" fill={T.text} fontSize={30} /><Txt text="the dataset of human comparisons" fontFamily={T.font} fontSize={25} fill={T.text} /></Layout>
      <Txt text="training on all (K choose 2) comparisons of a prompt as one batch element: a single forward pass per completion, and no overfitting" fontFamily={T.font} fontSize={23} fill={T.muted} />
    </Layout>,
  );

  yield* pop(prompt());
  yield* draw(arrows[0], 0.4);
  yield* all(sequence(0.12, ...docs.map(d => pop(d, 0.4))), fadeIn(kLabel()));
  yield* draw(arrows[1], 0.4);
  yield* pop(human());
  yield* fadeIn(ranking());
  yield* waitFor(0.4);
  yield* fadeIn(pairsLabel());
  yield* sequence(0.1, ...pairs.map(p => pop(p, 0.4)));
  yield* fadeIn(sampleLabel());
  yield* pop(rm());
  yield* waitFor(0.4);

  // build the loss step by step
  yield* fadeIn(eq());
  note().text('the reward model outputs a scalar for (prompt, completion)');
  yield* waitFor(1.2);
  yield* eq().tex('{{r_\\theta(x, y_w)}} - {{r_\\theta(x, y_l)}}', 0.8);
  note().text('the difference in rewards is the log-odds that a labeler prefers y_w over y_l');
  yield* waitFor(1.4);
  yield* eq().tex('\\log\\Big(\\sigma\\big({{r_\\theta(x, y_w)}} - {{r_\\theta(x, y_l)}}\\big)\\Big)', 0.8);
  note().text('cross-entropy with the comparison as the label');
  yield* waitFor(1.2);
  yield* eq().tex(
    '\\mathrm{loss}(\\theta) = -\\frac{1}{\\binom{K}{2}}\\; \\mathbb{E}_{(x, y_w, y_l) \\sim \\mathcal{D}}\\Big[\\log\\Big(\\sigma\\big({{r_\\theta(x, y_w)}} - {{r_\\theta(x, y_l)}}\\big)\\Big)\\Big]',
    1.0,
  );
  note().text('averaged over all comparisons of every prompt in the dataset');
  yield* waitFor(0.6);
  yield* fadeIn(legend());
  yield* waitFor(2.5);
});
