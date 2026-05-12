import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Divider,
} from "@mui/material";
import { getMovieReviews } from "../api/reviews-api";
import type { Review } from "../api/reviews-api";
import ReviewForm from "./ReviewForm";

interface MovieReviewsProps {
  movieId: number;
}

const MovieReviews = ({ movieId }: MovieReviewsProps) => {
  const { data, isLoading, isError, error } = useQuery<Review[], Error>({
    queryKey: ["reviews", movieId],
    queryFn: () => getMovieReviews(movieId),
  });

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Reviews
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {isLoading ? (
        <CircularProgress />
      ) : isError ? (
        <Alert severity="error">
          {error?.message || "Failed to load reviews"}
        </Alert>
      ) : data && data.length > 0 ? (
        data.map((review, index) => (
          <Paper key={review.id || index} sx={{ p: 2, mb: 2 }} elevation={1}>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {review.text}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 1 }}
            >
              Published on: {review.date}
            </Typography>
          </Paper>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No reviews yet. Be the first to review!
        </Typography>
      )}

      <ReviewForm movieId={movieId} />
    </Box>
  );
};

export default MovieReviews;
