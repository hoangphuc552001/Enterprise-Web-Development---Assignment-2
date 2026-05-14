import { useState, useEffect } from "react";

export const useFavouriteActors = () => {
  const [favouriteActors, setFavouriteActors] = useState<number[]>(() => {
    const saved = localStorage.getItem("favouriteActors");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("favouriteActors", JSON.stringify(favouriteActors));
  }, [favouriteActors]);

  const toggleFavourite = (id: number) => {
    setFavouriteActors((prev) =>
      prev.includes(id) ? prev.filter((aId) => aId !== id) : [...prev, id],
    );
  };

  const isFavourite = (id: number) => favouriteActors.includes(id);

  const reorderFavourites = (newOrder: number[]) => {
    setFavouriteActors(newOrder);
  };

  return { favouriteActors, toggleFavourite, isFavourite, reorderFavourites };
};
