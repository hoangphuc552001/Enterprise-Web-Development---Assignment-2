import { useQuery } from "@tanstack/react-query";
import { Alert, Box, CircularProgress, Container, Stack } from "@mui/material";
import { getDiscoverTv } from "../api/tmdb-api";
import type { DiscoverTvResponse } from "../types/interfaces";
import PageHeader from "../components/PageHeader";
import TvSeriesList from "../components/TvSeriesList";

const TvSeriesPage = () => {
    const { data, error, isLoading, isError } = useQuery<DiscoverTvResponse, Error>({
        queryKey: ["discover", "tvSeries"],
        queryFn: () => getDiscoverTv()
    });

    const series = data?.results ?? [];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stack spacing={3}>
                <PageHeader title="TV Series" description="Discover popular TV series from TMDB." />

                {isLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : null}

                {isError ? <Alert severity="error">{error.message || "Failed to load TV series."}</Alert> : null}

                {!isLoading && !isError ? <TvSeriesList series={series} /> : null}
            </Stack>
        </Container>
    );
};

export default TvSeriesPage;
