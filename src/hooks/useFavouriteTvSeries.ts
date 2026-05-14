import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavourites, updateFavourites } from "../api/user-api";

export const useFavouriteTvSeries = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["favourites", "tv"],
    queryFn: getFavourites,
  });

  const favouriteTvSeries: number[] = data?.tv || [];

  const mutation = useMutation({
    mutationFn: (newFavourites: number[]) =>
      updateFavourites("tv", newFavourites),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favourites", "tv"] });
    },
  });

  const toggleFavourite = (id: number) => {
    const newFavourites = favouriteTvSeries.includes(id)
      ? favouriteTvSeries.filter((sId) => sId !== id)
      : [...favouriteTvSeries, id];
    mutation.mutate(newFavourites);
  };

  const reorderFavourites = (newFavourites: number[]) => {
    mutation.mutate(newFavourites);
  };

  const isFavourite = (id: number) => favouriteTvSeries.includes(id);

  return { favouriteTvSeries, toggleFavourite, isFavourite, reorderFavourites };
};
