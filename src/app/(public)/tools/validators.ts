import { z } from 'zod';

export const answerSchema = z.object({
  userName: z.string().min(1, 'User Name is required'),
  answerText: z
    .string()
    .min(2, 'Answer must be at least 2 characters long')
    .regex(/^[\w\s.,!?'"-]*$/, 'Answer contains invalid characters')
    .trim(),
  questionId: z.string().min(1, 'Question ID is required'),
  tool: z.string().min(1, 'Tool is required'),
});

export type AnswerInput = z.infer<typeof answerSchema>;
