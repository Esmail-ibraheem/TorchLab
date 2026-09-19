import {
  Circle,
  Layout,
  LayoutProps,
  Line,
  LineProps,
  Node,
  NodeProps,
  Rect,
  RectProps,
  Txt,
  TxtProps,
  View2D,
} from '@motion-canvas/2d';
import {PossibleVector2, Vector2} from '@motion-canvas/core';
import {T} from '../theme';

/* ---------- text ---------- */

/** Small muted caption in the top-left corner naming the figure. */
export function addTitle(view: View2D, text: string): Txt {
  const t = (
    <Txt
      text={text}
      fontFamily={T.font}
      fontSize={30}
      fill={T.muted}
      position={[-940, -510]}
      offset={[-1, -1]}
      opacity={0}
    />
  ) as Txt;
  view.add(t);
  return t;
}

export function Label(props: TxtProps) {
  return (
    <Txt
      fontFamily={T.font}
      fontSize={34}
      fill={T.text}
      textAlign="center"
      {...props}
    />
  );
}

/** Several lines of text stacked in a column. */
export function Lines({
  lines,
  gap = 10,
  ...props
}: LayoutProps & {lines: string[]} & Pick<TxtProps, 'fontSize' | 'fill' | 'textAlign' | 'fontWeight' | 'fontFamily'>) {
  const {fontSize, fill, textAlign, fontWeight, fontFamily, ...rest} = props as any;
  return (
    <Layout layout direction="column" gap={gap} alignItems={textAlign === 'left' ? 'start' : textAlign === 'right' ? 'end' : 'center'} {...rest}>
      {lines.map(l => (
        <Txt
          text={l}
          fontFamily={fontFamily ?? T.font}
          fontSize={fontSize ?? 34}
          fill={fill ?? T.text}
          fontWeight={fontWeight}
          textAlign={textAlign ?? 'center'}
        />
      ))}
    </Layout>
  );
}

/* ---------- shapes ---------- */

export interface BoxProps extends RectProps {
  label?: string;
  labels?: string[];
  color?: string;
  stroke?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: number;
}

/** Rounded, labelled box. Auto-sizes to its label unless width/height are given. */
export function Box({
  label,
  labels,
  color = T.panel,
  stroke = T.panelStroke,
  textColor = T.text,
  fontSize = 34,
  fontWeight = 500,
  ...props
}: BoxProps) {
  const ls = labels ?? (label !== undefined ? [label] : []);
  return (
    <Rect
      radius={18}
      fill={color}
      stroke={stroke}
      lineWidth={3}
      padding={[18, 30]}
      layout
      direction="column"
      gap={6}
      justifyContent="center"
      alignItems="center"
      {...props}
    >
      {ls.map(l => (
        <Txt
          text={l}
          fontFamily={T.font}
          fontSize={fontSize}
          fontWeight={fontWeight}
          fill={textColor}
          textAlign="center"
        />
      ))}
    </Rect>
  );
}

/** Arrow line; starts hidden (end=0) so scenes can grow it with end(1, t). */
export function Arrow(props: LineProps) {
  return (
    <Line
      stroke={T.line}
      lineWidth={6}
      endArrow
      arrowSize={20}
      lineCap="round"
      lineJoin="round"
      end={0}
      {...props}
    />
  );
}

/** Dashed arrow variant. */
export function DashedArrow(props: LineProps) {
  return <Arrow lineDash={[16, 14]} {...props} />;
}

/* ---------- icons ---------- */

export interface NeuralNetProps extends NodeProps {
  color?: string;
  /** Optional per-layer node colours (falls back to `color`). */
  layerColors?: string[];
  layers?: number[];
  width?: number;
  height?: number;
  nodeSize?: number;
  lineWidth?: number;
}

