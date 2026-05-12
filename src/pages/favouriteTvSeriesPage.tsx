import { useQueries } from "@tanstack/react-query";
import { Container, Stack, Box, CircularProgress, Alert } from "@mui/material";
import { getTvSeries } from "../api/tmdb-api";
import { useFavouriteTvSeries } from "../hooks/useFavouriteTvSeries";
import PageHeader from "../components/PageHeader";
import TvSeriesList from "../components/TvSeriesList";
import type { BaseTvSeriesProps } from "../types/interfaces";

const FavouriteTvSeriesPage = () => {
  const { favouriteTvSeries } = useFavouriteTvSeries();

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <PageHeader
          title="Favourite TV Series"
          description="Your favorite TV series in one place."
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
          <TvSeriesList series={series} />
        ) : null}
      </Stack>
    </Container>
  );
};

export default FavouriteTvSeriesPage;
