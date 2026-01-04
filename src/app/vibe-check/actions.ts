
'use server';

import { z } from 'zod';
import { ai } from '@/ai/genkit';

const codeSchema = z.object({
  code: z.string().min(1, 'Code snippet is required.'),
  language: z.string().optional(),
});

const videoSchema = z.object({
    videoDataUri: z.string().min(1, 'Video upload is required.'),
    description: z.string().min(1, 'Description is required.'),
});


export async function getCodeFeedback(prevState: any, formData: FormData) {
  const validatedFields = codeSchema.safeParse({
    code: formData.get('code'),
    language: formData.get('language'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed',
      errors: validatedFields.error.flatten().fieldErrors,
      feedback: null,
    };
  }
  
  try {
    const { code, language } = validatedFields.data;

    const prompt = `You are an expert code reviewer. Provide constructive feedback on the following ${language || 'code'} snippet. Focus on quality, efficiency, and best practices. Keep your feedback concise and actionable.

Code:
\'\'\'${language}
${code}
\'\'\'`;

    const { text } = await ai.generate({
      prompt: prompt,
    });

    return {
      message: 'Success',
      errors: {},
      feedback: text,
    };

  } catch (error) {
    console.error(error);
    return {
        message: 'An unexpected error occurred.',
        errors: {},
        feedback: null
    }
  }
}

export async function getVideoFeedback(prevState: any, formData: FormData) {
  const validatedFields = videoSchema.safeParse({
    videoDataUri: formData.get('videoDataUri'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed',
      errors: validatedFields.error.flatten().fieldErrors,
      feedback: null,
    };
  }

  try {
    const { videoDataUri, description } = validatedFields.data;

    const prompt = [
        { media: { url: videoDataUri } },
        { text: `You are an expert video editor and post-production specialist. Provide constructive feedback on this video edit based on the user's description. Analyze pacing, cuts, color grading, and overall impact. Keep your feedback helpful and encouraging.

User's Description: "${description}"`},
    ]

    const { text } = await ai.generate({ prompt });

    return {
        message: 'Success',
        errors: {},
        feedback: text,
      };

  } catch (error) {
    console.error(error);
    return {
        message: 'An unexpected error occurred while analyzing the video.',
        errors: {},
        feedback: null
    }
  }
}
