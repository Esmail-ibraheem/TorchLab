"""Build ../Readme-v2.md from ../Readme.md: same prose, every figure/equation image replaced by its clip.

Run from RLHF/motion:  python scripts/build-readme.py
"""
import os
import re

here = os.path.dirname(os.path.abspath(__file__))
rlhf = os.path.abspath(os.path.join(here, '..', '..'))
src = open(os.path.join(rlhf, 'Readme.md'), encoding='utf-8').read().split('\n')
out = []


def clip(name, alt):
    return [f'![{alt}](videos/{name}.gif)', '', f'<sub>▶ [mp4](videos/{name}.mp4)</sub>']


def is_img(l):
    return l.startswith('![') and 'github.com/Esmail-ibraheem/Axon/assets' in l


def key(l):
    return l[2:l.index(']')]


EQ = {
    'Pasted image 20240429152538': r'$$\pi^* = \arg\max_\pi J(\pi)$$',
    'Pasted image 20240429152616': r'$$J(\pi) = \int_\tau P(\tau \mid \pi)\, R(\tau) = \mathop{\mathbb{E}}_{\tau \sim \pi}\big[R(\tau)\big]$$',
    'Pasted image 20240429152631': r'$$\tau = (s_0, a_0, s_1, a_1, \ldots)$$',
    'Pasted image 20240429152649': r'$$s_{t+1} \sim P(\cdot \mid s_t, a_t)$$',
    'Pasted image 20240429152717': r'$$P(\tau \mid \pi) = \rho_0(s_0) \prod_{t=0}^{T-1} P(s_{t+1} \mid s_t, a_t)\, \pi(a_t \mid s_t)$$',
    'Pasted image 20240429152733': r'$$R(\tau) = \sum_{t=0}^{\infty} \gamma^t r_t$$',
    'Pasted image 20240429152913': r'$$\hat g = \frac{1}{|\mathcal{D}|} \sum_{\tau \in \mathcal{D}} \sum_{t=0}^{T} \nabla_\theta \log \pi_\theta(a_t \mid s_t)\, R(\tau), \qquad \theta_{k+1} = \theta_k + \alpha\, \nabla_\theta J(\pi_\theta)\big|_{\theta_k}$$',
}

PPO_OBJ = r'$$L_t^{\mathrm{CLIP}+\mathrm{VF}+S}(\theta) = \hat{\mathbb{E}}_t\Big[ L_t^{\mathrm{CLIP}}(\theta) - c_1 L_t^{\mathrm{VF}}(\theta) + c_2 S[\pi_\theta](s_t) \Big]$$'
PPO_LOSSES = [
    r'$$L_{\mathrm{POLICY}} = \min\Big( \frac{\pi_\theta(a_t \mid s_t)}{\pi_{\theta_{old}}(a_t \mid s_t)}\hat A_t,\; \mathrm{clip}\Big(\frac{\pi_\theta(a_t \mid s_t)}{\pi_{\theta_{old}}(a_t \mid s_t)},\, 1-\epsilon,\, 1+\epsilon\Big)\hat A_t \Big)$$',
    r'$$L_{\mathrm{VF}} = \frac{1}{2}\, \Big\| V_{\theta}(s) - \Big( \sum_{t=0}^{T} \gamma^t r_t \;\Big|\; s_0 = s \Big) \Big\|_2^2$$',
    r'$$L_{\mathrm{ENTROPY}} = -\sum_x p(x) \log p(x)$$',
    r'$$L_{PPO} = L_{\mathrm{POLICY}} + c_1 L_{\mathrm{VF}} + c_2 L_{\mathrm{ENTROPY}}$$',
]
PTX_OBJ = r'$$\mathrm{objective}(\phi) = \mathbb{E}_{(x,y)\sim D_{\pi^{\mathrm{RL}}_\phi}}\Big[ r_\theta(x,y) - \beta \log\big(\pi^{\mathrm{RL}}_\phi(y \mid x) / \pi^{\mathrm{SFT}}(y \mid x)\big) \Big] + \gamma\, \mathbb{E}_{x \sim D_{\mathrm{pretrain}}}\Big[\log\big(\pi^{\mathrm{RL}}_\phi(x)\big)\Big]$$'
DPO_LOSS = r'$$\mathcal{L}_{\mathrm{DPO}}(\pi_\theta; \pi_{\mathrm{ref}}) = -\,\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}}\Big[ \log \sigma\Big( \beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_{\mathrm{ref}}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_{\mathrm{ref}}(y_l \mid x)} \Big) \Big]$$'

