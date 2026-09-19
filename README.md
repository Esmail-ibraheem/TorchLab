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

## Papers implemented
- attention is all you need.
   - > The dominant sequence transduction models are based on complex recurrent or convolutional neural networks in an encoder-decoder configuration. The best-performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles by over 2 BLEU. On the WMT 2014 English-to-French translation task, our model establishes a new single-model state-of-the-art BLEU score of 41.8 after training for 3.5 days on eight GPUs, a small fraction of the training costs of the best models from the literature. We show that the Transformer generalizes well to other tasks by applying it successfully to English constituency parsing both with large and limited training data.
- InstructGPT.
   - > Making language models bigger does not inherently make them better at following a user's intent. For example, large language models can generate outputs that are untruthful, toxic, or simply not helpful to the user. In other words, these models are not aligned with their users. In this paper, we show an avenue for aligning language models with user intent on a wide range of tasks by fine-tuning with human feedback. Starting with a set of labeler-written prompts and prompts submitted through the OpenAI API, we collect a dataset of labeler demonstrations of the desired model behavior, which we use to fine-tune GPT-3 using supervised learning. We then collect a dataset of rankings of model outputs, which we use to further fine-tune this supervised model using reinforcement learning from human feedback. We call the resulting models InstructGPT. In human evaluations on our prompt distribution, outputs from the 1.3B parameter InstructGPT model are preferred to outputs from the 175B GPT-3, despite having 100x fewer parameters. Moreover, InstructGPT models show improvements in truthfulness and reductions in toxic output generation while having minimal performance regressions on public NLP datasets. Even though InstructGPT still makes simple mistakes, our results show that fine-tuning with human feedback is a promising direction for aligning language models with human intent.
- Llama.
   - > In this work, we develop and release Llama 2, a collection of pretrained and fine-tuned large language models (LLMs) ranging in scale from 7 billion to 70 billion parameters. Our fine-tuned LLMs, called Llama 2-Chat, are optimized for dialogue use cases. Our models outperform open-source chat models on most benchmarks we tested, and based on our human evaluations for helpfulness and safety, may be a suitable substitute for closed-source models. We provide a detailed description of our approach to fine-tuning and safety improvements of Llama 2-Chat in order to enable the community to build on our work and contribute to the responsible development of LLMs.
- Multi-Head attention.
- Multi-Query attention.
- Grouped-Query attention.
   - > Multi-query attention (MQA), which only uses a single key-value head, drastically speeds up decoder inference. However, MQA can lead to quality degradation, and moreover it may not be desirable to train a separate model just for faster inference. We (1) propose a recipe for uptraining existing multi-head language model checkpoints into models with MQA using 5% of original pre-training compute, and (2) introduce grouped-query attention (GQA), a generalization of multi-query attention which uses an intermediate (more than one, less than number of query heads) number of key-value heads. We show that uptrained GQA achieves quality close to multi-head attention with comparable speed to MQA.
```
      ┌───┐┌───┐┌───┐┌───┐     ┌───┐    ┌───┐             ┌───┐
      │ v ││ v ││ v ││ v │     │ v │    │ v │             │ v │
      └───┘└───┘└───┘└───┘     └───┘    └───┘             └───┘
        │    │    │    │         │        │                 │
      ┌───┐┌───┐┌───┐┌───┐     ┌───┐    ┌───┐             ┌───┐
      │ k ││ k ││ k ││ k │     │ k │    │ k │             │ k │
      └───┘└───┘└───┘└───┘     └───┘    └───┘             └───┘
        │    │    │    │      ┌──┴──┐  ┌──┴──┐      ┌────┬──┴─┬────┐
      ┌───┐┌───┐┌───┐┌───┐  ┌───┐┌───┐┌───┐┌───┐  ┌───┐┌───┐┌───┐┌───┐
      │ q ││ q ││ q ││ q │  │ q ││ q ││ q ││ q │  │ q ││ q ││ q ││ q │
      └───┘└───┘└───┘└───┘  └───┘└───┘└───┘└───┘  └───┘└───┘└───┘└───┘
      ◀️──────────────────▶️  ◀️──────────────────▶️  ◀️──────────────────▶️
              MHA                    GQA                   MQA
        n_query_groups=4       n_query_groups=2      n_query_groups=1
```

