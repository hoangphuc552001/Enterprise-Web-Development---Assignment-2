// Skill 8: api-fetching — Assignment 1 Backend API client
// Handles authentication (Cognito) and data persistence (DynamoDB)
// Separate from TMDB so auth concerns don't mix with movie browsing

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

// ─── Auth ──────────────────────────────────────────────────────

export const signin = async (username: string, password: string) => {
  const res = await fetch(`${BACKEND_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  return res.json();
};

export const signup = async (
  username: string,
  password: string,
  email: string
) => {
  const res = await fetch(`${BACKEND_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email }),
  });
  return res.json();
};

export const confirmSignup = async (username: string, code: string) => {
  const res = await fetch(`${BACKEND_URL}/auth/confirm-signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, code }),
  });
  return res.json();
};

export const signout = async () => {
  const res = await fetch(`${BACKEND_URL}/auth/signout`, {
    method: "GET",
    credentials: "include",
  });
  return res.json();
};

// ─── Reviews (existing Assignment 1 endpoints) ────────────────

export const addMovieReview = async (
  movieId: number,
  date: string,
  text: string,
  token: string
) => {
  const res = await fetch(`${BACKEND_URL}/movies/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}`,
    },
    credentials: "include",
    body: JSON.stringify({ movieId, date, text }),
  });
  return res.json();
};

export const getMovieReviewsFromBackend = async (movieId: number) => {
  const res = await fetch(`${BACKEND_URL}/movies/${movieId}/reviews`, {
    credentials: "include",
  });
  return res.json();
};

export const updateMovieReview = async (
  movieId: number,
  text: string,
  token: string
) => {
  const res = await fetch(`${BACKEND_URL}/movies/${movieId}/reviews`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}`,
    },
    credentials: "include",
    body: JSON.stringify({ text }),
  });
  return res.json();
};

// ─── Favourites (Outstanding tier — new endpoints) ─────────────

export const getFavourites = async (token: string) => {
  const res = await fetch(`${BACKEND_URL}/favourites`, {
    headers: { Cookie: `token=${token}` },
    credentials: "include",
  });
  return res.json();
};

export const addFavourite = async (
  movieId: number,
  title: string,
  posterPath: string,
  token: string
) => {
  const res = await fetch(`${BACKEND_URL}/favourites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}`,
    },
    credentials: "include",
    body: JSON.stringify({ movieId, title, poster_path: posterPath }),
  });
  return res.json();
};

export const removeFavourite = async (movieId: number, token: string) => {
  const res = await fetch(`${BACKEND_URL}/favourites/${movieId}`, {
    method: "DELETE",
    headers: { Cookie: `token=${token}` },
    credentials: "include",
  });
  return res.json();
};

// ─── Fantasy Movies (Outstanding tier — new endpoints) ─────────

export const getFantasyMovies = async (token: string) => {
  const res = await fetch(`${BACKEND_URL}/fantasy-movies`, {
    headers: { Cookie: `token=${token}` },
    credentials: "include",
  });
  return res.json();
};

export const createFantasyMovie = async (
  data: Record<string, unknown>,
  token: string
) => {
  const res = await fetch(`${BACKEND_URL}/fantasy-movies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteFantasyMovie = async (id: string, token: string) => {
  const res = await fetch(`${BACKEND_URL}/fantasy-movies/${id}`, {
    method: "DELETE",
    headers: { Cookie: `token=${token}` },
    credentials: "include",
  });
  return res.json();
};

// ─── Playlists (Outstanding tier — new endpoints) ──────────────

export const getPlaylists = async (token: string) => {
  const res = await fetch(`${BACKEND_URL}/playlists`, {
    headers: { Cookie: `token=${token}` },
    credentials: "include",
  });
  return res.json();
};

export const createPlaylist = async (
  data: Record<string, unknown>,
  token: string
) => {
  const res = await fetch(`${BACKEND_URL}/playlists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updatePlaylist = async (
  id: string,
  data: Record<string, unknown>,
  token: string
) => {
  const res = await fetch(`${BACKEND_URL}/playlists/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deletePlaylist = async (id: string, token: string) => {
  const res = await fetch(`${BACKEND_URL}/playlists/${id}`, {
    method: "DELETE",
    headers: { Cookie: `token=${token}` },
    credentials: "include",
  });
  return res.json();
};
