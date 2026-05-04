import type { paths } from "./generated/tmdb";

export type DiscoverMoviesProps = paths["/3/discover/movie"]["get"]["responses"][200]["content"]["application/json"];

export type BaseMovieProps = NonNullable<DiscoverMoviesProps["results"]>[number];

export type GetMoviesResponse = DiscoverMoviesProps;
