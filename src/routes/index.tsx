import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Main } from '../layouts/Main'
import { Grid } from '../components/RepoLayouts/Grid'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    children: [
      {
        path: '/',
        element: <Grid repos={[
          {
            id: '123123123',
            name: 'plz-cli',
            description: 'Copilot for your terminal',
            author: 'm1guelpf',
            language: 'Rust',
            stars: 941
          },
          {
            id: '123123123',
            name: 'docked',
            description: 'Running Rails from Docker for easy start to development',
            author: 'rails',
            language: 'Dockerfile',
            stars: 863
          },
          {
            id: '123123123',
            name: 'DiT',
            description: 'Official PyTorch Implementation of "Scalable Diffusion Models with Transformers"',
            author: 'facebookresearch',
            language: 'Python',
            stars: 640
          },
          {
            id: '123123123',
            name: 'Prompt-Engineering-Guide',
            description: 'Guide and resources for prompt engineering',
            author: 'dair-ai',
            language: '',
            stars: 624
          },
          {
            id: '123123123',
            name: '.github',
            description: '',
            author: 'nopecha-ai',
            language: 'Rust',
            stars: 474
          }
        ]} />
      }
    ]
  }
])

export default router
