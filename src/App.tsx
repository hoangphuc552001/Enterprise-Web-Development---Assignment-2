import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/homePage";
import MovieDetailPage from "./pages/movieDetailPage";
import ActorsPage from "./pages/actorsPage";
import TvSeriesPage from "./pages/tvSeriesPage";
import ActorDetailPage from "./pages/actorDetailPage";
import TvSeriesDetailPage from "./pages/tvSeriesDetailPage";
import SiteNavigation from "./components/SiteNavigation";


const App = () => {
  return (
    <SiteNavigation>
      <Routes>
        {/* PUBLIC routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/movies/:id" element={<MovieDetailPage />} />
        <Route path="/actors" element={<ActorsPage />} />
        <Route path="/actors/:id" element={<ActorDetailPage />} />
        <Route path="/tv" element={<TvSeriesPage />} />
        <Route path="/tv/:id" element={<TvSeriesDetailPage />} />

        {/*  FALLBACK routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </SiteNavigation>
  );
};

export default App;
