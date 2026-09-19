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

## Foundational AI Papers - Phase 0

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


## AI Papers - Phase 1

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


## AI Paper - Phase 2

A collection of research papers associated with [Priyam Mazumdar's YouTube channel](https://www.youtube.com/@ExploratoryDataAdventures) and his [PyTorch-Adventures repository](https://github.com/priyammaz/PyTorch-Adventures).

The collection covers computer vision, Transformers, generative models, speech processing, reinforcement learning, and efficient deep-learning systems.

| # | Year | Paper |
|---|------|-------|
| 01 | 2006 | [Connectionist Temporal Classification: Labelling Unsegmented Sequence Data with Recurrent Neural Networks](https://www.cs.toronto.edu/~graves/icml_2006.pdf) |
| 02 | 2012 | [ImageNet Classification with Deep Convolutional Neural Networks (AlexNet)](https://arxiv.org/abs/1207.0580) |
| 03 | 2013 | [Auto-Encoding Variational Bayes (VAE)](https://arxiv.org/abs/1312.6114) |
| 04 | 2013 | [Playing Atari with Deep Reinforcement Learning (DQN)](https://arxiv.org/abs/1312.5602) |
| 05 | 2014 | [Generative Adversarial Networks (GAN)](https://arxiv.org/abs/1406.2661) |
| 06 | 2015 | [Deep Residual Learning for Image Recognition (ResNet)](https://arxiv.org/abs/1512.03385) |
| 07 | 2015 | [Unsupervised Representation Learning with Deep Convolutional Generative Adversarial Networks (DCGAN)](https://arxiv.org/abs/1511.06434) |
| 08 | 2015 | [Deep Reinforcement Learning with Double Q-learning](https://arxiv.org/abs/1509.06461) |
| 09 | 2015 | [Dueling Network Architectures for Deep Reinforcement Learning](https://arxiv.org/abs/1511.06581) |
| 10 | 2015 | [Prioritized Experience Replay](https://arxiv.org/abs/1511.05952) |
| 11 | 2015 | [Trust Region Policy Optimization (TRPO)](https://arxiv.org/abs/1502.05477) |
| 12 | 2015 | [Continuous Control with Deep Reinforcement Learning (DDPG)](https://arxiv.org/abs/1509.02971) |
| 13 | 2015 | [High-Dimensional Continuous Control Using Generalized Advantage Estimation (GAE)](https://arxiv.org/abs/1506.02438) |
| 14 | 2016 | [Pixel Recurrent Neural Networks (PixelRNN / PixelCNN)](https://arxiv.org/abs/1601.06759) |
| 15 | 2016 | [Gumbel-Softmax: Categorical Reparameterization with Gumbel-Softmax](https://arxiv.org/abs/1611.01144) |
| 16 | 2016 | [WaveNet: A Generative Model for Raw Audio](https://arxiv.org/abs/1609.03499) |
| 17 | 2017 | [Attention Is All You Need](https://arxiv.org/abs/1706.03762) |
| 18 | 2017 | [Neural Discrete Representation Learning (VQ-VAE)](https://arxiv.org/abs/1711.00937) |
| 19 | 2017 | [Wasserstein GAN](https://arxiv.org/abs/1701.07875) |
| 20 | 2017 | [Unpaired Image-to-Image Translation Using Cycle-Consistent Adversarial Networks (CycleGAN)](https://arxiv.org/abs/1703.10593) |
| 21 | 2017 | [Proximal Policy Optimization Algorithms (PPO)](https://arxiv.org/abs/1707.06347) |
| 22 | 2017 | [Natural TTS Synthesis by Conditioning WaveNet on Mel Spectrogram Predictions (Tacotron 2)](https://arxiv.org/abs/1712.05884) |
| 23 | 2019 | [RoBERTa: A Robustly Optimized BERT Pretraining Approach](https://arxiv.org/abs/1907.11692) |
| 24 | 2020 | [An Image Is Worth 16x16 Words: Transformers for Image Recognition at Scale (ViT)](https://arxiv.org/abs/2010.11929) |
| 25 | 2020 | [Denoising Diffusion Probabilistic Models (DDPM)](https://arxiv.org/abs/2006.11239) |
| 26 | 2020 | [wav2vec 2.0: A Framework for Self-Supervised Learning of Speech Representations](https://arxiv.org/abs/2006.11477) |
| 27 | 2020 | [HiFi-GAN: Generative Adversarial Networks for Efficient and High Fidelity Speech Synthesis](https://arxiv.org/abs/2010.05646) |
| 28 | 2021 | [Learning Transferable Visual Models From Natural Language Supervision (CLIP)](https://arxiv.org/abs/2103.00020) |
| 29 | 2021 | [Masked Autoencoders Are Scalable Vision Learners (MAE)](https://arxiv.org/abs/2111.06377) |
| 30 | 2021 | [High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752) |
| 31 | 2022 | [Classifier-Free Diffusion Guidance](https://arxiv.org/abs/2207.12598) |
| 32 | 2022 | [High Fidelity Neural Audio Compression (EnCodec)](https://arxiv.org/abs/2210.13438) |
| 33 | 2022 | [FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness](https://arxiv.org/abs/2205.14135) |

## Next

Candidates for the next packages, roughly in the order they build on each other:

- [ ] GPT-2 / nanoGPT-style decoder-only pretraining
- [ ] LoRA fine-tuning
- [ ] Vision Transformer
- [ ] Mixture of Experts
- [ ] Flash attention (in [03-pytorch](../03-pytorch) custom kernels first)
