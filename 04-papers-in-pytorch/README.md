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

## Foundational AI Papers

A chronological collection of 30 papers tracing the development of neural networks, representation learning, generative models, and deep learning.

| # | Year | Paper |
|---|------|-------|
| 01 | 1977 | Relaxation and Its Role in Vision (PhD Thesis) |
| 02 | 1985 | A Learning Algorithm for Boltzmann Machines |
| 03 | 1986 | Learning Representations by Back-Propagating Errors |
| 04 | 1986 | Distributed Representations |
| 05 | 1986 | Learning Internal Representations by Error Propagation |
| 06 | 1991 | Adaptive Mixtures of Local Experts |
| 07 | 1992 | How Neural Networks Learn from Experience |
| 08 | 1992 | Stochastic Neighbor Embedding |
| 09 | 1994 | Autoencoders, Minimum Description Length and Helmholtz Free Energy |
| 10 | 1995 | The Helmholtz Machine |
| 11 | 1995 | The Wake-Sleep Algorithm |
| 12 | 1999 | Products of Experts |
| 13 | 2002 | Training Products of Experts by Minimizing Contrastive Divergence |
| 14 | 2006 | A Fast Learning Algorithm for Deep Belief Nets |
| 15 | 2006 | Reducing the Dimensionality of Data with Neural Networks |
| 16 | 2007 | Restricted Boltzmann Machines for Collaborative Filtering |
| 17 | 2008 | Visualizing Data using t-SNE |
| 18 | 2009 | Deep Boltzmann Machines |
| 19 | 2010 | Rectified Linear Units Improve Restricted Boltzmann Machines |
| 20 | 2012 | Deep Neural Networks for Acoustic Modeling in Speech Recognition |
| 21 | 2012 | ImageNet Classification with Deep Convolutional Neural Networks (AlexNet) |
| 22 | 2013 | On the Importance of Initialization and Momentum in Deep Learning |
| 23 | 2014 | Dropout: A Simple Way to Prevent Neural Networks from Overfitting |
| 24 | 2015 | Distilling the Knowledge in a Neural Network |
| 25 | 2016 | Layer Normalization |
| 26 | 2016 | Using Fast Weights to Attend to the Recent Past |
| 27 | 2017 | Dynamic Routing Between Capsules |
| 28 | 2018 | Matrix Capsules with EM Routing |
| 29 | 2021 | How to Represent Part-Whole Hierarchies in a Neural Network |
| 30 | 2022 | The Forward-Forward Algorithm: Some Preliminary Investigations |


## Umar Jamil — AI Paper Collection

A collection of research papers associated with Umar Jamil's AI tutorials, covering Transformers, diffusion models, reinforcement learning, and modern neural architectures.

| # | Year | Paper |
|---|------|-------|
| 01 | 2013 | [Auto-Encoding Variational Bayes](https://arxiv.org/abs/1312.6114) |
| 02 | 2017 | [Attention Is All You Need](https://arxiv.org/abs/1706.03762) |
| 03 | 2017 | [Proximal Policy Optimization Algorithms](https://arxiv.org/abs/1707.06347) |
| 04 | 2018 | [BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding](https://arxiv.org/abs/1810.04805) |
| 05 | 2020 | [Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239) |
| 06 | 2021 | [Learning Transferable Visual Models From Natural Language Supervision (CLIP)](https://arxiv.org/abs/2103.00020) |
| 07 | 2021 | [RoFormer: Enhanced Transformer with Rotary Position Embedding](https://arxiv.org/abs/2104.09864) |
| 08 | 2021 | [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685) |
| 09 | 2021 | [Structured State Spaces for Sequence Modeling (S4)](https://arxiv.org/abs/2111.00396) |
| 10 | 2021 | [High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752) |
| 11 | 2022 | [Training Language Models to Follow Instructions with Human Feedback (InstructGPT)](https://arxiv.org/abs/2203.02155) |
| 12 | 2022 | [FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness](https://arxiv.org/abs/2205.14135) |
| 13 | 2023 | [Segment Anything](https://arxiv.org/abs/2304.02643) |
| 14 | 2023 | [GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints](https://arxiv.org/abs/2305.13245) |
| 15 | 2023 | [Direct Preference Optimization: Your Language Model is Secretly a Reward Model](https://arxiv.org/abs/2305.18290) |
| 16 | 2023 | [LongNet: Scaling Transformers to 1,000,000,000 Tokens](https://arxiv.org/abs/2307.02486) |
| 17 | 2023 | [Llama 2: Open Foundation and Fine-Tuned Chat Models](https://arxiv.org/abs/2307.09288) |
| 18 | 2023 | [Mistral 7B](https://arxiv.org/abs/2310.06825) |
| 19 | 2023 | [Mamba: Linear-Time Sequence Modeling with Selective State Spaces](https://arxiv.org/abs/2312.00752) |
| 20 | 2024 | [Mixtral of Experts](https://arxiv.org/abs/2401.04088) |
| 21 | 2024 | [KAN: Kolmogorov-Arnold Networks](https://arxiv.org/abs/2404.19756) |
| 22 | 2025 | [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning](https://arxiv.org/abs/2501.12948) |

## Next

Candidates for the next packages, roughly in the order they build on each other:

- [ ] GPT-2 / nanoGPT-style decoder-only pretraining
- [ ] LoRA fine-tuning
- [ ] Vision Transformer
- [ ] Mixture of Experts
- [ ] Flash attention (in [03-pytorch](../03-pytorch) custom kernels first)
