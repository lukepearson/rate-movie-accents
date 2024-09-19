"use server";

import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";
import { Rating, RatingSchema } from "./types";
import { b64, getKey, sanitise } from "@/utilities/Sanitisation";
import { updateRollingAverage } from "@/utilities/Average";
import { urls } from "@/utilities/Urls";
import { NextRequest, NextResponse } from "next/server";

export async function submitNewRating(formData: FormData) {
  const actor = String(formData.get("actor"));
  const film = String(formData.get("film"));
  const nativeAccent = String(formData.get("nativeAccent"));
  const attemptedAccent = String(formData.get("attemptedAccent"));
  const rating = Math.max(1, Math.min(5, parseInt(String(formData.get("rating")))));
  console.log('New rating for', {
    actor, film, rating, nativeAccent, attemptedAccent,
  });
  if (!actor || !film) {
    throw new Error("Missing actor or film");
  }
  const newRating: Rating = {
    actor,
    film,
    nativeAccent,
    attemptedAccent,
    rating,
    votes: 1,
    id: getKey(actor, film),
    created_at: new Date().toISOString(),
  };
  await kv.hset(newRating.id, newRating);
  await kv.zadd("items_by_score", {
    score: Number(newRating.rating),
    member: newRating.id,
  });

  const path = urls.rating(actor, film);
  revalidatePath(path);
  revalidatePath("/");
  return NextResponse.rewrite(`${path}?voted=true`);
}

export async function searchByActorAndFilm(actor: string, film: string): Promise<Rating | null> {
  const key = getKey(actor, film);
  console.log('Searching for', key);
  const rating = await kv.hgetall(key);
  if (!rating) {
    console.log('Rating not found for', key);
    return null;
  }
  console.log('Returning item for', key);
  return RatingSchema.safeParse(rating).data ?? null;
}

export async function submitExistingRating(ratingId: string, newRating: number) {
  
  if (!ratingId || !newRating) {
    throw new Error(`Missing ratingId (${ratingId}) or newRating (${newRating})`);
  }

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
  const parsedRating = parseResult.data;
  const updatedRating = updateRollingAverage(parsedRating, newRating);
  
  await kv.hset(updatedRating.id, updatedRating);
  await kv.zadd("items_by_score", { score: updatedRating.rating, member: updatedRating.id });

  const path = urls.rating(updatedRating.actor, updatedRating.film);
  revalidatePath(path);
  revalidatePath("/");
}
