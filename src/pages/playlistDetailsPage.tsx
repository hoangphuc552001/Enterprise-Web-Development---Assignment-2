import { useParams, useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import {
  Container,
  Stack,
  Box,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getMovie } from "../api/tmdb-api";
import { usePlaylists } from "../hooks/usePlaylists";
import PageHeader from "../components/PageHeader";
import MovieList from "../components/MovieList";
import type { BaseMovieProps } from "../types/interfaces";

const PlaylistDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPlaylist } = usePlaylists();

  const playlist = getPlaylist(id || "");

  const playlistQueries = useQueries({
    queries: (playlist?.movieIds || []).map((movieId) => {
      return {
        queryKey: ["movie", movieId],
        queryFn: () => getMovie(movieId.toString()),
      };
    }),
  });

  if (!playlist) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Playlist not found.</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/playlists")}
          sx={{ mt: 2 }}
        >
          Back to Playlists
        </Button>
      </Container>
    );
  }

  const isLoading = playlistQueries.some((q) => q.isLoading);
  const isError = playlistQueries.some((q) => q.isError);

  const movies = playlistQueries
    .map((q) => q.data)
    .filter((movie) => movie !== undefined) as BaseMovieProps[];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/playlists")}
            sx={{ mb: 2 }}
          >
            Back to Playlists
          </Button>
          <PageHeader
            title={playlist.name}
            description={playlist.description || "Custom Playlist"}
          />
        </Box>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : null}

        {isError ? (
          <Alert severity="error">Failed to load some movies.</Alert>
        ) : null}

        {!isLoading && movies.length === 0 && !isError ? (
          <Alert severity="info">This playlist has no movies yet.</Alert>
        ) : null}

        {!isLoading && movies.length > 0 ? <MovieList movies={movies} /> : null}
      </Stack>
    </Container>
  );
};

export default PlaylistDetailsPage;
