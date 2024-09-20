'use server';

import { TMDB } from 'tmdb-ts';

const tmdb = new TMDB('eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjAxM2I3Y2E3OWZjY2E1OGZhY2RiZTM3ZGUxYTQ0NSIsIm5iZiI6MTcyNjg0NjUzMC45NjgzNjMsInN1YiI6IjY2ZWQ5NDMzNmQwY2QyNjQ4M2ZlMTY3NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yP_koCj3SO0PX-XTDrpQmMudbUJYdIO5xK0PfGne1QE');

console.log('TMDB', process.env.TMDB_READ_API_KEY);

const searchFilms = async (query: string) => {
  const response = await tmdb.search.movies({
    include_adult: false,
    query,
  });
  return response.results;
}

const searchActors = async (query: string) => {
  const response = await tmdb.search.people({
    include_adult: false,
    query,
  });
  return response.results;
}

const searchFilmsByActorId = async (actorId: number) => {
  const response = await tmdb.people.movieCredits(actorId);
  return response.cast;
}

export { searchFilms, searchActors, searchFilmsByActorId };