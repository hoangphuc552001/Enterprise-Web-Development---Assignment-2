import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Alert,
    Box,
    CircularProgress,
    Container,
    Stack,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
} from "@mui/material";
import {getMovies} from "../api/tmdb-api";
import type {GetMoviesResponse} from "../types/interfaces";
import PageHeader from "../components/PageHeader";
import MovieList from "../components/MovieList";
import { useDebounce } from "../hooks/useDebounce";

const GENRES = [
    { id: "28", name: "Action" },
    { id: "12", name: "Adventure" },
    { id: "16", name: "Animation" },
    { id: "35", name: "Comedy" },
    { id: "80", name: "Crime" },
    { id: "99", name: "Documentary" },
    { id: "18", name: "Drama" },
    { id: "10751", name: "Family" },
    { id: "14", name: "Fantasy" },
    { id: "36", name: "History" },
    { id: "27", name: "Horror" },
    { id: "10402", name: "Music" },
    { id: "9648", name: "Mystery" },
    { id: "10749", name: "Romance" },
    { id: "878", name: "Science Fiction" },
    { id: "10770", name: "TV Movie" },
    { id: "53", name: "Thriller" },
    { id: "10752", name: "War" },
    { id: "37", name: "Western" },
];

const SORT_OPTIONS = [
    { value: "popularity.desc", label: "Most Popular" },
    { value: "popularity.asc", label: "Least Popular" },
    { value: "vote_average.desc", label: "Highest Rated" },
    { value: "vote_average.asc", label: "Lowest Rated" },
    { value: "release_date.desc", label: "Newest" },
    { value: "release_date.asc", label: "Oldest" },
];

const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

const HomePage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [sortBy, setSortBy] = useState("popularity.desc");

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const { data, error, isLoading, isError } = useQuery<GetMoviesResponse, Error>({
        queryKey: ["movies", debouncedSearchQuery, selectedGenre, selectedYear, sortBy],
        queryFn: () =>
            getMovies({
                query: debouncedSearchQuery || undefined,
                sortBy: debouncedSearchQuery ? undefined : sortBy,
                withGenres: selectedGenre || undefined,
                primaryReleaseYear: selectedYear ? parseInt(selectedYear) : undefined,
            }),
    });

    const movies = data?.results ?? [];

    return (
        <Container maxWidth="lg" sx={{py: 4}}>
            <Stack spacing={3}>
                <PageHeader title="Movies" description="Discover movies from TMDB."/>

                {/* Search and Filter Controls */}
                <Stack spacing={2} sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 1 }}>
                    <TextField
                        fullWidth
                        placeholder="Search movies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        variant="outlined"
                        size="small"
                    />

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Genre</InputLabel>
                                <Select
                                    value={selectedGenre}
                                    onChange={(e) => setSelectedGenre(e.target.value)}
                                    label="Genre"
                                >
                                    <MenuItem value="">All Genres</MenuItem>
                                    {GENRES.map((genre) => (
                                        <MenuItem key={genre.id} value={genre.id}>
                                            {genre.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Year</InputLabel>
                                <Select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    label="Year"
                                >
                                    <MenuItem value="">All Years</MenuItem>
                                    {YEARS.map((year) => (
                                        <MenuItem key={year} value={year}>
                                            {year}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small" disabled={!!debouncedSearchQuery}>
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
                        </Grid>
                    </Grid>
                </Stack>

                {isLoading ? (
                    <Box sx={{display: "flex", justifyContent: "center", py: 8}}>
                        <CircularProgress/>
                    </Box>
                ) : null}

                {isError ? <Alert severity="error">{error.message || "Failed to load movies"}</Alert> : null}

                {!isLoading && !isError ? <MovieList movies={movies}/> : null}
            </Stack>
        </Container>
    );
};

export default HomePage;
