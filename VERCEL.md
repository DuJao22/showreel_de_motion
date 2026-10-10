# Guia Completo de Hospedagem no Vercel 🚀

Este sistema foi totalmente estruturado e otimizado para deploy imediato no **Vercel**, suportando tanto a interface SPA de alta performance (Vite + React) quanto as rotas de backend de inteligência artificial (`/api/gemini/*`, `/api/claude/*`, `/api/gemini/tts`) por meio de **Serverless Functions** do Vercel.

---

## ⚡ Passo a Passo: Deploy em 2 Minutos

### Opção 1: Pelo Painel Web do Vercel (Recomendado)

1. **Suba seu código para o GitHub ou GitLab**:
   - Crie um repositório no seu GitHub e envie os arquivos deste projeto.

2. **Acesse o Vercel**:
   - Entre em [vercel.com](https://vercel.com) e faça login.
   - Clique em **"Add New..."** → **"Project"**.
   - Selecione o repositório do projeto e clique em **"Import"**.

3. **Configurações do Projeto (Já pré-configuradas pelo `vercel.json`)**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Variáveis de Ambiente (Environment Variables)**:
   No campo **Environment Variables** da tela de criação do projeto, adicione:
   - `GEMINI_API_KEY`: Sua chave de API do Google Gemini (obtida gratuitamente no [Google AI Studio](https://aistudio.google.com/app/apikey)).
   - *(Opcional)* `ANTHROPIC_API_KEY`: Caso deseje utilizar o Claude 3 Opus diretamente pelo servidor.

5. **Clique em "Deploy"**:
   - O Vercel construirá os arquivos estáticos e provisionará a função serverless em `api/index.ts` automaticamente.
   - Em menos de 1 minuto seu Showreel Motion Studio estará no ar com HTTPS gratuito e CDN global!

---

### Opção 2: Pelo Terminal via Vercel CLI

Se preferir fazer deploy direto pelo terminal:

```bash
# 1. Instalar a CLI do Vercel (se ainda não tiver)
npm i -g vercel

# 2. Fazer o login e deploy
vercel

# 3. Para deploy final em produção:
vercel --prod
```

Durante o assistente, responda:
- `Set up and deploy?`: **Y**
- `Which scope?`: Seu usuário/equipe
- `Link to existing project?`: **N**
- `Project name`: `remix-motion-showreel` (ou o nome que preferir)
- `Directory located?`: `./`
- `Want to modify settings?`: **N** (as configurações do `vercel.json` serão lidas automaticamente).

Para adicionar a chave de API pelo terminal:
```bash
vercel env add GEMINI_API_KEY
```

---

## 🛠️ Arquitetura Híbrida & Resiliência Implementada

1. **`vercel.json`**:
   - Redireciona todas as requisições para `/api/(.*)` diretamente para a Serverless Function do Vercel (`api/index.ts`).
   - Redireciona todas as rotas do frontend para o `index.html` (Single Page Application routing).

2. **Serverless Functions (`/api/index.ts`)**:
   - Executa as rotas Express `/api/gemini/generate`, `/api/gemini/repair`, `/api/claude/generate`, `/api/gemini/tts` com streaming e cycling de modelos.

3. **Fallback Client-Side Direto**:
   - Caso prefira não configurar variáveis de ambiente no servidor Vercel, o usuário pode simplesmente abrir o modal de **Configurações (ícone de engrenagem)** na interface e colar sua chave de API pessoal.
   - O sistema detecta automaticamente e faz chamadas diretas com segurança via REST no navegador!

4. **Efeito Parallax 2.5D**:
   - Totalmente compatível com mobile e desktop em produção no Vercel (GPU-accelerated Canvas 2D + CSS 3D Transforms).

---

## ✅ Como Testar o Deploy

1. Acesse o link gerado pelo Vercel (ex: `https://seu-projeto.vercel.app`).
2. Clique no botão **"Variação Sem Repetir"** no topo ou no painel Roteiro:
   - O sistema gerará as cenas instantaneamente com arquétipos procedurais não repetidos!
3. Passe o mouse ou arraste o dedo sobre o preview 9:16:
   - Observe a profundidade do efeito **Parallax 2.5D** reagindo ao cursor e à linha do tempo!
4. Clique em **"Auditoria"** para certificar 100% das cenas em tempo real.
