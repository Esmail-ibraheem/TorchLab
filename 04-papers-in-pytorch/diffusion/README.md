# [Diffusion models](https://arxiv.org/abs/2006.11239), [Original repo](https://github.com/Esmail-ibraheem/Dali)

First, we need to define What is a generative model? 

A generative model learns a probability distribution of the data set such that we can then sample from the distribution to create new instances of data. For example, if we have many pictures of cats and we train a generative model on it, we then sample from this distribution to create new images of cats.

Now what are Diffusion Models are generative models which have been gaining significant popularity in the past several years, and for good reason. A handful of seminal papers released in the 2020s _alone_ have shown the world what Diffusion models are capable of, such as beating [GANs] on image synthesis. Most recently, practitioners will have seen Diffusion Models used in [DALL-E 2](https://www.assemblyai.com/blog/how-dall-e-2-actually-works/), OpenAI’s image generation model released last month.



![](https://cdn-images-1.medium.com/max/800/1*J0E2GAgolgS-kIJvOra9Wg.png)

### Diffusion Models — Introduction

Diffusion Models are **generative** models, meaning that they are used to generate data similar to the data on which they are trained. Fundamentally, Diffusion Models work by **destroying training data** through the successive addition of Gaussian noise, and then **learning to recover** the data by _reversing_ this noising process. After training, we can use the Diffusion Model to generate data by simply **passing randomly sampled noise through the learned denoising process.**

Diffusion models are inspired by **non-equilibrium thermodynamics**. They define a **Markov chain** of diffusion steps to slowly add random noise to data and then learn to reverse the diffusion process to construct desired data samples from the noise. Unlike **VAE or flow models**, diffusion models are learned with a fixed procedure and the latent variable has high dimensionality (same as the original data).

---

### Now get deeper into the diffusion models:

diffusion models consists of two processes as shown in the image below:
- Forward process (with red lines).
- Reverse process (with blue lines).

As mentioned above, a Diffusion Model consists of a **forward process** (or **diffusion process**), in which a datum (generally an image) is progressively noised, and a **reverse process** (or **reverse diffusion process**), in which noise is transformed back into a sample from the target distribution.

In a bit more detail for images, the set-up consists of 2 processes:

- a fixed (or predefined) forward diffusion process q of our choosing, that gradually adds Gaussian noise to an image, until you end up with pure noise
- a learned reverse denoising diffusion process p_θ​, where a neural network is trained to gradually denoise an image starting from pure noise, until you end up with an actual image.

## 1. Forward Process (Fixed):

The sampling chain transitions in the forward process can be set to conditional Gaussians when the noise level is sufficiently low. Combining this fact with the Markov assumption leads to a simple parameterization of the forward process:

![image](https://github.com/Esmail-ibraheem/Axon/assets/113830751/30cadd66-f266-45da-9b8d-7d3a4583f5ff)

Where beta_1, ..., beta_T is a variance schedule (either learned or fixed) which, if well-behaved, **ensures that** x_T **is nearly an isotropic Gaussian for sufficiently large T**.
The data sample f{x}_0  gradually loses its distinguishable features as the step t becomes larger. Eventually when T to infty, is equivalent to an isotropic Gaussian distribution.
![image](https://github.com/Esmail-ibraheem/Axon/assets/113830751/44c4a9a0-f8bc-4065-b82d-da49686c2994)


## 2. Reverse Process (Learned)

As mentioned previously, the "magic" of diffusion models comes in the **reverse process** During training, the model learns to reverse this diffusion process in order to generate new data. Starting with the pure Gaussian noise, the model learns the joint distribution as

Ultimately, the image is asymptotically transformed to pure Gaussian noise. The **goal** of training a diffusion model is to learn the **reverse** process - i.e. training. By traversing backwards along this chain, we can generate new data.

![image](https://github.com/Esmail-ibraheem/Axon/assets/113830751/33f0f7dc-a924-470d-b57f-c62ace859402)

![image](https://github.com/Esmail-ibraheem/Axon/assets/113830751/bf89c830-6d27-499f-9c06-40654da4a5b1)


where the time-dependent parameters of the Gaussian transitions are learned. Note in particular that the Markov formulation asserts that a given reverse diffusion transition distribution depends only on the previous timestep (or following timestep, depending on how you look at it).


> [!Note] Both the forward and reverse process indexed by t happen for some number of finite time steps T (the DDPM authors use T=1000). You start with t=0 where you sample a real image x_0​ from your data distribution (let's say an image of a cat from ImageNet), and the forward process samples some noise from a Gaussian distribution at each time step t, which is added to the image of the previous time step. Given a sufficiently large T and a well behaved schedule for adding noise at each time step, you end up with what is called an [isotropic Gaussian distribution](https://math.stackexchange.com/questions/1991961/gaussian-distribution-is-isotropic) at t=T via a gradual process.

---

# Denoising Diffusion Probabilistic Model

## Paper background: 
>[!Note] the mathematical equations with the red color are the forward process, and with the yellow color is the revers process, and the equation in the middle which assigned in number (3) is the learning process for the reverse.


>This paper presents progress in diffusion probabilistic models [53]. A diffusion probabilistic model (which we will call a “diffusion model” for brevity) is a parameterized Markov chain trained using variational inference to produce samples matching the data after finite time. Transitions of this chain are learned to reverse a diffusion process, which is a Markov chain that gradually adds noise to the data in the opposite direction of sampling until signal is destroyed. When the diffusion consists of small amounts of Gaussian noise, it is sufficient to set the sampling chain transitions to conditional Gaussians too, allowing for a particularly simple neural network parameterization. Diffusion models are straightforward to define and efficient to train, but to the best of our knowledge, there has been no demonstration that they are capable of generating high-quality samples. We show that diffusion models actually are capable of generating high quality samples, sometimes better than the published results on other types of generative models (Section 4). In addition, we show that a certain parameterization of diffusion models reveals an equivalence with denoising score matching over multiple noise levels during training and with annealed Langevin dynamics during sampling (Section 3.2) [55, 61]. We obtained our best sample quality results using this parameterization (Section 4.2), so we consider this equivalence to be one of our primary contributions. Despite their sample quality, our models do not have competitive log likelihoods compared to other likelihood-based models (our models do, however, have log-likelihoods better than the large estimates annealed importance sampling has been reported to produce for energy based models and score matching [11, 55]). We find that the majority of our models’ lossless codelengths are consumed to describe imperceptible image details (Section 4.3). We present a more refined analysis of this phenomenon in the language of lossy compression, and we show that the sampling procedure of diffusion models is a type of progressive decoding that resembles autoregressive decoding along a bit ordering that vastly generalizes what is normally possible with autoregressive models.


> [!Note] Note that the forward process is fixed we just add noise to the image by using the formula, but the reverse process is the main formula for the diffusion model, where the diffusion model actually learn, but how we can make the model learn by just using the reverse process. A Diffusion Model is trained by **finding the reverse Markov transitions that maximize the likelihood of the training data**. In practice, training equivalently consists of minimizing the variational upper bound on the negative log likelihood.


---

[huggingFace-blog](https://huggingface.co/blog/Esmail-AGumaan/diffusion-models#diffusion-models)


## Usage
**you have two different ways to run with interface:**
- using gradio: run this command `python sd_gradio.py`
  ![Pasted image 20240818155133](https://github.com/user-attachments/assets/41036af9-98cd-4476-9435-74d196c32c35)
- using fastapi: enter the directory 'stable_diffusion_api', then run this command `uvicorn sd_api:app --reload` assuming that you already downloaded the checkpoints, and you are in the directory.
in the fastapi option, you have like an engine, creating your project, select your hardware, and then you have the generate image page

![image](https://github.com/user-attachments/assets/cab2879c-6a16-4bce-af48-e8af7fa1673c)
![image](https://github.com/user-attachments/assets/41a38b75-87fb-48ac-8d82-dedf4695d51c)







> [!NOTE]
> Download vocab.json and merges.txt from [huggingface/stable_diffusion.tokenizer](https://huggingface.co/runwayml/stable-diffusion-v1-5/tree/main/tokenizer) and 
> Download v1-5-pruned-emaonly.ckpt from [huggingface/stable_diffusion.checpoints](https://huggingface.co/runwayml/stable-diffusion-v1-5/tree/main) and save it in the data folder



![image](https://github.com/user-attachments/assets/fdc43eb0-3fa5-42b6-bcdc-af612dbb20fa)

## Results:

<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/83f8d84f-754c-49cb-ab33-73eaa66805d3" alt="output" width="200"/></td>
    <td><img src="https://github.com/user-attachments/assets/90104a77-db5b-4031-b91d-d4d89b78b764" alt="d" width="200"/></td>
    <td><img src="https://github.com/user-attachments/assets/24478566-b22e-41be-adcc-e77cd3d9dff9" alt="output_image" width="200"/></td>
    <td><img src="https://github.com/user-attachments/assets/26c059b3-7437-41ab-8307-3a7e4a3793f2" alt="s" width="200"/></td>
    <td><img src="https://github.com/user-attachments/assets/4cba0dfe-38c3-40c1-890d-f83559c49132" alt="test" width="200"/></td>
  </tr>
  <tr>
    <td><b>Prompt:</b> A cat stretching on the floor, highly detailed, ultra sharp, cinematic, 100mm lens, 8k resolution</td>
    <td><b>Prompt:</b> A dog reading a book, wearing glasses, comfy hat, highly detailed, ultra sharp, cinematic, 100mm lens, 8k resolution</td>
    <td><b>Prompt:</b> A dog stretching on the floor wearing sunglasses, looking to the camera, highly detailed, ultra sharp, cinematic, 100mm lens, 8k resolution</td>
    <td><b>Prompt:</b> An astronaut on the moon, highly detailed, ultra sharp, cinematic, 100mm lens, 8k resolution</td>
    <td><b>Prompt:</b> A black dog sitting between a bush and a pair of green pants standing up with nobody inside them, highly detailed, ultra sharp, cinematic, 100mm lens, 8k resolution</td>
  </tr>
</table>




---
```BibTex
@misc{ho2020denoising,
    title   = {Denoising Diffusion Probabilistic Models},
    author  = {Jonathan Ho and Ajay Jain and Pieter Abbeel},
    year    = {2020},
    eprint  = {2006.11239},
    archivePrefix = {arXiv},
    primaryClass = {cs.LG}
}

@misc{rombach2021highresolution,
      title={High-Resolution Image Synthesis with Latent Diffusion Models}, 
      author={Robin Rombach and Andreas Blattmann and Dominik Lorenz and Patrick Esser and Björn Ommer},
      year={2021},
      eprint={2112.10752},
      archivePrefix={arXiv},
      primaryClass={cs.CV}
}

@misc{https://doi.org/10.48550/arxiv.2204.11824,
  doi = {10.48550/ARXIV.2204.11824},
  url = {https://arxiv.org/abs/2204.11824},
  author = {Blattmann, Andreas and Rombach, Robin and Oktay, Kaan and Ommer, Björn},
  keywords = {Computer Vision and Pattern Recognition (cs.CV), FOS: Computer and information sciences, FOS: Computer and information sciences},
  title = {Retrieval-Augmented Diffusion Models},
  publisher = {arXiv},
  year = {2022},  
  copyright = {arXiv.org perpetual, non-exclusive license}
}
```
