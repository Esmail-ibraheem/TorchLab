# 05 · Torch from scratch

Build your own PyTorch: a small deep-learning framework written from nothing, one component
at a time, so that every abstraction in [03-pytorch](../03-pytorch) is something you have
implemented yourself. The end goal is a library complete enough to re-implement the papers in
[06-papers-in-torch-from-scratch](../06-papers-in-torch-from-scratch).

## Layout

Each component is a folder with the theory and its implementation. Once the pieces exist they
are assembled into an importable package (`torchlab/`) with tests.

```
05-torch-from-scratch/
├── autograd/
│   └── forward-mode-dual-numbers/   ✅ forward-mode AD with dual numbers
├── tensor/                           planned
├── nn/                               planned
├── optim/                            planned
├── data/                             planned
└── torchlab/                         the assembled package (planned)
```

## Roadmap

| # | Component | Covers | Status |
|---|-----------|--------|--------|
| 01 | Autograd — forward mode | dual numbers, tangent propagation | **done** → [autograd/forward-mode-dual-numbers](autograd/forward-mode-dual-numbers/) |
| 02 | Autograd — reverse mode | tape / graph, VJPs, topological backward, `micrograd`-style scalars first | planned |
| 03 | Tensor | n-d storage, strides, views, broadcasting, reductions, matmul | planned |
| 04 | Tensor autograd | reverse mode over tensors, broadcasting-aware gradients | planned |
| 05 | `nn` | Module, Parameter, Linear, activations, Conv2d, LayerNorm / RMSNorm, Embedding, Dropout | planned |
| 06 | Losses | MSE, cross-entropy (log-sum-exp stable) | planned |
| 07 | `optim` | SGD, momentum, Adam / AdamW, schedulers | planned |
| 08 | `data` | Dataset, DataLoader, batching, shuffling | planned |
| 09 | Attention | scaled dot-product, multi-head, causal mask, KV-cache | planned |
| 10 | Backends | NumPy first; then a GPU backend (CUDA / Triton) | planned |
| 11 | Tests | gradient checks against finite differences and against PyTorch | planned |

## References

- Karpathy, *micrograd*; the *minitorch* course
- Baydin et al., *Automatic Differentiation in Machine Learning: a Survey*
