import {Latex, Layout, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {arcPoints, draw, fadeIn, pop} from '../lib/anim';
import {Earth, Robot, Token} from '../lib/icons';
import {NeuralNet, addTitle} from '../lib/ui';
import {T} from '../theme';

/** RL1.png (agent ⇄ environment) followed by the same loop read as a language model. */
export default makeScene2D(function* (view) {
  const title = addTitle(view, 'The RL setup — connection to language models');

  const loop = createRef<Node>();
  const robot = createRef<Node>();
  const earth = createRef<Node>();
  const agentLbl = createRef<Txt>();
  const envLbl = createRef<Txt>();
  const topArrow = createRef<Line>();
  const botArrow = createRef<Line>();
  const topText = createRef<Layout>();
  const botText = createRef<Layout>();

  const AX = -560, EX = 560, Y = 0;

  view.add(
    <Node ref={loop}>
      <Node ref={robot} position={[AX, Y]} opacity={0}>
        <Robot />
      </Node>
      <Txt ref={agentLbl} text="AGENT" fontFamily={T.font} fontSize={40} fontWeight={700} fill={T.text} position={[AX, Y - 230]} opacity={0} />
      <Node ref={earth} position={[EX, Y]} opacity={0}>
        <Earth />
      </Node>
      <Txt ref={envLbl} text="ENVIRONMENT" fontFamily={T.font} fontSize={40} fontWeight={700} fill={T.text} position={[EX, Y - 230]} opacity={0} />

      <Line ref={topArrow} points={arcPoints(0, Y + 700, 830, -122, -58)} stroke={T.line} lineWidth={6} endArrow arrowSize={22} end={0} lineCap="round" />
      <Line ref={botArrow} points={arcPoints(0, Y - 700, 830, 122, 58)} stroke={T.line} lineWidth={6} endArrow arrowSize={22} end={0} lineCap="round" />

      <Layout ref={topText} layout direction="column" gap={10} alignItems="start" position={[0, Y - 235]} opacity={0}>
        <Layout layout gap={14} alignItems="center">
          <Txt text="- State" fontFamily={T.font} fontSize={38} fill={T.text} />
          <Latex tex="s \in \mathcal{S}" fill={T.text} fontSize={44} />
        </Layout>
        <Layout layout gap={14} alignItems="center">
          <Txt text="- Take action" fontFamily={T.font} fontSize={38} fill={T.text} />
          <Latex tex="a \in \mathcal{A}" fill={T.text} fontSize={44} />
        </Layout>
      </Layout>
      <Layout ref={botText} layout direction="column" gap={10} alignItems="start" position={[0, Y + 230]} opacity={0}>
        <Layout layout gap={14} alignItems="center">
          <Txt text="- Get reward" fontFamily={T.font} fontSize={38} fill={T.text} />
          <Latex tex="r" fill={T.text} fontSize={44} />
        </Layout>
        <Layout layout gap={14} alignItems="center">
          <Txt text="- New state" fontFamily={T.font} fontSize={38} fill={T.text} />
          <Latex tex="s' \in \mathcal{S}" fill={T.text} fontSize={44} />
        </Layout>
      </Layout>
    </Node>,
  );

  yield* title.opacity(1, 0.5);
  yield* all(fadeIn(robot()), fadeIn(agentLbl()));
  yield* all(fadeIn(earth()), fadeIn(envLbl()));
  yield* draw(topArrow(), 0.9);
  yield* fadeIn(topText());
  yield* draw(botArrow(), 0.9);
  yield* fadeIn(botText());
  yield* waitFor(1);

  /* ---- part 2: the same loop for a language model ---- */
  yield* all(loop().scale(0.55, 0.8, easeInOutCubic), loop().position([0, -330], 0.8, easeInOutCubic));

  const lm = createRef<Node>();
  const mapping = createRef<Layout>();
  const lmBox = createRef<Rect>();
  const prompt = createRef<Layout>();
  const next = createRef<Node>();
  const rm = createRef<Rect>();
  const arrows: Line[] = [];

  view.add(
    <Node ref={lm} opacity={0}>
      {/* state: prompt tokens */}
      <Layout ref={prompt} layout gap={10} position={[-560, 140]}>
        {['Explain', 'RL', 'to', 'a', '6', 'year'].map(t => (
          <Token text={t} color={T.env} />
        ))}
      </Layout>
      <Txt text="state = the prompt (input tokens)" fontFamily={T.font} fontSize={28} fill={T.muted} position={[-560, 215]} />

      {/* agent / policy: the language model */}
      <Rect ref={lmBox} position={[60, 140]} width={300} height={190} radius={24} fill={T.panel} stroke={T.agent} lineWidth={4}>
        <Txt text="Language model" fontFamily={T.font} fontSize={30} fill={T.agent} y={-62} />
        <NeuralNet color={T.agent} width={150} height={90} y={14} />
      </Rect>
      <Latex tex="a_t \sim \pi(\cdot \mid s_t)" fill={T.agent} fontSize={40} position={[60, 275]} />
      <Txt text="agent = policy = the LM itself" fontFamily={T.font} fontSize={28} fill={T.muted} position={[60, 335]} />

      {/* action: next token */}
      <Node ref={next} position={[420, 140]}>
        <Token text="old" color={T.policy} />
      </Node>
      <Txt text="action = which token is next" fontFamily={T.font} fontSize={28} fill={T.muted} position={[420, 215]} />

      {/* reward model */}
      <Rect ref={rm} position={[720, 140]} width={220} height={150} radius={24} fill={T.panel} stroke={T.reward} lineWidth={4}>
        <Txt text="Reward" fontFamily={T.font} fontSize={30} fill={T.reward} y={-45} />
        <NeuralNet color={T.reward} width={110} height={70} y={20} layers={[3, 3, 2]} />
      </Rect>
      <Txt text='reward "good responses"' fontFamily={T.font} fontSize={28} fill={T.muted} position={[720, 250]} />
      <Txt text="no reward for bad ones" fontFamily={T.font} fontSize={28} fill={T.muted} position={[720, 290]} />

      <Line ref={a => arrows.push(a)} points={[[-320, 140], [-95, 140]]} stroke={T.line} lineWidth={5} endArrow arrowSize={18} end={0} />
      <Line ref={a => arrows.push(a)} points={[[215, 140], [360, 140]]} stroke={T.line} lineWidth={5} endArrow arrowSize={18} end={0} />
      <Line ref={a => arrows.push(a)} points={[[480, 140], [605, 140]]} stroke={T.line} lineWidth={5} endArrow arrowSize={18} end={0} />
    </Node>,
  );

  view.add(
    <Layout ref={mapping} layout direction="row" gap={60} position={[0, -80]} opacity={0}>
      {[
        ['Agent', 'the language model'],
        ['State', 'the prompt'],
        ['Action', 'next token'],
        ['Reward', 'reward model score'],
        ['Policy', 'the LM itself'],
      ].map(([k, v]) => (
        <Layout layout direction="column" alignItems="center" gap={6}>
          <Txt text={k} fontFamily={T.font} fontSize={30} fontWeight={700} fill={T.agent} />
          <Txt text={v} fontFamily={T.font} fontSize={28} fill={T.text} />
        </Layout>
      ))}
    </Layout>,
  );

  yield* fadeIn(mapping());
  lm().opacity(1);
  for (const n of [prompt(), lmBox(), next(), rm()]) n.scale(0);
  yield* pop(prompt());
  yield* draw(arrows[0]);
  yield* pop(lmBox());
  yield* draw(arrows[1]);
  yield* pop(next());
  yield* draw(arrows[2]);
  yield* pop(rm());
  yield* waitFor(0.3);
  // the chosen token joins the prompt and the loop repeats
  yield* all(next().position([-560 + 3 * 95, 140], 0.6), next().opacity(0, 0.6));
  next().position([420, 140]);
  yield* next().opacity(1, 0.4);
  yield* waitFor(1.2);
});
