import { z } from "zod";

const AccentSchema = z.object({
  nativeAccent: z.string(),
  attemptedAccent: z.string(),
});

type Accent = z.infer<typeof AccentSchema>;

export { AccentSchema };
export type { Accent };