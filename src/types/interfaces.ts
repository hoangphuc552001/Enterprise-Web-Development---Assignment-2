import type { paths } from "./generated/tmdb";

export type DiscoverMoviesProps =
  paths["/3/discover/movie"]["get"]["responses"][200]["content"]["application/json"];

export type BaseMovieProps = NonNullable<
  DiscoverMoviesProps["results"]
>[number];

export type GetMoviesResponse = DiscoverMoviesProps;

export type MovieDetailsProps =
  paths["/3/movie/{movie_id}"]["get"]["responses"][200]["content"]["application/json"];

export type PopularActorsResponse =
  paths["/3/person/popular"]["get"]["responses"][200]["content"]["application/json"];

export type BaseActorProps = NonNullable<
  PopularActorsResponse["results"]
>[number];

export type DiscoverTvResponse =
  paths["/3/discover/tv"]["get"]["responses"][200]["content"]["application/json"];

export type BaseTvSeriesProps = NonNullable<
  DiscoverTvResponse["results"]
>[number];

export type ActorDetailsProps =
  paths["/3/person/{person_id}"]["get"]["responses"][200]["content"]["application/json"];

export type TvSeriesDetailsProps =
  paths["/3/tv/{series_id}"]["get"]["responses"][200]["content"]["application/json"];

export interface FantasyMovie {
  id: string;
  title: string;
  overview: string;
  genres: Array<{ id: number; name: string }>;
  releaseDate: string;
  runtime: number;
  productionCompanies: string[];
}
