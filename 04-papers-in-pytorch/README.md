# 04 · Papers in PyTorch

Research papers implemented in PyTorch. Every package pairs the theory (a written walkthrough of
the paper, with figures and — for RLHF — animated clips) with a working implementation.

## Layout

```
04-papers-in-pytorch/
└── <paper>/
    ├── README.md        the paper explained: math, diagrams, design decisions
    ├── assets/          figures used by the README
    └── ...              the implementation
```

## Packages

| Package | Papers | Implementation | Status |
|---------|--------|----------------|--------|
| [transformer](transformer/) | [Attention Is All You Need](https://arxiv.org/abs/1706.03762) | [`transformer/`](transformer/transformer/) — encoder, decoder, positional encoding, full model (notebooks + `Transformer.py`); [`translator/`](transformer/translator/) — an English → Arabic translator trained on it | done |
| [llama](llama/) | [Llama 2](https://arxiv.org/abs/2307.09288), [RoFormer (RoPE)](https://arxiv.org/abs/2104.09864), [GQA](https://arxiv.org/abs/2305.13245), [RMSNorm](https://arxiv.org/abs/1910.07467) | [`x_llama/`](llama/x_llama/) — the model (~500 lines), config, inference with KV-cache; [`models/`](llama/models/) — MHA / MQA / GQA attentions, rotary embeddings | done |
| [diffusion](diffusion/) | [DDPM](https://arxiv.org/abs/2006.11239), [Latent Diffusion](https://arxiv.org/abs/2112.10752) | Stable Diffusion from scratch: VAE encoder / decoder, CLIP text encoder, U-Net with attention, DDPM sampler, Gradio UI | done |
| [rlhf](rlhf/) | [InstructGPT](https://arxiv.org/abs/2203.02155), [PPO](https://arxiv.org/abs/1707.06347), [DPO](https://arxiv.org/abs/2305.18290), [RLHF survey](https://arxiv.org/abs/2312.14925) | theory walkthrough with 20 animated clips ([`motion/`](rlhf/motion/) is the Motion Canvas source); PPO / DPO fine-tuning code | notes done · code planned |

## Next

Candidates for the next packages, roughly in the order they build on each other:

- [ ] GPT-2 / nanoGPT-style decoder-only pretraining
- [ ] LoRA fine-tuning
- [ ] Vision Transformer
- [ ] Mixture of Experts
- [ ] Flash attention (in [03-pytorch](../03-pytorch) custom kernels first)
