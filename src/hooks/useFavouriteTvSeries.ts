import { useState, useEffect } from "react";

export const useFavouriteTvSeries = () => {
  const [favouriteTvSeries, setFavouriteTvSeries] = useState<number[]>(() => {
    const saved = localStorage.getItem("favouriteTvSeries");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "favouriteTvSeries",
      JSON.stringify(favouriteTvSeries),
    );
  }, [favouriteTvSeries]);

  const toggleFavourite = (id: number) => {
    setFavouriteTvSeries((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id],
    );
  };

  const isFavourite = (id: number) => favouriteTvSeries.includes(id);

  return { favouriteTvSeries, toggleFavourite, isFavourite };
};
