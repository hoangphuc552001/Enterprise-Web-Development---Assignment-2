import { useQueries } from "@tanstack/react-query";
import { Container, Stack, Box, CircularProgress, Alert } from "@mui/material";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { getTvSeries } from "../api/tmdb-api";
import { useFavouriteTvSeries } from "../hooks/useFavouriteTvSeries";
import PageHeader from "../components/PageHeader";
import TvSeriesCard from "../components/TvSeriesCard";
import type { BaseTvSeriesProps } from "../types/interfaces";

const FavouriteTvSeriesPage = () => {
  const { favouriteTvSeries, reorderFavourites } = useFavouriteTvSeries();

  const favouriteTvSeriesQueries = useQueries({
    queries: favouriteTvSeries.map((seriesId) => {
      return {
        queryKey: ["tvSeries", seriesId],
        queryFn: () => getTvSeries(seriesId.toString()),
      };
    }),
  });

  const isLoading = favouriteTvSeriesQueries.some((q) => q.isLoading);
  const isError = favouriteTvSeriesQueries.some((q) => q.isError);

  const series = favouriteTvSeriesQueries
    .map((q) => q.data)
    .filter((s) => s !== undefined) as BaseTvSeriesProps[];

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(favouriteTvSeries);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    reorderFavourites(items);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <PageHeader
          title="Favourite TV Series"
          description="Your favorite TV series!"
        />

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : null}

        {isError ? (
          <Alert severity="error">Failed to load some TV series.</Alert>
        ) : null}

        {!isLoading && series.length > 0 ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tv-series-list">
              {(provided) => (
                <Stack
                  spacing={2}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {series.map((s, index) => (
                    <Draggable
                      key={s.id.toString()}
                      draggableId={s.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TvSeriesCard series={s} />
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

export default FavouriteTvSeriesPage;
