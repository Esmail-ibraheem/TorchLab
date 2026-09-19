# 03 · PyTorch

Learning the framework itself, from tensors up to distributed training — so that the paper
implementations in [04-papers-in-pytorch](../04-papers-in-pytorch) use it fluently, and so that
[05-torch-from-scratch](../05-torch-from-scratch) has a clear target to rebuild.

## Layout

```
03-pytorch/
└── <nn>-<topic>/
    ├── README.md        what the API does and how it works underneath
    └── *.py / *.ipynb   runnable examples
```

## Syllabus

| # | Topic | Covers | Status |
|---|-------|--------|--------|
| 01 | Tensors | storage & strides, views vs copies, broadcasting, dtypes, devices | planned |
| 02 | Autograd | `requires_grad`, the graph, `backward`, custom `autograd.Function` | planned |
| 03 | `nn.Module` | parameters, buffers, `state_dict`, hooks, writing layers | planned |
| 04 | Data | `Dataset`, `DataLoader`, samplers, collate functions, tokenisers | planned |
| 05 | The training loop | losses, optimisers, schedulers, checkpointing, logging, evaluation | planned |
| 06 | Mixed precision & memory | `autocast`, `GradScaler`, gradient checkpointing, activation memory | planned |
| 07 | `torch.compile` & profiling | graph capture, the profiler, finding the bottleneck | planned |
| 08 | Distributed training | DDP, FSDP, tensor / pipeline parallelism | planned |
| 09 | Custom kernels | C++ / CUDA extensions, Triton | planned |
| 10 | Inference | KV-cache, quantisation, export (ONNX / TorchScript) | planned |

## References

- [PyTorch documentation](https://pytorch.org/docs/) and tutorials
- Edward Z. Yang, *PyTorch internals*
