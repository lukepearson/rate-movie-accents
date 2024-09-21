"use client";

import { useEffect, useRef, useState } from "react";
import { searchFilmsByActorId } from "./store/tmdb";
import { searchForActors } from "./actions";
import { Movie, Person } from "tmdb-ts";
import { debounce } from "lodash";
import { Dropdown, DropdownItem } from "@/components/Dropdown";
import { useDebounce, useDebouncedCallback } from "use-debounce";


export default function RatingsForm() {
  const [actors, setActors] = useState<Person[]>([]);
  const [films, setFilms] = useState<Movie[]>([]);
  const [filteredFilms, setFilteredFilms] = useState<Movie[]>([]);
  const [actorSearchTerm, setActorSearchTerm] = useState('');
  const [searchTerm, setDebouncedTerm] = useState('');
  const [filmSearchTerm, setFilmSearchTerm] = useState('');
  const [actorId, setActorId] = useState<number | null>(null);
  const [filmId, setFilmId] = useState<number | null>(null);

  const count = useRef(0);
  const count2 = useRef(0);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(actorSearchTerm);
    }, 600);

    return () => {
      clearTimeout(handler);
    };
  }, [actorSearchTerm]);

  useEffect(() => {
    if (!searchTerm) return;
    searchForActors(searchTerm).then((actors) => {
      console.log(`Setting actors!!!!!!!! ${count.current++}`);
      setActors(actors);
    });
  }, [searchTerm]);

  useEffect(() => {
    if (!actorId) return;
    searchFilmsByActorId(actorId).then((films) => {
      console.log(`Setting films!!!!!!!! ${count2.current++}`);
      setFilms(films);
    });
  }, [actorId]);

  const url = `/rating/${actorId}/${filmId}`;

  return (
    <>
      <div className="mx-8 w-full">
        <form className="relative my-8 items-center justify-center flex flex-col gap-4 p-4">
          <h2 className="text-lg font-semibold">Search by actor and film</h2>

          <Dropdown
            id='actor'
            label="Actor"
            items={actors.map(n => ({ id: String(n.id), value: n.name }))}
            setSearchTerm={(searchTerm: string) => {
              setActorSearchTerm(searchTerm);
            }}
            searchTerm={actorSearchTerm}
            onSelect={(selectedItem: DropdownItem) => {
              console.log('Actor ID', selectedItem.id);
              setActorId(Number(selectedItem.id));
              setActorSearchTerm(selectedItem.value);
            }}
          />

          <Dropdown
            id='film'
            label="Film"
            items={filteredFilms.map(n => ({ id: String(n.id), value: n.title }))}
            setSearchTerm={(searchTerm: string) => {
              setFilmSearchTerm(searchTerm);
              setFilteredFilms(films.filter(({ title }) => title.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())));
            }}
            disabled={!actorId}
            searchTerm={filmSearchTerm}
            onSelect={(selectedItem: DropdownItem) => {
              console.log('Film ID', selectedItem.id);
              setFilmId(Number(selectedItem.id));
              setFilmSearchTerm(selectedItem.value);
            }}
          />

          <a className="btn btn-primary" href={url}>
            Search
          </a>
        </form>
      </div>
    </>
  );
}
