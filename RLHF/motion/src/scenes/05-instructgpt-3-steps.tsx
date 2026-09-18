import {Latex, Layout, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {draw, fadeIn, pop} from '../lib/anim';
import {DocIcon, HumanIcon, NeuralNet, addTitle} from '../lib/ui';
import {T} from '../theme';

/** Pasted image 20240430122335 — InstructGPT: SFT → reward model → PPO, column by column. */
export default makeScene2D(function* (view) {
  const title = addTitle(view, 'InstructGPT — the three steps (Ouyang et al. 2022)');
  yield* title.opacity(1, 0.5);

  const green = '#183a26';
  const greenStroke = '#2fb56f';
  const card = '#1a1a22';
  const cardStroke = '#2c2c3a';

  const side = (x: number, y: number, lines: string[]) => (
    <Layout layout direction="column" alignItems="start" gap={4} position={[x, y]} offset={[-1, 0]} opacity={0}>
      {lines.map(l => (
        <Txt text={l} fontFamily={T.font} fontSize={25} fill={T.text} />
      ))}
    </Layout>
  );
  const heading = (x: number, step: string, lines: string[]) => (
    <Layout layout direction="column" alignItems="start" gap={6} position={[x, -455]} offset={[-1, -1]} opacity={0}>
      <Txt text={step} fontFamily={T.font} fontSize={24} fill={T.muted} marginBottom={6} />
      {lines.map(l => (
        <Txt text={l} fontFamily={T.font} fontSize={28} fontWeight={700} fill={T.text} />
      ))}
    </Layout>
  );
  const promptCard = (x: number, y: number, icon: string, lines: string[]) => (
    <Rect width={270} height={120} radius={16} fill={green} stroke={greenStroke} lineWidth={2} position={[x, y]} scale={0}>
      <Txt text={icon} fontSize={30} y={-32} />
      <Layout layout direction="column" alignItems="center" y={18}>
        {lines.map(l => (
          <Txt text={l} fontFamily={T.font} fontSize={19} fill={T.text} />
        ))}
      </Layout>
    </Rect>
  );
  const vArrow = (x: number, y0: number, y1: number) => (
    <Line points={[[x, y0], [x, y1]]} stroke={T.muted} lineWidth={4} endArrow arrowSize={14} end={0} />
  );

  const C1 = -640, C2 = 0, C3 = 640;
  const BX3 = 125;
  const BX = 170; // boxes sit right of the column centre, text left of it
  const TX = -300;

  /* ---------------- column 1 ---------------- */
  const h1 = heading(C1 + TX, 'Step 1', ['Collect demonstration data', 'and train a supervised policy.']);
  const p1 = promptCard(C1 + BX, -230, '🔄', ['Explain reinforcement', 'learning to a 6 year old.']);
  const a1 = vArrow(C1 + BX, -168, -110);
  const lab1 = (
    <Rect width={270} height={210} radius={16} fill={card} stroke={cardStroke} lineWidth={2} position={[C1 + BX, 5]} scale={0}>
      <HumanIcon color={T.text} size={70} y={-55} />
      <Txt text="✎" fontSize={30} fill={T.text} y={8} />
      <Layout layout direction="column" alignItems="center" y={60}>
        <Txt text="We give treats and" fontFamily={T.font} fontSize={19} fill={T.text} />
        <Txt text="punishments to teach…" fontFamily={T.font} fontSize={19} fill={T.text} />
      </Layout>
    </Rect>
  );
  const a2 = vArrow(C1 + BX, 112, 170);
  const sft = (
    <Rect width={270} height={260} radius={16} fill={card} stroke={cardStroke} lineWidth={2} position={[C1 + BX, 310]} scale={0}>
      <Txt text="SFT" fontFamily={T.font} fontSize={24} fill={T.text} y={-100} />
      <NeuralNet color={T.text} width={120} height={80} y={-30} nodeSize={12} />
      <Txt text="✎" fontSize={28} fill={T.text} y={45} />
      {[-40, 0, 40].map(x => (
        <DocIcon color={T.text} width={30} height={38} lines={3} x={x} y={95} />
      ))}
    </Rect>
  );
  const s1a = side(C1 + TX, -230, ['A prompt is', 'sampled from our', 'prompt dataset.']);
  const s1b = side(C1 + TX, 5, ['A labeler', 'demonstrates the', 'desired output', 'behavior.']);
  const s1c = side(C1 + TX, 310, ['This data is used to', 'fine-tune GPT-3.5', 'with supervised', 'learning.']);

  /* ---------------- column 2 ---------------- */
  const h2 = heading(C2 + TX, 'Step 2', ['Collect comparison data and', 'train a reward model.']);
  const p2 = promptCard(C2 + BX, -290, '🔄', ['Explain reinforcement', 'learning to a 6 year old.']);
  const outs: Rect[] = [];
  const outData = [
    ['A', 'In reinforcement', 'learning, the agent is…'],
    ['B', 'Explain rewards…', ''],
    ['C', 'In machine', 'learning…'],
    ['D', 'We give treats and', 'punishments to teach…'],
  ];
  const outputs = (
    <Node>
      {outData.map(([k, l1, l2], i) => (
        <Rect ref={r => outs.push(r)} width={128} height={90} radius={12} fill={card} stroke={cardStroke} lineWidth={2} position={[C2 + BX + (i % 2 === 0 ? -70 : 70), -160 + Math.floor(i / 2) * 100]} scale={0}>
          <Rect width={26} height={26} radius={13} fill={T.text} y={-28}><Txt text={k} fontFamily={T.font} fontSize={16} fontWeight={700} fill={T.bg} /></Rect>
          <Txt text={l1} fontFamily={T.font} fontSize={13} fill={T.text} y={2} />
          <Txt text={l2} fontFamily={T.font} fontSize={13} fill={T.text} y={20} />
        </Rect>
      ))}
    </Node>
  );
  const brace = (
    <Line
      points={[[C2 + BX - 130, -6], [C2 + BX - 130, 6], [C2 + BX, 6], [C2 + BX, 18], [C2 + BX, 6], [C2 + BX + 130, 6], [C2 + BX + 130, -6]]}
      stroke={T.muted}
      lineWidth={3}
      radius={4}
      end={0}
    />
  );
  const a3 = vArrow(C2 + BX, 18, 40);
  const rank = (
    <Rect width={270} height={160} radius={16} fill={card} stroke={cardStroke} lineWidth={2} position={[C2 + BX, 125]} scale={0}>
      <HumanIcon color={T.text} size={66} y={-38} />
      <Txt text="D > C > A > B" fontFamily={T.font} fontSize={26} fontWeight={700} fill={T.text} y={48} />
    </Rect>
  );
  const a4 = vArrow(C2 + BX, 210, 260);
  const rm = (
    <Rect width={270} height={200} radius={16} fill={card} stroke={cardStroke} lineWidth={2} position={[C2 + BX, 365]} scale={0}>
      <Txt text="RM" fontFamily={T.font} fontSize={24} fill={T.text} y={-72} />
      <NeuralNet color={T.text} width={120} height={80} y={-10} nodeSize={12} />
      <Txt text="D > C > A > B" fontFamily={T.font} fontSize={24} fontWeight={700} fill={T.text} y={68} />
    </Rect>
  );
  const s2a = side(C2 + TX, -250, ['A prompt and', 'several model', 'outputs are', 'sampled.']);
  const s2b = side(C2 + TX, 125, ['A labeler ranks the', 'outputs from best', 'to worst.']);
  const s2c = side(C2 + TX, 365, ['This data is used', 'to train our', 'reward model.']);

  /* ---------------- column 3 ---------------- */
  const h3 = heading(C3 + TX, 'Step 3', ['Optimize a policy against the', 'reward model using the PPO', 'reinforcement learning algorithm.']);
  const p3 = promptCard(C3 + BX3, -240, '🦦', ['Write a story', 'about otters.']);
  const a5 = vArrow(C3 + BX3, -178, -148);
  const ppo = (
    <Rect width={270} height={130} radius={16} fill={card} stroke={cardStroke} lineWidth={2} position={[C3 + BX3, -75]} scale={0}>
      <Txt text="PPO" fontFamily={T.font} fontSize={22} fill={T.text} y={-40} />
      <NeuralNet color={T.text} width={110} height={64} y={14} nodeSize={11} />
    </Rect>
  );
  const a6 = vArrow(C3 + BX3, -8, 22);
  const out3 = (
    <Rect width={270} height={70} radius={16} fill={card} stroke={cardStroke} lineWidth={2} position={[C3 + BX3, 60]} scale={0}>
      <Txt text="Once upon a time…" fontFamily={T.font} fontSize={20} fill={T.text} />
    </Rect>
  );
  const a7 = vArrow(C3 + BX3, 97, 127);
  const rm3 = (
    <Rect width={270} height={130} radius={16} fill={card} stroke={cardStroke} lineWidth={2} position={[C3 + BX3, 195]} scale={0}>
      <Txt text="RM" fontFamily={T.font} fontSize={22} fill={T.text} y={-40} />
      <NeuralNet color={T.text} width={110} height={64} y={14} nodeSize={11} />
    </Rect>
  );
  const a8 = vArrow(C3 + BX3, 262, 292);
  const rk = (
    <Rect width={270} height={90} radius={16} fill={card} stroke={cardStroke} lineWidth={2} position={[C3 + BX3, 340]} scale={0}>
      <Latex tex="r_k" fill={T.text} fontSize={44} />
    </Rect>
  );
  const back = (
    <Line
      points={[[C3 + BX3 + 135, 340], [C3 + BX3 + 185, 340], [C3 + BX3 + 185, -75], [C3 + BX3 + 140, -75]]}
      stroke={T.muted}
      lineWidth={4}
      endArrow
      arrowSize={14}
      radius={14}
      end={0}
    />
  );
  const s3a = side(C3 + TX, -240, ['A new prompt is', 'sampled from', 'the dataset.']);
  const s3b = side(C3 + TX, -75, ['The PPO model is', 'initialized from the', 'supervised policy.']);
  const s3c = side(C3 + TX, 60, ['The policy generates', 'an output.']);
  const s3d = side(C3 + TX, 195, ['The reward model', 'calculates a reward', 'for the output.']);
  const s3e = side(C3 + TX, 340, ['The reward is used', 'to update the', 'policy using PPO.']);

  const sep = (x: number) => <Line points={[[x, -460], [x, 480]]} stroke={cardStroke} lineWidth={3} opacity={0} />;
  const sep1 = sep(-320);
  const sep2 = sep(320);

  view.add(
    <>
      {sep1}{sep2}
      {h1}{p1}{a1}{lab1}{a2}{sft}{s1a}{s1b}{s1c}
      {h2}{p2}{outputs}{brace}{a3}{rank}{a4}{rm}{s2a}{s2b}{s2c}
      {h3}{p3}{a5}{ppo}{a6}{out3}{a7}{rm3}{a8}{rk}{back}{s3a}{s3b}{s3c}{s3d}{s3e}
    </>,
  );

  yield* all((sep1 as Line).opacity(1, 0.5), (sep2 as Line).opacity(1, 0.5));

  // column 1
  yield* fadeIn(h1 as Node);
  yield* all(pop(p1 as Node), fadeIn(s1a as Node));
  yield* draw(a1 as Line, 0.4);
  yield* all(pop(lab1 as Node), fadeIn(s1b as Node));
  yield* draw(a2 as Line, 0.4);
  yield* all(pop(sft as Node), fadeIn(s1c as Node));
  yield* waitFor(0.8);

  // column 2
  yield* fadeIn(h2 as Node);
  yield* all(pop(p2 as Node), fadeIn(s2a as Node));
  yield* sequence(0.12, ...outs.map(o => pop(o, 0.4)));
  yield* (brace as Line).end(1, 0.5);
  yield* draw(a3 as Line, 0.3);
  yield* all(pop(rank as Node), fadeIn(s2b as Node));
  yield* draw(a4 as Line, 0.4);
  yield* all(pop(rm as Node), fadeIn(s2c as Node));
  yield* waitFor(0.8);

  // column 3
  yield* fadeIn(h3 as Node);
  yield* all(pop(p3 as Node), fadeIn(s3a as Node));
  yield* draw(a5 as Line, 0.3);
  yield* all(pop(ppo as Node), fadeIn(s3b as Node));
  yield* draw(a6 as Line, 0.3);
  yield* all(pop(out3 as Node), fadeIn(s3c as Node));
  yield* draw(a7 as Line, 0.3);
  yield* all(pop(rm3 as Node), fadeIn(s3d as Node));
  yield* draw(a8 as Line, 0.3);
  yield* all(pop(rk as Node), fadeIn(s3e as Node));
  yield* draw(back as Line, 1.0);
  yield* waitFor(0.5);

  // steps 2 and 3 iterate: pulse the loop twice
  for (let i = 0; i < 2; i++) {
    yield* (back as Line).stroke(T.policy, 0.3);
    yield* (back as Line).stroke(T.muted, 0.3);
  }
  yield* waitFor(1.5);
});
