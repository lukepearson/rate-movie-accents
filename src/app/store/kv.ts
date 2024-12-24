import { createClient } from "@vercel/kv";
import { sanitise } from "@/utilities/Sanitisation";
import { createRatingId, Rating, RatingId, RatingSchema } from "../models/Rating";
import { updateRollingAverage } from "@/utilities/Average";
import { Chat, ChatSchema, toChatId } from "../models/Chat";
import { write } from "fs";

const [url, token] = [process.env.UPSTASH_KV_REST_API_URL, process.env.UPSTASH_KV_REST_API_READ_ONLY_TOKEN];
if (!url || !token) {
  throw new Error("Missing Upstash KV URL or token");
}

const [writeUrl, writeToken] = [process.env.UPSTASH_KV_REST_API_URL, process.env.UPSTASH_KV_REST_API_TOKEN];
if (!writeUrl || !writeToken) {
  throw new Error("Missing Upstash KV URL or token");
}

const readClient = createClient({
  url,
  token,
});

const writeClient = createClient({
  url: writeUrl,
  token: writeToken,
});

const getRatingById = async (ratingId: string): Promise<Rating> => {
  const ratingIdSanitised = sanitise(ratingId);

  const existingRating = await readClient.hgetall(ratingIdSanitised);
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

const searchForRating = async (actorId: number, filmId: number): Promise<Rating | null> => {
  const key = createRatingId(actorId, filmId);
  const rating = await readClient.hgetall(key);
  return RatingSchema.safeParse(rating).data ?? null;
}

const updateRating = async (ratingId: RatingId, newRating: number): Promise<Rating> => {
  const rating = await getRatingById(ratingId);
  const updatedRating = updateRollingAverage(rating, newRating);
  await writeClient.hset(updatedRating.id, updatedRating);
  await writeClient.zadd("items_by_score", { score: updatedRating.rating, member: updatedRating.id });
  return updatedRating;
}

const insertRating = async (rating: Rating): Promise<Rating> => {
  await writeClient.hset(rating.id, rating);
  await writeClient.zadd("items_by_score", { score: rating.rating, member: rating.id });
  return rating;
}

async function getRatings(): Promise<Rating[]> {
  try {
    const itemIds = await readClient.zrange<Array<string>>("items_by_score", 0, 100, {
      rev: true,
    });

    if (!itemIds.length) {
      return [];
    }

    const multi = writeClient.multi();
    itemIds.forEach((id) => {
      multi.hgetall(id);
    });

    return multi.exec();
  } catch (error) {
    console.error(error);
    return [];
  }
}

const getMessages = async (ratingId: string): Promise<Chat[]> => {
  const chatMessages = await readClient.lrange(toChatId(ratingId), 0, -1);
  return chatMessages.map((message) => ChatSchema.parse(message));
}

const insertMessage = async (ratingId: string, message: Chat) => {
  await writeClient.rpush(toChatId(ratingId), message);
};

export { getRatingById, updateRating, insertRating, searchForRating, getRatings, getMessages, insertMessage };