import {makeProject} from '@motion-canvas/core';

// Every clip is one scene; the file name is the output folder / video name.
import s01 from './scenes/01-rl-loop?scene';
import s02 from './scenes/02-cat-grid?scene';
import s03 from './scenes/03-rl-to-lm?scene';
import s04 from './scenes/04-history?scene';
import s05 from './scenes/05-instructgpt-3-steps?scene';
import s06 from './scenes/06-hf-pipeline-overview?scene';
import s07 from './scenes/07-hf-pretraining?scene';
import s08 from './scenes/08-hf-reward-model?scene';
import s09 from './scenes/09-rm-loss?scene';
import s10 from './scenes/10-ppo-ptx-objective?scene';
import s11 from './scenes/11-hf-rl-finetune?scene';
import s12 from './scenes/12-recap?scene';
import s13 from './scenes/13-trajectories?scene';
import s14 from './scenes/14-ppo-loss?scene';
import s15 from './scenes/15-ppo-algorithm?scene';
import s16 from './scenes/16-dpo-vs-rlhf?scene';
import s17 from './scenes/17-dpo-derivation?scene';
import s18 from './scenes/18-dpo-theory?scene';
import s19 from './scenes/19-preliminaries?scene';
import s20 from './scenes/20-ppo-vs-dpo-charts?scene';

const all = [s01, s02, s03, s04, s05, s06, s07, s08, s09, s10,
             s11, s12, s13, s14, s15, s16, s17, s18, s19, s20];

// VITE_SCENES="01-rl-loop,09-rm-loss" limits a render to a subset (see scripts/render.mjs).
const only = (import.meta.env.VITE_SCENES as string | undefined)?.split(',').map(s => s.trim()).filter(Boolean);
const scenes = only?.length ? all.filter(s => only.some(name => s.name === name)) : all;

export default makeProject({
  name: 'rlhf',
  scenes,
});
