"use server";

import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";
import { createRating, createRatingId, getIdsFromRatingId, Rating, ratingIdSchema, RatingSchema } from "./models/Rating";
import { toChatId, ChatSchema } from "./models/Chat";
import { urls } from "@/utilities/Urls";
import { updateRating } from "./store/kv";
import { getActorById, getFilmById, searchActors, searchFilms, searchFilmsByActorId } from "./store/tmdb";


export async function submitNewRating(formData: FormData) {
  const actorId = Number(formData.get("actorId"));
  const filmId = Number(formData.get("filmId"));
  const nativeAccent = String(formData.get("nativeAccent"));
  const attemptedAccent = String(formData.get("attemptedAccent"));
  const rating = Math.max(0.5, Math.min(5, parseInt(String(formData.get("rating")))));
  console.log('New rating for', {
    actorId, filmId, rating, nativeAccent, attemptedAccent,
  });

  const actor = (await getActorById(actorId)).name;
  const film = (await getFilmById(filmId)).title;

  const image = (await getFilmById(filmId)).backdrop_path;

  const newRating = createRating(actor, film, actorId, filmId, nativeAccent, attemptedAccent, rating, image);
  
  await kv.hset(newRating.id, newRating);
  await kv.zadd("items_by_score", {
    score: Number(newRating.rating),
    member: newRating.id,
  });

  const path = urls.rating(actorId, filmId);
  revalidatePath(path);
  revalidatePath("/");
}

export async function searchForFilms(query: string) {
  console.log('Searching for films', query);
  const films = await searchFilms(query);
  console.log(films.length, 'films found for', query);
  return films;
}

export async function searchForActors(query: string) {
  console.log('Searching for actors', query);
  const actors = await searchActors(query);
  console.log(actors.length, 'actors found for', query);
  return actors;
}

export async function searchForFilmsByActor(actorId: number) {
  console.log('Searching for films by actor', actorId);
  const films = await searchFilmsByActorId(actorId);
  console.log(films.length, 'films found for', actorId);
  return films;
}

export async function searchByActorAndFilm(actorId: number, filmId: number): Promise<Rating | null> {
  const key = createRatingId(actorId, filmId);
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
  console.log('Voting on', ratingId, newRating);
  const parsedRatingId = ratingIdResult.data;
  const updatedRating = await updateRating(parsedRatingId, newRating);
  const [actorId, filmId] = updatedRating.id.split(":").map(Number);

  const path = urls.rating(actorId, filmId);
  revalidatePath(path);
  revalidatePath("/");
}

export async function submitChatMessage(formData: FormData) {
  const author = String(formData.get("author"));
  const message = String(formData.get("message"));
  const ratingId = ratingIdSchema.parse(formData.get("ratingId"));
  if (!author || !message || !ratingId) {
    throw new Error("Missing name or message or ratingId");
  }
  const chatMessage = ChatSchema.parse({
    author,
    message,
    created_at: new Date().toISOString(),
  });
  
  const [ actorId, filmId ] = getIdsFromRatingId(ratingId);

  console.log('New chat message for', ratingId, chatMessage);
  await kv.rpush(toChatId(ratingId), chatMessage);
  const path = urls.rating(actorId, filmId);
  revalidatePath(path);
}

export async function getChatMessages(ratingId: string) {
  if (!ratingId) {
    throw new Error("Missing ratingId");
  }
  const chatMessages = await kv.lrange(toChatId(ratingId), 0, -1);
  return chatMessages.map((message) => ChatSchema.parse(message));
}

export async function fetchActorById(actorId: number) {
  return getActorById(Number(actorId));
}

export async function fetchFilmById(filmId: number) {
  return getFilmById(Number(filmId));
}