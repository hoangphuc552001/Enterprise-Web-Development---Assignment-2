import { Routes, Route, Navigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Skill 10: routing-and-navigation — Central route configuration
// All routes are defined here in one place so the URL structure is easy to understand.
// Pages will be imported here as they are built in Phase 2+.

// Temporary placeholder page used until real pages are built
const PlaceholderPage = ({ title }: { title: string }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "80vh",
    }}
  >
    <Typography variant="h4" color="primary">
      {title} — Coming Soon
    </Typography>
  </Box>
);

const App = () => {
  return (
    <Routes>
      {/* ─── PUBLIC ROUTES ─── */}
      <Route path="/" element={<PlaceholderPage title="Home — Discover Movies" />} />
      <Route path="/movies/:id" element={<PlaceholderPage title="Movie Details" />} />
      <Route path="/movies/upcoming" element={<PlaceholderPage title="Upcoming Movies" />} />
      <Route path="/movies/popular" element={<PlaceholderPage title="Popular Movies" />} />
      <Route path="/movies/top-rated" element={<PlaceholderPage title="Top Rated Movies" />} />
      <Route path="/movies/now-playing" element={<PlaceholderPage title="Now Playing" />} />
      <Route path="/movies/:id/similar" element={<PlaceholderPage title="Similar Movies" />} />
      <Route path="/actors" element={<PlaceholderPage title="Popular Actors" />} />
      <Route path="/actors/:id" element={<PlaceholderPage title="Actor Details" />} />
      <Route path="/tv" element={<PlaceholderPage title="Popular TV Series" />} />
      <Route path="/tv/:id" element={<PlaceholderPage title="TV Series Details" />} />
      <Route path="/login" element={<PlaceholderPage title="Login" />} />
      <Route path="/signup" element={<PlaceholderPage title="Sign Up" />} />

      {/* ─── PROTECTED ROUTES (auth guard added in Phase 6) ─── */}
      <Route path="/movies/favourites" element={<PlaceholderPage title="Favourite Movies" />} />
      <Route path="/reviews/:id" element={<PlaceholderPage title="Movie Review" />} />
      <Route path="/reviews/form" element={<PlaceholderPage title="Write a Review" />} />
      <Route path="/movies/search" element={<PlaceholderPage title="Search Movies" />} />
      <Route path="/fantasy-movies" element={<PlaceholderPage title="My Fantasy Movies" />} />
      <Route path="/fantasy-movies/new" element={<PlaceholderPage title="Create Fantasy Movie" />} />
      <Route path="/fantasy-movies/:id" element={<PlaceholderPage title="Fantasy Movie Details" />} />
      <Route path="/playlists" element={<PlaceholderPage title="My Playlists" />} />
      <Route path="/playlists/:id" element={<PlaceholderPage title="Playlist Details" />} />

      {/* ─── FALLBACK ─── */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