|         MHA          |                  GQA                  |         MQA          |
| :------------------: | :-----------------------------------: | :------------------: |
|     High quality     | A good compromise between quality and |   Loss in quality    |
| Computationally slow |                 speed                 | Computationally fast |

- reinforcement learning from human feedback.
  - > A promising approach to improve the robustness and exploration in Reinforcement Learning is collecting human feedback and that way incorporating prior knowledge of the target environment. It is, however, often too expensive to obtain enough feedback of good quality. To mitigate the issue, we aim to rely on a group of multiple experts (and non-experts) with different skill levels to generate enough feedback. Such feedback can therefore be inconsistent and infrequent. In this paper, we build upon prior work -- Advise, a Bayesian approach attempting to maximise the information gained from human feedback -- extending the algorithm to accept feedback from this larger group of humans, the trainers, while also estimating each trainer's reliability. We show how aggregating feedback from multiple trainers improves the total feedback's accuracy and make the collection process easier in two ways. Firstly, this approach addresses the case of some of the trainers being adversarial. Secondly, having access to the information about each trainer reliability provides a second layer of robustness and offers valuable information for people managing the whole system to improve the overall trust in the system. It offers an actionable tool for improving the feedback collection process or modifying the reward function design if needed. We empirically show that our approach can accurately learn the reliability of each trainer correctly and use it to maximise the information gained from the multiple trainers' feedback, even if some of the sources are adversarial.


---

## Packages

```
┌───────────────┐        ┌───────────────┐        ┌───────────────┐        ┌───────────────┐
│  transformer  │        │     llama     │        │   diffusion   │        │     rlhf      │
└───────┬───────┘        └───────┬───────┘        └───────┬───────┘        └───────┬───────┘
        │                        │                        │                        │
        ▼                        ▼                        ▼                        ▼
┌───────────────────┐   ┌───────────────────────────┐   ┌───────────────────┐   ┌────────────────────────┐
│ "Attention is All │   │ "Llama2"                  │   │ "DDPM"            │   │ "InstructGPT"          │
│ You Need"         │   │ "RoFormer"                │   │ "Latent Diffusion"│   │ "PPO"                  │
└───────────────────┘   │ "GQA"                     │   └───────────────────┘   │ "DPO"                  │
                        │ "Attention is All         │                           │ "RLHF Survey"          │
                        │ You Need"                 │                           └────────────────────────┘
                        │ "KV-cache", RMSNorm       │
                        └───────────────────────────┘
```

- [transformer](04-papers-in-pytorch/transformer/)
   - **Abstract.** The Transformer neural network is a powerful deep learning model that was introduced in a landmark paper titled "attention is all you need" by Vaswani et al. in 2017. It revolutionized the field of natural language processing (NLP) and has since found applications in various other domains. The Transformer architecture is based on the concept of attention, enabling it to capture long-range dependencies and achieve state-of-the-art performance on a wide range of tasks. The transformer is a neural network component that can be used to learn useful represen tations of sequences or sets of data-points [Vaswani et al., 2017]. The transformer has driven recent advances in natural language processing [Devlin et al., 2019], computer vision [Dosovitskiy et al., 2021], and spatio-temporal modelling [Bi et al., 2022].
