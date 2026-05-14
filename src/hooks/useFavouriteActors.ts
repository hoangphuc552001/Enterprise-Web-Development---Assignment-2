import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavourites, updateFavourites } from "../api/user-api";

export const useFavouriteActors = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["favourites", "actors"],
    queryFn: getFavourites,
  });

  const favouriteActors: number[] = data?.actors || [];

  const mutation = useMutation({
    mutationFn: (newFavourites: number[]) =>
      updateFavourites("actors", newFavourites),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favourites", "actors"] });
    },
  });

  const toggleFavourite = (id: number) => {
    const newFavourites = favouriteActors.includes(id)
      ? favouriteActors.filter((aId) => aId !== id)
      : [...favouriteActors, id];
    mutation.mutate(newFavourites);
  };

  const reorderFavourites = (newFavourites: number[]) => {
    mutation.mutate(newFavourites);
  };

  const isFavourite = (id: number) => favouriteActors.includes(id);

  return { favouriteActors, toggleFavourite, isFavourite, reorderFavourites };
};
