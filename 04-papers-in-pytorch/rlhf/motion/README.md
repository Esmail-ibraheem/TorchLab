# RLHF clips — Motion Canvas source

Source for the 20 animated clips embedded in [`../README.md`](../README.md).
One scene per clip, in `src/scenes/NN-name.tsx`; the file name is the video name.

## Build

```bash
npm install
npm run build-videos        # = render + encode → ../videos/*.mp4 + *.gif
```

- `npm run render [scene…]` — headless render through the Motion Canvas editor
  (Playwright + Chromium) into `output/rlhf/<scene>/NNNNNN.png`. Pass scene
  names to re-render only those, e.g. `node scripts/render.mjs 09-rm-loss`.
- `npm run encode [scene…]` — ffmpeg: 1920×1080 30 fps H.264 MP4, plus a
  960 px 12 fps GIF (2-pass palette; steps down to 10 fps / 800 px if a GIF
  would exceed 8 MB).
- `python scripts/build-readme.py` — regenerates `../README.md` from
  `../README-original.md` (the text-only original), swapping every figure/equation image for its clip.
- `npm run serve` — the interactive editor at http://localhost:9000 for
  iterating on a scene.

## Layout

| Path | What |
|---|---|
| `src/project.ts` | scene list; `VITE_SCENES=a,b` limits a render (set by `render.mjs`) |
| `src/project.meta` | 1920×1080, 30 fps, PNG sequence grouped by scene |
| `src/theme.ts` | colours / fonts (one accent per concept: agent, environment, policy, reward model, DPO) |
| `src/lib/ui.tsx` | Box, Arrow, NeuralNet, DocIcon, HumanIcon, Grid, … |
| `src/lib/icons.tsx` | Robot, Earth, Token, PageStack, Keyboard |
| `src/lib/hf.tsx` | the Hugging Face three-phase figure, shared by clips 06/07/08/11 |
| `src/lib/anim.ts` | pop / draw / fade helpers, arc & bezier point generators |

## Notes

- Equations use the `Latex` node (MathJax → SVG). MathJax's *sized* vertical
  delimiters (`\big|`, `\Big\|`, `\underbrace`) do not survive the SVG import —
  use unsized `\lvert … \rvert` or build annotated pieces from separate nodes.
- `tex()` morphing works for balanced `{{…}}` groups only; for bracketed terms
  that grow, reveal separate `Latex` nodes in a `Layout` row instead.
- Text is Segoe UI / Consolas from the rendering machine; emoji render in colour.
