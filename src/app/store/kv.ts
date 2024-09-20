import { kv } from "@vercel/kv";
import { sanitise } from "@/utilities/Sanitisation";
import { Rating, RatingId, RatingSchema } from "../models/Rating";
import { updateRollingAverage } from "@/utilities/Average";

const getRatingById = async (ratingId: string): Promise<Rating> => {
  const ratingIdSanitised = sanitise(ratingId);

  const existingRating = await kv.hgetall(ratingIdSanitised);
  if (!existingRating) {
    throw new Error(`Rating not found for id ${ratingIdSanitised}`);
  }

  const parseResult = RatingSchema.safeParse(existingRating);
  if (!parseResult.success) {
    console.error(parseResult.error)
    throw new Error("Invalid rating " + JSON.stringify(existingRating));
  }
  return parseResult.data;
}

const updateRating = async (ratingId: RatingId, newRating: number): Promise<Rating> => {
  const rating = await getRatingById(ratingId);
  const updatedRating = updateRollingAverage(rating, newRating);
  await kv.hset(updatedRating.id, updatedRating);
  await kv.zadd("items_by_score", { score: updatedRating.rating, member: updatedRating.id });
  return updatedRating;
}

export { getRatingById, updateRating };