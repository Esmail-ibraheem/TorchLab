import {Circle, Latex, Layout, Line, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, easeInOutCubic, easeOutBack, sequence, waitFor} from '@motion-canvas/core';
import {Arrow, Label, addTitle} from '../lib/ui';
import {T} from '../theme';

/** RL2.png — the agent / environment loop with s_t, r_t, a_t and the notation panel. */
export default makeScene2D(function* (view) {
  const title = addTitle(view, 'Reinforcement Learning — the agent / environment loop');

  const agent = createRef<Rect>();
  const env = createRef<Rect>();
  const rightArrow = createRef<Line>();
  const leftArrow = createRef<Line>();
  const aLabel = createRef<Latex>();
  const sLabel = createRef<Latex>();
  const rLabel = createRef<Latex>();
  const notation = createRef<Layout>();
  const dot = createRef<Circle>();

  const AX = -250, AY = -190; // agent centre
  const EX = -250, EY = 190;  // environment centre

  view.add(
    <>
      <Rect
        ref={agent}
        position={[AX, AY]}
        width={400}
        height={210}
        radius={60}
        fill={T.agent}
        scale={0}
        layout
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap={4}
      >
        <Txt text="Agent" fontFamily={T.font} fontSize={44} fill="#1a1208" />
        <Latex tex="\pi_\theta(\cdot)" fill="#1a1208" fontSize={64} />
      </Rect>
      <Rect
        ref={env}
        position={[EX, EY]}
        width={480}
        height={190}
        radius={8}
        fill={T.env}
        scale={0}
        layout
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Txt text="Target" fontFamily={T.font} fontSize={44} fill="#06170d" />
        <Txt text="Environment" fontFamily={T.font} fontSize={44} fill="#06170d" />
      </Rect>

      {/* agent → environment (action) */}
      <Arrow
        ref={rightArrow}
        stroke={T.policy}
        lineWidth={7}
        points={[
          [AX + 200, AY],
          [AX + 420, AY],
          [AX + 420, EY],
          [EX + 240, EY],
        ]}
      />
      {/* environment → agent (state, reward) */}
      <Arrow
        ref={leftArrow}
        stroke={T.policy}
        lineWidth={7}
        points={[
          [EX - 240, EY],
          [EX - 440, EY],
          [EX - 440, AY],
          [AX - 200, AY],
        ]}
      />
      <Latex ref={aLabel} tex="a_t" fill={T.text} fontSize={84} position={[AX + 500, 0]} opacity={0} />
      <Latex ref={sLabel} tex="s_t" fill={T.text} fontSize={84} position={[EX - 540, -60]} opacity={0} />
      <Latex ref={rLabel} tex="r_t" fill={T.text} fontSize={84} position={[EX - 540, 60]} opacity={0} />

      <Layout ref={notation} layout direction="column" gap={22} position={[560, -20]} alignItems="start" opacity={0}>
        <Txt text="Some notation:" fontFamily={T.font} fontSize={40} fill={T.text} marginBottom={16} />
        <Layout layout gap={16} alignItems="center">
          <Latex tex="s_t" fill={T.text} fontSize={44} />
          <Txt text=": state" fontFamily={T.font} fontSize={38} fill={T.text} />
        </Layout>
        <Layout layout gap={16} alignItems="center">
          <Latex tex="r_t" fill={T.text} fontSize={44} />
          <Txt text=": reward" fontFamily={T.font} fontSize={38} fill={T.text} />
        </Layout>
        <Layout layout gap={16} alignItems="center">
          <Latex tex="a_t" fill={T.text} fontSize={44} />
          <Txt text=": action" fontFamily={T.font} fontSize={38} fill={T.text} />
        </Layout>
        <Layout layout gap={16} alignItems="center">
          <Latex tex="a_t \sim \pi_\theta(s_t)" fill={T.text} fontSize={44} />
          <Txt text=": policy" fontFamily={T.font} fontSize={38} fill={T.text} />
        </Layout>
      </Layout>

      <Circle ref={dot} size={30} fill={T.yellow} position={[AX + 200, AY]} opacity={0} />
    </>,
  );

  yield* title.opacity(1, 0.5);
  yield* agent().scale(1, 0.7, easeOutBack);
  yield* env().scale(1, 0.7, easeOutBack);
  yield* waitFor(0.3);

  // action goes out
  yield* rightArrow().end(1, 1.0, easeInOutCubic);
  yield* aLabel().opacity(1, 0.4);
  yield* waitFor(0.3);

  // state + reward come back
  yield* leftArrow().end(1, 1.0, easeInOutCubic);
  yield* all(sLabel().opacity(1, 0.4), rLabel().opacity(1, 0.4));
  yield* waitFor(0.4);

  // notation list, one row at a time
  notation().opacity(1);
  const rows = notation().children();
  for (const r of rows) r.opacity(0);
  yield* sequence(0.35, ...rows.map(r => r.opacity(1, 0.4)));
  yield* waitFor(0.5);

  // a token travelling around the loop twice: agent → env (a_t), env → agent (s_t, r_t)
  const path = [
    [AX + 420, AY], [AX + 420, EY], [EX + 240, EY], // right side
    [EX - 240, EY], [EX - 440, EY], [EX - 440, AY], [AX - 200, AY], // left side
  ] as [number, number][];
  yield* dot().opacity(1, 0.2);
  for (let lap = 0; lap < 2; lap++) {
    dot().position([AX + 200, AY]);
    yield* chain(
      dot().position(path[0], 0.35), dot().position(path[1], 0.5), dot().position(path[2], 0.3),
      all(dot().position(path[3], 0.45), dot().fill(T.env, 0.45)),
      dot().position(path[4], 0.3), dot().position(path[5], 0.5), dot().position(path[6], 0.35),
      dot().fill(T.yellow, 0.2),
    );
  }
  yield* dot().opacity(0, 0.3);
  yield* waitFor(1);
});