/** Small fully-connected network icon (3-4-3 by default). */
export function NeuralNet({
  color = T.policy,
  layerColors,
  layers = [3, 4, 3],
  width = 170,
  height = 120,
  nodeSize = 18,
  lineWidth = 2,
  ...props
}: NeuralNetProps) {
  const cols: Vector2[][] = layers.map((n, i) => {
    const x = layers.length === 1 ? 0 : -width / 2 + (i * width) / (layers.length - 1);
    return Array.from({length: n}, (_, j) => {
      const y = n === 1 ? 0 : -height / 2 + (j * height) / (n - 1);
      return new Vector2(x, y);
    });
  });
  const edges: Line[] = [];
  for (let i = 0; i < cols.length - 1; i++) {
    for (const a of cols[i]) {
      for (const b of cols[i + 1]) {
        edges.push(
          (<Line points={[a, b]} stroke={color} lineWidth={lineWidth} opacity={0.55} />) as Line,
        );
      }
    }
  }
  return (
    <Node {...props}>
      {edges}
      {cols.flatMap((col, i) =>
        col.map(p => <Circle position={p} size={nodeSize} fill={layerColors?.[i] ?? color} />),
      )}
    </Node>
  );
}

export interface DocIconProps extends NodeProps {
  color?: string;
  width?: number;
  height?: number;
  lines?: number;
}

/** A document: page outline with a few text lines. */
export function DocIcon({color = T.text, width = 70, height = 90, lines = 4, ...props}: DocIconProps) {
  const pad = width * 0.18;
  return (
    <Node {...props}>
      <Rect width={width} height={height} radius={8} stroke={color} lineWidth={3} fill={T.bg} />
      {Array.from({length: lines}, (_, i) => {
        const y = -height / 2 + pad + i * ((height - 2 * pad) / (lines - 1));
        const w = i === lines - 1 ? (width - 2 * pad) * 0.55 : width - 2 * pad;
        return (
          <Line
            points={[
              [-width / 2 + pad, y],
              [-width / 2 + pad + w, y],
            ]}
            stroke={color}
            lineWidth={3}
            lineCap="round"
            opacity={0.8}
          />
        );
      })}
    </Node>
  );
}

export interface HumanIconProps extends NodeProps {
  color?: string;
  size?: number;
}

/** Head + shoulders person glyph. */
export function HumanIcon({color = T.purple, size = 90, ...props}: HumanIconProps) {
  return (
    <Node {...props}>
      <Circle size={size * 0.42} fill={color} y={-size * 0.28} />
      <Rect
        width={size * 0.8}
        height={size * 0.5}
        radius={[size * 0.4, size * 0.4, size * 0.12, size * 0.12]}
        fill={color}
        y={size * 0.22}
      />
    </Node>
  );
}

/** Simple monitor/window frame used for the "human feedback interface". */
export function Window({width = 300, height = 220, color = T.purple, ...props}: NodeProps & {width?: number; height?: number; color?: string}) {
  return (
    <Node {...props}>
      <Rect width={width} height={height} radius={14} stroke={color} lineWidth={4} fill={T.panel} />
      <Rect width={width} height={34} radius={[14, 14, 0, 0]} fill={color} y={-height / 2 + 17} />
      {[0, 1, 2].map(i => (
        <Circle size={10} fill={T.bg} x={-width / 2 + 20 + i * 18} y={-height / 2 + 17} />
      ))}
    </Node>
  );
}

/** Grid of square cells. */
export function Grid({cols, rows, cell, color = T.dim, ...props}: NodeProps & {cols: number; rows: number; cell: number; color?: string}) {
  const w = cols * cell;
  const h = rows * cell;
  const ls: Line[] = [];
  for (let i = 0; i <= cols; i++) {
    ls.push((<Line points={[[-w / 2 + i * cell, -h / 2], [-w / 2 + i * cell, h / 2]]} stroke={color} lineWidth={3} />) as Line);
  }
  for (let j = 0; j <= rows; j++) {
    ls.push((<Line points={[[-w / 2, -h / 2 + j * cell], [w / 2, -h / 2 + j * cell]]} stroke={color} lineWidth={3} />) as Line);
  }
  return <Node {...props}>{ls}</Node>;
}

/** Helper: straight arrow from point a to point b, shortened by `inset` on both ends. */
export function segment(a: PossibleVector2, b: PossibleVector2, insetA = 0, insetB = 0): [Vector2, Vector2] {
  const va = new Vector2(a);
  const vb = new Vector2(b);
  const dir = vb.sub(va).normalized;
  return [va.add(dir.scale(insetA)), vb.sub(dir.scale(insetB))];
}
