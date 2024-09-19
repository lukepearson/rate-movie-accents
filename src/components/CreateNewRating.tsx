"use client";

import { submitNewRating } from "@/app/actions";
import { FC, useEffect, useState } from "react";
import UpArrow from '@heroicons/react/24/outline/ArrowUpCircleIcon';
import WarningIcon from '@heroicons/react/24/outline/ExclamationCircleIcon';
import { RatingHearts } from "./RatingHearts";

interface CreateNewRatingProps {
  actor: string;
  film: string;
}

const CreateNewRating: FC<CreateNewRatingProps> = ({ actor, film }) => {

  const [rating, setRating] = useState(3);
  const [nativeAccent, setNativeAccent] = useState('');
  const [attemptedAccent, setAttemptedAccent] = useState('');
  const [accents, setAccents] = useState([]);

  useEffect(() => {
    fetch('/accents.json')
      .then((response) => response.json())
      .then((data) => {
        setAccents(data);
      });
  }, []);

  const isInvalid = !nativeAccent || !attemptedAccent;

  return (
    <div className="flex flex-col items-center justify-center">
      
      <div role="alert" className="alert m-5">
        <WarningIcon className="h-6 w-6 text-primary" />
        <span className="my-5 text-center">
          There are no ratings yet for 
          <span className="badge badge-primary badge-lg mx-1">{actor}</span> 
          in the film <span className="badge badge-secondary badge-lg mx-1">{film}</span>
        </span>
      </div>

      <h2 className="text-center mb-4 text-xl">Submit a new rating:</h2>

      <form className="flex flex-col items-center gap-4 p-4" action={submitNewRating}>
        <input type="hidden" name="actor" value={actor} />
        <input type="hidden" name="film" value={film} />
        <input type="hidden" name="rating" value={rating} />
        
        <input 
          type="text" 
          name="nativeAccent" 
          placeholder="Native accent"
          className="input input-bordered input-primary w-full max-w-xs placeholder-gray-500"
          value={nativeAccent}
          list="accent-list"
          id="nativeAccent"
          onChange={(e) => setNativeAccent(e.target.value)}
          required 
        />
        
        <input 
          type="text" 
          name="attemptedAccent" 
          placeholder="Attempted accent" 
          className="input input-bordered input-primary w-full max-w-xs placeholder-gray-500"
          value={attemptedAccent}
          list="accent-list"
          id="attemptedAccent"
          onChange={(e) => setAttemptedAccent(e.target.value)}
          required 
        />

        <datalist id="accent-list">
          {accents.map((accent, index) => (
            <option key={index} value={accent} />
          ))}
        </datalist>
      
        <RatingHearts rating={rating} onRatingChange={(newRating: number) => {
          setRating(newRating);
        }} />
        
        <button
          disabled={isInvalid}
          type="submit"
          className="btn btn-primary text-white p-3 rounded-full focus:cursor-auto disabled:bg-ghost"
        >
          <UpArrow className="h-6 w-6 text-white" />
        </button>
      </form>

      <a href="/" className="btn btn-ghost">Go back</a>

    </div>
  );
};

export { CreateNewRating };
