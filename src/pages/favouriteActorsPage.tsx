import { useQueries } from "@tanstack/react-query";
import { Container, Stack, Box, CircularProgress, Alert } from "@mui/material";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { getActor } from "../api/tmdb-api";
import { useFavouriteActors } from "../hooks/useFavouriteActors";
import PageHeader from "../components/PageHeader";
import ActorCard from "../components/ActorCard";
import type { BaseActorProps } from "../types/interfaces";

const FavouriteActorsPage = () => {
  const { favouriteActors, reorderFavourites } = useFavouriteActors();

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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(favouriteActors);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    reorderFavourites(items);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <PageHeader
          title="Favourite Actors"
          description="Your favorite actors in one place. Drag and drop to reorder them!"
        />

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : null}

        {isError ? (
          <Alert severity="error">Failed to load some actors.</Alert>
        ) : null}

        {!isLoading && actors.length > 0 ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="actors-list">
              {(provided) => (
                <Stack
                  spacing={2}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {actors.map((actor, index) => (
                    <Draggable
                      key={actor.id.toString()}
                      draggableId={actor.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ActorCard actor={actor} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Stack>
              )}
            </Droppable>
          </DragDropContext>
        ) : null}
      </Stack>
    </Container>
  );
};

export default FavouriteActorsPage;
