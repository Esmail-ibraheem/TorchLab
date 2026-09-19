# 02 · Deep learning theory

The mathematics behind neural networks: why backpropagation works, why optimisers behave the
way they do, what normalisation and initialisation fix, and how the big architectures
(CNN, RNN, Transformer, diffusion) fall out of a few ideas. Derivations first, code second —
the implementations live in [03-pytorch](../03-pytorch) and [05-torch-from-scratch](../05-torch-from-scratch).

## Layout

```
02-deep-learning-theory/
└── <nn>-<topic>/
    ├── README.md        derivations, intuition, figures / clips
    └── notebook.ipynb   small numerical experiments that check the math
```

## Syllabus

| # | Topic | Covers | Status |
|---|-------|--------|--------|
| 01 | Perceptron → MLP | activations, universal approximation, depth vs width | planned |
| 02 | Backpropagation | chain rule as vector-Jacobian products, computational graphs | planned |
| 03 | Optimisation | SGD, momentum, RMSProp, Adam / AdamW, learning-rate schedules, warmup | planned |
| 04 | Initialisation | Xavier / Kaiming, vanishing & exploding gradients, residual connections | planned |
| 05 | Normalisation | BatchNorm, LayerNorm, RMSNorm — what they stabilise and why | planned |
| 06 | Regularisation | weight decay, dropout, data augmentation, early stopping | planned |
| 07 | Convolutional networks | convolution as a linear operator, receptive fields, pooling, ResNet | planned |
| 08 | Sequence models | RNN, LSTM / GRU, backprop through time, why they were replaced | planned |
| 09 | Attention & Transformers | scaled dot-product attention, multi-head, positional encodings, KV-cache | planned |
| 10 | Tokenisation & embeddings | BPE, embedding spaces | planned |
| 11 | Generative models | autoencoders, VAE (ELBO), GANs, diffusion (DDPM), latent diffusion | planned |
| 12 | Reinforcement learning | MDPs, policy gradients, PPO, RLHF, DPO | planned |
| 13 | Scaling & efficiency | scaling laws, mixed precision, quantisation, LoRA | planned |

## References

- Goodfellow, Bengio, Courville, *Deep Learning*
- Zhang et al., *Dive into Deep Learning* (d2l.ai)
- Stanford CS231n / CS224n, Karpathy's *Neural Networks: Zero to Hero*
