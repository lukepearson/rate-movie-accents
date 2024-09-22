import OpenAI from 'openai';

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

export { moderateChatMessage };