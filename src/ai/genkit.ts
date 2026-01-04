
'use server';

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { defineDotprompt } from 'genkit/dotprompt';

// Initialize the AI toolkit
export const ai = genkit({
    plugins: [
        googleAI({
            apiVersion: 'v1beta'
        }),
    ],
    logLevel: 'debug',
    enableTracingAndMetrics: true,
});
