# 06 · Papers in torch-from-scratch

The papers from [04-papers-in-pytorch](../04-papers-in-pytorch), implemented again — this time
on the framework built in [05-torch-from-scratch](../05-torch-from-scratch). No PyTorch import
allowed. Each re-implementation is checked against its PyTorch counterpart (same weights, same
outputs within tolerance), which doubles as the integration test suite for the framework.

## Layout

```
06-papers-in-torch-from-scratch/
└── <paper>/
    ├── README.md        what the framework needed to gain to run this paper
    ├── ...              the implementation on torchlab
    └── parity.py        loads the PyTorch version, compares outputs
```

## Roadmap

| Paper | Needs from the framework | Status |
|-------|--------------------------|--------|
| Transformer | Linear, LayerNorm, Embedding, softmax, multi-head attention, Adam | planned |
| Llama | RMSNorm, RoPE, GQA, KV-cache | planned |
| Diffusion (DDPM) | Conv2d, GroupNorm, U-Net skip connections, samplers | planned |
| RLHF (PPO / DPO) | log-prob gathering, KL penalties, reference-model forward | planned |
