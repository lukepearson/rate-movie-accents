"use client";

import { Rating } from "./models/Rating";
import { useRouter } from "next/navigation";
import { b64 } from "@/utilities/Sanitisation";


export default function RatingsForm() {
  const router = useRouter();

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
    </>
  );
}
