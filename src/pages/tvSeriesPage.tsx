import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Container, Stack } from "@mui/material";
import { getDiscoverTv } from "../api/tmdb-api";
import type { BaseTvSeriesProps, DiscoverTvResponse } from "../types/interfaces";
import PageHeader from "../components/PageHeader";
import TvSeriesList from "../components/TvSeriesList";

const TvSeriesPage = () => {
    const [series, setSeries] = useState<BaseTvSeriesProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadSeries = async () => {
            try {
                setLoading(true);
                setError("");
                const response = (await getDiscoverTv()) as DiscoverTvResponse;
                setSeries(response.results ?? []);
            } catch {
                setError("Failed to load TV series.");
            } finally {
                setLoading(false);
            }
        };

        loadSeries();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stack spacing={3}>
                <PageHeader title="TV Series" description="Discover popular TV series from TMDB." />

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : null}

                {!loading && error ? <Alert severity="error">{error}</Alert> : null}

                {!loading && !error ? <TvSeriesList series={series} /> : null}
            </Stack>
        </Container>
    );
};

export default TvSeriesPage;
