import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPlaylists, updatePlaylists } from "../api/user-api";

export interface Playlist {
  id: string;
  name: string;
  description: string;
  movieIds: number[];
}

export const usePlaylists = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["playlists"],
    queryFn: getPlaylists,
  });

  const playlists: Playlist[] = data || [];

  const mutation = useMutation({
    mutationFn: (newPlaylists: Playlist[]) => updatePlaylists(newPlaylists),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });

  const createPlaylist = (name: string, description: string) => {
    const newPlaylist: Playlist = {
      id: crypto.randomUUID(),
      name,
      description,
      movieIds: [],
    };
    mutation.mutate([...playlists, newPlaylist]);
  };

  const deletePlaylist = (id: string) => {
    mutation.mutate(playlists.filter((p) => p.id !== id));
  };

  const addToPlaylist = (playlistId: string, movieId: number) => {
    const updated = playlists.map((p) => {
      if (p.id === playlistId && !p.movieIds.includes(movieId)) {
        return { ...p, movieIds: [...p.movieIds, movieId] };
      }
      return p;
    });
    mutation.mutate(updated);
  };

  const removeFromPlaylist = (playlistId: string, movieId: number) => {
    const updated = playlists.map((p) => {
      if (p.id === playlistId) {
        return { ...p, movieIds: p.movieIds.filter((id) => id !== movieId) };
      }
      return p;
    });
    mutation.mutate(updated);
  };

  return {
    playlists,
    createPlaylist,
    deletePlaylist,
    addToPlaylist,
    removeFromPlaylist,
    isLoading,
  };
};
