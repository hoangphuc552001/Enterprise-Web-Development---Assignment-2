import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { getMovies, getGenres } from "../api/tmdb-api";
import type { GetMoviesResponse } from "../types/interfaces";
import PageHeader from "../components/PageHeader";
import MovieList from "../components/MovieList";
import { useDebounce } from "../hooks/useDebounce";
import { useSearchParams } from "react-router-dom";

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "popularity.asc", label: "Least Popular" },
  { value: "primary_release_date.desc", label: "Newest" },
  { value: "primary_release_date.asc", label: "Oldest" },
];

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const initialGenre = searchParams.get("genre");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<number[]>(
    initialGenre ? [Number(initialGenre)] : [],
  );
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [page, setPage] = useState(1);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data: genresData } = useQuery<
    { genres: Array<{ id: number; name: string }> },
    Error
  >({
    queryKey: ["genres"],
    queryFn: () => getGenres(),
  });

  const { data, error, isLoading, isError } = useQuery<
    GetMoviesResponse,
    Error
  >({
    queryKey: ["movies", page, debouncedSearchQuery, selectedGenres, sortBy],
    queryFn: () =>
      getMovies({
        page,
        query: debouncedSearchQuery || undefined,
        sortBy: debouncedSearchQuery ? undefined : sortBy,
        withGenres:
          selectedGenres.length > 0 ? selectedGenres.join(",") : undefined,
      }),
  });

  const movies = data?.results ?? [];
  const genres = genresData?.genres ?? [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <PageHeader title="Movies" description="Discover movies from TMDB." />

        <Stack spacing={2}>
          <TextField
            fullWidth
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
          />

          <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Genre</InputLabel>
              <Select
                multiple
                value={selectedGenres}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedGenres(
                    typeof val === "string"
                      ? val.split(",").map(Number)
                      : (val as number[]),
                  );
                  setPage(1);
                }}
                label="Genres"
                renderValue={(selected) =>
                  selected
                    .map((id) => genres.find((g) => g.id === id)?.name)
                    .join(", ")
                }
              >
                <MenuItem value="">All Genres</MenuItem>
                {genres.map((genre) => (
                  <MenuItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{ minWidth: 160 }}
              disabled={!!debouncedSearchQuery}
            >
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
              >
                {SORT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : null}

        {isError ? (
          <Alert severity="error">
            {error.message || "Failed to load movies"}
          </Alert>
        ) : null}

        {!isLoading && !isError ? (
          <>
            <MovieList movies={movies} />
            {data?.total_pages && data.total_pages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={Math.min(data.total_pages, 500)}
                  page={page}
                  onChange={(_, p) => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  color="primary"
                />
              </Box>
            )}
          </>
        ) : null}
      </Stack>
    </Container>
  );
};

export default HomePage;
