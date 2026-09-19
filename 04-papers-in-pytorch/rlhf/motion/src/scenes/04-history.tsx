import {Layout, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {bendPoints, drawAll, fadeIn, fadeOut, popAll} from '../lib/anim';
import {Arrow, Box, DashedArrow, DocIcon, HumanIcon, NeuralNet, addTitle} from '../lib/ui';
import {T} from '../theme';

/**
 * History — RLHF for decision making:
 *  A. TAMER (pre deep RL)          B. Christiano et al. 2017 (deep RL)
 *  C. consensus data-collection pipeline (Bakker et al. 2022)
 *  D. the RLHF survey abstract, key sentences highlighted
 */
export default makeScene2D(function* (view) {
  const title = addTitle(view, 'History — RLHF for decision making');
  yield* title.opacity(1, 0.5);

  /* ------------------------------------------------------------------ A + B */
  const partAB = createRef<Node>();
  const tamerBoxes: Rect[] = [];
  const tamerArrows: Line[] = [];
  const deepBoxes: Rect[] = [];
  const deepArrows: Line[] = [];
  const labels: Node[] = [];

  const lbl = (text: string | string[], x: number, y: number, size = 24, color = T.text) => {
    const ls = Array.isArray(text) ? text : [text];
    return (
      <Layout ref={l => labels.push(l)} layout direction="column" alignItems="center" position={[x, y]} opacity={0}>
        {ls.map(l => (
          <Txt text={l} fontFamily={T.font} fontSize={size} fill={color} textAlign="center" />
        ))}
      </Layout>
    );
  };

  const cyan = '#bfe3e6';
  const cyanText = '#0d2a2c';

  view.add(
    <Node ref={partAB}>
      {/* ---------- A. TAMER ---------- */}
      <Txt text="Pre Deep RL" fontFamily={T.font} fontSize={40} fontWeight={700} fill={T.text} position={[-520, -440]} />
      <Box ref={b => tamerBoxes.push(b)} label="Human" color={cyan} textColor={cyanText} stroke={cyan} width={200} height={120} radius={24} position={[-780, -290]} />
      <Box ref={b => tamerBoxes.push(b)} label="Environment" color={cyan} textColor={cyanText} stroke={cyan} width={220} height={120} radius={24} position={[-360, -290]} />
      <Rect ref={b => tamerBoxes.push(b)} width={520} height={220} radius={30} fill={cyan} opacity={0.6} position={[-560, 90]} />
      <Txt text="Agent" fontFamily={T.font} fontSize={30} fill={T.text} position={[-870, 90]} />
      <Box ref={b => tamerBoxes.push(b)} labels={['Supervised', 'Learner']} color={T.panel} stroke={T.text} width={190} height={100} fontSize={26} position={[-690, 90]} />
      <Box ref={b => tamerBoxes.push(b)} labels={['Reward', 'Model']} color={T.panel} stroke={T.text} width={170} height={100} fontSize={26} position={[-420, 90]} />

      {/* sensory display: env → human */}
      <Arrow ref={a => tamerArrows.push(a)} points={[[-472, -290], [-682, -290]]} stroke={T.text} />
      {lbl(['Sensory', 'Display'], -577, -345)}
      {/* reward: human → supervised learner */}
      <Arrow ref={a => tamerArrows.push(a)} points={[[-780, -228], [-780, -20], [-690, -20], [-690, 38]]} stroke={T.text} radius={12} />
      {lbl('Reward', -830, -120)}
      {/* state: env → SL and env → RM */}
      <Arrow ref={a => tamerArrows.push(a)} points={[[-390, -228], [-390, -60], [-640, 38]]} stroke={T.text} />
      <Arrow ref={a => tamerArrows.push(a)} points={[[-420, -228], [-420, 38]]} stroke={T.text} />
      {lbl('State', -470, -120)}
      {/* action: agent → env */}
      <Arrow ref={a => tamerArrows.push(a)} points={[[-330, 38], [-330, -228]]} stroke={T.text} />
      {lbl('Action', -280, -120)}
      {/* weight update / reward prediction */}
      <Arrow ref={a => tamerArrows.push(a)} points={[[-595, 70], [-505, 70]]} stroke={T.text} lineWidth={4} arrowSize={14} />
      <Arrow ref={a => tamerArrows.push(a)} points={[[-505, 110], [-595, 110]]} stroke={T.text} lineWidth={4} arrowSize={14} />
      {lbl('Weight Update', -550, 28, 20, cyanText)}
      {lbl('Reward Prediction', -550, 152, 20, cyanText)}
      {lbl('Fig. 2. Framework for Training an Agent Manually', -560, 260, 22, T.muted)}
      {lbl('via Evaluative Reinforcement (TAMER).', -560, 290, 22, T.muted)}

      {/* ---------- B. Christiano et al. ---------- */}
      <Txt text="For Deep RL" fontFamily={T.font} fontSize={40} fontWeight={700} fill={T.text} position={[480, -440]} />
      <Box ref={b => deepBoxes.push(b)} label="REWARD PREDICTOR" color="#a244e0" stroke="#a244e0" textColor="#fff" fontSize={26} fontWeight={700} width={330} height={90} position={[470, -290]} />
      <Box ref={b => deepBoxes.push(b)} label="RL ALGORITHM" color="#4a4a5a" stroke="#4a4a5a" textColor="#fff" fontSize={26} fontWeight={700} width={260} height={150} radius={8} position={[250, 60]} />
      <Box ref={b => deepBoxes.push(b)} label="ENVIRONMENT" color="#4a4a5a" stroke="#4a4a5a" textColor="#fff" fontSize={26} fontWeight={700} width={260} height={150} radius={8} position={[740, 60]} />
      {/* human feedback → reward predictor (dotted) */}
      <DashedArrow ref={a => deepArrows.push(a)} points={[[850, -290], [645, -290]]} stroke={T.text} lineWidth={4} arrowSize={14} lineDash={[4, 10]} />
      {lbl(['HUMAN', 'FEEDBACK'], 880, -290, 24)}
      {/* observation: env → RL */}
      <Arrow ref={a => deepArrows.push(a)} points={[[608, 30], [385, 30]]} stroke={T.text} lineWidth={4} arrowSize={14} />
      {lbl('OBSERVATION', 496, 0, 22)}
      {/* action: RL → env */}
      <Arrow ref={a => deepArrows.push(a)} points={[[385, 100], [608, 100]]} stroke={T.text} lineWidth={4} arrowSize={14} />
      {lbl('ACTION', 496, 130, 22)}
      {/* env → reward predictor (curved) */}
      <Arrow ref={a => deepArrows.push(a)} points={bendPoints([690, -18], [560, -120], [520, -240])} stroke={T.text} lineWidth={4} arrowSize={14} />
      {/* reward predictor → RL (curved) */}
      <Arrow ref={a => deepArrows.push(a)} points={bendPoints([310, -290], [250, -200], [250, -20])} stroke={T.text} lineWidth={4} arrowSize={14} />
      {lbl(['PREDICTED', 'REWARD'], 120, -290, 22)}
      {lbl('Christiano, Paul F., et al. "Deep reinforcement learning from human', 560, 250, 22, T.muted)}
      {lbl('preferences." Advances in neural information processing systems 30', 560, 280, 22, T.muted)}
    </Node>,
  );

  yield* popAll(tamerBoxes, 0.12);
  yield* all(drawAll(tamerArrows, 0.1, 0.5), sequence(0.1, ...labels.slice(0, 9).map(l => l.opacity(1, 0.3))));
  yield* waitFor(0.5);
  yield* popAll(deepBoxes, 0.12);
  yield* all(drawAll(deepArrows, 0.1, 0.5), sequence(0.1, ...labels.slice(9).map(l => l.opacity(1, 0.3))));
  yield* waitFor(2);
  yield* fadeOut(partAB(), 0.5);

  /* ------------------------------------------------------------------ C. consensus pipeline */
  const partC = createRef<Node>();
  const cBoxes: Node[] = [];
  const cArrows: Line[] = [];
  const cLabels: Node[] = [];

  const stepBox = (n: string, text: string[], x: number, y: number, w: number, h: number, children?: any) => (
    <Rect ref={b => cBoxes.push(b)} width={w} height={h} radius={22} fill={T.panel} stroke={T.panelStroke} lineWidth={3} position={[x, y]}>
      {children}
      <Layout layout direction="column" alignItems="center" gap={2} y={h / 2 - 20 - text.length * 12}>
        {text.map((l, i) => (
          <Txt text={i === 0 ? `${n} ${l}` : l} fontFamily={T.font} fontSize={22} fill={i === 0 ? T.text : T.muted} />
        ))}
      </Layout>
    </Rect>
  );
  const colors = ['#5b7fd1', '#5aa860', '#d67a4e', '#d9b74a', '#8f8fa0'];
  const people = (x: number, y: number, withDocs = true, gap = 44) => (
    <Node position={[x, y]}>
      {colors.map((c, i) => (
        <Node x={(i - 2) * gap}>
          <HumanIcon color={c} size={40} y={withDocs ? -22 : 0} />
          {withDocs && <DocIcon color={c} width={28} height={36} lines={3} y={18} />}
        </Node>
      ))}
    </Node>
  );

  view.add(
    <Node ref={partC} opacity={0}>
      <Rect ref={b => cBoxes.push(b)} width={560} height={70} radius={16} fill={T.panel} stroke={T.panelStroke} lineWidth={3} position={[-620, -400]}>
        <Txt text='"Should we lower the speed limit on roads?"' fontFamily={T.font} fontSize={24} fill={T.text} fontStyle="italic" />
      </Rect>
      {stepBox('1.', ['participants write opinions'], -620, -240, 560, 170, people(0, -25))}
      {stepBox('2.', ['SFT LLM generates', 'consensus candidates'], -620, 0, 560, 190,
        <Node y={-30}>
          <Box label="LLM (SFT)" color={T.panelStroke} stroke={T.panelStroke} fontSize={22} width={150} height={70} x={-170} />
          {[0, 1, 2].map(i => <DocIcon color={T.env} width={34} height={44} lines={3} x={-20 + i * 46} />)}
          <Txt text="loss" fontFamily={T.font} fontSize={18} fill={T.policy} x={120} y={-30} />
          {[0, 1, 2].map(i => <DocIcon color={T.muted} width={34} height={44} lines={3} x={140 + i * 46} />)}
        </Node>)}
      {stepBox('3.', ['opinion-conditioned reward model', 'evaluates consensus candidates'], 0, 0, 520, 320,
        <Node y={-60}>
          {colors.map((c, i) => (
            <Node x={(i - 2) * 95}>
              <HumanIcon color={c} size={34} y={-60} />
              <Txt text="?" fontFamily={T.font} fontSize={22} fill={T.muted} x={26} y={-64} />
              <Txt text="loss" fontFamily={T.font} fontSize={16} fill={T.policy} y={-22} />
              <Rect width={26} height={26} radius={4} fill={T.panelStroke} x={-16} y={14}><Txt text={String((i * 3) % 5 + 1)} fontSize={18} fill={T.text} fontFamily={T.font} /></Rect>
              <Rect width={26} height={26} radius={4} fill={T.panelStroke} x={16} y={14}><Txt text={String((i * 2 + 1) % 5 + 1)} fontSize={18} fill={T.text} fontFamily={T.font} /></Rect>
            </Node>
          ))}
          <Box label="LLM (RM)" color={T.panelStroke} stroke={T.panelStroke} fontSize={22} width={150} height={60} y={80} />
        </Node>)}
      {stepBox('4.', ['preferences aggregated with', 'social welfare function'], 600, 0, 440, 190,
        <Node y={-35}>
          {people(-60, -20, false, 34)}
          <Txt text="⚖️" fontSize={56} x={120} y={-10} />
        </Node>)}
      {stepBox('5.', ['consensus chosen by reranking'], 600, -240, 440, 150,
        <Node y={-22}>
          {[0, 1, 2, 3, 4].map(i => <DocIcon color={i === 0 ? T.env : T.reward} width={30} height={40} lines={3} x={(i - 2) * 46} />)}
        </Node>)}
      {stepBox('6.', ['players rate consensus'], 0, -400, 440, 150,
        <Node y={-22}>
          {colors.map((c, i) => (
            <Node x={(i - 2) * 60}>
              <HumanIcon color={c} size={34} y={-12} />
              <Txt text={String([4, 2, 3, 5, 3][i])} fontFamily={T.font} fontSize={22} fill={c} y={22} />
            </Node>
          ))}
        </Node>)}
      <Rect ref={b => cBoxes.push(b)} width={300} height={150} radius={22} fill={T.panel} stroke={T.panelStroke} lineWidth={3} position={[600, -400]}>
        <Txt text="evaluation" fontFamily={T.font} fontSize={22} fill={T.text} y={45} />
        {colors.map((c, i) => <HumanIcon color={c} size={30} x={(i - 2) * 40} y={-20} />)}
      </Rect>
      <Rect ref={b => cBoxes.push(b)} width={170} height={110} radius={16} fill={T.panel} stroke={T.policy} lineWidth={3} position={[-250, -240]}>
        <Txt text="✅ ❌" fontSize={30} y={-16} />
        <Txt text="quality filtering" fontFamily={T.font} fontSize={18} fill={T.policy} y={30} />
      </Rect>

      {/* main flow */}
      <Arrow ref={a => cArrows.push(a)} points={[[-620, -365], [-620, -325]]} stroke={T.line} lineWidth={4} arrowSize={14} />
      <Arrow ref={a => cArrows.push(a)} points={[[-620, -155], [-620, -95]]} stroke={T.line} lineWidth={4} arrowSize={14} />
      <Arrow ref={a => cArrows.push(a)} points={[[-340, 0], [-260, 0]]} stroke={T.line} lineWidth={4} arrowSize={14} />
      <Arrow ref={a => cArrows.push(a)} points={[[260, 0], [380, 0]]} stroke={T.line} lineWidth={4} arrowSize={14} />
      <Arrow ref={a => cArrows.push(a)} points={[[600, -95], [600, -165]]} stroke={T.line} lineWidth={4} arrowSize={14} />
      <Arrow ref={a => cArrows.push(a)} points={[[380, -240], [220, -240], [220, -325]]} stroke={T.line} lineWidth={4} arrowSize={14} radius={12} />
      <Arrow ref={a => cArrows.push(a)} points={[[220, -400], [450, -400]]} stroke={T.line} lineWidth={4} arrowSize={14} />
      {/* training feedback */}
      <Arrow ref={a => cArrows.push(a)} points={[[0, -325], [0, -160]]} stroke={T.policy} lineWidth={5} arrowSize={16} />
      <Txt ref={t => cLabels.push(t)} text="agreement ratings → train" fontFamily={T.font} fontSize={20} fill={T.policy} position={[0, -290]} opacity={0} />
      <Arrow ref={a => cArrows.push(a)} points={[[-220, -400], [-250, -400], [-250, -295]]} stroke={T.policy} lineWidth={5} arrowSize={16} radius={12} />
      <Txt ref={t => cLabels.push(t)} text="quality ratings → train" fontFamily={T.font} fontSize={20} fill={T.policy} position={[-300, -440]} opacity={0} />
      <Arrow ref={a => cArrows.push(a)} points={[[-250, -185], [-250, -95]]} stroke={T.policy} lineWidth={5} arrowSize={16} />
      <Txt text="Bakker et al. 2022 — fine-tuning language models to find agreement among humans with diverse preferences" fontFamily={T.font} fontSize={22} fill={T.muted} position={[0, 210]} />
    </Node>,
  );

  partC().opacity(1);
  for (const b of cBoxes) b.scale(0);
  yield* popAll(cBoxes.slice(0, 1), 0.1);
  yield* popAll(cBoxes.slice(1, 8), 0.2);
  yield* drawAll(cArrows.slice(0, 7), 0.12, 0.45);
  yield* popAll(cBoxes.slice(8), 0.1);
  yield* all(drawAll(cArrows.slice(7), 0.15, 0.5), sequence(0.2, ...cLabels.map(l => l.opacity(1, 0.3))));
  yield* waitFor(2.5);
  yield* fadeOut(partC(), 0.5);

  /* ------------------------------------------------------------------ D. abstract */
  const partD = createRef<Node>();
  const sentences = [
    ['Reinforcement learning from human feedback (RLHF) is a variant of reinforcement learning (RL)', true],
    ['that learns from human feedback instead of relying on an engineered reward function.', true],
    ['Building on prior work on preference-based reinforcement learning (PbRL), it stands at', false],
    ['the intersection of artificial intelligence and human-computer interaction.', true],
    ['This positioning offers a promising avenue to enhance the performance and adaptability', false],
    ['of intelligent systems while also improving the alignment of their objectives with human values.', true],
    ['The training of large language models (LLMs) has impressively demonstrated this potential,', false],
    ["where RLHF played a decisive role in targeting the model's capabilities toward human objectives.", true],
  ] as [string, boolean][];
  const marks: Rect[] = [];
  const texts: Txt[] = [];
  const LEFT = -800;
  const TOP = -200;
  const ROW = 56;
  view.add(
    <Node ref={partD} opacity={0}>
      <Txt text="ABSTRACT — Reinforcement Learning from Human Feedback (survey, 2023)" fontFamily={T.font} fontSize={32} fontWeight={700} fill={T.text} position={[LEFT, TOP - 90]} offset={[-1, 0]} />
      {sentences.map(([s], i) => (
        <Node position={[LEFT, TOP + i * ROW]}>
          <Rect ref={r => marks.push(r)} fill={T.yellow} height={46} width={0} offset={[-1, 0]} x={-8} radius={4} />
          <Txt ref={t => texts.push(t)} text={s} fontFamily={T.font} fontSize={30} fill={T.text} offset={[-1, 0]} />
        </Node>
      ))}
    </Node>,
  );

  yield* fadeIn(partD());
  yield* waitFor(0.6);
  for (let i = 0; i < sentences.length; i++) {
    if (!sentences[i][1]) continue;
    const w = texts[i].width() + 16;
    yield* all(marks[i].width(w, 0.7), texts[i].fill('#1a1a06', 0.5));
    yield* waitFor(0.25);
  }
  yield* waitFor(2);
});
