"use client";

import { Rating } from "./models/Rating";
import { b64 } from "@/utilities/Sanitisation";
import { useState } from "react";


export default function RatingsForm() {
  const [actor, setActor] = useState('');
  const [film, setFilm] = useState('');

  const url = `/rating/${b64(actor)}/${b64(film)}`;

  return (
    <>
      <div className="mx-8 w-full">
        <form className="relative my-8 items-center justify-center flex flex-col gap-4 p-4">
          <h2 className="text-lg font-semibold">Search by actor and film</h2>
          <input
            aria-label="Enter the name of an actor"
            className="input text-white input-bordered input-primary w-full max-w-sm"
            maxLength={150}
            placeholder="Actor..."
            required
            name="actor"
            type="text"
            value={actor}
            onChange={(e) => setActor(e.target.value)}
          />
          <input
            aria-label="Enter the name of a film the actor has acted in"
            className="input text-white input-bordered input-primary w-full max-w-sm"
            maxLength={150}
            placeholder="Film..."
            required
            name="film"
            type="text"
            value={film}
            onChange={(e) => setFilm(e.target.value)}
          />
          <a className="btn btn-primary" href={url}>
            Search
          </a>
        </form>
      </div>
    </>
  );
}
