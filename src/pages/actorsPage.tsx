import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Container, Stack } from "@mui/material";
import { getPopularActors } from "../api/tmdb-api";
import type { BaseActorProps, PopularActorsResponse } from "../types/interfaces";
import PageHeader from "../components/PageHeader";
import ActorList from "../components/ActorList";

const ActorsPage = () => {
    const [actors, setActors] = useState<BaseActorProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadActors = async () => {
            try {
                setLoading(true);
                setError("");
                const response = (await getPopularActors()) as PopularActorsResponse;
                setActors(response.results ?? []);
            } catch {
                setError("Failed to load actors.");
            } finally {
                setLoading(false);
            }
        };

        loadActors();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stack spacing={3}>
                <PageHeader title="Popular Actors" description="Discover the most popular actors on TMDB." />

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : null}

                {!loading && error ? <Alert severity="error">{error}</Alert> : null}

                {!loading && !error ? <ActorList actors={actors} /> : null}
            </Stack>
        </Container>
    );
};

export default ActorsPage;
