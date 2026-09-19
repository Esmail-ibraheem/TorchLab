import {Circle, Line, Node, NodeProps, Rect, Txt} from '@motion-canvas/2d';
import {T} from '../theme';

/** The RL1.png robot silhouette (antenna, visor head, three-dot body, arms, legs). */
export function Robot({color = T.text, size = 260, ...props}: NodeProps & {color?: string; size?: number}) {
  const s = size / 260;
  return (
    <Node {...props} scale={s}>
      {/* antenna */}
      <Line points={[[0, -150], [0, -118]]} stroke={color} lineWidth={8} lineCap="round" />
      <Circle size={22} fill={color} y={-158} />
      {/* head */}
      <Rect width={190} height={130} radius={40} fill={color} y={-60} />
      <Rect width={140} height={44} radius={22} fill={T.bg} y={-58} />
      <Circle size={22} fill={color} x={-36} y={-58} />
      <Circle size={22} fill={color} x={36} y={-58} />
      {/* body */}
      <Rect width={210} height={130} radius={26} fill={color} y={50} />
      {[-30, 0, 30].map(x => (
        <Circle size={14} fill={T.bg} x={x} y={68} />
      ))}
      {/* arms */}
      <Rect width={30} height={110} radius={15} fill={color} x={-125} y={40} />
      <Rect width={30} height={110} radius={15} fill={color} x={125} y={40} />
      <Circle size={34} fill={color} x={-125} y={100} />
      <Circle size={34} fill={color} x={125} y={100} />
      {/* legs */}
      <Rect width={30} height={60} radius={15} fill={color} x={-55} y={140} />
      <Rect width={30} height={60} radius={15} fill={color} x={55} y={140} />
      <Rect width={60} height={22} radius={11} fill={color} x={-55} y={174} />
      <Rect width={60} height={22} radius={11} fill={color} x={55} y={174} />
    </Node>
  );
}

/** A stylised globe: dark disc with green land masses. */
export function Earth({size = 280, ...props}: NodeProps & {size?: number}) {
  const s = size / 280;
  const land = '#8bbf5a';
  return (
    <Node {...props} scale={s}>
      <Circle size={280} fill="#22252b" stroke={land} lineWidth={6} clip>
        <Rect width={110} height={90} radius={[50, 30, 60, 40]} fill={land} x={-50} y={-60} rotation={-15} />
        <Rect width={60} height={110} radius={[30, 20, 40, 40]} fill={land} x={-35} y={45} rotation={10} />
        <Rect width={90} height={70} radius={[40, 40, 30, 50]} fill={land} x={60} y={-30} />
        <Rect width={70} height={80} radius={[30, 40, 40, 30]} fill={land} x={80} y={60} rotation={20} />
        <Rect width={40} height={30} radius={15} fill={land} x={20} y={110} />
      </Circle>
    </Node>
  );
}

/** A "token" chip used in the language-model diagrams. */
export function Token({text, color = T.policy, ...props}: NodeProps & {text: string; color?: string}) {
  return (
    <Node {...props}>
      <Rect
        radius={10}
        fill={color}
        layout
        padding={[8, 16]}
        alignItems="center"
        justifyContent="center"
      >
        <Txt text={text} fontFamily={T.mono} fontSize={30} fill={T.bg} fontWeight={700} />
      </Rect>
    </Node>
  );
}

/** A stack of pages (the "Prompts Dataset" glyph in the HF figure). */
export function PageStack({color = '#d9b07a', width = 130, height = 100, count = 5, ...props}: NodeProps & {color?: string; width?: number; height?: number; count?: number}) {
  return (
    <Node {...props}>
      {Array.from({length: count}, (_, i) => (
        <Rect
          width={width}
          height={height}
          radius={6}
          fill={color}
          opacity={0.35 + (0.65 * (i + 1)) / count}
          x={-((count - 1) * 6) / 2 + i * 6}
          y={((count - 1) * 6) / 2 - i * 6}
          stroke={T.bg}
          lineWidth={2}
        />
      ))}
    </Node>
  );
}

/** Keyboard glyph (the "Human Augmented Text" box). */
export function Keyboard({color = T.muted, ...props}: NodeProps & {color?: string}) {
  const keys: any[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 8; c++) {
      keys.push(<Rect width={14} height={10} radius={2} fill={color} x={-56 + c * 16 + (r === 1 ? 4 : 0)} y={-14 + r * 14} />);
    }
  }
  return (
    <Node {...props}>
      <Rect width={150} height={64} radius={8} stroke={color} lineWidth={3} />
      {keys}
      <Rect width={80} height={8} radius={2} fill={color} y={22} />
    </Node>
  );
}

/** Trophy (preferred response marker in the DPO figure). */
export function Trophy({size = 40, ...props}: NodeProps & {size?: number}) {
  return (
    <Txt text="🏆" fontSize={size} {...(props as any)} />
  );
}
