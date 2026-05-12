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
  Select,
  Stack,
  TextField,
  Pagination,
  Checkbox,
  ListItemText,
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

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<number[]>(
    initialGenre ? [Number(initialGenre)] : [],
  );
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [voteAverage, setVoteAverage] = useState<number[]>([0, 10]);
  const [releaseDates, setReleaseDates] = useState<string[]>([
    "1990-01-01",
    `${new Date().getFullYear()}-12-31`,
  ]);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const debouncedVoteAverage = useDebounce(voteAverage, 500);
  const debouncedReleaseDates = useDebounce(releaseDates, 500);

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
    queryKey: [
      "movies",
      page,
      debouncedSearchQuery,
      selectedGenres,
      sortBy,
      debouncedVoteAverage,
      debouncedReleaseDates,
    ],
    queryFn: () =>
      getMovies({
        page,
        query: debouncedSearchQuery || undefined,
        sortBy: debouncedSearchQuery ? undefined : sortBy,
        withGenres:
          selectedGenres.length > 0 ? selectedGenres.join(",") : undefined,
        voteAverageGte: debouncedVoteAverage[0],
        voteAverageLte: debouncedVoteAverage[1],
        releaseDateGte: debouncedReleaseDates[0],
        releaseDateLte: debouncedReleaseDates[1],
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

          <Stack
            direction="row"
            spacing={2}
            sx={{ flexWrap: "wrap" }}
            useFlexGap
          >
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Genres</InputLabel>
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
                {genres.map((genre) => (
                  <MenuItem key={genre.id} value={genre.id}>
                    <Checkbox checked={selectedGenres.indexOf(genre.id) > -1} />
                    <ListItemText primary={genre.name} />
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
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                label="Sort By"
              >
                {SORT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                label="Release Date From"
                type="date"
                size="small"
                sx={{ width: 160 }}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                value={releaseDates[0]}
                onChange={(e) => {
                  setReleaseDates([e.target.value, releaseDates[1]]);
                  setPage(1);
                }}
              />
              <TextField
                label="Release Date To"
                type="date"
                size="small"
                sx={{ width: 160 }}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                value={releaseDates[1]}
                onChange={(e) => {
                  setReleaseDates([releaseDates[0], e.target.value]);
                  setPage(1);
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                label="Min Vote Average"
                type="number"
                size="small"
                sx={{ width: 150 }}
                slotProps={{
                  htmlInput: { min: 0, max: 10, step: 0.1 },
                }}
                value={voteAverage[0]}
                onChange={(e) => {
                  setVoteAverage([Number(e.target.value), voteAverage[1]]);
                  setPage(1);
                }}
              />
              <TextField
                label="Max Vote Average"
                type="number"
                size="small"
                sx={{ width: 150 }}
                slotProps={{
                  htmlInput: { min: 0, max: 10, step: 0.1 },
                }}
                value={voteAverage[1]}
                onChange={(e) => {
                  setVoteAverage([voteAverage[0], Number(e.target.value)]);
                  setPage(1);
                }}
              />
            </Box>
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
