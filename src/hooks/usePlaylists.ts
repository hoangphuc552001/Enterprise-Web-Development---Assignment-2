import { useState, useEffect } from "react";

export interface Playlist {
  id: string;
  name: string;
  description: string;
  movieIds: number[];
}

export const usePlaylists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem("playlists");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("playlists", JSON.stringify(playlists));
  }, [playlists]);

  const createPlaylist = (name: string, description: string) => {
    const newPlaylist: Playlist = {
      id: crypto.randomUUID(),
      name,
      description,
      movieIds: [],
    };
    setPlaylists((prev) => [...prev, newPlaylist]);
  };

  const addMovieToPlaylist = (playlistId: string, movieId: number) => {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id === playlistId) {
          if (!playlist.movieIds.includes(movieId)) {
            return { ...playlist, movieIds: [...playlist.movieIds, movieId] };
          }
        }
        return playlist;
      }),
    );
  };

  const removeMovieFromPlaylist = (playlistId: string, movieId: number) => {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id === playlistId) {
          return {
            ...playlist,
            movieIds: playlist.movieIds.filter((id) => id !== movieId),
          };
        }
        return playlist;
      }),
    );
  };

  const deletePlaylist = (playlistId: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
  };

  const getPlaylist = (id: string) => playlists.find((p) => p.id === id);

  return {
    playlists,
    createPlaylist,
    addMovieToPlaylist,
    removeMovieFromPlaylist,
    deletePlaylist,
    getPlaylist,
  };
};
