"use server";

import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";
import { createRating, createRatingId, Rating, ratingIdSchema, RatingSchema } from "./models/Rating";
import { toChatId, ChatSchema } from "./models/Chat";
import { urls } from "@/utilities/Urls";
import { getRatingById, updateRating } from "./store/kv";


export async function submitNewRating(formData: FormData) {
  const actor = String(formData.get("actor"));
  const film = String(formData.get("film"));
  const nativeAccent = String(formData.get("nativeAccent"));
  const attemptedAccent = String(formData.get("attemptedAccent"));
  const rating = Math.max(0.5, Math.min(5, parseInt(String(formData.get("rating")))));
  console.log('New rating for', {
    actor, film, rating, nativeAccent, attemptedAccent,
  });

  const newRating = createRating(actor, film, nativeAccent, attemptedAccent, rating);
  
  await kv.hset(newRating.id, newRating);
  await kv.zadd("items_by_score", {
    score: Number(newRating.rating),
    member: newRating.id,
  });

  const path = urls.rating(actor, film);
  revalidatePath(path);
  revalidatePath("/");
}

export async function searchByActorAndFilm(actor: string, film: string): Promise<Rating | null> {
  const key = createRatingId(actor, film);
  console.log('Searching for', key);
  const rating = await kv.hgetall(key);
  if (!rating) {
    console.log('Rating not found for', key);
    return null;
  }
  console.log('Returning item for', key);
  return RatingSchema.safeParse(rating).data ?? null;
}

export async function voteOnExistingRating(ratingId: string, newRating: number) {
  const ratingIdResult = ratingIdSchema.safeParse(ratingId);
  if (!ratingIdResult.success) {
    return ratingIdResult.error;
  }
  const parsedRatingId = ratingIdResult.data;
  const updatedRating = await updateRating(parsedRatingId, newRating);

  const path = urls.rating(updatedRating.actor, updatedRating.film);
  revalidatePath(path);
  revalidatePath("/");
}

export async function submitChatMessage(formData: FormData) {
  const author = String(formData.get("author"));
  const message = String(formData.get("message"));
  const ratingId = String(formData.get("ratingId"));
  if (!author || !message || !ratingId) {
    throw new Error("Missing name or message or ratingId");
  }
  const chatMessage = ChatSchema.parse({
    author,
    message,
    created_at: new Date().toISOString(),
  });
  
  const rating = await getRatingById(ratingId);

  console.log('New chat message for', ratingId, chatMessage);
  await kv.rpush(toChatId(ratingId), chatMessage);
  const path = urls.rating(rating.actor, rating.film);
  revalidatePath(path);
}

export async function getChatMessages(ratingId: string) {
  if (!ratingId) {
    throw new Error("Missing ratingId");
  }
  const chatMessages = await kv.lrange(toChatId(ratingId), 0, -1);
  return chatMessages.map((message) => ChatSchema.parse(message));
}