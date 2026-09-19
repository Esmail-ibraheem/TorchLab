import {Latex, Layout, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, chain, createRef, easeOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {fadeIn, pop} from '../lib/anim';
import {Grid, addTitle} from '../lib/ui';
import {T} from '../theme';

/** rlgame.png + the reward-model bullets + the policy — the cat walking the 5x5 grid. */
export default makeScene2D(function* (view) {
  const title = addTitle(view, 'The RL setup — agent, state, action, reward, policy');

  const CELL = 150;
  const N = 5;
  const GX = -470; // grid centre
  const GY = 40;
  const cellPos = (c: number, r: number): [number, number] => [GX - (N * CELL) / 2 + CELL / 2 + c * CELL, GY - (N * CELL) / 2 + CELL / 2 + r * CELL];

  const grid = createRef<Node>();
  const cat = createRef<Txt>();
  const broom = createRef<Txt>();
  const tub = createRef<Txt>();
  const meat = createRef<Txt>();
  const setup = createRef<Layout>();
  const rewards = createRef<Layout>();
  const policy = createRef<Layout>();
  const popup = createRef<Txt>();

  const START: [number, number] = [0, 0];
  const glyph = (ref: any, text: string, c: number, r: number) => (
    <Txt ref={ref} text={text} fontSize={96} position={cellPos(c, r)} scale={0} />
  );

  view.add(
    <>
      <Node ref={grid} opacity={0}>
        <Rect width={N * CELL} height={N * CELL} position={[GX, GY]} fill="#1b1b24" />
        <Grid cols={N} rows={N} cell={CELL} position={[GX, GY]} color="#33334a" />
      </Node>
      {glyph(broom, '🧹', 1, 0)}
      {glyph(tub, '🛁', 2, 3)}
      {glyph(meat, '🥩', 4, 4)}
      {glyph(cat, '🐈', START[0], START[1])}
      <Txt ref={popup} text="" fontFamily={T.font} fontSize={64} fontWeight={700} fill={T.text} opacity={0} />

      <Layout ref={setup} layout direction="column" gap={18} alignItems="start" position={[520, -330]} offset={[0, -1]} opacity={0}>
        <Txt text="The RL setup" fontFamily={T.font} fontSize={44} fill={T.text} fontWeight={700} />
        <Txt text="Agent:  the cat" fontFamily={T.font} fontSize={32} fill={T.text} />
        <Txt text="State:  the position of the cat (x, y) in the grid" fontFamily={T.font} fontSize={32} fill={T.text} />
        <Txt text="Action:  move to one of the 4-connected cells" fontFamily={T.font} fontSize={32} fill={T.text} />
        <Txt text="(an invalid move keeps the cat where it is)" fontFamily={T.font} fontSize={26} fill={T.muted} />
      </Layout>

      <Layout ref={rewards} layout direction="column" gap={14} alignItems="start" position={[520, -60]} offset={[0, -1]} opacity={0}>
        <Txt text="Reward model" fontFamily={T.font} fontSize={44} fill={T.text} fontWeight={700} />
        <Txt text="→ empty cell:  reward  0" fontFamily={T.font} fontSize={32} fill={T.text} />
        <Txt text="→ broom:  reward  −1" fontFamily={T.font} fontSize={32} fill={T.reward} />
        <Txt text="→ bathtub:  reward  −10, the cat faints (episode over)" fontFamily={T.font} fontSize={32} fill={T.reward} />
        <Txt text="     and respawns at the initial position" fontFamily={T.font} fontSize={28} fill={T.reward} />
        <Txt text="→ meat:  reward  +100" fontFamily={T.font} fontSize={32} fill={T.env} />
      </Layout>

      <Layout ref={policy} layout direction="column" gap={14} alignItems="start" position={[520, 250]} offset={[0, -1]} opacity={0}>
        <Txt text="Policy" fontFamily={T.font} fontSize={44} fill={T.text} fontWeight={700} />
        <Txt text="rules how the agent selects the action given its state" fontFamily={T.font} fontSize={32} fill={T.text} />
        <Latex tex="a_t \sim \pi(\cdot \mid s_t)" fill={T.agent} fontSize={48} marginLeft={40} />
        <Txt text="goal: select the policy that maximizes the expected return" fontFamily={T.font} fontSize={32} fill={T.text} />
      </Layout>
    </>,
  );

  yield* title.opacity(1, 0.5);
  yield* fadeIn(grid());
  yield* sequence(0.15, pop(broom()), pop(tub()), pop(meat()), pop(cat()));

  // setup list
  yield* fadeIn(setup());
  yield* waitFor(0.6);

  // reward list header + rules appear as we demonstrate them
  const rows = rewards().children();
  for (const r of rows) r.opacity(0);
  rewards().opacity(1);
  yield* rows[0].opacity(1, 0.3);

  function* moveTo(c: number, r: number, reward: string, color: string) {
    const p = cellPos(c, r);
    yield* cat().position(p, 0.45, easeOutCubic);
    popup().text(reward);
    popup().fill(color);
    popup().position([p[0], p[1] - 70]);
    popup().opacity(1);
    yield* all(popup().position([p[0], p[1] - 130], 0.6), popup().opacity(0, 0.6));
  }

  // 1) onto the broom: −1
  yield* rows[2].opacity(1, 0.3);
  yield* moveTo(1, 0, '−1', T.reward);
  yield* waitFor(0.2);
  // 2) empty cells: 0
  yield* rows[1].opacity(1, 0.3);
  yield* moveTo(1, 1, '0', T.muted);
  yield* moveTo(1, 2, '0', T.muted);
  yield* moveTo(2, 2, '0', T.muted);
  // 3) into the bathtub: −10, faint, respawn
  yield* all(rows[3].opacity(1, 0.3), rows[4].opacity(1, 0.3));
  yield* moveTo(2, 3, '−10', T.reward);
  yield* all(cat().rotation(90, 0.4), cat().opacity(0, 0.6));
  cat().rotation(0);
  cat().position(cellPos(START[0], START[1]));
  yield* cat().opacity(1, 0.4);
  yield* waitFor(0.3);
  // 4) a better trajectory to the meat: +100
  yield* rows[5].opacity(1, 0.3);
  yield* chain(
    moveTo(0, 1, '0', T.muted),
    moveTo(0, 2, '0', T.muted),
    moveTo(0, 3, '0', T.muted),
    moveTo(0, 4, '0', T.muted),
    moveTo(1, 4, '0', T.muted),
    moveTo(2, 4, '0', T.muted),
    moveTo(3, 4, '0', T.muted),
  );
  yield* moveTo(4, 4, '+100', T.env);
  yield* all(cat().scale(1.3, 0.3), meat().scale(0, 0.3));
  yield* cat().scale(1, 0.3);

  // policy
  yield* fadeIn(policy());
  yield* waitFor(1.2);
});
