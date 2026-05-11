import {
    Box,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Stack,
    Typography,
    Alert,
} from "@mui/material";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getMovie} from "../api/tmdb-api";
import type {MovieDetailsProps} from "../types/interfaces";
import PageHeader from "../components/PageHeader";
import PollIcon from '@mui/icons-material/Poll';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import DateRangeIcon from '@mui/icons-material/DateRange';
import StarIcon from '@mui/icons-material/Star';

const BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";
const POSTER_BASE = "https://image.tmdb.org/t/p/w500";

const MovieDetailPage = () => {
    const {id} = useParams<{ id: string }>();
    const [movie, setMovie] = useState<MovieDetailsProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const data = (await getMovie(id!)) as MovieDetailsProps;
                setMovie(data);
            } catch {
                setError("Failed to load movie details.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    if (loading) {
        return (
            <Box sx={{display: "flex", justifyContent: "center", py: 12}}>
                <CircularProgress/>
            </Box>
        );
    }

    if (error || !movie) {
        return (
            <Container maxWidth="lg" sx={{py: 4}}>
                <Alert severity="error">{error || "Movie not found."}</Alert>
            </Container>
        );
    }

    return (
        <Box sx={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            {movie.backdrop_path && (
                <Box sx={{position: "fixed", top: 0, left: 0, right: 0, bottom: 0}}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: -20,
                            left: -20,
                            right: -20,
                            bottom: -20,
                            backgroundImage: `url(${BACKDROP_BASE}${movie.backdrop_path})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            filter: "blur(5px)",
                        }}
                    />
                    <Box sx={{position: "absolute", inset: 0, bgcolor: "rgba(0, 0, 0, 0.75)"}}/>
                </Box>
            )}

            <Container sx={{py: 4, position: "relative"}}>
                <Stack direction={{xs: "column", md: "row"}} spacing={4}>
                    {movie.poster_path && (
                        <Box
                            component="img"
                            src={`${POSTER_BASE}${movie.poster_path}`}
                            alt={movie.title}
                            sx={{
                                maxWidth: 300,
                                borderRadius: 2,
                            }}
                        />
                    )}

                    <Stack spacing={2}>
                        <PageHeader
                            title={movie.title ?? ""}
                            description={movie.tagline ?? ""}
                        />

                        {movie.genres && movie.genres.length > 0 && (
                            <Stack direction="row" spacing={1}>
                                {movie.genres.map((g) => (
                                    <Chip key={g.id} label={g.name} size="small" color="primary" variant="outlined"/>
                                ))}
                            </Stack>
                        )}

                        <Divider/>

                        <Stack direction="row" spacing={3} sx={{flexWrap: "wrap"}}>
                            <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                                <PollIcon fontSize="small" sx={{ mr: 0.5 }}/>
                                {movie.vote_average.toFixed(1)} / 10 ({movie.vote_count} votes)
                            </Typography>
                            {movie.runtime > 0 && (
                                <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                                    <TimelapseIcon fontSize="small" sx={{ mr: 0.5 }}/>
                                    {movie.runtime} min
                                </Typography>
                            )}
                            {movie.release_date && (
                                <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                                    <DateRangeIcon fontSize="small" sx={{ mr: 0.5 }}/>
                                    {movie.release_date}
                                </Typography>
                            )}
                            {movie.status && (
                                <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                                    <StarIcon fontSize="small" sx={{ mr: 0.5 }}/>
                                    Status: {movie.status}
                                </Typography>
                            )}
                        </Stack>

                        <Divider/>

                        <Typography variant="body1">{movie.overview}</Typography>

                        {movie.production_companies && movie.production_companies.length > 0 && (
                            <>
                                <Divider/>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Production
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{flexWrap: "wrap"}}>
                                    {movie.production_companies.map((c) => (
                                        <Chip key={c.id} label={c.name} size="small" variant="outlined"/>
                                    ))}
                                </Stack>
                            </>
                        )}

                        {(movie.budget > 0 || movie.revenue > 0) && (
                            <>
                                <Divider/>
                                <Stack direction="row" spacing={3}>
                                    {movie.budget > 0 && (
                                        <Typography variant="body2" color="text.secondary">
                                            Budget: ${movie.budget.toLocaleString()}
                                        </Typography>
                                    )}
                                    {movie.revenue > 0 && (
                                        <Typography variant="body2" color="text.secondary">
                                            Revenue: ${movie.revenue.toLocaleString()}
                                        </Typography>
                                    )}
                                </Stack>
                            </>
                        )}
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};

export default MovieDetailPage;
