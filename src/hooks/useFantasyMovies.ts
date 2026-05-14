import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFantasyMovies, updateFantasyMovies } from "../api/user-api";
import type { FantasyMovie } from "../types/interfaces";

export const useFantasyMovies = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["fantasyMovies"],
    queryFn: getFantasyMovies,
  });

  const movies: FantasyMovie[] = data || [];

  const mutation = useMutation({
    mutationFn: (newMovies: FantasyMovie[]) => updateFantasyMovies(newMovies),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fantasyMovies"] });
    },
  });

  const addMovie = (data: Omit<FantasyMovie, "id">): FantasyMovie => {
    const movie: FantasyMovie = { ...data, id: crypto.randomUUID() };
    const updated = [...movies, movie];
    mutation.mutate(updated);
    return movie;
  };

  const deleteMovie = (id: string) => {
    const updated = movies.filter((m) => m.id !== id);
    mutation.mutate(updated);
  };

  const getMovie = (id: string) => movies.find((m) => m.id === id);

  return { movies, addMovie, deleteMovie, getMovie };
};
