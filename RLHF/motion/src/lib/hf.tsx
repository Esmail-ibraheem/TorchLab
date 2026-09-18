import {Circle, Latex, Layout, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import {createRef, Reference} from '@motion-canvas/core';
import {bendPoints} from './anim';
import {Keyboard, PageStack} from './icons';
import {NeuralNet} from './ui';
import {T} from '../theme';

/**
 * The Hugging Face "three phases of RLHF" figure (rlhf3.png family).
 * Built once so the overview clip and the three per-phase clips share geometry.
 *
 * Each panel is laid out in its own local frame (~600 x 480) and placed at
 * x = -640 / 0 / 640. Everything that should animate is returned as a ref.
 */

const green = '#1d3d2a';
const greenStroke = '#5cc47a';
const red = '#3d1d24';
const redStroke = '#ef6f7f';
const blueBox = '#1a2c48';
const blueStroke = '#6fa3f7';
const grayBox = '#23232d';
const grayStroke = '#7a7a8c';
const nnColors = [T.policy, '#5cc47a', T.yellow];

export interface Panel {
  root: Reference<Node>;
  title: Reference<Txt>;
  items: Node[]; // things that pop in, in narrative order
  arrows: Line[]; // arrows that draw, in narrative order
}

export interface Pipeline {
  root: Reference<Node>;
  p1: Panel;
  p2: Panel;
  p3: Panel;
  seps: Line[];
}

function lmBox(label: string[], w: number, h: number, extra?: any) {
  return (
    <Rect width={w} height={h} radius={16} fill={green} stroke={greenStroke} lineWidth={3}>
      <Layout layout direction="column" alignItems="center" y={-h / 2 + 22}>
        {label.map(l => (
          <Txt text={l} fontFamily={T.font} fontSize={17} fontWeight={700} fill={T.text} />
        ))}
      </Layout>
      <NeuralNet layerColors={nnColors} color="#8a8aa0" width={110} height={80} y={10} nodeSize={12} layers={[3, 4, 3]} />
      {extra}
    </Rect>
  );
}

export function buildPipeline(): {node: Node; pipe: Pipeline} {
  const root = createRef<Node>();
  const p1 = createRef<Node>();
  const p2 = createRef<Node>();
  const p3 = createRef<Node>();
  const t1 = createRef<Txt>();
  const t2 = createRef<Txt>();
  const t3 = createRef<Txt>();
  const items1: Node[] = [], arrows1: Line[] = [];
  const items2: Node[] = [], arrows2: Line[] = [];
  const items3: Node[] = [], arrows3: Line[] = [];
  const seps: Line[] = [];
  const i1 = (n: Node) => items1.push(n);
  const a1 = (l: Line) => arrows1.push(l);
  const i2 = (n: Node) => items2.push(n);
  const a2 = (l: Line) => arrows2.push(l);
  const i3 = (n: Node) => items3.push(n);
  const a3 = (l: Line) => arrows3.push(l);

  const arrow = (props: any) => <Line stroke={T.line} lineWidth={3} endArrow arrowSize={12} lineCap="round" {...props} />;
  const small = (text: string, x: number, y: number, size = 15, color = T.text, weight = 400) => (
    <Txt text={text} fontFamily={T.font} fontSize={size} fill={color} fontWeight={weight} position={[x, y]} />
  );

  const node = (
    <Node ref={root}>
      {/* separators */}
      <Line ref={l => seps.push(l)} points={[[-320, -210], [-320, 240]]} stroke={T.text} lineWidth={5} />
      <Line ref={l => seps.push(l)} points={[[320, -210], [320, 240]]} stroke={T.text} lineWidth={5} />

      {/* ============================ panel 1 ============================ */}
      <Node ref={p1} x={-640}>
        <Txt ref={t1} text="Language Model Pretraining" fontFamily={T.font} fontSize={34} fill={T.text} y={-250} />
        <Node ref={i1}>
          {small('Prompts & Text Dataset', -170, -130, 15, T.text, 700)}
          <PageStack x={-170} y={-60} width={110} height={80} />
        </Node>
        {arrow({ref: a1, points: [[-170, -10], [-170, 40], [45, 40]]})}
        <Node ref={i1} x={150} y={20}>
          {small('Train Language Model', 0, -120, 15, T.text, 700)}
          {lmBox(['Initial Language Model'], 200, 170)}
        </Node>
        <Node ref={i1} x={0} y={170}>
          <Rect width={210} height={120} radius={8} fill={grayBox} stroke={grayStroke} lineWidth={2} />
          <Keyboard y={-18} color={T.text} />
          {small('Human Augmented', 0, 30, 14, T.text, 700)}
          {small('Text (Optional)', 0, 48, 14, T.text, 700)}
        </Node>
        {arrow({ref: a1, points: [[-170, 40], [-170, 170], [-110, 170]], lineDash: [8, 8], stroke: T.muted})}
        {arrow({ref: a1, points: [[110, 170], [150, 170], [150, 110]], lineDash: [8, 8], stroke: T.muted})}
      </Node>

      {/* ============================ panel 2 ============================ */}
      <Node ref={p2} x={0}>
        <Txt ref={t2} text="Reward Model Training" fontFamily={T.font} fontSize={34} fill={T.text} y={-250} />
        <Node ref={i2}>
          {small('Prompts Dataset', -200, -190, 15, T.text, 700)}
          <PageStack x={-200} y={-125} width={110} height={80} />
        </Node>
        <Node ref={i2}>
          {small('Sample many prompts', -200, -55, 14, T.muted)}
          {[-262, -237, -212, -187, -162, -137].map(x => arrow({ref: a2, points: [[x, -40], [x, -5]], lineWidth: 2, arrowSize: 8, stroke: T.muted}))}
        </Node>
        <Node ref={i2} x={-200} y={80}>
          {lmBox(['Initial Language Model'], 200, 140)}
        </Node>
        <Node ref={i2} x={-40} y={70}>
          {['Lorem ipsum dolor', 'sit amet, consectetur', 'adipiscing elit. Aenean', 'vulputate egest, arcu', 'Donec quam felis,', 'Nam quam nunc,', 'eros faucibus tincid'].map((l, i) => small(l, 0, -55 + i * 16, 11, T.muted))}
          {small('Generated text', 0, 78, 12, T.text, 700)}
        </Node>
        <Node ref={i2} x={100} y={70}>
          <Rect width={110} height={110} radius={8} fill={grayBox} stroke={grayStroke} lineWidth={2} />
          <Rect width={44} height={54} radius={4} stroke={T.text} lineWidth={2} y={-18} />
          {[-30, -20, -10, 0].map(y => <Line points={[[-14, y], [14, y]]} stroke={T.text} lineWidth={2} />)}
          <Txt text="✎" fontSize={22} fill={T.agent} x={18} y={-2} />
          {small('Human Scoring', 0, 40, 12, T.text, 700)}
        </Node>
        <Node ref={i2} x={235} y={70}>
          {small('Outputs are ranked', 0, -80, 12, T.text, 700)}
          {small('(relative, ELO, etc.)', 0, -64, 12, T.text, 700)}
          {['#5cc47a', '#9fd36a', '#d9d45e', '#e7b04f', '#e88a4f', '#e26a5e', '#ef6f7f'].map((c, i) => (
            <Rect width={110} height={14} radius={4} fill={c} y={-45 + i * 19} />
          ))}
        </Node>
        {[-45, -26, -7, 12, 31, 50, 69].map(y => arrow({ref: a2, points: [[160, 45], [180, y + 70]], lineWidth: 1.5, arrowSize: 6, stroke: T.muted}))}
        <Node ref={i2} x={190} y={-140}>
          <Rect width={200} height={120} radius={16} fill={red} stroke={redStroke} lineWidth={3} />
          {small('Reward (Preference)', 0, -42, 15, T.text, 700)}
          {small('Model', 0, -25, 15, T.text, 700)}
          <NeuralNet color={redStroke} width={90} height={60} y={18} nodeSize={10} layers={[3, 4, 2]} />
          <Txt text="text" fontFamily={T.font} fontSize={12} fill={T.muted} x={-78} y={18} rotation={-90} />
          <Latex tex="r_\theta" fill={T.text} fontSize={24} x={75} y={18} />
        </Node>
        {arrow({ref: a2, points: bendPoints([90, 0], [70, -110], [85, -140]), lineWidth: 3, arrowSize: 12})}
        <Node ref={i2}>
          {small('Train on', -20, -110, 12, T.text, 700)}
          {small('{sample, reward} pairs', 10, -95, 12, T.muted)}
        </Node>
      </Node>

      {/* ============================ panel 3 ============================ */}
      <Node ref={p3} x={640}>
        <Txt ref={t3} text="Fine-tuning with RL" fontFamily={T.font} fontSize={34} fill={T.text} y={-250} />
        <Node ref={i3}>
          {small('Prompts Dataset', -90, -205, 13, T.text, 700)}
          <PageStack x={-90} y={-168} width={90} height={55} count={4} />
          {small('x: A dog is…', -90, -125, 12, T.muted)}
        </Node>
        {arrow({ref: a3, points: [[-140, -175], [-190, -175], [-190, -120]], lineWidth: 2, arrowSize: 9, stroke: T.muted})}
        {arrow({ref: a3, points: [[-40, -175], [10, -175], [10, -120]], lineWidth: 2, arrowSize: 9, stroke: T.muted})}
        <Node ref={i3} x={-190} y={-10}>
          <Rect width={185} height={210} radius={16} fill={green} stroke={greenStroke} lineWidth={3} />
          {small('Initial Language Model', 0, -88, 13, T.text, 700)}
          <NeuralNet layerColors={nnColors} color="#8a8aa0" width={90} height={60} y={-38} nodeSize={10} />
          {arrow({ref: a3, points: [[0, 0], [0, 22]], lineWidth: 2, arrowSize: 8, stroke: T.muted})}
          <Rect width={150} height={60} radius={8} fill={T.panel} stroke={grayStroke} lineWidth={1.5} y={62} />
          {small('Base Text', -35, 50, 11, T.text)}
          {[0, 1, 2, 3].map(i => <Circle size={7} fill={T.policy} x={22 + i * 11} y={50} />)}
          {small('y: a furry mammal', 0, 76, 12, T.policy)}
        </Node>
        <Node ref={i3} x={10} y={-10}>
          <Rect width={185} height={210} radius={16} fill={grayBox} stroke={grayStroke} lineWidth={3} />
          {small('Tuned Language', 0, -92, 13, T.text, 700)}
          {small('Model (RL Policy)', 0, -76, 13, T.text, 700)}
          {small('Parameters Frozen*', -45, -58, 9, T.policy)}
          <NeuralNet color="#8a8aa0" width={90} height={60} y={-30} nodeSize={10} />
          {arrow({ref: a3, points: [[0, 6], [0, 24]], lineWidth: 2, arrowSize: 8, stroke: T.muted})}
          <Rect width={150} height={60} radius={8} fill={T.panel} stroke={grayStroke} lineWidth={1.5} y={62} />
          {small('RLHF', -45, 44, 10, T.text)}
          {small('Tuned Text', -35, 57, 10, T.text)}
          {[0, 1, 2, 3].map(i => <Circle size={7} fill={T.purple} x={22 + i * 11} y={50} />)}
          {small("y: man's best friend", 0, 76, 12, T.purple)}
        </Node>
        <Node ref={i3} x={215} y={45}>
          <Rect width={150} height={110} radius={14} fill={red} stroke={redStroke} lineWidth={3} />
          {small('Reward (Preference)', 0, -38, 12, T.text, 700)}
          {small('Model', 0, -24, 12, T.text, 700)}
          <NeuralNet color={redStroke} width={70} height={46} y={14} nodeSize={8} layers={[3, 4, 2]} />
          <Txt text="text" fontFamily={T.font} fontSize={10} fill={T.muted} x={-58} y={14} rotation={-90} />
          <Latex tex="r_\theta" fill={T.text} fontSize={18} x={55} y={14} />
        </Node>
        {arrow({ref: a3, points: [[103, 50], [138, 50]], lineWidth: 2, arrowSize: 9, stroke: T.purple})}
        <Node ref={i3} x={205} y={-155}>
          <Rect width={185} height={95} radius={10} fill={blueBox} stroke={blueStroke} lineWidth={2} />
          {small('Reinforcement Learning', 0, -30, 12, T.text, 700)}
          {small('Update (e.g. PPO)', 0, -15, 12, T.text, 700)}
          <Latex tex="\theta \leftarrow \theta + \nabla_\theta J(\theta)" fill={T.text} fontSize={20} y={18} />
        </Node>
        <Node ref={i3} x={-70} y={195}>
          <Rect width={330} height={80} radius={8} fill={T.panel} stroke={grayStroke} lineWidth={1.5} />
          <Latex tex="-\lambda_{\mathrm{KL}} D_{\mathrm{KL}}\big(\pi_{\mathrm{PPO}}(y \mid x)\ \|\ \pi_{\mathrm{base}}(y \mid x)\big)" fill={T.text} fontSize={17} y={-10} />
          {small('KL prediction shift penalty', -70, 22, 12, T.muted)}
        </Node>
        <Node ref={i3} x={215} y={195}>
          <Circle size={36} fill={T.panel} stroke={T.text} lineWidth={2} />
          <Txt text="+" fontFamily={T.font} fontSize={26} fill={T.text} y={-2} />
          <Latex tex="r_\theta(y \mid x)" fill={T.text} fontSize={18} y={40} />
        </Node>
        {/* base text & tuned text → KL box (crossing) */}
        {arrow({ref: a3, points: [[-160, 100], [-10, 155]], lineWidth: 2, arrowSize: 8, stroke: '#5cc47a'})}
        {arrow({ref: a3, points: [[40, 100], [-110, 155]], lineWidth: 2, arrowSize: 8, stroke: T.purple})}
        {/* RM → +, KL → +, + → RL update, RL update → tuned LM */}
        {arrow({ref: a3, points: [[215, 100], [215, 172]], lineWidth: 2, arrowSize: 9})}
        {arrow({ref: a3, points: [[95, 195], [193, 195]], lineWidth: 2, arrowSize: 9})}
        {arrow({ref: a3, points: bendPoints([236, 195], [292, 150], [292, -105]), lineWidth: 2, arrowSize: 9})}
        {arrow({ref: a3, points: [[112, -155], [70, -155], [70, -115]], lineWidth: 2, arrowSize: 9})}
      </Node>
    </Node>
  ) as Node;

  return {
    node,
    pipe: {
      root,
      seps,
      p1: {root: p1, title: t1, items: items1, arrows: arrows1},
      p2: {root: p2, title: t2, items: items2, arrows: arrows2},
      p3: {root: p3, title: t3, items: items3, arrows: arrows3},
    },
  };
}

/** Hide a panel's parts so a scene can animate them in. */
export function resetPanel(p: Panel) {
  for (const n of p.items) n.opacity(0);
  for (const a of p.arrows) a.end(0);
}
