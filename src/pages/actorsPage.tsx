import {useQuery} from "@tanstack/react-query";
import {Alert, Box, CircularProgress, Container, Stack} from "@mui/material";
import {getPopularActors} from "../api/tmdb-api";
import type {PopularActorsResponse} from "../types/interfaces";
import PageHeader from "../components/PageHeader";
import ActorList from "../components/ActorList";

const ActorsPage = () => {
    const {data, error, isLoading, isError} = useQuery<PopularActorsResponse, Error>({
        queryKey: ["popular", "actors"],
        queryFn: () => getPopularActors()
    });

    const actors = data?.results ?? [];

    return (
        <Container maxWidth="lg" sx={{py: 4}}>
            <Stack spacing={3}>
                <PageHeader title="Popular Actors" description="Discover the most popular actors on TMDB."/>

                {isLoading ? (
                    <Box sx={{display: "flex", justifyContent: "center", py: 8}}>
                        <CircularProgress/>
                    </Box>
                ) : null}

                {isError ? <Alert severity="error">{error.message || "Failed to load actors."}</Alert> : null}

                {!isLoading && !isError ? <ActorList actors={actors}/> : null}
            </Stack>
        </Container>
    );
};

export default ActorsPage;
