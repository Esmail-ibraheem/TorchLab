<p align="center">
  <picture>
    <source
      media="(prefers-color-scheme: dark)"
      srcset="assets/torchlab-light.png"
    />
    <source
      media="(prefers-color-scheme: light)"
      srcset="assets/torchlab-dark.png"
    />
    <img
      alt="TorchLab"
      src="assets/torchlab-light.png"
      width="420"
    />
  </picture>
</p>

<p align="center">
  <a href="https://arxiv.org/abs/2307.09288">
    <img src="https://img.shields.io/badge/Arxiv-llama paper%20-red" alt="https://arxiv.org/abs/2307.09288">
  </a>
  <a href="https://arxiv.org/abs/1706.03762">
    <img src="https://img.shields.io/badge/Arxiv-Transformer%20-red" alt="https://arxiv.org/abs/1706.03762">
  </a>
  <a href="https://arxiv.org/abs/2305.13245">
    <img src="https://img.shields.io/badge/Arxiv-GQA%20-red" alt="https://arxiv.org/abs/2305.13245">
  </a>
  <a href="https://arxiv.org/abs/2104.09864">
    <img src="https://img.shields.io/badge/Arxiv-RoFormer%20-red" alt="https://arxiv.org/abs/2104.09864">
  </a>

  <a href="https://arxiv.org/abs/1910.07467">
    <img src="https://img.shields.io/badge/Arxiv-RMSNorm%20-red" alt="https://arxiv.org/abs/1910.07467">
  </a>
  <a href="https://arxiv.org/abs/2104.12470">
    <img src="https://img.shields.io/badge/Arxiv-Easy and Effecient Transformer%20-red" alt="https://arxiv.org/abs/2104.12470">
  </a>
  <a href="https://arxiv.org/abs/2203.02155">
    <img src="https://img.shields.io/badge/Arxiv-InstructGPT%20-red" alt="https://arxiv.org/abs/2203.02155">
  </a>
  <a href="https://arxiv.org/abs/1707.06347">
    <img src="https://img.shields.io/badge/Arxiv-PPO%20-red" alt="https://arxiv.org/abs/1707.06347">
  </a>
  <a href="https://arxiv.org/abs/2305.18290">
    <img src="https://img.shields.io/badge/Arxiv-DPO%20-red" alt="https://arxiv.org/abs/2305.18290">
  </a>
</p>

**TorchLab** is my repository of learning and building, in order: the theory of machine learning
and deep learning, PyTorch itself, research papers implemented in PyTorch, then a deep-learning
framework built from scratch — and the same papers implemented again on top of it.

Every folder pairs the mathematics with runnable code, and every paper package explains the
paper before implementing it.

---

## The path

```
01  machine learning ──▶ 02  deep learning theory ──▶ 03  PyTorch ──▶ 04  papers in PyTorch
                                                                              │
                                     06  papers in torch-from-scratch ◀── 05  torch from scratch
```

| Stage | What | Status |
|-------|------|--------|
| [01 · Machine learning](01-machine-learning/) | classical ML from the math up, rebuilt in NumPy | syllabus |
| [02 · Deep learning theory](02-deep-learning-theory/) | backprop, optimisation, normalisation, CNN / RNN / Transformer / diffusion / RL — the derivations | syllabus |
| [03 · PyTorch](03-pytorch/) | tensors, autograd, `nn.Module`, data, training loops, mixed precision, distributed, custom kernels | syllabus |
| [04 · Papers in PyTorch](04-papers-in-pytorch/) | **Transformer**, **Llama**, **Diffusion**, **RLHF** — theory walkthrough + implementation | 4 packages |
| [05 · Torch from scratch](05-torch-from-scratch/) | build your own PyTorch: autograd, tensor, nn, optim, data | forward-mode autodiff done |
| [06 · Papers in torch-from-scratch](06-papers-in-torch-from-scratch/) | the stage-04 papers re-implemented on the home-made framework, checked against PyTorch | roadmap |

## Repository map

```
TorchLab/
├── 01-machine-learning/                 syllabus (README) — topics land as <nn>-<topic>/ folders
├── 02-deep-learning-theory/             syllabus
├── 03-pytorch/                          syllabus
├── 04-papers-in-pytorch/
│   ├── transformer/                     "Attention Is All You Need": encoder/decoder notebooks, model, EN→AR translator
│   ├── llama/                           Llama 2 with RoPE, GQA/MQA/MHA, RMSNorm, KV-cache (x_llama/, models/)
│   ├── diffusion/                       DDPM / Stable Diffusion from scratch: VAE, CLIP, U-Net, sampler, Gradio UI
│   └── rlhf/                            InstructGPT, PPO, DPO — animated walkthrough (videos/, motion/ source)
├── 05-torch-from-scratch/
│   └── autograd/forward-mode-dual-numbers/
├── 06-papers-in-torch-from-scratch/     roadmap
├── website/                             the TorchLab package site (Vue + Vite)
└── assets/                              logos
```

---
