import OpenAI from 'openai';
import { Accent, AccentSchema } from '../models/Accent';

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

const prompt  = (message: string) => `
  Convert the following text between the <> to the style of a 1920s nobleman:

  <${message}>
`

const moderateChatMessage = async (message: string) => {
  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: 'user', content: prompt(message) }],
    model: 'gpt-3.5-turbo',
  });

  return chatCompletion.choices[0].message.content?.trim();
};

const accentPrompt = (actor: string, film: string) => 
  `Answering only in JSON in the format {"nativeAccent": "" , "attemptedAccent": ""} provide the actor ${actor}'s native accent, and their attempted accent in the film ${film}.`

const suggestAccents = async (actor: string, film: string): Promise<Accent | null> => {
  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: 'user', content: accentPrompt(actor, film) }],
    model: 'gpt-3.5-turbo',
  });

  const rawResponse = chatCompletion.choices[0].message.content?.trim();
  if (!rawResponse) {
    return null;
  }
  const json = rawResponse.match(/{.*}/)?.[0];
  if (!json) {
    console.log('Failed to parse JSON from response:', rawResponse);
    return null;
  }
  const parsedResponse = JSON.parse(json);
  const accents = AccentSchema.safeParse(parsedResponse);
  if (!accents.success) {
    console.log('Failed to parse into accent schema:', accents.error);
    return null;
  }
  console.log('Successfully parsed accents', accents.data);
  return accents.data;
}

export { moderateChatMessage, suggestAccents };