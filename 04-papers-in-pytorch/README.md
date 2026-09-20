# 04 · Papers in PyTorch

A topic-organized, chronological catalog of research papers for **TorchLab**. Each paper appears **once** in the master catalog, even if it was featured in multiple creator collections or referenced by an existing implementation.

The catalog is a reading and implementation backlog, **not a claim that every paper has been reproduced**. See the package table for the current implementation status. Years are the year supplied in the original collection, except for explicitly documented corrections below.

## Layout

```text
04-papers-in-pytorch/
└── <paper>/
    ├── README.md        paper explanation: math, figures, design decisions
    ├── assets/          README figures
    └── ...              implementation
```

## Existing packages and implementation status

| Package | Papers | Implementation | Status |
|---------|--------|----------------|--------|
| [transformer](transformer/) | [Attention Is All You Need](https://arxiv.org/abs/1706.03762) | [`transformer/`](transformer/transformer/) — encoder, decoder, positional encoding, full model (notebooks + `Transformer.py`); [`translator/`](transformer/translator/) — an English → Arabic translator trained on it | done |
| [llama](llama/) | [Llama 2](https://arxiv.org/abs/2307.09288), [RoFormer (RoPE)](https://arxiv.org/abs/2104.09864), [GQA](https://arxiv.org/abs/2305.13245), [RMSNorm](https://arxiv.org/abs/1910.07467) | [`x_llama/`](llama/x_llama/) — the model (~500 lines), config, inference with KV-cache; [`models/`](llama/models/) — MHA / MQA / GQA attentions, rotary embeddings | done |
| [diffusion](diffusion/) | [DDPM](https://arxiv.org/abs/2006.11239), [Latent Diffusion](https://arxiv.org/abs/2112.10752) | Stable Diffusion from scratch: VAE encoder / decoder, CLIP text encoder, U-Net with attention, DDPM sampler, Gradio UI | done |
| [rlhf](rlhf/) | [InstructGPT](https://arxiv.org/abs/2203.02155), [PPO](https://arxiv.org/abs/1707.06347), [DPO](https://arxiv.org/abs/2305.18290), [RLHF survey](https://arxiv.org/abs/2312.14925) | theory walkthrough with 20 animated clips ([`motion/`](rlhf/motion/) is the Motion Canvas source); PPO / DPO fine-tuning code | notes done · code planned |

## Paper catalog

**Source key:** H = [Geoffrey Hinton](https://www.cs.utoronto.ca/~hinton/papers.html) collection; U = [Umar Jamil](https://www.youtube.com/@umarjamilai); P = [Priyam Mazumdar](https://www.youtube.com/@ExploratoryDataAdventures); A = [Aladdin Persson](https://www.youtube.com/@AladdinPersson); Pkg = cited in the existing package table only. A paper can have multiple sources, but is listed in only one category. Source labels reflect your original lists, not an independently verified mapping of every video.

### Browse by topic

- [Foundations, Representation Learning & Early Neural Networks](#foundations-representation-learning-early-neural-networks) — 24 papers
- [Optimization, Normalization, Distillation & Alternative Learning](#optimization-normalization-distillation-alternative-learning) — 9 papers
- [Computer Vision, CNNs & Vision Transformers](#computer-vision-cnns-vision-transformers) — 14 papers
- [Sequence Models, Language Models & Transformers](#sequence-models-language-models-transformers) — 13 papers
- [GANs, Image Translation & Super-Resolution](#gans-image-translation-super-resolution) — 9 papers
- [Autoencoders, Autoregressive Models & Diffusion](#autoencoders-autoregressive-models-diffusion) — 6 papers
- [Speech, Audio & Text-to-Speech](#speech-audio-text-to-speech) — 7 papers
- [Reinforcement Learning, RLHF & Preference Optimization](#reinforcement-learning-rlhf-preference-optimization) — 12 papers

---

<a id="foundations-representation-learning-early-neural-networks"></a>

### Foundations, Representation Learning & Early Neural Networks

| # | Year | Paper | Source |
|---:|---:|---|---|
| 01 | 1977 | Relaxation and Its Role in Vision (PhD Thesis) | H |
| 02 | 1985 | A Learning Algorithm for Boltzmann Machines | H |
| 03 | 1986 | Distributed Representations | H |
| 04 | 1986 | Learning Internal Representations by Error Propagation | H |
| 05 | 1986 | Learning Representations by Back-Propagating Errors | H |
| 06 | 1991 | Adaptive Mixtures of Local Experts | H |
| 07 | 1992 | [How Neural Networks Learn from Experience](https://pubmed.ncbi.nlm.nih.gov/1502516/) | H |
| 08 | 1994 | Autoencoders, Minimum Description Length and Helmholtz Free Energy | H |
| 09 | 1995 | The Helmholtz Machine | H |
| 10 | 1995 | The Wake-Sleep Algorithm | H |
| 11 | 1999 | Products of Experts | H |
| 12 | 2002 | [Stochastic Neighbor Embedding](https://papers.nips.cc/paper/2276-stochastic-neighbor-embedding) | H |
| 13 | 2002 | Training Products of Experts by Minimizing Contrastive Divergence | H |
| 14 | 2006 | A Fast Learning Algorithm for Deep Belief Nets | H |
| 15 | 2006 | Reducing the Dimensionality of Data with Neural Networks | H |
| 16 | 2007 | Restricted Boltzmann Machines for Collaborative Filtering | H |
| 17 | 2008 | Visualizing Data using t-SNE | H |
| 18 | 2009 | Deep Boltzmann Machines | H |
| 19 | 2010 | Rectified Linear Units Improve Restricted Boltzmann Machines | H |
| 20 | 2016 | Using Fast Weights to Attend to the Recent Past | H |
| 21 | 2017 | Dynamic Routing Between Capsules | H |
| 22 | 2018 | Matrix Capsules with EM Routing | H |
| 23 | 2021 | How to Represent Part-Whole Hierarchies in a Neural Network | H |
| 24 | 2022 | The Forward-Forward Algorithm: Some Preliminary Investigations | H |

<a id="optimization-normalization-distillation-alternative-learning"></a>

### Optimization, Normalization, Distillation & Alternative Learning

| # | Year | Paper | Source |
|---:|---:|---|---|
| 01 | 2013 | On the Importance of Initialization and Momentum in Deep Learning | H |
| 02 | 2014 | Dropout: A Simple Way to Prevent Neural Networks from Overfitting | H |
| 03 | 2015 | Distilling the Knowledge in a Neural Network | H |
| 04 | 2016 | [Gumbel-Softmax: Categorical Reparameterization with Gumbel-Softmax](https://arxiv.org/abs/1611.01144) | P |
| 05 | 2016 | Layer Normalization | H |
| 06 | 2019 | [Root Mean Square Layer Normalization (RMSNorm)](https://arxiv.org/abs/1910.07467) | Pkg |
| 07 | 2021 | [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685) | U |
| 08 | 2022 | [FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness](https://arxiv.org/abs/2205.14135) | U, P |
| 09 | 2024 | [KAN: Kolmogorov-Arnold Networks](https://arxiv.org/abs/2404.19756) | U |

<a id="computer-vision-cnns-vision-transformers"></a>

### Computer Vision, CNNs & Vision Transformers

| # | Year | Paper | Source |
|---:|---:|---|---|
| 01 | 1998 | [Gradient-Based Learning Applied to Document Recognition (LeNet-5)](http://yann.lecun.com/exdb/publis/pdf/lecun-98.pdf) | A |
| 02 | 2012 | [ImageNet Classification with Deep Convolutional Neural Networks (AlexNet)](https://papers.nips.cc/paper_files/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html) | H, P |
| 03 | 2014 | [Going Deeper with Convolutions (GoogLeNet / Inception v1)](https://arxiv.org/abs/1409.4842) | A |
| 04 | 2014 | [Very Deep Convolutional Networks for Large-Scale Image Recognition (VGG)](https://arxiv.org/abs/1409.1556) | A |
| 05 | 2015 | [A Neural Algorithm of Artistic Style (Neural Style Transfer)](https://arxiv.org/abs/1508.06576) | A |
| 06 | 2015 | [Deep Residual Learning for Image Recognition (ResNet)](https://arxiv.org/abs/1512.03385) | P, A |
| 07 | 2015 | [U-Net: Convolutional Networks for Biomedical Image Segmentation](https://arxiv.org/abs/1505.04597) | A |
| 08 | 2015 | [You Only Look Once: Unified, Real-Time Object Detection (YOLOv1)](https://arxiv.org/abs/1506.02640) | A |
| 09 | 2018 | [YOLOv3: An Incremental Improvement](https://arxiv.org/abs/1804.02767) | A |
| 10 | 2019 | [EfficientNet: Rethinking Model Scaling for Convolutional Neural Networks](https://arxiv.org/abs/1905.11946) | A |
| 11 | 2020 | [An Image Is Worth 16x16 Words: Transformers for Image Recognition at Scale (ViT)](https://arxiv.org/abs/2010.11929) | P |
| 12 | 2021 | [Learning Transferable Visual Models From Natural Language Supervision (CLIP)](https://arxiv.org/abs/2103.00020) | U, P |
| 13 | 2021 | [Masked Autoencoders Are Scalable Vision Learners (MAE)](https://arxiv.org/abs/2111.06377) | P |
| 14 | 2023 | [Segment Anything](https://arxiv.org/abs/2304.02643) | U |

<a id="sequence-models-language-models-transformers"></a>

### Sequence Models, Language Models & Transformers

| # | Year | Paper | Source |
|---:|---:|---|---|
| 01 | 2014 | [Neural Machine Translation by Jointly Learning to Align and Translate (Bahdanau Attention)](https://arxiv.org/abs/1409.0473) | A |
| 02 | 2014 | [Sequence to Sequence Learning with Neural Networks](https://arxiv.org/abs/1409.3215) | A |
| 03 | 2017 | [Attention Is All You Need](https://arxiv.org/abs/1706.03762) | U, P, A |
| 04 | 2018 | [BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding](https://arxiv.org/abs/1810.04805) | U |
| 05 | 2019 | [RoBERTa: A Robustly Optimized BERT Pretraining Approach](https://arxiv.org/abs/1907.11692) | P |
| 06 | 2021 | [RoFormer: Enhanced Transformer with Rotary Position Embedding](https://arxiv.org/abs/2104.09864) | U |
| 07 | 2021 | [Structured State Spaces for Sequence Modeling (S4)](https://arxiv.org/abs/2111.00396) | U |
| 08 | 2023 | [GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints](https://arxiv.org/abs/2305.13245) | U |
| 09 | 2023 | [Llama 2: Open Foundation and Fine-Tuned Chat Models](https://arxiv.org/abs/2307.09288) | U |
| 10 | 2023 | [LongNet: Scaling Transformers to 1,000,000,000 Tokens](https://arxiv.org/abs/2307.02486) | U |
| 11 | 2023 | [Mamba: Linear-Time Sequence Modeling with Selective State Spaces](https://arxiv.org/abs/2312.00752) | U |
| 12 | 2023 | [Mistral 7B](https://arxiv.org/abs/2310.06825) | U |
| 13 | 2024 | [Mixtral of Experts](https://arxiv.org/abs/2401.04088) | U |

<a id="gans-image-translation-super-resolution"></a>

### GANs, Image Translation & Super-Resolution

| # | Year | Paper | Source |
|---:|---:|---|---|
| 01 | 2014 | [Generative Adversarial Networks (GAN)](https://arxiv.org/abs/1406.2661) | P, A |
| 02 | 2015 | [Unsupervised Representation Learning with Deep Convolutional Generative Adversarial Networks (DCGAN)](https://arxiv.org/abs/1511.06434) | P, A |
| 03 | 2016 | [Image-to-Image Translation with Conditional Adversarial Networks (Pix2Pix)](https://arxiv.org/abs/1611.07004) | A |
| 04 | 2016 | [Photo-Realistic Single Image Super-Resolution Using a Generative Adversarial Network (SRGAN)](https://arxiv.org/abs/1609.04802) | A |
| 05 | 2017 | [Improved Training of Wasserstein GANs (WGAN-GP)](https://arxiv.org/abs/1704.00028) | A |
| 06 | 2017 | [Progressive Growing of GANs for Improved Quality, Stability, and Variation (ProGAN)](https://arxiv.org/abs/1710.10196) | A |
| 07 | 2017 | [Unpaired Image-to-Image Translation Using Cycle-Consistent Adversarial Networks (CycleGAN)](https://arxiv.org/abs/1703.10593) | P, A |
| 08 | 2017 | [Wasserstein GAN](https://arxiv.org/abs/1701.07875) | P, A |
| 09 | 2018 | [ESRGAN: Enhanced Super-Resolution Generative Adversarial Networks](https://arxiv.org/abs/1809.00219) | A |

<a id="autoencoders-autoregressive-models-diffusion"></a>

### Autoencoders, Autoregressive Models & Diffusion

| # | Year | Paper | Source |
|---:|---:|---|---|
| 01 | 2013 | [Auto-Encoding Variational Bayes](https://arxiv.org/abs/1312.6114) | U, P |
| 02 | 2016 | [Pixel Recurrent Neural Networks (PixelRNN / PixelCNN)](https://arxiv.org/abs/1601.06759) | P |
| 03 | 2017 | [Neural Discrete Representation Learning (VQ-VAE)](https://arxiv.org/abs/1711.00937) | P |
| 04 | 2020 | [Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239) | U, P |
| 05 | 2021 | [High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752) | U, P |
| 06 | 2022 | [Classifier-Free Diffusion Guidance](https://arxiv.org/abs/2207.12598) | P |

<a id="speech-audio-text-to-speech"></a>

### Speech, Audio & Text-to-Speech

| # | Year | Paper | Source |
|---:|---:|---|---|
| 01 | 2006 | [Connectionist Temporal Classification: Labelling Unsegmented Sequence Data with Recurrent Neural Networks](https://www.cs.toronto.edu/~graves/icml_2006.pdf) | P |
| 02 | 2012 | Deep Neural Networks for Acoustic Modeling in Speech Recognition | H |
| 03 | 2016 | [WaveNet: A Generative Model for Raw Audio](https://arxiv.org/abs/1609.03499) | P |
| 04 | 2017 | [Natural TTS Synthesis by Conditioning WaveNet on Mel Spectrogram Predictions (Tacotron 2)](https://arxiv.org/abs/1712.05884) | P |
| 05 | 2020 | [HiFi-GAN: Generative Adversarial Networks for Efficient and High Fidelity Speech Synthesis](https://arxiv.org/abs/2010.05646) | P |
| 06 | 2020 | [wav2vec 2.0: A Framework for Self-Supervised Learning of Speech Representations](https://arxiv.org/abs/2006.11477) | P |
| 07 | 2022 | [High Fidelity Neural Audio Compression (EnCodec)](https://arxiv.org/abs/2210.13438) | P |

<a id="reinforcement-learning-rlhf-preference-optimization"></a>

### Reinforcement Learning, RLHF & Preference Optimization

| # | Year | Paper | Source |
|---:|---:|---|---|
| 01 | 2013 | [Playing Atari with Deep Reinforcement Learning (DQN)](https://arxiv.org/abs/1312.5602) | P |
| 02 | 2015 | [Continuous Control with Deep Reinforcement Learning (DDPG)](https://arxiv.org/abs/1509.02971) | P |
| 03 | 2015 | [Deep Reinforcement Learning with Double Q-learning](https://arxiv.org/abs/1509.06461) | P |
| 04 | 2015 | [Dueling Network Architectures for Deep Reinforcement Learning](https://arxiv.org/abs/1511.06581) | P |
| 05 | 2015 | [High-Dimensional Continuous Control Using Generalized Advantage Estimation (GAE)](https://arxiv.org/abs/1506.02438) | P |
| 06 | 2015 | [Prioritized Experience Replay](https://arxiv.org/abs/1511.05952) | P |
| 07 | 2015 | [Trust Region Policy Optimization (TRPO)](https://arxiv.org/abs/1502.05477) | P |
| 08 | 2017 | [Proximal Policy Optimization Algorithms](https://arxiv.org/abs/1707.06347) | U, P |
| 09 | 2022 | [Training Language Models to Follow Instructions with Human Feedback (InstructGPT)](https://arxiv.org/abs/2203.02155) | U |
| 10 | 2023 | [A Survey of Reinforcement Learning from Human Feedback](https://arxiv.org/abs/2312.14925) | Pkg |
| 11 | 2023 | [Direct Preference Optimization: Your Language Model is Secretly a Reward Model](https://arxiv.org/abs/2305.18290) | U |
| 12 | 2025 | [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning](https://arxiv.org/abs/2501.12948) | U |

---

## Bibliography corrections

- **Stochastic Neighbor Embedding:** corrected the supplied year from 1992 to **2002** (NeurIPS 2002).
- **AlexNet:** replaced the supplied arXiv `1207.0580` link (which leads to a different paper) with the original NeurIPS 2012 paper page.
- Other titles, years, and paper links are carried over from your uploaded collection unless noted above. Entries without a link remain plain text rather than inventing citations.

---
