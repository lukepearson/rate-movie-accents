"use client";

import { fetchActorById, fetchFilmById, submitNewRating } from "@/app/actions";
import { FC, useEffect, useState } from "react";
import UpArrow from '@heroicons/react/24/outline/ArrowUpCircleIcon';
import WarningIcon from '@heroicons/react/24/outline/ExclamationCircleIcon';
import { RatingHearts } from "./RatingHearts";
import useLocalStorageState from "use-local-storage-state";
import { createRatingId } from "@/app/models/Rating";
import { MovieDetails, PersonDetails } from "tmdb-ts";

interface CreateNewRatingProps {
  actorId: string;
  filmId: string;
}

const CreateNewRating: FC<CreateNewRatingProps> = ({ actorId, filmId }) => {

  const [rating, setRating] = useState(3);
  const [nativeAccent, setNativeAccent] = useState('');
  const [attemptedAccent, setAttemptedAccent] = useState('');
  const [accents, setAccents] = useState([]);
  const [votedIds, setVoteIds] = useLocalStorageState<Array<string>>("hasAlreadyVoted", {
    defaultValue: [],
  });
  const [actor, setActor] = useState<PersonDetails | null>(null);
  const [film, setFilm] = useState<MovieDetails | null>(null);

  useEffect(() => {
    fetchActorById(Number(actorId)).then((actor) => {
      setActor(actor);
      console.log('Actor', actor);
    });
  }, [actorId]);

  useEffect(() => {
    fetchFilmById(Number(filmId)).then((film) => {
      setFilm(film);
      console.log('Film', film);
    });
  }, [filmId]);

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
          <span>There are no ratings yet for&nbsp;</span>
          <span className="badge badge-primary badge-lg mx-1 my-2">{actor?.name}</span>
          <span className="">&nbsp;in the film&nbsp;</span>
          <span className="badge badge-secondary badge-lg mx-1">{film?.title}</span>
        </span>
      </div>

      <h2 className="text-center mb-4 text-xl">Submit a new rating:</h2>

      <form className="flex flex-col items-center gap-4 p-4" action={(e) => {
        if (!actor || !film) return;
        const newVoteId = createRatingId(actor?.id, film?.id);
        setVoteIds([...votedIds, newVoteId]);
        submitNewRating(e)
      }}>
        <input type="hidden" name="actorId" value={actor?.id} />
        <input type="hidden" name="filmId" value={film?.id} />
        <input type="hidden" name="rating" value={rating} />
        
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Native Accent</span>
          </div>
          <input 
            type="text" 
            name="nativeAccent" 
            className="input input-bordered input-primary w-full max-w-xs placeholder-gray-500"
            value={nativeAccent}
            list="accent-list"
            id="nativeAccent"
            onChange={(e) => setNativeAccent(e.target.value)}
            required 
          />
        </label>

        
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Attempted Accent</span>
          </div>
          <input 
            type="text" 
            name="attemptedAccent" 
            className="input input-bordered input-primary w-full max-w-xs placeholder-gray-500"
            value={attemptedAccent}
            list="accent-list"
            id="attemptedAccent"
            onChange={(e) => setAttemptedAccent(e.target.value)}
            required 
          />
        </label>

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
