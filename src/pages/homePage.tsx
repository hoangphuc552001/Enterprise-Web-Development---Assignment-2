import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { getMovies } from "../api/tmdb-api";
import type { BaseMovieProps, GetMoviesResponse } from "../types/interfaces";

const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

const HomePage = () => {
  const [movies, setMovies] = useState<BaseMovieProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadMovies = async () => {
      try {
        setLoading(true);
        setError("");

        const response = (await getMovies()) as GetMoviesResponse;

        if (!ignore) {
          setMovies(response.results ?? []);
        }
      } catch {
        if (!ignore) {
          setError("Failed to load movies. Check your TMDB API key and try again.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Movies
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover movies from TMDB.
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : null}

        {!loading && error ? <Alert severity="error">{error}</Alert> : null}

        {!loading && !error ? (
          <Stack spacing={2}>
            {movies.map((movie) => (
              <Card
                key={movie.id}
                sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}
              >
                {movie.poster_path ? (
                  <CardMedia
                    component="img"
                    image={`${POSTER_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    sx={{ width: { sm: 180 }, objectFit: "cover" }}
                  />
                ) : null}

                <CardContent sx={{ flex: 1 }}>
                  <Stack spacing={1}>
                    <Typography variant="h5" component="h2">
                      {movie.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Release date: {movie.release_date || "Unknown"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rating: {movie.vote_average.toFixed(1)} / 10
                    </Typography>
                    <Typography variant="body1">
                      {movie.overview || "No overview available."}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : null}
      </Stack>
    </Container>
  );
};

export default HomePage;
