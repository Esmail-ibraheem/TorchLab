import {Latex, Layout, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {bendPoints, drawAll, fadeIn, fadeOut, popAll} from '../lib/anim';
import {Arrow, Box, DashedArrow, DocIcon, HumanIcon, NeuralNet, Window, addTitle} from '../lib/ui';
import {T} from '../theme';

/**
 * Recapping RLHF techniques:
 *  A. Stiennon et al. 2020 — human feedback → reward model → PPO (TL;DR summarisation)
 *  B. Anthropic 2022 — data collection and model training workflow
 */
export default makeScene2D(function* (view) {
  const title = addTitle(view, 'Recapping RLHF techniques');
  yield* title.opacity(1, 0.5);

  /* ------------------------------------------------------------ A */
  const tan = '#3a2d22', tanStroke = '#d9a06b';
  const grn = '#20351f', grnStroke = '#8fc47a';
  const pur = '#2a2440', purStroke = '#a99bd8';
  const partA = createRef<Node>();
  const aItems: Node[] = [];
  const aArrows: Line[] = [];
  const aText: Node[] = [];

  const card = (x: number, y: number, w: number, h: number, color: string, stroke: string, children?: any) => (
    <Rect ref={n => aItems.push(n)} position={[x, y]} width={w} height={h} radius={12} fill={color} stroke={stroke} lineWidth={2} scale={0}>
      {children}
    </Rect>
  );
  const post = (color = tanStroke, w = 70, h = 90) => <DocIcon color={color} width={w} height={h} lines={5} />;
  const side = (x: number, y: number, lines: string[]) => (
    <Layout ref={n => aText.push(n)} layout direction="column" alignItems="start" gap={2} position={[x, y]} offset={[-1, 0]} opacity={0}>
      {lines.map(l => (
        <Txt text={l} fontFamily={T.font} fontSize={20} fill={T.text} />
      ))}
    </Layout>
  );
  const head = (x: number, n: string, text: string) => (
    <Layout ref={n2 => aText.push(n2)} layout gap={12} alignItems="center" position={[x, -440]} offset={[-1, 0]} opacity={0}>
      <Rect width={30} height={30} radius={15} fill={T.text} layout justifyContent="center" alignItems="center"><Txt text={n} fontFamily={T.font} fontSize={18} fontWeight={700} fill={T.bg} /></Rect>
      <Txt text={text} fontFamily={T.font} fontSize={30} fontWeight={700} fill={T.text} />
    </Layout>
  );
  const va = (x: number, y0: number, y1: number, color = T.muted) => (
    <Arrow ref={a => aArrows.push(a)} points={[[x, y0], [x, y1]]} stroke={color} lineWidth={3} arrowSize={12} />
  );
  const rmBox = (x: number, y: number) =>
    card(x, y, 100, 90, grn, grnStroke, (
      <>
        <NeuralNet color={grnStroke} width={56} height={44} y={-6} nodeSize={9} layers={[3, 3, 2]} />
        <Rect width={24} height={20} radius={4} fill={grnStroke} x={36} y={30}><Latex tex="r" fill={T.bg} fontSize={16} /></Rect>
      </>
    ));

  const C1 = -640, C2 = 0, C3 = 640;
  view.add(
    <Node ref={partA}>
      {head(C1 - 300, '1', 'Collect human feedback')}
      {head(C2 - 300, '2', 'Train reward model')}
      {head(C3 - 300, '3', 'Train policy with PPO')}
      <Line points={[[-320, -470], [-320, 470]]} stroke={T.panelStroke} lineWidth={3} />
      <Line points={[[320, -470], [320, 470]]} stroke={T.panelStroke} lineWidth={3} />

      {/* column 1 */}
      {card(C1 + 120, -320, 180, 130, tan, tanStroke, post())}
      {side(C1 - 300, -320, ['A Reddit post is', 'sampled from the', 'Reddit TL;DR dataset.'])}
      {va(C1 + 120, -252, -215)}
      {card(C1 + 120, -140, 180, 120, tan, tanStroke, (
        <>{[-40, -20, 0, 20, 40].map((x, i) => <DocIcon color={tanStroke} width={44} height={40} lines={3} x={x} y={(i % 2) * 14 - 7} />)}</>
      ))}
      {side(C1 - 300, -140, ['Various policies', 'are used to', 'sample a set of', 'summaries.'])}
      {va(C1 + 70, -78, -40)}
      {va(C1 + 170, -78, -40)}
      {card(C1 + 60, 10, 90, 70, tan, tanStroke, <><DocIcon color={tanStroke} width={40} height={36} lines={3} x={-8} /><Txt text="j" fontFamily={T.font} fontSize={16} fill={T.bg} x={26} y={14} /><Rect width={20} height={20} radius={10} fill={tanStroke} x={26} y={14}><Txt text="j" fontFamily={T.font} fontSize={14} fill={T.bg} /></Rect></>)}
      {card(C1 + 180, 10, 90, 70, tan, tanStroke, <><DocIcon color={tanStroke} width={40} height={36} lines={3} x={-8} /><Rect width={20} height={20} radius={10} fill={tanStroke} x={26} y={14}><Txt text="k" fontFamily={T.font} fontSize={14} fill={T.bg} /></Rect></>)}
      {side(C1 - 300, 10, ['Two summaries', 'are selected for', 'evaluation.'])}
      <Arrow ref={a => aArrows.push(a)} points={[[C1 + 60, 48], [C1 + 60, 80], [C1 + 120, 80], [C1 + 120, 115]]} stroke={T.muted} lineWidth={3} arrowSize={12} radius={8} />
      <Arrow ref={a => aArrows.push(a)} points={[[C1 + 180, 48], [C1 + 180, 80], [C1 + 120, 80], [C1 + 120, 115]]} stroke={T.muted} lineWidth={3} arrowSize={12} radius={8} />
      {card(C1 + 120, 190, 130, 130, '#1e2a3a', '#7fb0d8', <HumanIcon color="#cfe2f3" size={80} />)}
      {side(C1 - 300, 190, ['A human judges', 'which is a better', 'summary of the', 'post.'])}
      {va(C1 + 120, 258, 300)}
      {card(C1 + 120, 350, 220, 70, pur, purStroke, <Txt text="“j is better than k”" fontFamily={T.font} fontSize={20} fontStyle="italic" fill={purStroke} />)}

      {/* column 2 */}
      {card(C2 + 60, -320, 120, 130, tan, tanStroke, <><DocIcon color={tanStroke} width={60} height={80} lines={5} y={-6} /><Rect width={44} height={30} radius={4} fill={tan} stroke={tanStroke} lineWidth={2} x={20} y={30} /><Rect width={16} height={16} radius={8} fill={tanStroke} x={38} y={40}><Txt text="j" fontFamily={T.font} fontSize={11} fill={T.bg} /></Rect></>)}
      {card(C2 + 210, -320, 120, 130, tan, tanStroke, <><DocIcon color={tanStroke} width={60} height={80} lines={5} y={-6} /><Rect width={44} height={30} radius={4} fill={tan} stroke={tanStroke} lineWidth={2} x={20} y={30} /><Rect width={16} height={16} radius={8} fill={tanStroke} x={38} y={40}><Txt text="k" fontFamily={T.font} fontSize={11} fill={T.bg} /></Rect></>)}
      {side(C2 - 300, -320, ['One post with', 'two summaries', 'judged by a', 'human are fed', 'to the reward', 'model.'])}
      {va(C2 + 60, -252, -215)}
      {va(C2 + 210, -252, -215)}
      {rmBox(C2 + 60, -160)}
      {rmBox(C2 + 210, -160)}
      {side(C2 - 300, -160, ['The reward', 'model calculates', 'a reward r for', 'each summary.'])}
      {va(C2 + 60, -112, -75)}
      {va(C2 + 210, -112, -75)}
      {card(C2 + 60, -40, 56, 56, T.panel, T.panelStroke, <Latex tex="r_j" fill={T.text} fontSize={26} />)}
      {card(C2 + 210, -40, 56, 56, T.panel, T.panelStroke, <Latex tex="r_k" fill={T.text} fontSize={26} />)}
      <Arrow ref={a => aArrows.push(a)} points={[[C2 + 60, -10], [C2 + 60, 30], [C2 + 135, 30], [C2 + 135, 60]]} stroke={T.muted} lineWidth={3} arrowSize={12} radius={8} />
      <Arrow ref={a => aArrows.push(a)} points={[[C2 + 210, -10], [C2 + 210, 30], [C2 + 135, 30], [C2 + 135, 60]]} stroke={T.muted} lineWidth={3} arrowSize={12} radius={8} />
      {card(C2 + 135, 110, 300, 80, T.panel, T.panelStroke, <Latex tex="\mathrm{loss} = \log\big(\sigma(r_j - r_k)\big)" fill={T.text} fontSize={28} />)}
      {side(C2 - 300, 110, ['The loss is', 'calculated based', 'on the rewards', 'and human label,', 'and is used to', 'update the', 'reward model.'])}
      {va(C2 + 135, 250, 160)}
      {card(C2 + 135, 300, 220, 70, pur, purStroke, <Txt text="“j is better than k”" fontFamily={T.font} fontSize={20} fontStyle="italic" fill={purStroke} />)}
      <DashedArrow ref={a => aArrows.push(a)} points={bendPoints([C2 - 20, 110], [C2 - 60, -60], [C2 + 20, -190])} stroke={grnStroke} lineWidth={2} arrowSize={10} lineDash={[6, 8]} />
      <DashedArrow ref={a => aArrows.push(a)} points={bendPoints([C2 + 290, 110], [C2 + 330, -60], [C2 + 250, -190])} stroke={grnStroke} lineWidth={2} arrowSize={10} lineDash={[6, 8]} />

      {/* column 3 */}
      {card(C3 + 120, -320, 180, 130, tan, tanStroke, post())}
      {side(C3 - 300, -320, ['A new post is', 'sampled from the', 'dataset.'])}
      {va(C3 + 120, -252, -215)}
      {card(C3 + 120, -160, 100, 90, pur, purStroke, (
        <>
          <NeuralNet color={purStroke} width={56} height={44} y={-6} nodeSize={9} layers={[3, 3, 2]} />
          <Rect width={24} height={20} radius={4} fill={purStroke} x={36} y={30}><Latex tex="\pi" fill={T.bg} fontSize={16} /></Rect>
        </>
      ))}
      {side(C3 - 300, -160, ['The policy π', 'generates a', 'summary for the', 'post.'])}
      {va(C3 + 120, -112, -75)}
      {card(C3 + 120, -30, 100, 70, tan, tanStroke, <DocIcon color={tanStroke} width={44} height={40} lines={3} />)}
      {va(C3 + 120, 8, 45)}
      {rmBox(C3 + 120, 95)}
      {side(C3 - 300, 95, ['The reward', 'model calculates', 'a reward for the', 'summary.'])}
      {va(C3 + 120, 143, 180)}
      {card(C3 + 120, 220, 56, 56, T.panel, T.panelStroke, <Latex tex="r" fill={T.text} fontSize={26} />)}
      {side(C3 - 300, 220, ['The reward is', 'used to update', 'the policy via', 'PPO.'])}
      <DashedArrow ref={a => aArrows.push(a)} points={bendPoints([C3 + 150, 220], [C3 + 230, 30], [C3 + 175, -165])} stroke={purStroke} lineWidth={2} arrowSize={10} lineDash={[6, 8]} />
      <Txt text="Figure 2 (Stiennon et al. 2020): human feedback, reward model training, and policy training procedure." fontFamily={T.font} fontSize={22} fill={T.muted} position={[0, 440]} />
    </Node>,
  );

  yield* sequence(0.1, ...aText.slice(0, 3).map(h => h.opacity(1, 0.4)));
  yield* all(
    popAll(aItems, 0.07, 0.4),
    sequence(0.12, ...aText.slice(3).map(t => t.opacity(1, 0.35))),
  );
  yield* drawAll(aArrows, 0.06, 0.4);
  yield* waitFor(3);
  yield* fadeOut(partA(), 0.5);

  /* ------------------------------------------------------------ B */
  const partB = createRef<Node>();
  const bItems: Node[] = [];
  const bArrows: Line[] = [];
  const lav = '#2a2a48', lavStroke = '#9d93f0';
  const rose = '#3d2028', roseStroke = '#f08a8a';
  const sky = '#1e3340', skyStroke = '#8ad0f0';
  const magenta = '#a02a8a';

  const diamond = (x: number, y: number, lines: string[], size = 150) => (
    <Node ref={n => bItems.push(n)} position={[x, y]} scale={0}>
      <Rect width={size} height={size} radius={10} rotation={45} fill={lav} stroke={lavStroke} lineWidth={3} />
      <Layout layout direction="column" alignItems="center">
        {lines.map(l => <Txt text={l} fontFamily={T.font} fontSize={20} fill={T.text} />)}
      </Layout>
    </Node>
  );
  const rbox = (x: number, y: number, lines: string[], w = 220, h = 130) => (
    <Box ref={n => bItems.push(n)} position={[x, y]} width={w} height={h} labels={lines} color={rose} stroke={roseStroke} fontSize={22} radius={8} scale={0} />
  );
  const ar = (points: any, color = lavStroke, extra: any = {}) => (
    <Arrow ref={a => bArrows.push(a)} points={points} stroke={color} lineWidth={3} arrowSize={12} radius={10} {...extra} />
  );

  view.add(
    <Node ref={partB} opacity={0}>
      {diamond(-780, -260, ['Pretrained', 'LM'])}
      {rbox(-330, -260, ['Preference Model', 'Pretraining (PMP)'])}
      {rbox(-20, -260, ['Human-Feedback', 'Fine-Tuning'])}
      {diamond(290, -260, ['Preference', 'Model'])}
      {rbox(-780, 40, ['HHH prompt', 'context distillation'])}
      {diamond(-470, 40, ['Initial Policy'], 160)}
      {rbox(-170, 40, ['RLHF (PPO)'])}
      <Node ref={n => bItems.push(n)} position={[130, 40]} scale={0}>
        {[24, 12, 0].map(d => <Rect width={140} height={140} radius={10} rotation={45} fill={lav} stroke={lavStroke} lineWidth={3} y={d} />)}
        <Layout layout direction="column" alignItems="center"><Txt text="RLHF" fontFamily={T.font} fontSize={20} fill={T.text} /><Txt text="Policies" fontFamily={T.font} fontSize={20} fill={T.text} /></Layout>
      </Node>
      <Node ref={n => bItems.push(n)} position={[560, 170]} scale={0}>
        <Window width={330} height={250} color={magenta} />
        <Txt text="Human Feedback Interface" fontFamily={T.font} fontSize={20} fill={T.text} y={-70} />
        <Rect width={120} height={22} radius={6} fill="#55556a" x={-80} y={-25} />
        <Rect width={180} height={40} radius={8} fill="#7a74f2" x={40} y={25} />
        <Rect width={180} height={40} radius={8} fill="#55556a" x={40} y={75} />
      </Node>
      <Box ref={n => bItems.push(n)} position={[780, -90]} width={170} height={100} labels={['Human-Feedback', 'Comparison Data']} color={sky} stroke={skyStroke} fontSize={17} radius={8} scale={0} />

      {ar([[-700, -260], [-445, -260]])}
      {ar([[-215, -260], [-135, -260]])}
      {ar([[95, -260], [205, -260]])}
      {ar([[290, -180], [290, -120], [-170, -120], [-170, -28]])}
      {ar([[-780, -180], [-780, -28]])}
      {ar([[-665, 40], [-555, 40]])}
      {ar([[-385, 40], [-283, 40]])}
      {ar([[-55, 40], [30, 40]])}
      {ar([[200, 90], [200, 200], [385, 200]])}
      {ar([[-470, 125], [-470, 230], [385, 230]])}
      {ar([[730, 170], [800, 170], [800, -35]], magenta)}
      {ar([[800, -145], [800, -370], [-20, -370], [-20, -330]], magenta)}
      <Txt text="Figure 2 (Bai et al. 2022, Anthropic): data collection and model training workflow." fontFamily={T.font} fontSize={22} fill={T.muted} position={[-200, 440]} />
    </Node>,
  );
  partB().opacity(1);
  yield* popAll(bItems, 0.12, 0.45);
  yield* drawAll(bArrows, 0.12, 0.5);
  yield* waitFor(3);
});
