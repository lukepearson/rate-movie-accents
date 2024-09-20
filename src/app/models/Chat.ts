import { z } from "zod";

const ChatSchema = z.object({
  author: z.string().max(30),
  message: z.string().max(120),
  created_at: z.string(),
});

type Chat = z.infer<typeof ChatSchema>;

interface ItemByScore {
  score: number;
  id: string;
}

type ChatId = z.infer<typeof chatIdSchema>;

const chatIdSchema = z
  .string()
  .refine((val) => val.startsWith("chat:"), {
    message: "Invalid chatId: Must start with 'chat:'",
  })
  .brand<"ChatId">();


const toChatId = (id: string): ChatId => chatIdSchema.parse(`chat:${id.split(":").slice(1).join(':')}`);

export { ChatSchema, toChatId };
export type { ItemByScore, Chat };
