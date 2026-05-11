import { useState } from "react";
import type { FantasyMovie } from "../types/interfaces";

const STORAGE_KEY = "fantasy_movies";

const load = (): FantasyMovie[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FantasyMovie[]) : [];
  } catch {
    return [];
  }
};

const persist = (movies: FantasyMovie[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
};

export const useFantasyMovies = () => {
  const [movies, setMovies] = useState<FantasyMovie[]>(load);

  const addMovie = (data: Omit<FantasyMovie, "id">): FantasyMovie => {
    const movie: FantasyMovie = { ...data, id: crypto.randomUUID() };
    const updated = [...movies, movie];
    persist(updated);
    setMovies(updated);
    return movie;
  };

  const deleteMovie = (id: string) => {
    const updated = movies.filter((m) => m.id !== id);
    persist(updated);
    setMovies(updated);
  };

  const getMovie = (id: string) => movies.find((m) => m.id === id);

  return { movies, addMovie, deleteMovie, getMovie };
};
