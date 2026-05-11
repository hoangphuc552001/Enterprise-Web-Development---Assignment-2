const BASE_URL = "/api/tmdb";

export const getMovies = (page: number = 1) => {
  return fetch(`${BASE_URL}/discover/movie?page=${page}`)
    .then((res) => res.json())
    .then((json) => json);
};

export const getMovie = (id: string) => {
  return fetch(`${BASE_URL}/movie/${id}`)
    .then((res) => res.json())
    .then((json) => json);
};

export const getPopularActors = (page: number = 1) => {
  return fetch(`${BASE_URL}/person/popular?page=${page}`)
    .then((res) => res.json())
    .then((json) => json);
};

export const getDiscoverTv = (page: number = 1) => {
  return fetch(`${BASE_URL}/discover/tv?page=${page}`)
    .then((res) => res.json())
    .then((json) => json);
};

export const getActor = (id: string) => {
  return fetch(`${BASE_URL}/person/${id}`)
    .then((res) => res.json())
    .then((json) => json);
};

export const getTvSeries = (id: string) => {
  return fetch(`${BASE_URL}/tv/${id}`)
    .then((res) => res.json())
    .then((json) => json);
};
