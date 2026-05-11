import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
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
} from "@mui/material";
import {getMovies, getGenres} from "../api/tmdb-api";
import type {GetMoviesResponse} from "../types/interfaces";
import PageHeader from "../components/PageHeader";
import MovieList from "../components/MovieList";
import {useDebounce} from "../hooks/useDebounce";

const SORT_OPTIONS = [
    { value: "popularity.desc", label: "Most Popular" },
    { value: "popularity.asc", label: "Least Popular" },
    { value: "primary_release_date.desc", label: "Newest" },
    { value: "primary_release_date.asc", label: "Oldest" },
];

const HomePage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [sortBy, setSortBy] = useState("popularity.desc");

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const { data: genresData } = useQuery<{ genres: Array<{ id: number; name: string }> }, Error>({
        queryKey: ["genres"],
        queryFn: () => getGenres(),
    });

    const { data, error, isLoading, isError } = useQuery<GetMoviesResponse, Error>({
        queryKey: ["movies", debouncedSearchQuery, selectedGenre, sortBy],
        queryFn: () =>
            getMovies({
                query: debouncedSearchQuery || undefined,
                sortBy: debouncedSearchQuery ? undefined : sortBy,
                withGenres: selectedGenre || undefined,
            }),
    });

    const movies = data?.results ?? [];
    const genres = genresData?.genres ?? [];

    return (
        <Container maxWidth="lg" sx={{py: 4}}>
            <Stack spacing={3}>
                <PageHeader title="Movies" description="Discover movies from TMDB."/>

                <Stack spacing={2} >
                    <TextField
                        fullWidth
                        placeholder="Search movies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        variant="outlined"
                        size="small"
                    />

                    <Stack direction="row" spacing={2} sx={{flexWrap: "wrap"}}>
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                            <InputLabel>Genre</InputLabel>
                            <Select
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                                label="Genre"
                            >
                                <MenuItem value="">All Genres</MenuItem>
                                {genres.map((genre) => (
                                    <MenuItem key={genre.id} value={genre.id}>
                                        {genre.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 160 }} disabled={!!debouncedSearchQuery}>
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
