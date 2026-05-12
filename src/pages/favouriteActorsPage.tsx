import { useQueries } from "@tanstack/react-query";
import { Container, Stack, Box, CircularProgress, Alert } from "@mui/material";
import { getActor } from "../api/tmdb-api";
import { useFavouriteActors } from "../hooks/useFavouriteActors";
import PageHeader from "../components/PageHeader";
import ActorList from "../components/ActorList";
import type { BaseActorProps } from "../types/interfaces";

const FavouriteActorsPage = () => {
  const { favouriteActors } = useFavouriteActors();

  const favouriteActorQueries = useQueries({
    queries: favouriteActors.map((actorId) => {
      return {
        queryKey: ["actor", actorId],
        queryFn: () => getActor(actorId.toString()),
      };
    }),
  });

  const isLoading = favouriteActorQueries.some((q) => q.isLoading);
  const isError = favouriteActorQueries.some((q) => q.isError);

  const actors = favouriteActorQueries
    .map((q) => q.data)
    .filter((actor) => actor !== undefined) as BaseActorProps[];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <PageHeader
          title="Favourite Actors"
          description="Your favorite actors in one place."
        />

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : null}

        {isError ? (
          <Alert severity="error">Failed to load some actors.</Alert>
        ) : null}

        {!isLoading && actors.length > 0 ? <ActorList actors={actors} /> : null}
      </Stack>
    </Container>
  );
};

export default FavouriteActorsPage;
