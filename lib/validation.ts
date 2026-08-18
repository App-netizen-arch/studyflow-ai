import { z } from 'zod';

export const noteInputSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120),
  subject: z.string().trim().max(80).optional().or(z.literal('')),
  content: z.string().trim().min(20, 'Add some notes first so the AI has something to work with.').max(50000, 'Notes are limited to 50,000 characters.'),
});

export const aiRequestSchema = z.object({
  noteId: z.string().cuid(),
  operation: z.enum(['summarize', 'flashcards', 'key-points']),
});

export type NoteInput = z.infer<typeof noteInputSchema>;
export type AIOperation = z.infer<typeof aiRequestSchema>['operation'];
