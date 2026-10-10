import type { Express } from 'express';
import { GoogleGenAI } from '@google/genai';

// Gemini TTS - speech generation route
const DEFAULT_TTS_MODEL = 'gemini-2.5-flash-preview-tts';

export function registerTtsRoute(app: Express) {
  app.post('/api/gemini/tts', async (req, res) => {
    try {
      const { text, voice = 'Kore', style = '', apiKey, model } = req.body ?? {};
      const key = apiKey || process.env.GEMINI_API_KEY;
      if (!key) {
        return res.status(400).json({ error: 'Falta a chave da API do Gemini para narração TTS.' });
      }
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Falta o texto da narração.' });
      }

      const ai = new GoogleGenAI({ apiKey: key });
      const prompt = style ? `${style}:\n\n${text}` : text;

      const r = await ai.models.generateContent({
        model: model || DEFAULT_TTS_MODEL,
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice },
            },
          },
        },
      });

      const data = r.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!data) {
        return res.status(502).json({ error: 'A API do Gemini não devolveu áudio para este texto.' });
      }

      // PCM 16-bit, mono, 24 kHz em base64
      res.json({ pcm: data, sampleRate: 24000 });
    } catch (e: unknown) {
      console.error('Erro na rota TTS:', e);
      const errMsg = e instanceof Error ? e.message : String(e);
      res.status(500).json({ error: errMsg });
    }
  });
}
