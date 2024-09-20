"use client";

import { Rating } from "./models/Rating";
import { b64 } from "@/utilities/Sanitisation";
import { useEffect, useRef, useState } from "react";
import { searchFilms, searchFilmsByActorId } from "./store/tmdb";
import { searchForActors, searchForFilms } from "./actions";
import { Movie, Person } from "tmdb-ts";
import { debounce } from "lodash";


export default function RatingsForm() {
  const [actor, setActor] = useState('');
  const [actors, setActors] = useState<Person[]>([]);
  const [film, setFilm] = useState('');
  const [films, setFilms] = useState<Movie[]>([]);
  const actorId = useRef<number | null>(null);

  // useEffect(() => {
  //   if (film.length > 2) {
  //     debounce(() => {
  //       searchForFilmsByActor(film).then((films) => {
  //         console.log('Films', films);
  //         if (actorId.current) {
  //           films = films.filter((film) => film..some((actor) => actor.id === actorId.current));
  //         }
  //         setFilms(films);
  //       });
  //     }, 500)()
  //   }
  // }, [film])

  useEffect(() => {
    if (actor.length > 2) {
      debounce(() => {
        searchForActors(actor).then((actors) => {
          setActors(actors);
        });
      }, 500)()
    }
  }, [actor])

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
            list="actors"
            value={actor}
            onBlur={() => {
              const actorId = actors.find(n => n.name == actor)?.id;
              if (!actorId) {
                return;
              }
              searchFilmsByActorId(actorId).then((films) => {
                setFilms(films);
              });
            }}
            onChange={(e) => setActor(e.target.value)}
          />
          <datalist id="actors">
            {actors.map((actor) => (
              <option key={actor.id} value={actor.name} />
            ))}
          </datalist>

          <input
            aria-label="Enter the name of a film the actor has acted in"
            className="input text-white input-bordered input-primary w-full max-w-sm"
            maxLength={150}
            placeholder="Film..."
            required
            name="film"
            type="text"
            list="films"
            value={film}
            onChange={(e) => setFilm(e.target.value)}
          />
          <datalist id="films">
            {films.map((film) => (
              <option key={film.id} value={film.title} />
            ))}
          </datalist>
          <a className="btn btn-primary" href={url}>
            Search
          </a>
        </form>
      </div>
    </>
  );
}
