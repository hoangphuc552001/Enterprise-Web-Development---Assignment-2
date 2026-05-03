// Skill 9: openapi-type-layer — App-facing type aliases
// These types are derived from TMDB API response shapes and used throughout the app.
// Keeping them in one place means component props are always consistent with the API.

export interface BaseMovieProps {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  popularity: number;
  genre_ids: number[];
  favourite?: boolean;
}

export interface MovieDetailsProps extends BaseMovieProps {
  genres: GenreProps[];
  runtime: number;
  revenue: number;
  budget: number;
  tagline: string;
  homepage: string;
  production_companies: ProductionCompanyProps[];
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages: { iso_639_1: string; name: string }[];
  status: string;
  imdb_id: string;
}

export interface GenreProps {
  id: number;
  name: string;
}

export interface ProductionCompanyProps {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface BaseMovieListProps {
  movies: BaseMovieProps[];
}

export interface DiscoverMoviesResponse {
  page: number;
  results: BaseMovieProps[];
  total_pages: number;
  total_results: number;
}

// Reviews from TMDB
export interface MovieReviewProps {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  updated_at: string;
  url: string;
}

// Actors / People
export interface BaseActorProps {
  id: number;
  name: string;
  profile_path: string | null;
  popularity: number;
  known_for_department: string;
  known_for: BaseMovieProps[];
}

export interface ActorDetailsProps extends BaseActorProps {
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  homepage: string | null;
  also_known_as: string[];
  imdb_id: string;
  gender: number;
}

export interface ActorMovieCreditsProps {
  id: number;
  cast: (BaseMovieProps & { character: string })[];
}

// TV Series
export interface BaseTVSeriesProps {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  first_air_date: string;
  popularity: number;
  genre_ids: number[];
}

export interface TVSeriesDetailsProps extends BaseTVSeriesProps {
  genres: GenreProps[];
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  tagline: string;
  homepage: string;
  created_by: { id: number; name: string; profile_path: string | null }[];
  networks: { id: number; name: string; logo_path: string | null }[];
  seasons: TVSeasonProps[];
}

export interface TVSeasonProps {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  air_date: string | null;
  overview: string;
  poster_path: string | null;
}

// Movie cast (for movie details page)
export interface MovieCastMemberProps {
  id: number;
  name: string;
  profile_path: string | null;
  character: string;
  order: number;
}

// Fantasy Movie (user-created)
export interface FantasyMovieProps {
  id: string;
  title: string;
  overview: string;
  genres: GenreProps[];
  releaseDate: string;
  runtime: number;
  productionCompanies: string[];
  posterUrl?: string;
  cast?: FantasyCastMemberProps[];
}

export interface FantasyCastMemberProps {
  name: string;
  roleName: string;
  description: string;
}

// Playlist
export interface PlaylistProps {
  id: string;
  title: string;
  theme: string;
  movieIds: number[];
}

// Filter types
export type FilterOption = "title" | "genre";

// Review form data
export interface ReviewFormDataProps {
  author: string;
  content: string;
  rating: number;
}
