import express, { type Express } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { registerTtsRoute } from './server-tts-route';

dotenv.config();

/**
 * Resilient Gemini caller that handles temporary demand spikes (503),
 * rate limits (429), or transient API errors by cycling models and API keys.
 */
async function callGeminiWithResilience({
  requestedModel = 'gemini-3.8-flash',
  contents,
  systemInstruction,
  clientKey,
  temperature = 0.7,
  responseMimeType,
}: {
  requestedModel?: string;
  contents: string;
  systemInstruction?: string;
  clientKey?: string;
  temperature?: number;
  responseMimeType?: string;
}): Promise<string> {
  const cleanModel = requestedModel.replace(/^models\//, '');

  const candidateModels = [
    cleanModel,
    'gemini-2.5-flash',
    'gemini-flash-latest',
  ].filter((m, idx, arr) => m && arr.indexOf(m) === idx);

  const apiKeysToTry: string[] = [];
  if (clientKey && clientKey.trim()) {
    apiKeysToTry.push(clientKey.trim());
  }
  if (
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY.trim() &&
    !apiKeysToTry.includes(process.env.GEMINI_API_KEY.trim())
  ) {
    apiKeysToTry.push(process.env.GEMINI_API_KEY.trim());
  }

  if (apiKeysToTry.length === 0) {
    throw new Error(
      'Nenhuma chave de API do Gemini configurada. Configure GEMINI_API_KEY no ambiente ou informe nas configurações.'
    );
  }

  let lastError: unknown = null;

  for (const apiKey of apiKeysToTry) {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: systemInstruction || undefined,
            temperature,
            responseMimeType: responseMimeType || undefined,
          },
        });

        const text = response.text;
        if (text && text.trim()) {
          return text;
        }
      } catch (err: unknown) {
        lastError = err;
        const errMsg = err instanceof Error ? err.message : String(err);
        console.warn(`Tentativa Gemini com modelo ${modelName} falhou: ${errMsg}`);

        const isTransient =
          errMsg.includes('503') ||
          errMsg.includes('demand') ||
          errMsg.includes('429') ||
          errMsg.includes('RESOURCE_EXHAUSTED') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('500');

        if (isTransient) {
          await new Promise((r) => setTimeout(r, 400));
          continue;
        }

        if (errMsg.includes('API_KEY_INVALID') || errMsg.includes('API key not valid')) {
          break;
        }
      }
    }
  }

  const finalMsg =
    lastError instanceof Error
      ? lastError.message
      : String(lastError || 'Falha ao gerar conteúdo com Gemini.');
  throw new Error(finalMsg);
}

