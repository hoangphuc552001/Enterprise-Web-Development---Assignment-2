import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Stack,
  Pagination,
} from "@mui/material";
import { getDiscoverTv } from "../api/tmdb-api";
import type { DiscoverTvResponse } from "../types/interfaces";
import PageHeader from "../components/PageHeader";
import TvSeriesList from "../components/TvSeriesList";

const TvSeriesPage = () => {
  const [page, setPage] = useState(1);

  const { data, error, isLoading, isError } = useQuery<
    DiscoverTvResponse,
    Error
  >({
    queryKey: ["discover", "tvSeries", page],
    queryFn: () => getDiscoverTv(page),
  });

  const series = data?.results ?? [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <PageHeader
          title="TV Series"
          description="Discover popular TV series from TMDB."
        />

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : null}

        {isError ? (
          <Alert severity="error">
            {error.message || "Failed to load TV series."}
          </Alert>
        ) : null}

        {!isLoading && !isError ? (
          <>
            <TvSeriesList series={series} />
            {data?.total_pages && data.total_pages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={Math.min(data.total_pages, 500)}
                  page={page}
                  onChange={(_, p) => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  color="primary"
                />
              </Box>
            )}
          </>
        ) : null}
      </Stack>
    </Container>
  );
};

export default TvSeriesPage;
