import { useQuery } from "@tanstack/react-query";
import {
    Alert,
    Box,
    CircularProgress,
    Container,
    Stack,
} from "@mui/material";
import {getMovies} from "../api/tmdb-api";
import type {GetMoviesResponse} from "../types/interfaces";
import PageHeader from "../components/PageHeader";
import MovieList from "../components/MovieList";

const HomePage = () => {
    const { data, error, isLoading, isError } = useQuery<GetMoviesResponse, Error>({
        queryKey: ["discover", "movies"],
        queryFn: () => getMovies()
    });

    const movies = data?.results ?? [];

    return (
        <Container maxWidth="lg" sx={{py: 4}}>
            <Stack spacing={3}>
                <PageHeader title="Movies" description="Discover movies from TMDB."/>

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
