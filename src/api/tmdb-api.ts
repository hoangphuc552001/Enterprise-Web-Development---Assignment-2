const BASE_URL = "/api/tmdb";

interface GetMoviesParams {
  page?: number;
  query?: string;
  sortBy?: string;
  withGenres?: string;
  primaryReleaseYear?: number;
}

export const getMovies = ({
  page = 1,
  query,
  sortBy = "popularity.desc",
  withGenres,
  primaryReleaseYear,
}: GetMoviesParams = {}) => {
  let url = `${BASE_URL}`;

  if (query) {
    url += `/search/movie?query=${encodeURIComponent(query)}`;
  } else {
    url += `/discover/movie?sort_by=${sortBy}`;
    if (withGenres) {
      url += `&with_genres=${withGenres}`;
    }
    if (primaryReleaseYear) {
      url += `&primary_release_year=${primaryReleaseYear}`;
    }
  }

  url += `&page=${page}`;

  return fetch(url)
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
