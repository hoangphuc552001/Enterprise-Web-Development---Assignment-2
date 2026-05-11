import { Card, CardActionArea, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import type { BaseMovieProps } from "../types/interfaces";

const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface MovieCardProps {
    movie: BaseMovieProps;
}

const MovieCard = ({ movie }: MovieCardProps) => {
    return (
        <Card sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
            <CardActionArea
                component={Link}
                to={`/movies/${movie.id}`}
                sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "stretch" }}
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
                            Release date: {movie.release_date}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Rating: {movie.vote_average.toFixed(1)} / 10
                        </Typography>
                        <Typography variant="body1">
                            {movie.overview}
                        </Typography>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default MovieCard;
