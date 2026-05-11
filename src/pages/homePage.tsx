import {useEffect, useState} from "react";
import {
    Alert,
    Box,
    CircularProgress,
    Container,
    Stack,
} from "@mui/material";
import {getMovies} from "../api/tmdb-api";
import type {BaseMovieProps, GetMoviesResponse} from "../types/interfaces";
import PageHeader from "../components/PageHeader";
import MovieList from "../components/MovieList";

const HomePage = () => {
    const [movies, setMovies] = useState<BaseMovieProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadMovies = async () => {
            try {
                setLoading(true);
                setError("");

                const response = (await getMovies()) as GetMoviesResponse;
                setMovies(response.results ?? []);
            } catch {
                setError("Failed to load movies");
            }finally {
                setLoading(false);
            }
        };

        loadMovies();
    }, []);

    return (
        <Container maxWidth="lg" sx={{py: 4}}>
            <Stack spacing={3}>
                <PageHeader title="Movies" description="Discover movies from TMDB." />

                {loading ? (
                    <Box sx={{display: "flex", justifyContent: "center", py: 8}}>
                        <CircularProgress/>
                    </Box>
                ) : null}

                {!loading && error ? <Alert severity="error">{error}</Alert> : null}

                {!loading && !error ? <MovieList movies={movies} /> : null}
            </Stack>
        </Container>
    );
};

export default HomePage;
