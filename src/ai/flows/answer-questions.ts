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
      })),
    },
    async () => {
        const q = query(collection(db, "internships"), orderBy("postedAt", "desc"));
        const querySnapshot = await getDocs(q);
        const internshipsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as InternshipWithId[];

        return internshipsData.map(({ id, title, company, location }) => ({ id, title, company, location }));
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
  prompt: `You are a chatbot assistant for InternLink, an internship website.

  Your main goal is to help students find information about available internships and projects.
  
  - If the user asks to see internships, projects, or any available positions, use the 'getInternships' tool to fetch the list.
  - When you present the internships, format each one as a clickable link that directs the user to the details page. For example: "[Title] at [Company] (/internships/[id])".
  - If the tool returns no internships, inform the user that there are no open positions at the moment.
  - For any other questions related to the website, applications, or general guidance, provide a helpful and friendly response.

  Answer the following question:

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
