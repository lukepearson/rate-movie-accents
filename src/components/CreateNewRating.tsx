"use client";

import { fetchAccentsByActorAndFilm, fetchActorById, fetchFilmById, submitNewRating } from "@/app/actions";
import { FC, useEffect, useState } from "react";
import UpArrow from '@heroicons/react/24/outline/ArrowUpCircleIcon';
import WarningIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon';
import { RatingHearts } from "./RatingHearts";
import useLocalStorageState from "use-local-storage-state";
import { createRatingId } from "@/app/models/Rating";
import { MovieDetails, PersonDetails } from "tmdb-ts";
import Loading from "@/app/loading";
import Image from "next/image";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActorById(Number(actorId)).then((actor) => {
      setActor(actor);
    });
  }, [actorId]);

  useEffect(() => {
    fetchFilmById(Number(filmId)).then((film) => {
      setFilm(film);
    });
  }, [filmId]);

  useEffect(() => {
    if (actor?.name && film?.title) {
      fetchAccentsByActorAndFilm(actor.name, film.title).then((accent) => {
        setNativeAccent(accent?.nativeAccent || '');
        setAttemptedAccent(accent?.attemptedAccent || '');
        setIsLoading(false);
      });
    }
  }, [actor?.name, film?.title])

  useEffect(() => {
    fetch('/accents.json')
      .then((response) => response.json())
      .then((data) => {
        setAccents(data);
      });
  }, []);

  const isInvalid = !nativeAccent || !attemptedAccent;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
        <div className="p-8 my-5 mb-9 border-2 border-primary rounded-md"
          style={{ backgroundImage: `url(https://media.themoviedb.org/t/p/w220_and_h330_face/${film?.backdrop_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backfaceVisibility: 'hidden',
            backdropFilter: 'blur(20px)',
            // backgroundBlendMode: 'luminosity',
          }}>
          <div className="bg-black/70 p-5 flex flex-col items-center justify-center leading-loose">
            <Image alt={actor?.name ?? 'Actor'} 
              width={100} height={100}
              className="mb-2 rounded-full border-2 border-primary"
              src={`https://media.themoviedb.org/t/p/w220_and_h330_face${actor?.profile_path}`}
            />
            <p>There are no ratings yet for&nbsp;</p>
            <p className="text-primary mx-1">{actor?.name}</p>
            <p className="">&nbsp;in the film&nbsp;</p>
            <p className="text-secondary mx-1">{film?.title}</p>
          </div>
        </div>

      <h2 className="text-center text-white mb-4 text-xl">Submit a new rating:</h2>

      <form className="flex flex-col items-center gap-4 py-4"
        action={(e) => {
          if (!actor || !film) return;
          const newVoteId = createRatingId(actor?.id, film?.id);
          setVoteIds([...votedIds, newVoteId]);
          submitNewRating(e)
        }}
      >
        <input type="hidden" name="actorId" value={actor?.id} />
        <input type="hidden" name="filmId" value={film?.id} />
        <input type="hidden" name="rating" value={rating} />
        
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Native Accent</span>
          </div>
          <input 
            type="text" 
            name="nativeAccent" 
            className="input input-bordered input-primary w-full placeholder-gray-500"
            value={nativeAccent}
            list="accent-list"
            id="nativeAccent"
            onChange={(e) => setNativeAccent(e.target.value)}
            required 
          />
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Attempted Accent</span>
          </div>
          <input 
            type="text" 
            name="attemptedAccent" 
            className="input input-bordered input-primary w-full placeholder-gray-500"
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
          className="btn btn-primary text-lg bg-primary text-white p-3 px-5 focus:cursor-auto disabled:bg-ghost"
        >
          Submit
        </button>
      </form>

      <a href="/" className="btn btn-ghost">Go back</a>

    </div>
  );
};

export { CreateNewRating };
