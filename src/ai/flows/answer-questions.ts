// This file contains the Genkit flow for answering student questions about internships, applications, and community guidelines.

'use server';

/**
 * @fileOverview An AI chatbot that answers student questions about internships, applications, and community guidelines.
 *
 * - answerQuestions - A function that answers questions from students.
 * - AnswerQuestionsInput - The input type for the answerQuestions function.
 * - AnswerQuestionsOutput - The return type for the answerQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { InternshipWithId } from "@/types/internship";


const AnswerQuestionsInputSchema = z.object({
  question: z.string().describe('The question from the student.'),
});
export type AnswerQuestionsInput = z.infer<typeof AnswerQuestionsInputSchema>;

const AnswerQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the student question.'),
});
export type AnswerQuestionsOutput = z.infer<typeof AnswerQuestionsOutputSchema>;


const getInternshipsTool = ai.defineTool(
    {
      name: 'getInternships',
      description: 'Get a list of available internships and projects.',
      outputSchema: z.array(z.object({
        id: z.string(),
        title: z.string(),
        company: z.string(),
        location: z.string(),
        description: z.string(),
      })),
    },
    async () => {
        const q = query(collection(db, "internships"), orderBy("postedAt", "desc"));
        const querySnapshot = await getDocs(q);
        const internshipsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as InternshipWithId[];

        return internshipsData.map(({ id, title, company, location, description }) => ({ id, title, company, location, description }));
    }
);


export async function answerQuestions(input: AnswerQuestionsInput): Promise<AnswerQuestionsOutput> {
  return answerQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionsPrompt',
  input: {schema: AnswerQuestionsInputSchema},
  output: {schema: AnswerQuestionsOutputSchema},
  tools: [getInternshipsTool],
  prompt: `You are a friendly and helpful chatbot assistant for InternLink, an internship website for tech students.

Your primary purpose is to assist users by providing information about the website and available internships.

Here are your instructions:
- When a user asks for available internships, projects, jobs, or any similar request, you MUST use the 'getInternships' tool to fetch the latest listings.
- When presenting the internships, you MUST format each one as a clickable Markdown link. The format should be: "[Internship Title] at [Company Name](/internships/[id])".
- If the 'getInternships' tool returns an empty list, you should inform the user that there are currently no open positions and encourage them to check back later.
- For general questions about the site, provide a concise and helpful answer based on the context of being an internship platform.
- If a question is completely unrelated to internships, tech, or job applications (e.g., "what is the capital of France?"), you should politely state that you can only help with questions related to the InternLink platform.
- Never make up information. If you don't know the answer, say that you don't have that information.

Answer the following question from a student:

Question: {{{question}}}
  `,
});

const answerQuestionsFlow = ai.defineFlow(
  {
    name: 'answerQuestionsFlow',
    inputSchema: AnswerQuestionsInputSchema,
    outputSchema: AnswerQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
