import motionCanvasPlugin from '@motion-canvas/vite-plugin';
import {defineConfig} from 'vite';

// The plugin ships as CJS; depending on how the config is bundled the default
// export is either the function itself or {default: fn}.
const motionCanvas = ((motionCanvasPlugin as any).default ?? motionCanvasPlugin) as typeof motionCanvasPlugin;

export default defineConfig({
  plugins: [
    motionCanvas({
      project: ['./src/project.ts'],
    }),
  ],
});
