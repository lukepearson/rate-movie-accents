import { getKey } from '@/utilities/Sanitisation';
import { isKeyOfRatings } from '@/utilities/TypePredicates';
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
  ratings: z.object({ 1: z.number(), 2: z.number(), 3: z.number(), 4: z.number(), 5: z.number() }),
  votes: z.number({ coerce: true }).default(0),
  created_at: z.string(),
});

type Rating = z.infer<typeof RatingSchema>;

type RatingId = z.infer<typeof ratingIdSchema>;
const ratingIdSchema = z
  .string()
  .refine((val) => val.startsWith("rating:"), {
    message: "Invalid ratingId: Must start with 'rating:'",
  })
  .brand<"RatingId">();

function createRating(actor: string, film: string, nativeAccent: string, attemptedAccent: string, rating: number): Rating {
  const ratings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const newRating: Rating = {
    actor,
    film,
    nativeAccent,
    attemptedAccent,
    rating,
    votes: 1,
    ratings: ratings,
    id: getKey(actor, film),
    created_at: new Date().toISOString(),
  };
  if (isKeyOfRatings(rating)) newRating.ratings[rating] = 1;
  return newRating;
}

export { RatingSchema, ratingIdSchema, minRating, maxRating, createRating };
export type { Rating, RatingId };