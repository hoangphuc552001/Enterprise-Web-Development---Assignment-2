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
import { getPopularActors } from "../api/tmdb-api";
import type { PopularActorsResponse } from "../types/interfaces";
import PageHeader from "../components/PageHeader";
import ActorList from "../components/ActorList";

const ActorsPage = () => {
  const [page, setPage] = useState(1);

  const { data, error, isLoading, isError } = useQuery<
    PopularActorsResponse,
    Error
  >({
    queryKey: ["popular", "actors", page],
    queryFn: () => getPopularActors(page),
  });

  const actors = data?.results ?? [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <PageHeader
          title="Popular Actors"
          description="Discover the most popular actors on TMDB."
        />

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : null}

        {isError ? (
          <Alert severity="error">
            {error.message || "Failed to load actors."}
          </Alert>
        ) : null}

        {!isLoading && !isError ? (
          <>
            <ActorList actors={actors} />
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

export default ActorsPage;
