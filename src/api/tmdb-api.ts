const BASE_URL = "/api/tmdb";

export const getMovies = (page: number = 1) => {
  return fetch(`${BASE_URL}/discover/movie?page=${page}`)
    .then((res) => res.json())
    .then((json) => json);
};
