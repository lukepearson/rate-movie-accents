"use client";

import { useEffect, useRef, useState } from "react";
import { fetchFilmById, searchForActors, searchForActorsByFilm, searchForFilms, searchForFilmsByActor } from "./actions";
import { Cast, Movie, Person, PersonMovieCast } from "tmdb-ts";
import { Dropdown, DropdownItem } from "@/components/Dropdown";
import { urls } from "@/utilities/Urls";
import { sortBy } from "lodash";


export default function RatingsForm() {
  const [actors, setActors] = useState<Person[]>([]);
  const [films, setFilms] = useState<Movie[]>([]);
  const [cast, setCast] = useState<Cast[]>([]);
  const [actorFilms, setActorFilms] = useState<PersonMovieCast[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [combinedItems, setCombinedItems] = useState<(Person | Movie)[]>([]);
  const [debouncedSearchTerm, setDebouncedTerm] = useState('');
  const [actorId, setActorId] = useState<number | null>(null);
  const [filmId, setFilmId] = useState<number | null>(null);

  useEffect(() => {
    setCombinedItems(sortBy([...actors, ...films], 'popularity').reverse());
  }, [actors, films]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 600);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (!debouncedSearchTerm) return;
    searchForFilms(debouncedSearchTerm).then((films) => {
      setFilms(films);
    });
    searchForActors(debouncedSearchTerm).then((actors) => {
      setActors(actors);
    });
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (!filmId) return;
    searchForActorsByFilm(filmId).then((cast) => {
      setCast(cast.filter(n => n.known_for_department === 'Acting'));
    });
  }, [filmId]);

  useEffect(() => {
    if (!actorId) return;
    searchForFilmsByActor(actorId).then((films) => {
      setActorFilms(films);
    });
  }, [actorId]);

  return (
    <div className="w-full w-max-sm">
      <div className="relative my-8 items-center justify-center flex flex-col gap-4">
        <Dropdown
          id='film'
          label="Search by actor or film"
          items={combinedItems.map(n => {
            if ('title' in n) {
              return { id: String(n.id), value: n.title, type: 'film' };
            } else {
              return { id: String(n.id), value: n.name, type: 'actor' };
            }
          })}
          setSearchTerm={(searchTerm: string) => {
            setSearchTerm(searchTerm);
          }}
          searchTerm={searchTerm}
          onSelect={(selectedItem: DropdownItem) => {
            console.log('Film ID', selectedItem.id);
            if (selectedItem.type === 'actor') {
              setActorId(Number(selectedItem.id));
              setFilmId(null);
            } else {
              setFilmId(Number(selectedItem.id));
              setActorId(null);
            }
            setSearchTerm(selectedItem.value);
          }}
        />

        {actorId && (
          <div className="menu bg-base-200 p-4 rounded-box">
            <ul>
              {actorFilms.map((film) => (
                <li className="my-2" key={film.id}>
                  <a className="btn btn-ghost w-full text-left" href={urls.rating(actorId, film.id)}>{film.title}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {filmId && (
          <div className="menu bg-base-200 p-4 rounded-box">
            <ul>
              {cast.map((actor) => (
                <li className="my-2" key={actor.id}>
                  <a className="btn btn-ghost w-full text-left" href={urls.rating(actor.id, filmId)}>{actor.name}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