FOLDED = {  # images whose content lives in an earlier clip
    'Pasted image 20240429151951', 'Pasted image 20240429122909',  # → 04-history
    'Pasted image 20240430125633',  # → 12-recap
    'Pasted image 20240501142731',  # → 17-dpo-derivation
    'Pasted image 20240501144222', 'Pasted image 20240501144245',  # → 18-dpo-theory
}

for l in src:
    k = key(l) if is_img(l) else None
    if k == 'RL2':
        out += clip('01-rl-loop', 'The agent / environment loop')
    elif k == 'rlgame':
        out += clip('02-cat-grid', 'The cat, the broom, the bathtub and the meat')
    elif k == 'RL1':
        out += clip('03-rl-to-lm', 'Agent and environment, then the same loop as a language model')
    elif k == 'deep_rl3':
        out += clip('04-history', 'History: TAMER, deep RL from human preferences, consensus data collection, and the RLHF survey abstract')
    elif k == 'Pasted image 20240430122335':
        out += clip('05-instructgpt-3-steps', 'InstructGPT: the three steps')
    elif k == 'rlhf3':
        out += clip('06-hf-pipeline-overview', 'The three phases of RLHF')
    elif k == 'rlhf_step11':
        out += clip('07-hf-pretraining', 'Phase 1: language model pretraining')
    elif k == 'rlhf_step22':
        out += clip('08-hf-reward-model', 'Phase 2: reward model training')
    elif k == 'Pasted image 20240429125320':
        out += [PTX_OBJ, ''] + clip('10-ppo-ptx-objective', 'The PPO-ptx objective and the KL penalty')
    elif l.startswith('where ![image]('):
        out.append(r'where $\pi^{\mathrm{RL}}_\phi$')
    elif k == 'Pasted image 20240429132323':
        out += clip('11-hf-rl-finetune', 'Phase 3: fine-tuning with RL')
    elif k == 'Pasted image 20240430131111':
        out += clip('12-recap', 'Recap: Stiennon et al. (TL;DR) and the Anthropic workflow')
    elif k == 'Scheme-of-Deep-Reinforcement-Learning':
        out += clip('13-trajectories', 'Scheme of deep RL and the trajectory equations')
    elif k in EQ:
        out.append(EQ[k])
    elif k == 'image' and 'a64ce3e8' in l:
        out.append(PPO_OBJ)
    elif k == 'Pasted image 20240429153634':
        out += PPO_LOSSES + [''] + clip('14-ppo-loss', 'The PPO loss and the clipped probability ratio')
    elif k == 'Pasted image 20240501133952':
        out += clip('15-ppo-algorithm', 'Algorithm 1: PPO, Actor-Critic style')
    elif k == 'Pasted image 20240430135953':
        out += clip('16-dpo-vs-rlhf', 'RLHF versus DPO')
    elif k == 'Pasted image 20240501142641':
        out += [DPO_LOSS, ''] + clip('17-dpo-derivation', 'Deriving the DPO objective, its implicit reward and its gradient')
    elif k == 'Pasted image 20240501144218':
        out += clip('18-dpo-theory', 'Theoretical analysis of DPO')
    elif l.startswith('### Preliminaries:'):
        out += [l, ''] + clip('19-preliminaries', 'Preliminaries: SFT, reward modelling, RL fine-tuning')
    elif k == 'Pasted image 20240501132016':
        out += clip('20-ppo-vs-dpo-charts', 'PPO vs DPO: reward/KL frontier and TL;DR win rate')
    elif k in FOLDED:
        continue
    elif is_img(l):
        raise SystemExit('unhandled image line: ' + l[:80])
    else:
        out.append(l)

# The RM loss is inline LaTeX inside a paragraph; drop the clip in right after that paragraph.
for j, l in enumerate(out):
    if l.startswith('**Reward modeling (RM).**') and '$$loss(' in l:
        out[j:j + 1] = [l, ''] + clip('09-rm-loss', 'The reward-model loss')
        break
else:
    raise SystemExit('RM loss paragraph not found')

header = [
    '> **Version 2 — animated.** Every figure, drawing and equation of the original [Readme.md](Readme.md) is recreated as a short',
    '> [Motion Canvas](https://motioncanvas.io) clip. The GIFs play inline; each has an MP4 link underneath. Source for every clip: [`motion/`](motion/).',
    '',
]
text = '\n'.join(header + out)
open(os.path.join(rlhf, 'Readme-v2.md'), 'w', encoding='utf-8').write(text)
gifs = sorted(set(re.findall(r'videos/(\d\d-[a-z0-9-]+)\.gif', text)))
print(len(gifs), 'clips referenced:', ', '.join(gifs))
print('remaining external images:', len(re.findall(r'!\[[^\]]*\]\(https://', text)))