- [llama](04-papers-in-pytorch/llama/)
  - X-Llama is an advanced language model framework, inspired by the original Llama model but enhanced with additional features such as Grouped Query Attention (GQA), Multi-Head Attention (MHA), and more. This project aims to provide a flexible and extensible platform for experimenting with various attention mechanisms and building state-of-the-art natural language processing models.

    The [model](04-papers-in-pytorch/llama/x_llama/model.py) was constructed in approximately ~500 lines of code, and you have the model's [configuration](04-papers-in-pytorch/llama/x_llama/config.py).
    ```
    llama/
    ├── assets/
    ├── models/
    │   ├── attentions.py          MHA / MQA / GQA
    │   ├── rotary_embeddings.py   RoPE
    │   └── transformer.py
    └── x_llama/
        ├── model.py
        ├── config.py
        └── inference.py
    ```
- [diffusion](04-papers-in-pytorch/diffusion/)
  - Diffusion Models are generative models, meaning that they are used to generate data similar to the data on which they are trained. Fundamentally, Diffusion Models work by destroying training data through the successive addition of Gaussian noise and then learning to recover the data by reversing this noising process. After training, we can use the Diffusion Model to generate data by simply passing randomly sampled noise through the learned denoising process. Diffusion models are inspired by non-equilibrium thermodynamics. They define a Markov chain of diffusion steps to slowly add random noise to data and then learn to reverse the diffusion process to construct desired data samples from the noise. Unlike VAE or flow models, diffusion models are learned with a fixed procedure and the latent variable has high dimensionality (same as the original data).
- [rlhf](04-papers-in-pytorch/rlhf/)
  - AI alignment: A large language model typically is pre-trained on a massive amount of data, for example, the entire Wikipedia and billions of web pages. This gives the language model a vast “knowledge” of information to complete any prompt in a reasonable way. However, to use an LLM as a chat assistant (for example ChatGPT) we want to force the language model to follow a particular style. For example, we may want the following:

     - Do not use offensive language
     - Do not use racist expressions
     - Answer questions using a particular style The goal of AI alignment is to align the model’s behavior with a desired behavior.

    Every figure and equation of the walkthrough is animated — 20 short clips, with the [Motion Canvas](https://motioncanvas.io) source in [`rlhf/motion/`](04-papers-in-pytorch/rlhf/motion/).

---

## Usage

```
git clone https://github.com/Esmail-ibraheem/TorchLab.git
```

Each stage folder has a README with its syllabus or index; each package under
`04-papers-in-pytorch/` has a README that explains the paper and how to run the code.
The website in [`website/`](website/) is a Vue + Vite app (`npm install && npm run dev`).

---

## Citation
```BibTex
@misc{Gumaan2024-TorchLab,
  title   = "TorchLab",
  author  = "Gumaan, Esmail",
  howpublished = {\url{https://github.com/Esmail-ibraheem/TorchLab}},
  year    = "2024",
  month   = "May",
  note    = "[Online; accessed 2024-05-24]",
}
```

---

## Notes and Acknowledgments

I built TorchLab (formerly Axon) as my path from the theory of machine learning to building a
deep-learning framework of my own: learn the math, learn PyTorch, implement research papers on
topics ranging from transformers and Llama to diffusion models and RLHF, then rebuild the
framework from scratch and implement the same papers on it. Each package explains the theoretical
and mathematical side of its paper in its README. If you want to add an implementation of a
research paper, please make a pull request.

**papers**:
- [llama 2 research paper](https://arxiv.org/abs/2307.09288)
- [attention is all you need research paper](https://arxiv.org/abs/1706.03762)
- [Grouped Query Attention research paper](https://arxiv.org/abs/2305.13245)
- [RoFormer: Enhanced Transformer with Rotary Position Embedding research paper](https://arxiv.org/abs/2104.09864)
- [RMSNorm](https://arxiv.org/abs/1910.07467)
- [Easy and Efficient Transformer](https://arxiv.org/abs/2104.12470)
- [InstructGPT](https://arxiv.org/abs/2203.02155)
- [Proximal Policy Optimization algorithm](https://arxiv.org/abs/1707.06347)
- [Direct Perfernces Optimization algorithm](https://arxiv.org/abs/2305.18290)
- [Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239)
- [Reinforcement Learning from Human Feedback survey](https://arxiv.org/abs/2312.14925)
