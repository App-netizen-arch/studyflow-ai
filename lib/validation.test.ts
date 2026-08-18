import { describe, expect, it } from 'vitest';
import { aiRequestSchema, noteInputSchema } from './validation';

describe('validation',()=>{
 it('accepts a useful note',()=>{expect(noteInputSchema.safeParse({title:'Biology',subject:'Science',content:'Photosynthesis converts light energy into chemical energy.'}).success).toBe(true)});
 it('rejects empty note content',()=>{expect(noteInputSchema.safeParse({title:'Biology',content:'too short'}).success).toBe(false)});
 it('accepts only supported AI operations',()=>{expect(aiRequestSchema.safeParse({noteId:'cm123456789012345678901234',operation:'flashcards'}).success).toBe(true); expect(aiRequestSchema.safeParse({noteId:'cm123456789012345678901234',operation:'chat'}).success).toBe(false)});
});
