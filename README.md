# Remix Motion Showreel Agent v2

Sistema profissional de direção e geração de **Motion Design Showreels** em formato 9:16 (Stories/Reels/TikTok). Equipado com sorteio estocástico de DNA visual, geração roteirizada sem repetição de animações, sistema de profundidade **Parallax 2.5D**, renderizador Canvas 2D ultra-otimizado e certificação de cenas com zero falhas.

---

## 🚀 Como Hospedar no Vercel

Este projeto já está **100% configurado para o Vercel** com suporte a Serverless Functions e SPA Vite:

1. Suba o código para o seu GitHub/GitLab.
2. No [Vercel](https://vercel.com), clique em **"Add New..."** → **"Project"** e importe este repositório.
3. Nas **Environment Variables**, adicione:
   - `GEMINI_API_KEY`: sua chave de API do Gemini.
4. Clique em **Deploy**! O `vercel.json` e a pasta `api/` cuidam de toda a configuração automaticamente.

Para instruções detalhadas passo a passo, veja o arquivo [VERCEL.md](./VERCEL.md).

---

## 🎨 Recursos Principais

- **Parallax 2.5D Multi-Camadas**:
  - Camada de fundo cósmico distante (z = 0.25).
  - Camada de foco com câmera dinâmica e zoom de segurança (z = 1.0).
  - Camada de primeiro plano com bokeh e partículas ópticas (z = 1.85).
  - Reação contínua à timeline e ao cursor do mouse / toque na tela, além de perspectiva 3D no viewport.
  - Alternador `2.5D ON / OFF` no HUD do player.

- **Geração de Animações Sem Repetir**:
  - Algoritmo de roteirização semântica que distribui 12 arquétipos visuais distintos sem duplicatas.
  - Botão *"Variação Sem Repetir"* gera combinações imediatas com renderização a 60 FPS.

- **Tema Minimalista & Responsivo**:
  - Interface escura de alta fidelidade baseada em paleta obsidiana/zinco.
  - HUD compacto, safe areas 9:16 e atalhos de gravação WebM/MP4.

- **Auditoria & Verificação Automática**:
  - Teste automatizado de keyframes, detecção de canvas leaks e validação de 100% das cenas.
