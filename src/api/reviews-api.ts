const REVIEWS_API_URL =
  "https://ia6fqqgrrb.execute-api.us-east-1.amazonaws.com/dev";

export interface Review {
  id?: string;
  movieId: number;
  date: string;
  text: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // Assuming token is stored in localStorage by Auth context
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const getMovieReviews = async (movieId: string | number) => {
  const response = await fetch(`${REVIEWS_API_URL}/movies/${movieId}/reviews`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  const result = await response.json();
  return result.data || [];
};

export const addMovieReview = async (review: Review) => {
  const response = await fetch(`${REVIEWS_API_URL}/movies/reviews`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      movieId: review.movieId,
      date: review.date,
      text: review.text,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add review");
  }

  return response.json();
};

export const updateMovieReview = async (
  movieId: string | number,
  review: Review,
) => {
  const response = await fetch(`${REVIEWS_API_URL}/movies/${movieId}/reviews`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      text: review.text,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update review");
  }

  return response.json();
};
