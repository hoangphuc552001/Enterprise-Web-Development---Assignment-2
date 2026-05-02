// Skill 8: api-fetching — All TMDB API fetch functions
// Centralised here so no component ever calls fetch() directly.
// Each function targets one TMDB endpoint and returns parsed JSON.
// The API key comes from import.meta.env so it never appears in source code.

const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

// ─── Movies ────────────────────────────────────────────────────

export const getMovies = (page: number = 1) => {
  return fetch(
    `${BASE_URL}/discover/movie?api_key=${TMDB_KEY}&language=en-US&include_adult=false&include_video=false&page=${page}`
  )
    .then((res) => res.json())
    .then((json) => json);
};

export const getMovie = (id: string) => {
  return fetch(
    `${BASE_URL}/movie/${id}?api_key=${TMDB_KEY}&language=en-US`
  ).then((res) => res.json());
};

export const getUpcomingMovies = (page: number = 1) => {
  return fetch(
    `${BASE_URL}/movie/upcoming?api_key=${TMDB_KEY}&language=en-US&page=${page}`
  ).then((res) => res.json());
};

export const getPopularMovies = (page: number = 1) => {
  return fetch(
    `${BASE_URL}/movie/popular?api_key=${TMDB_KEY}&language=en-US&page=${page}`
  ).then((res) => res.json());
};

export const getTopRatedMovies = (page: number = 1) => {
  return fetch(
    `${BASE_URL}/movie/top_rated?api_key=${TMDB_KEY}&language=en-US&page=${page}`
  ).then((res) => res.json());
};

export const getNowPlayingMovies = (page: number = 1) => {
  return fetch(
    `${BASE_URL}/movie/now_playing?api_key=${TMDB_KEY}&language=en-US&page=${page}`
  ).then((res) => res.json());
};

export const getSimilarMovies = (id: string, page: number = 1) => {
  return fetch(
    `${BASE_URL}/movie/${id}/similar?api_key=${TMDB_KEY}&language=en-US&page=${page}`
  ).then((res) => res.json());
};

export const getMovieImages = (id: string) => {
  return fetch(
    `${BASE_URL}/movie/${id}/images?api_key=${TMDB_KEY}`
  ).then((res) => res.json());
};

export const getMovieReviews = (id: string) => {
  return fetch(
    `${BASE_URL}/movie/${id}/reviews?api_key=${TMDB_KEY}&language=en-US`
  ).then((res) => res.json());
};

export const getMovieCredits = (id: string) => {
  return fetch(
    `${BASE_URL}/movie/${id}/credits?api_key=${TMDB_KEY}&language=en-US`
  ).then((res) => res.json());
};

// ─── Genres ────────────────────────────────────────────────────

export const getGenres = () => {
  return fetch(
    `${BASE_URL}/genre/movie/list?api_key=${TMDB_KEY}&language=en-US`
  )
    .then((res) => res.json())
    .then((json) => json.genres);
};

export const getTVGenres = () => {
  return fetch(
    `${BASE_URL}/genre/tv/list?api_key=${TMDB_KEY}&language=en-US`
  )
    .then((res) => res.json())
    .then((json) => json.genres);
};

// ─── Actors / People ───────────────────────────────────────────

export const getPopularActors = (page: number = 1) => {
  return fetch(
    `${BASE_URL}/person/popular?api_key=${TMDB_KEY}&language=en-US&page=${page}`
  ).then((res) => res.json());
};

export const getActor = (id: string) => {
  return fetch(
    `${BASE_URL}/person/${id}?api_key=${TMDB_KEY}&language=en-US`
  ).then((res) => res.json());
};

export const getActorMovieCredits = (id: string) => {
  return fetch(
    `${BASE_URL}/person/${id}/movie_credits?api_key=${TMDB_KEY}&language=en-US`
  ).then((res) => res.json());
};

export const getActorImages = (id: string) => {
  return fetch(
    `${BASE_URL}/person/${id}/images?api_key=${TMDB_KEY}`
  ).then((res) => res.json());
};

// ─── TV Series ─────────────────────────────────────────────────

export const getPopularTVSeries = (page: number = 1) => {
  return fetch(
    `${BASE_URL}/tv/popular?api_key=${TMDB_KEY}&language=en-US&page=${page}`
  ).then((res) => res.json());
};

export const getTVSeries = (id: string) => {
  return fetch(
    `${BASE_URL}/tv/${id}?api_key=${TMDB_KEY}&language=en-US`
  ).then((res) => res.json());
};

export const getTVSeriesImages = (id: string) => {
  return fetch(
    `${BASE_URL}/tv/${id}/images?api_key=${TMDB_KEY}`
  ).then((res) => res.json());
};

// ─── Search ────────────────────────────────────────────────────

export const searchMovies = (query: string, page: number = 1) => {
  return fetch(
    `${BASE_URL}/search/movie?api_key=${TMDB_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
  ).then((res) => res.json());
};

export const discoverMovies = (params: {
  page?: number;
  with_genres?: string;
  primary_release_year?: number;
  sort_by?: string;
  "vote_average.gte"?: number;
  "vote_average.lte"?: number;
  with_original_language?: string;
}) => {
  const queryParams = new URLSearchParams({
    api_key: TMDB_KEY,
    language: "en-US",
    include_adult: "false",
    include_video: "false",
  });

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      queryParams.set(key, String(value));
    }
  });

  return fetch(`${BASE_URL}/discover/movie?${queryParams.toString()}`).then(
    (res) => res.json()
  );
};