export function createServerApp(): Express {
  const app = express();

  // JSON Body parsing with 10MB limit for rich prompt/scene transfers
  app.use(express.json({ limit: '10mb' }));

  // CORS headers for serverless or cross-origin requests
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-gemini-key, x-anthropic-key');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  // Create router that handles endpoints both with or without "/api" prefix (for Vercel rewrites resiliency)
  const router = express.Router();

  // Registrar rota de narração TTS
  registerTtsRoute(app);

  // Health checks
  const handleGeminiHealth = (_req: express.Request, res: express.Response) => {
    const hasServerKey = Boolean(process.env.GEMINI_API_KEY);
    const hasAnthropicKey = Boolean(process.env.ANTHROPIC_API_KEY);
    res.json({
      status: 'ok',
      hasServerKey,
      hasAnthropicKey,
      platform: 'remix-motion-agent',
    });
  };

  const handleClaudeHealth = (_req: express.Request, res: express.Response) => {
    const hasAnthropicKey = Boolean(process.env.ANTHROPIC_API_KEY);
    res.json({
      status: 'ok',
      hasAnthropicKey,
    });
  };

  router.get('/gemini/health', handleGeminiHealth);
  router.get('/claude/health', handleClaudeHealth);

  // Gemini Generate
  router.post('/gemini/generate', async (req: express.Request, res: express.Response) => {
    try {
      const { systemInstruction, userPrompt, model = 'gemini-3.8-flash' } = req.body;
      const clientKey = req.headers['x-gemini-key'] as string | undefined;

      const text = await callGeminiWithResilience({
        requestedModel: model,
        contents: userPrompt,
        systemInstruction,
        clientKey,
        temperature: 0.7,
        responseMimeType: 'application/json',
      });

      res.json({ text });
    } catch (err: unknown) {
      console.error('Erro na chamada ao Gemini no servidor:', err);
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: message });
    }
  });

  // Gemini Repair
  router.post('/gemini/repair', async (req: express.Request, res: express.Response) => {
    try {
      const { repairPrompt, model = 'gemini-3.8-flash' } = req.body;
      const clientKey = req.headers['x-gemini-key'] as string | undefined;

      const text = await callGeminiWithResilience({
        requestedModel: model,
        contents: repairPrompt,
        systemInstruction:
          'Você é um especialista em corrigir erros de código JavaScript Canvas 2D para animação de motion design. Retorne apenas JSON válido.',
        clientKey,
        temperature: 0.4,
        responseMimeType: 'application/json',
      });

      res.json({ text });
    } catch (err: unknown) {
      console.error('Erro no reparo de cena no servidor:', err);
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: message });
    }
  });

  // Claude Generate
  router.post('/claude/generate', async (req: express.Request, res: express.Response) => {
    try {
      const { systemInstruction, userPrompt, model = 'claude-3-opus-20240229' } = req.body;
      const clientKey = (req.headers['x-anthropic-key'] as string | undefined)?.trim();
      const apiKey = clientKey || process.env.ANTHROPIC_API_KEY || '';

      if (!apiKey) {
        return res.status(400).json({
          error:
            'Chave da API do Claude (Anthropic) não configurada. Cole sua chave Anthropic nas Configurações ou use o Gemini.',
        });
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: 4096,
          system: systemInstruction,
          messages: [
            {
              role: 'user',
              content: userPrompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData?.error?.message || `HTTP ${response.status} (${response.statusText})`;
        return res.status(response.status).json({ error: `Erro na API Claude: ${errMsg}` });
      }

      const data = await response.json();
      const textBlock = data.content?.find((c: { type: string; text?: string }) => c.type === 'text');
      const text = textBlock?.text || '';

      if (!text) {
        return res.status(500).json({ error: 'Nenhum texto retornado pelo Claude.' });
      }

      res.json({ text });
    } catch (err: unknown) {
      console.error('Erro na chamada ao Claude no servidor:', err);
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: message });
    }
  });

  // Claude Repair
  router.post('/claude/repair', async (req: express.Request, res: express.Response) => {
    try {
      const { repairPrompt, model = 'claude-3-opus-20240229' } = req.body;
      const clientKey = (req.headers['x-anthropic-key'] as string | undefined)?.trim();
      const apiKey = clientKey || process.env.ANTHROPIC_API_KEY || '';

      if (!apiKey) {
        return res.status(400).json({
          error: 'Chave da API do Claude não informada para o reparo.',
        });
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: 3000,
          system:
            'Você é o Claude Opus, mestre em computação gráfica e Canvas 2D em JavaScript. Corrija o código com precisão matemática pura. Retorne apenas JSON válido.',
          messages: [
            {
              role: 'user',
              content: repairPrompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        return res.status(response.status).json({
          error: errData?.error?.message || `Erro HTTP ${response.status}`,
        });
      }

      const data = await response.json();
      const textBlock = data.content?.find((c: { type: string; text?: string }) => c.type === 'text');
      res.json({ text: textBlock?.text || '' });
    } catch (err: unknown) {
      console.error('Erro no reparo de cena com Claude:', err);
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: message });
    }
  });

  // Mount router at both `/api` (standard) and `/` (if Vercel rewrite strips prefix)
  app.use('/api', router);
  app.use(router);

  return app;
}

const app = createServerApp();
export default app;
