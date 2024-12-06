import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// API Configuration Schema
const apiConfigSchema = z.object({
  openai: z.object({
    apiKey: z.string(),
    defaultModel: z.string().default('gpt-3.5-turbo'),
    organization: z.string().optional(),
  }),
  anthropic: z.object({
    apiKey: z.string(),
    defaultModel: z.string().default('claude-2'),
  }),
  palm: z.object({
    apiKey: z.string(),
    defaultModel: z.string().default('text-bison-001'),
  }),
  custom: z.object({
    endpoint: z.string().optional(),
    apiKey: z.string().optional(),
    defaultModel: z.string().optional(),
  }).optional(),
});

// Environment variables validation
export const apiConfig = apiConfigSchema.parse({
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    defaultModel: process.env.OPENAI_DEFAULT_MODEL,
    organization: process.env.OPENAI_ORGANIZATION,
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    defaultModel: process.env.ANTHROPIC_DEFAULT_MODEL,
  },
  palm: {
    apiKey: process.env.PALM_API_KEY,
    defaultModel: process.env.PALM_DEFAULT_MODEL,
  },
  custom: {
    endpoint: process.env.CUSTOM_API_ENDPOINT,
    apiKey: process.env.CUSTOM_API_KEY,
    defaultModel: process.env.CUSTOM_DEFAULT_MODEL,
  },
});