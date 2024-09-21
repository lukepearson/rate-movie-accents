'use server';

import { MovieDetails, PersonDetails, PersonMovieCast, TMDB } from 'tmdb-ts';

const tmdb = new TMDB('eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjAxM2I3Y2E3OWZjY2E1OGZhY2RiZTM3ZGUxYTQ0NSIsIm5iZiI6MTcyNjg0NjUzMC45NjgzNjMsInN1YiI6IjY2ZWQ5NDMzNmQwY2QyNjQ4M2ZlMTY3NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yP_koCj3SO0PX-XTDrpQmMudbUJYdIO5xK0PfGne1QE');

const searchFilms = async (query: string) => {
  const response = await tmdb.search.movies({
    include_adult: false,
    query,
  });
  return response.results;
}

const getFilmById = async (filmId: number): Promise<MovieDetails> => {
  const response = await tmdb.movies.details(filmId);
  return response;
}

const getActorById = async (actorId: number): Promise<PersonDetails> => {
  const response = await tmdb.people.details(actorId);
  return response;
}

const searchActors = async (query: string) => {
  const response = await tmdb.search.people({
    include_adult: false,
    query,
  });
  return response.results;
}

const searchFilmsByActorId = async (actorId: number): Promise<PersonMovieCast[]> => {
  console.log('Searching for films by actor', actorId);
  const response = await tmdb.people.movieCredits(actorId);
  console.log(`${response.cast.length} films found for actor ${actorId}`);
  return response.cast;
}

export { searchFilms, searchActors, searchFilmsByActorId, getFilmById, getActorById };