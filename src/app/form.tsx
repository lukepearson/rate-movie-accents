"use client";

import { Rating } from "./types";
import { notFound, useRouter } from "next/navigation";
import { RatingRenderer } from "@/components/RatingRenderer";
import { b64 } from "@/utilities/Sanitisation";
import { submitExistingRating } from "./actions";


export default function RatingsForm({ ratings }: { ratings: Rating[] }) {
  const router = useRouter();

  if (!ratings) return notFound();

  const sortedRatings = ratings.filter(Boolean).sort((a, b) => {
    if (!a) return 1;
    if (!b) return -1;
    if (Number(a.rating) > Number(b.rating)) return -1;
    if (Number(a.rating) < Number(b.rating)) return 1;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  const actor: keyof Rating = 'actor';
  const film: keyof Rating = 'film';

  return (
    <>
      <div className="mx-8 w-full">
        <form
          className="relative my-8 items-center justify-center flex flex-col gap-4 p-4"
          onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              const formData = new FormData(event.currentTarget);
              const actor = String(formData.get("actor") ?? '');
              const film = String(formData.get("film") ?? '');
              const b64Actor = b64(actor);
              const b64Film = b64(film);
              router.push(`/rating/${b64Actor}/${b64Film}`);
            }}
        >
          <h2 className="text-lg font-semibold">Search by actor and film</h2>
          <input
            aria-label="Enter the name of an actor"
            className="input input-bordered input-primary w-full max-w-xs"
            maxLength={150}
            placeholder="Actor..."
            required
            type="text"
            name={actor}
          />
          <input
            aria-label="Enter the name of a film the actor has acted in"
            className="input input-bordered input-primary w-full max-w-xs"
            maxLength={150}
            placeholder="Film..."
            required
            type="text"
            name={film}
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </form>
      </div>

      <h3 className="my-5">Highest rated:</h3>

      {sortedRatings.length > 0 && (
        <div className="items-center justify-center flex flex-col">
          {sortedRatings.map((rating: Rating, index: number) => (
            <RatingRenderer
              key={rating.id}
              onChange={(newRating) => {
                submitExistingRating(rating.id, newRating.rating)
              }}
              rating={rating}
            />
          ))}
        </div>
      )}
    </>
  );
}
