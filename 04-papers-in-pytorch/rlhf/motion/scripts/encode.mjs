// Encode every rendered scene folder into ../videos/<scene>.mp4 and .gif.
//
// Usage:
//   node scripts/encode.mjs                 # all scene folders under output/rlhf
//   node scripts/encode.mjs 01-rl-loop      # one scene
//
// MP4: 1920x1080, 30 fps, H.264 CRF 18 (yuv420p so every player opens it).
// GIF: 960 px wide, 12 fps, 2-pass palette so it renders inline on GitHub.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(root, 'output', 'rlhf');
const videosDir = path.resolve(root, '..', 'videos');
const FPS = 30;
const GIF_FPS = 12;
const GIF_WIDTH = 960;
const GIF_LIMIT_MB = 8;

fs.mkdirSync(videosDir, {recursive: true});

const requested = process.argv.slice(2);
const scenes = (requested.length ? requested : fs.readdirSync(outputDir)).filter(s =>
  fs.existsSync(path.join(outputDir, s)) && fs.statSync(path.join(outputDir, s)).isDirectory(),
);
if (!scenes.length) {
  console.error('[encode] nothing to encode under ' + outputDir);
  process.exit(1);
}

for (const scene of scenes) {
  const dir = path.join(outputDir, scene);
  const frames = fs.readdirSync(dir).filter(f => f.endsWith('.png')).sort();
  if (!frames.length) {
    console.error(`[encode] ${scene}: no frames`);
    process.exitCode = 1;
    continue;
  }
  const start = parseInt(frames[0], 10);
  const input = path.join(dir, '%06d.png');
  const mp4 = path.join(videosDir, `${scene}.mp4`);
  const gif = path.join(videosDir, `${scene}.gif`);

  ffmpeg(['-y', '-framerate', String(FPS), '-start_number', String(start), '-i', input,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4]);

  let gifFps = GIF_FPS;
  let gifWidth = GIF_WIDTH;
  for (let attempt = 0; attempt < 3; attempt++) {
    const filter = `fps=${gifFps},scale=${gifWidth}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=192:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle`;
    ffmpeg(['-y', '-i', mp4, '-vf', filter, '-loop', '0', gif]);
    const mb = fs.statSync(gif).size / 1e6;
    if (mb <= GIF_LIMIT_MB) break;
    // Too big for a README: step the GIF down and retry.
    if (attempt === 0) gifFps = 10;
    else gifWidth = 800;
  }

  const dur = (frames.length / FPS).toFixed(1);
  const mp4Mb = (fs.statSync(mp4).size / 1e6).toFixed(1);
  const gifMb = (fs.statSync(gif).size / 1e6).toFixed(1);
  console.log(`[encode] ${scene.padEnd(26)} ${frames.length} frames ${dur}s  mp4 ${mp4Mb} MB  gif ${gifMb} MB (${gifWidth}px@${gifFps}fps)`);
}

function ffmpeg(args) {
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', ...args], {stdio: 'inherit'});
}
