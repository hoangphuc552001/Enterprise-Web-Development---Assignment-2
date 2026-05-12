import { useState } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMovieReview } from "../api/reviews-api";
import type { Review } from "../api/reviews-api";

interface ReviewFormProps {
  movieId: number;
  onSuccess?: () => void;
}

const ReviewForm = ({ movieId, onSuccess }: ReviewFormProps) => {
  const [text, setText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newReview: Review) => addMovieReview(newReview),
    onSuccess: () => {
      setText("");
      setErrorMsg("");
      queryClient.invalidateQueries({ queryKey: ["reviews", movieId] });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      setErrorMsg(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setErrorMsg("Review text cannot be empty.");
      return;
    }

    mutation.mutate({
      movieId,
      date: new Date().toISOString().split("T")[0],
      text,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Write a Review
      </Typography>
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        placeholder="What did you think of the movie?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={mutation.isPending}
        sx={{ mb: 2 }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </Box>
  );
};

export default ReviewForm;
