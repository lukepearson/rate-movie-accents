import z from 'zod';


const minRating = 0.5;
const maxRating = 5;

const RatingSchema = z.object({
  id: z.string(),
  actor: z.string(),
  film: z.string(),
  nativeAccent: z.string(),
  attemptedAccent: z.string(),
  rating: z.number({ coerce: true }).min(minRating).max(maxRating),
  votes: z.number({ coerce: true }).default(0),
  created_at: z.string(),
});

type Rating = z.infer<typeof RatingSchema>;

interface ItemByScore {
  score: number;
  id: string;
}

export { RatingSchema, minRating, maxRating };
export type { Rating, ItemByScore };
