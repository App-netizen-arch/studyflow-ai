import { GoogleGenAI } from '@google/genai';
import type { AIOperation } from './validation';

export type StudyResult =
  | { summary: string; keyConcepts: string[]; definitions: { term: string; definition: string }[]; importantFacts: string[] }
  | { flashcards: { question: string; answer: string; difficulty: 'easy' | 'medium' | 'hard'; topic: string }[] }
  | { keyConcepts: string[]; importantFacts: string[]; definitions: { term: string; definition: string }[]; formulas: string[]; examPoints: string[] };

const schemas = {
  summarize: {
    type: 'object', properties: {
      summary: { type: 'string' }, keyConcepts: { type: 'array', items: { type: 'string' } },
      definitions: { type: 'array', items: { type: 'object', properties: { term: { type: 'string' }, definition: { type: 'string' } }, required: ['term','definition'] } },
      importantFacts: { type: 'array', items: { type: 'string' } },
    }, required: ['summary','keyConcepts','definitions','importantFacts']
  },
  flashcards: {
    type: 'object', properties: { flashcards: { type: 'array', items: { type: 'object', properties: {
      question: { type: 'string' }, answer: { type: 'string' }, difficulty: { type: 'string', enum: ['easy','medium','hard'] }, topic: { type: 'string' }
    }, required: ['question','answer','difficulty','topic'] } } }, required: ['flashcards']
  },
  'key-points': {
    type: 'object', properties: {
      keyConcepts: { type: 'array', items: { type: 'string' } }, importantFacts: { type: 'array', items: { type: 'string' } },
      definitions: { type: 'array', items: { type: 'object', properties: { term: { type: 'string' }, definition: { type: 'string' } }, required: ['term','definition'] } },
      formulas: { type: 'array', items: { type: 'string' } }, examPoints: { type: 'array', items: { type: 'string' } },
    }, required: ['keyConcepts','importantFacts','definitions','formulas','examPoints']
  }
} as const;

const instructions: Record<AIOperation, string> = {
  summarize: 'Create a concise but informative revision summary. Focus on core concepts, definitions, relationships and facts likely to matter for revision. Do not invent facts not supported by the notes.',
  flashcards: 'Create useful study questions covering different concepts. Avoid trivial wording and duplicate cards. Keep answers concise. Every card must be grounded in the source notes.',
  'key-points': 'Extract key concepts, important facts, definitions, formulas when applicable, and likely exam-relevant points. Do not invent information.',
};

export async function generateStudyMaterial(operation: AIOperation, note: string): Promise<StudyResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('AI_NOT_CONFIGURED');

  const ai = new GoogleGenAI({ apiKey: key, apiVersion: 'v1' });
  const prompt = `You are an expert educational assistant.\n\nTask: ${instructions[operation]}\n\nReturn ONLY valid JSON matching the supplied schema.\n\nSOURCE NOTES:\n${note}`;
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json', responseSchema: schemas[operation], temperature: 0.2 },
  });

  const text = response.text?.trim();
  if (!text) throw new Error('AI_EMPTY_RESPONSE');
  try { return JSON.parse(text) as StudyResult; } catch { throw new Error('AI_INVALID_JSON'); }
}
