const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

export const getMovies = (page: number = 1) => {
  return fetch(
    `${BASE_URL}/discover/movie?api_key=${TMDB_KEY}&page=${page}`
  )
    .then((res) => res.json())
    .then((json) => json);
};
