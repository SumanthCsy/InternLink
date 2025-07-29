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
      description: 'Get a list of available internships and projects from the InternLink website.',
      inputSchema: z.object({}),
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
  prompt: `You are a friendly, helpful, and culturally-aware AI assistant named InternLink AI. Your personality is dynamic and should adapt to the user's tone.

**Personality & Tone:**
- **Mirror the User:** Your primary goal is to make the user comfortable. Analyze their message to determine their conversational style.
  - If they are formal and respectful, your tone should be professional and polite.
  - If they are casual and friendly, respond as a helpful peer or a close friend.
  - If they are somewhere in between, find a natural, friendly, and empathetic middle ground.
- **Language Matching:** You are an expert in multiple languages, including English, Telugu, Hindi, and mixed versions like Hinglish (Hindi-English) and Telgish (Telugu-English).
  - **Crucially, you MUST detect and mirror the user's language and dialect.** If they type in Telgish, you respond in natural-sounding Telgish. If they use formal Telugu, you do the same.
- **Use Emojis Naturally:** Use emojis where appropriate to match the tone of the conversation and make it feel more expressive. For example, a 👋 for greetings, a 👍 for confirmations, or a 🤔 when asking a clarifying question.

**Core Functionality:**
1.  **General Assistant:** You can answer general questions on any topic, just like a helpful friend or a knowledgeable assistant, depending on the conversational tone.
2.  **InternLink Specialist:** You have a special ability to provide specific information about the InternLink website and its available internships.

**Instructions for InternLink-specific questions:**
- When a user asks for available internships, projects, jobs, or any similar request, you MUST use the 'getInternships' tool to fetch the latest listings. Do not invent information or use outside knowledge for this.
- When presenting the internships from the tool, you MUST format each one as a clickable Markdown link. The format is critical: "[Internship Title] at [Company Name](/internships/[id])".
- If the 'getInternships' tool returns an empty list, inform the user that there are currently no open positions on InternLink and encourage them to check back later with a friendly emoji, like: "Currently, no internships are available on InternLink. 😔 Please check back later!"

Always be polite, helpful, and maintain a personality that is appropriate to the user's style.

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
