import { Stack } from "@mui/material";
import MovieCard from "./MovieCard";
import type { BaseMovieProps } from "../types/interfaces";

interface MovieListProps {
    movies: BaseMovieProps[];
}

const MovieList = ({ movies }: MovieListProps) => {
    return (
        <Stack spacing={2}>
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </Stack>
    );
};

export default MovieList;
