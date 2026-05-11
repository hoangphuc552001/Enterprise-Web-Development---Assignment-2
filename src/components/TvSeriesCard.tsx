import { Card, CardActionArea, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import type { BaseTvSeriesProps } from "../types/interfaces";

const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface TvSeriesCardProps {
    series: BaseTvSeriesProps;
}

const TvSeriesCard = ({ series }: TvSeriesCardProps) => {
    return (
        <Card>
            <CardActionArea 
                component={Link} 
                to={`/tv/${series.id}`} 
                sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", justifyContent: "flex-start", height: '100%' }}
            >
            {series.poster_path ? (
                <CardMedia
                    component="img"
                    image={`${POSTER_BASE_URL}${series.poster_path}`}
                    alt={series.name ?? "TV Series"}
                    sx={{ width: { sm: 180 }, objectFit: "cover" }}
                />
            ) : null}

            <CardContent sx={{ flex: 1 }}>
                <Stack spacing={1}>
                    <Typography variant="h5" component="h2">
                        {series.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        First aired: {series.first_air_date ?? ""}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Rating: {series.vote_average.toFixed(1)} / 10
                    </Typography>
                    <Typography variant="body1">
                        {series.overview}
                    </Typography>
                </Stack>
            </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default TvSeriesCard;
