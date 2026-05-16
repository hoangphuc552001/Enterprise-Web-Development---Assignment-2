// const BASE_URL = "/api/tmdb";

// S3 deployment
const BASE_URL =
  "https://enterprise-web-development-assignme.vercel.app/api/tmdb";

interface GetMoviesParams {
  page?: number;
  query?: string;
  sortBy?: string;
  withGenres?: string;
  voteAverageGte?: number;
  voteAverageLte?: number;
  releaseDateGte?: string;
  releaseDateLte?: string;
}

export const getMovies = ({
  page = 1,
  query,
  sortBy = "popularity.desc",
  withGenres,
  voteAverageGte,
  voteAverageLte,
  releaseDateGte,
  releaseDateLte,
}: GetMoviesParams = {}) => {
  let url = `${BASE_URL}`;

  if (query) {
    url += `/search/movie?query=${encodeURIComponent(query)}`;
  } else {
    url += `/discover/movie?sort_by=${sortBy}`;
    if (withGenres) {
      url += `&with_genres=${withGenres}`;
    }
    if (voteAverageGte !== undefined) {
      url += `&vote_average.gte=${voteAverageGte}`;
    }
    if (voteAverageLte !== undefined) {
      url += `&vote_average.lte=${voteAverageLte}`;
    }
    if (releaseDateGte) {
      url += `&primary_release_date.gte=${releaseDateGte}`;
    }
    if (releaseDateLte) {
      url += `&primary_release_date.lte=${releaseDateLte}`;
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

export const getGenres = () => {
  return fetch(`${BASE_URL}/genre/movie/list`)
    .then((res) => res.json())
    .then((json) => json);
};
