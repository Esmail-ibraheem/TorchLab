import {Latex, Layout, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {bendPoints, draw, fadeIn, pop} from '../lib/anim';
import {Arrow, DocIcon, NeuralNet, addTitle} from '../lib/ui';
import {T} from '../theme';

/** Pasted image 20240430135953 — RLHF (reward model + RL loop) versus DPO (one maximum-likelihood step). */
export default makeScene2D(function* (view) {
  const title = addTitle(view, 'RLHF — Direct Preference Optimization (DPO)');
  yield* title.opacity(1, 0.5);

  const rose = '#3a2430', roseStroke = '#f0a0b8';
  const teal = '#1d3a3a', tealStroke = '#5ad6cc';
  const tealText = '#3fbfb5';
  const redText = '#e8605a';

  const prefData = (x: number, y: number) => (
    <Node position={[x, y]}>
      <Txt text="🏆" fontSize={40} position={[-70, -50]} />
      <DocIcon color={T.text} width={70} height={60} lines={3} x={-55} />
      <Latex tex="y_w" fill={T.text} fontSize={20} position={[-38, 22]} />
      <Latex tex="\succ" fill={T.text} fontSize={34} position={[0, 0]} />
      <DocIcon color={T.text} width={70} height={60} lines={3} x={55} />
      <Latex tex="y_l" fill={T.text} fontSize={20} position={[72, 22]} />
      <Txt text="preference data" fontFamily={T.font} fontSize={24} fill={T.text} position={[0, 62]} />
    </Node>
  );
  const promptTxt = (x: number, y: number) => (
    <Layout layout direction="column" alignItems="start" position={[x, y]} offset={[-1, 0]}>
      <Txt text="x: “write me a poem about" fontFamily={T.font} fontSize={20} fill={T.text} />
      <Txt text="     the history of jazz”" fontFamily={T.font} fontSize={20} fill={T.text} />
    </Layout>
  );
  const net = (x: number, y: number, label: string, color: string) => (
    <Node position={[x, y]}>
      <NeuralNet color={color} layerColors={[T.policy, '#9fc3e8', T.purple]} width={170} height={110} nodeSize={16} layers={[3, 4, 3]} lineWidth={1.5} />
      <Txt text={label} fontFamily={T.font} fontSize={24} fill={T.text} y={0} />
    </Node>
  );

  const left = createRef<Rect>();
  const right = createRef<Rect>();
  const lArrows: Line[] = [];
  const rArrows: Line[] = [];
  const lLabels: Node[] = [];
  const rLabels: Node[] = [];

  view.add(
    <>
      <Rect ref={left} position={[-360, 0]} width={1080} height={520} radius={36} fill={rose} stroke={roseStroke} lineWidth={3} scale={0}>
        <Txt text="Reinforcement Learning from Human Feedback (RLHF)" fontFamily={T.font} fontSize={32} fontWeight={700} fill={T.text} position={[-500, -210]} offset={[-1, 0]} />
        {promptTxt(-500, -140)}
        {prefData(-370, 0)}
        <Arrow ref={a => lArrows.push(a)} points={[[-230, 0], [-110, 0]]} stroke={T.text} lineWidth={4} arrowSize={16} />
        <Txt ref={n => lLabels.push(n)} text="maximum likelihood" fontFamily={T.font} fontSize={24} fontWeight={700} fill={tealText} position={[-170, 105]} opacity={0} />
        {net(20, 0, 'reward model', '#8aa7c8')}
        {net(380, 0, 'LM policy', '#8aa7c8')}
        <Arrow ref={a => lArrows.push(a)} points={bendPoints([120, -50], [200, -120], [280, -50])} stroke={T.text} lineWidth={4} arrowSize={16} />
        <Txt ref={n => lLabels.push(n)} text="label rewards" fontFamily={T.font} fontSize={24} fill={T.text} position={[200, -125]} opacity={0} />
        <Arrow ref={a => lArrows.push(a)} points={bendPoints([280, 50], [200, 120], [120, 50])} stroke={T.text} lineWidth={4} arrowSize={16} />
        <Txt ref={n => lLabels.push(n)} text="sample completions" fontFamily={T.font} fontSize={24} fill={T.text} position={[200, 128]} opacity={0} />
        <Txt ref={n => lLabels.push(n)} text="reinforcement learning" fontFamily={T.font} fontSize={28} fontWeight={700} fill={redText} position={[200, 200]} opacity={0} />
      </Rect>

      <Rect ref={right} position={[600, 0]} width={640} height={520} radius={36} fill={teal} stroke={tealStroke} lineWidth={3} scale={0}>
        <Txt text="Direct Preference Optimization (DPO)" fontFamily={T.font} fontSize={32} fontWeight={700} fill={T.text} position={[-280, -210]} offset={[-1, 0]} />
        {promptTxt(-280, -140)}
        {prefData(-150, 0)}
        <Arrow ref={a => rArrows.push(a)} points={[[-10, 0], [110, 0]]} stroke={T.text} lineWidth={4} arrowSize={16} />
        <Txt ref={n => rLabels.push(n)} text="maximum likelihood" fontFamily={T.font} fontSize={24} fontWeight={700} fill={tealText} position={[50, 105]} opacity={0} />
        {net(210, 0, 'final LM', '#8aa7c8')}
      </Rect>
    </>,
  );

  yield* pop(left(), 0.6);
  yield* draw(lArrows[0], 0.5);
  yield* fadeIn(lLabels[0]);
  yield* waitFor(0.3);
  yield* all(draw(lArrows[1], 0.7), fadeIn(lLabels[1]));
  yield* all(draw(lArrows[2], 0.7), fadeIn(lLabels[2]));
  yield* fadeIn(lLabels[3]);
  // the RL loop keeps cycling
  for (let i = 0; i < 2; i++) {
    yield* lArrows[1].stroke(redText, 0.25);
    yield* all(lArrows[1].stroke(T.text, 0.25), lArrows[2].stroke(redText, 0.25));
    yield* lArrows[2].stroke(T.text, 0.25);
  }
  yield* waitFor(0.4);

  yield* pop(right(), 0.6);
  yield* draw(rArrows[0], 0.6);
  yield* fadeIn(rLabels[0]);
  yield* waitFor(0.6);

  const caption = createRef<Layout>();
  view.add(
    <Layout ref={caption} layout direction="column" alignItems="center" gap={8} position={[0, 360]} opacity={0}>
      <Txt text="Existing methods first fit a reward model to human preferences over pairs of responses, then use RL to find a policy that maximises the learned reward." fontFamily={T.font} fontSize={24} fill={T.text} />
      <Txt text="DPO directly optimises the policy that best satisfies the preferences with a simple classification objective —" fontFamily={T.font} fontSize={24} fill={T.text} />
      <Txt text="it fits an implicit reward model whose optimal policy can be extracted in closed form. No reward model, no RL loop." fontFamily={T.font} fontSize={24} fill={tealText} />
    </Layout>,
  );
  yield* fadeIn(caption(), 0.6);
  yield* waitFor(3);
});
