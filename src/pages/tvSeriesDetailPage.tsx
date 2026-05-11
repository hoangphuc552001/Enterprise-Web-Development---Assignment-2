import {useQuery} from "@tanstack/react-query";
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
import {getTvSeries} from "../api/tmdb-api";
import type {TvSeriesDetailsProps} from "../types/interfaces";
import PageHeader from "../components/PageHeader";
import PollIcon from '@mui/icons-material/Poll';
import DateRangeIcon from '@mui/icons-material/DateRange';
import StarIcon from '@mui/icons-material/Star';
import LayersIcon from '@mui/icons-material/Layers';

const BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";
const POSTER_BASE = "https://image.tmdb.org/t/p/w500";

const TvSeriesDetailPage = () => {
    const {id} = useParams<{ id: string }>();

    const {data: tvSeries, error, isLoading, isError} = useQuery<TvSeriesDetailsProps, Error>({
        queryKey: ["tvSeries", id],
        queryFn: () => getTvSeries(id!)
    });

    if (isLoading) {
        return (
            <Box sx={{display: "flex", justifyContent: "center", py: 12}}>
                <CircularProgress/>
            </Box>
        );
    }

    if (isError || !tvSeries) {
        return (
            <Container maxWidth="lg" sx={{py: 4}}>
                <Alert severity="error">{error?.message || "TV series not found."}</Alert>
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
            {tvSeries.backdrop_path && (
                <Box sx={{position: "fixed", top: 0, left: 0, right: 0, bottom: 0}}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: -20,
                            left: -20,
                            right: -20,
                            bottom: -20,
                            backgroundImage: `url(${BACKDROP_BASE}${tvSeries.backdrop_path})`,
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
                    {tvSeries.poster_path && (
                        <Box
                            component="img"
                            src={`${POSTER_BASE}${tvSeries.poster_path}`}
                            alt={tvSeries.name}
                            sx={{
                                maxWidth: 300,
                                borderRadius: 2,
                            }}
                        />
                    )}

                    <Stack spacing={2} sx={{flex: 1}}>
                        <PageHeader
                            title={tvSeries.name ?? ""}
                            description={tvSeries.tagline ?? ""}
                        />

                        {tvSeries.genres && tvSeries.genres.length > 0 && (
                            <Stack direction="row" spacing={1}>
                                {tvSeries.genres.map((g) => (
                                    <Chip key={g.id} label={g.name} size="small" color="primary" variant="outlined"/>
                                ))}
                            </Stack>
                        )}

                        <Divider/>

                        <Stack direction="row" spacing={3} sx={{flexWrap: "wrap"}}>
                            <Typography variant="body2" color="text.secondary"
                                        sx={{display: "flex", alignItems: "center"}}>
                                <PollIcon fontSize="small" sx={{mr: 0.5}}/>
                                {tvSeries.vote_average?.toFixed(1)} / 10 ({tvSeries.vote_count} votes)
                            </Typography>
                            {tvSeries.first_air_date && (
                                <Typography variant="body2" color="text.secondary"
                                            sx={{display: "flex", alignItems: "center"}}>
                                    <DateRangeIcon fontSize="small" sx={{mr: 0.5}}/>
                                    First Aired: {tvSeries.first_air_date}
                                </Typography>
                            )}
                            {tvSeries.status && (
                                <Typography variant="body2" color="text.secondary"
                                            sx={{display: "flex", alignItems: "center"}}>
                                    <StarIcon fontSize="small" sx={{mr: 0.5}}/>
                                    Status: {tvSeries.status}
                                </Typography>
                            )}
                            {tvSeries.number_of_seasons && (
                                <Typography variant="body2" color="text.secondary"
                                            sx={{display: "flex", alignItems: "center"}}>
                                    <LayersIcon fontSize="small" sx={{mr: 0.5}}/>
                                    Seasons: {tvSeries.number_of_seasons}
                                </Typography>
                            )}
                        </Stack>

                        <Divider/>

                        <Typography variant="body1">{tvSeries.overview || "No overview available."}</Typography>

                        {tvSeries.production_companies && tvSeries.production_companies.length > 0 && (
                            <>
                                <Divider/>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Production
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{flexWrap: "wrap"}}>
                                    {tvSeries.production_companies.map((c) => (
                                        <Chip key={c.id} label={c.name} size="small" variant="outlined"/>
                                    ))}
                                </Stack>
                            </>
                        )}
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};

export default TvSeriesDetailPage;
