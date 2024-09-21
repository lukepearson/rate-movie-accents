import { sanitise } from '@/utilities/Sanitisation';
import { isKeyOfRatings } from '@/utilities/TypePredicates';
import z from 'zod';


const minRating = 1;
const maxRating = 5;

type RatingId = z.infer<typeof ratingIdSchema>;
const ratingIdSchema = z
  .string()
  .refine((val) => val.startsWith("rating:"), {
    message: "Invalid ratingId: Must start with 'rating:'",
  })
  .brand<"RatingId">();

const RatingSchema = z.object({
  id: ratingIdSchema,
  actor: z.string(),
  film: z.string(),
  nativeAccent: z.string(),
  attemptedAccent: z.string(),
  rating: z.number({ coerce: true }).min(minRating).max(maxRating),
  ratings: z.object({ 1: z.number(), 2: z.number(), 3: z.number(), 4: z.number(), 5: z.number() }),
  votes: z.number({ coerce: true }).default(0),
  image: z.string(),
  created_at: z.string(),
});

type Rating = z.infer<typeof RatingSchema>;

function createRating(actor: string, film: string, actorId: number, filmId: number, nativeAccent: string, attemptedAccent: string, rating: number, image: string): Rating {
  const ratings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const newRating: Rating = {
    actor,
    film,
    nativeAccent,
    attemptedAccent,
    rating,
    votes: 1,
    ratings: ratings,
    id: createRatingId(actorId, filmId),
    image,
    created_at: new Date().toISOString(),
  };
  if (isKeyOfRatings(rating)) newRating.ratings[rating] = 1;
  return newRating;
}

const createRatingId = (actor: number, film: number): RatingId => {
  return ratingIdSchema.parse(`rating:${sanitise(actor)}:${sanitise(film)}`);
};

const getIdsFromRatingId = (ratingId: RatingId): [number, number] => {
  const [, actor, film] = ratingId.split(":");
  return [actor, film].map(Number) as [number, number];
}

export { RatingSchema, ratingIdSchema, minRating, maxRating, createRating, createRatingId, getIdsFromRatingId };
export type { Rating, RatingId };