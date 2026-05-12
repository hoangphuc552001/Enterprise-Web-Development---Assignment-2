import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/homePage";
import MovieDetailPage from "./pages/movieDetailPage";
import ActorsPage from "./pages/actorsPage";
import TvSeriesPage from "./pages/tvSeriesPage";
import ActorDetailPage from "./pages/actorDetailPage";
import TvSeriesDetailPage from "./pages/tvSeriesDetailPage";
import FantasyMoviePage from "./pages/fantasyMoviePage";
import FantasyMovieFormPage from "./pages/fantasyMovieFormPage";
import SiteNavigation from "./components/SiteNavigation";
import FavouriteActorsPage from "./pages/favouriteActorsPage.tsx";
import FavouriteTvSeriesPage from "./pages/favouriteTvSeriesPage";
import LoginPage from "./pages/loginPage";
import SignupPage from "./pages/signupPage";
import ConfirmSignupPage from "./pages/confirmSignupPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <SiteNavigation>
      <Routes>
        {/* PUBLIC routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/confirm" element={<ConfirmSignupPage />} />

        <Route
          path="/movies/:id"
          element={
            <ProtectedRoute>
              <MovieDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="/actors" element={<ActorsPage />} />
        <Route
          path="/actors/:id"
          element={
            <ProtectedRoute>
              <ActorDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="/tv" element={<TvSeriesPage />} />
        <Route
          path="/tv/:id"
          element={
            <ProtectedRoute>
              <TvSeriesDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="/fantasy" element={<FantasyMoviePage />} />
        <Route path="/fantasy/new" element={<FantasyMovieFormPage />} />
        <Route path="/fav-actors" element={<FavouriteActorsPage />} />
        <Route path="/fav-tv" element={<FavouriteTvSeriesPage />} />

        {/*  FALLBACK routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </SiteNavigation>
  );
};

export default App;
