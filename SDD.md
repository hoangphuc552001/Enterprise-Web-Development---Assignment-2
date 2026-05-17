# Spec-Driven Development (SDD) Document

## Overview

This document follows the Spec-Driven Development approach introduced in the final lab.
Each feature was planned using the skill definitions in `./skills/`, broken into discrete tasks,
implemented incrementally, and validated against the spec before moving to the next feature.

Skills used as reference: `./skills/` (21 skills total, mapped in `./skills/project-requirements/implementation_plan.md`)

---

## Feature 1 — Core Movie Pages

### Spec

**Goal:** Display a paginated, filterable list of movies and a detail page for each movie.

**Acceptance criteria:**

- Home page fetches movies from TMDB `/discover/movie`
- Each movie shows poster, title, release date, and rating
- Clicking a movie navigates to a detail page at `/movies/:id`
- Detail page shows full movie information (genres, runtime, budget, overview, production companies)
- Loading and error states are shown during data fetching
- Data is cached so navigating back does not re-fetch

**Skills applied:**

- `props-and-list-rendering` — typed MovieCard props, list rendered with `.map()`
- `component-hierarchy-and-page-assembly` — HomePage assembles MovieList + filter panel
- `api-fetching` — `getMovies()` and `getMovie(id)` functions in `tmdb-api.ts`
- `server-state-caching` — `useQuery` with keys `["movies", params]` and `["movie", id]`
- `material-ui-basics` — Card, Grid, Typography, Chip components

### Tasks

- [x] Create `src/api/tmdb-api.ts` with `getMovies()` and `getMovie(id)`
- [x] Create `MovieCard` component with typed `BaseMovieProps`
- [x] Create `MovieList` component rendering a grid of `MovieCard`
- [x] Create `homePage.tsx` using `useQuery(["movies", params], getMovies)`
- [x] Create `movieDetailPage.tsx` using `useQuery(["movie", id], () => getMovie(id))`
- [x] Add routes `/` and `/movies/:id` in `App.tsx`

### Validation

- Navigating to `/` shows a grid of movies ✅
- Clicking a movie navigates to `/movies/:id` ✅
- Detail page shows all fields (genres as chips, runtime, budget, production companies) ✅
- Navigating back does not trigger a network request (React Query cache) ✅
- `tsc --noEmit` passes with no errors ✅

---

## Feature 2 — Additional Data Entities (Actors & TV Series)

### Spec

**Goal:** Add two new browsable entity types with list and detail views.

**Acceptance criteria:**

- `/actors` shows a paginated grid of popular actors fetched from TMDB
- `/actors/:id` shows actor biography, birthday, place of birth, and known-for department
- `/tv` shows a paginated grid of TV series
- `/tv/:id` shows series name, genres, number of seasons, first air date, and overview
- Each entity type has its own typed interface

**Skills applied:**

- `openapi-type-layer` — `ActorDetailsProps`, `BaseTvSeriesProps`, etc. in `interfaces.ts`
- `props-and-list-rendering` — `ActorCard`, `ActorList`, `TvSeriesCard`, `TvSeriesList`
- `server-state-caching` — `useQuery(["actors", page], ...)`, `useQuery(["actor", id], ...)`
- `routing-and-navigation` — parameterised routes `/actors/:id`, `/tv/:id`

### Tasks

- [x] Add `getPopularActors(page)`, `getActor(id)`, `getDiscoverTv(page)`, `getTvSeries(id)` to `tmdb-api.ts`
- [x] Define `BaseActorProps`, `ActorDetailsProps`, `BaseTvSeriesProps`, `TvSeriesDetailsProps` in `interfaces.ts`
- [x] Create `ActorCard`, `ActorList` components
- [x] Create `TvSeriesCard`, `TvSeriesList` components
- [x] Create `actorsPage.tsx` and `actorDetailPage.tsx`
- [x] Create `tvSeriesPage.tsx` and `tvSeriesDetailPage.tsx`
- [x] Add routes `/actors`, `/actors/:id`, `/tv`, `/tv/:id` in `App.tsx`

### Validation

- `/actors` loads a grid of actor cards with profile images ✅
- `/actors/:id` displays biography, birthday, and place of birth ✅
- `/tv` loads a grid of TV series cards ✅
- `/tv/:id` displays seasons count, air date, and genres ✅
- TypeScript types correctly narrow API responses ✅

---

## Feature 3 — Data Hyperlinking

### Spec

**Goal:** Connect entities through clickable links so users can navigate naturally between related data.

**Acceptance criteria:**

- Genre chips on movie detail page link back to home with that genre pre-selected
- Actor cards link to actor detail pages
- TV series cards link to series detail pages
- Movie cards in playlists link to movie detail pages

**Skills applied:**

- `extended-link-routing-and-page-state` — `<Link state={...}>` and `useLocation` for passing filter state
- `routing-and-navigation` — `<Link to="/actors/:id">` and `useNavigate`

### Tasks

- [x] Genre chips on `movieDetailPage` use `<Link to="/?genreId=X">` (or `useNavigate` with search params)
- [x] `ActorCard` wraps content in `<Link to={/actors/${id}}>`
- [x] `TvSeriesCard` wraps content in `<Link to={/tv/${id}}>`
- [x] `MovieCard` in playlist detail links to `/movies/:id`

### Validation

- Clicking a genre chip on movie detail navigates to home with that genre pre-filtered ✅
- Clicking an actor card navigates to `/actors/:id` ✅
- Clicking a TV series card navigates to `/tv/:id` ✅

---

## Feature 4 — Multi-Criteria Filtering & Search

### Spec

**Goal:** Let users narrow the movie list using multiple independent filter controls.

**Acceptance criteria:**

- Title text search (debounced 500 ms)
- Genre multi-select (filter by one or more genres)
- Sort by popularity or release date (ascending/descending)
- Vote average range (min and max)
- Release date range (from and to)
- Any filter change resets pagination to page 1
- When title search is active, sort is disabled (TMDB API constraint)

**Skills applied:**

- `filtering-and-data-flow` — parent-owned filter state, data-down/action-up
- `custom-hooks` — `useDebounce` hook for delaying filter API calls
- `server-state-caching` — query key includes all filter params so each combination is cached independently

### Tasks

- [x] Create `useDebounce<T>(value, delay)` in `hooks/useDebounce.ts`
- [x] Add filter state to `homePage.tsx` (title, genres, sortBy, voteMin, voteMax, dateFrom, dateTo)
- [x] Debounce title, vote average, and date inputs with `useDebounce`
- [x] Pass all params to `getMovies(params)` and include them in the query key
- [x] Reset `page` to 1 via `useEffect` whenever any filter changes
- [x] Disable sort dropdown when title search is non-empty

### Validation

- Typing in the search box waits 500 ms before fetching ✅
- Selecting multiple genres returns movies matching all selected genres ✅
- Vote average range filters correctly ✅
- Release date range filters correctly ✅
- Page resets to 1 on every filter change ✅

---

## Feature 5 — Pagination

### Spec

**Goal:** Allow users to page through large result sets on listing pages.

**Acceptance criteria:**

- Movie home page supports up to 500 pages
- Actors page and TV series page support pagination
- Current page is reflected in the query key (each page cached separately)
- Page changes scroll the view back to the top

**Skills applied:**

- `server-state-caching` — query key includes `page` number
- `parallel-queries-and-cache-identity` — stable cache keys per page

### Tasks

- [x] Add `page` state to `homePage.tsx`, `actorsPage.tsx`, `tvSeriesPage.tsx`
- [x] Include `page` in query keys: `["movies", page, ...filters]`
- [x] Render MUI `<Pagination>` component below each list
- [x] On page change, call `window.scrollTo({ top: 0, behavior: "smooth" })`

### Validation

- Clicking page 2 loads a different set of results ✅
- Going back to page 1 uses cached data (no network request) ✅
- Page scrolls to top on every page change ✅

---

## Feature 6 — Authentication & Protected Routes

### Spec

**Goal:** Allow users to sign up, confirm their email, and sign in. Gate premium routes behind authentication.

**Acceptance criteria:**

- Users can register with username, email, and password
- Registration triggers an email confirmation code (AWS Cognito)
- Signing in stores a JWT in `localStorage`
- All authenticated API calls include `Authorization: Bearer <token>`
- Protected routes redirect unauthenticated users to `/login`
- After login, user is redirected back to the original route

**Skills applied:**

- `context-for-shared-state` — `AuthContext` provides `{ isAuthenticated, username, token, login, logout }`
- `routing-and-navigation` — `ProtectedRoute` wrapper, `useLocation` for redirect state
- `api-fetching` — `signUp`, `confirmSignUp`, `signIn` functions in `auth-api.ts`

### Tasks

- [x] Create `src/contexts/AuthContext.tsx` with `AuthProvider` and `useAuth` hook
- [x] Create `src/api/auth-api.ts` with `signUp`, `confirmSignUp`, `signIn`
- [x] Create `loginPage.tsx`, `signupPage.tsx`, `confirmSignupPage.tsx`
- [x] Create `ProtectedRoute.tsx` — reads `isAuthenticated` from context, redirects with location state if false
- [x] Wrap all premium routes in `ProtectedRoute` in `App.tsx`
- [x] `getAuthHeaders()` in `user-api.ts` reads token from `localStorage`

### Validation

- Visiting `/fantasy` while logged out redirects to `/login` ✅
- After login, user is redirected back to `/fantasy` ✅
- JWT is included in the `Authorization` header on all user-data API calls ✅
- Logout clears `localStorage` and resets context state ✅

---

## Feature 7 — Favourite Actors & TV Series

### Spec

**Goal:** Users can mark actors and TV series as favourites. The selections persist to the backend.

**Acceptance criteria:**

- Heart icon on `ActorCard` and `TvSeriesCard` toggles favourite status
- Heart is filled when the item is a favourite
- Favourite actors list is accessible at `/fav-actors`
- Favourite TV series list is accessible at `/fav-tv`
- Favourites persist to DynamoDB via `PUT /user/favourites`

**Skills applied:**

- `favourites-and-local-ui-state` — icon state tied to favourite array membership
- `custom-hooks` — `useFavouriteActors`, `useFavouriteTvSeries` hooks encapsulate query + mutation logic
- `server-state-caching` — `useQuery(["favourites"], getFavourites)` with mutation invalidation

### Tasks

- [x] Add `getFavourites()` and `updateFavourites(type, ids)` to `user-api.ts`
- [x] Create `useFavouriteActors` hook: `isFavourite(id)`, `toggleFavourite(id)`, `reorderFavourites(ids)`
- [x] Create `useFavouriteTvSeries` hook (same interface)
- [x] Add heart `IconButton` to `ActorCard` and `TvSeriesCard`
- [x] Create `favouriteActorsPage.tsx` and `favouriteTvSeriesPage.tsx`
- [x] Wrap both routes in `ProtectedRoute`

### Validation

- Clicking the heart on an actor card fills the icon and persists to backend ✅
- Navigating to `/fav-actors` shows all favourited actors ✅
- Refreshing the page retains favourites (DynamoDB persistence) ✅

---

## Feature 8 — Ordered Favourites (Drag & Drop)

### Spec

**Goal:** Users can reorder their favourite actors and TV series by dragging cards.

**Acceptance criteria:**

- Favourite actors and TV series pages show items in a draggable list
- Dragging and dropping an item to a new position reorders it immediately
- The new order is persisted to the backend on drop

**Skills applied:**

- `custom-hooks` — `reorderFavourites(newIds)` method in favourite hooks
- `server-state-caching` — mutation on drop invalidates and refreshes the favourites query

**External library:** `@hello-pangea/dnd` (React 18/19-compatible fork of react-beautiful-dnd)

### Tasks

- [x] Install `@hello-pangea/dnd`
- [x] Wrap list in `<DragDropContext onDragEnd={...}>` and `<Droppable>`
- [x] Wrap each card in `<Draggable draggableId={id} index={index}>`
- [x] In `onDragEnd`, reorder the IDs array and call `reorderFavourites(newOrder)`
- [x] Add `reorderFavourites` to both favourite hooks — calls `updateFavourites` with new order

### Validation

- Dragging an actor card to a new position updates the list immediately ✅
- Refreshing the page retains the new order (DynamoDB persistence) ✅
- Drag works correctly on both `/fav-actors` and `/fav-tv` ✅

---

## Feature 9 — Themed Movie Playlists

### Spec

**Goal:** Users can create named playlists, add movies to them, and view playlist contents.

**Acceptance criteria:**

- `/playlists` lists all user playlists with name, description, and movie count
- Users can create a new playlist with a name and theme description
- Any movie card has an "Add to playlist" menu
- Movies already in a playlist are shown as disabled with "(Added)" label
- `/playlists/:id` shows all movies in the playlist as a full movie grid
- Playlists persist to DynamoDB

**Skills applied:**

- `review-forms-with-react-hook-form` — create playlist dialog uses a controlled form
- `custom-hooks` — `usePlaylists` hook encapsulates all CRUD operations
- `parallel-queries-and-cache-identity` — playlist detail page uses `useQueries` to batch-fetch movie details
- `server-state-caching` — `useQuery(["playlists"], getPlaylists)` with mutation invalidation

### Tasks

- [x] Add `getPlaylists()` and `updatePlaylists(playlists)` to `user-api.ts`
- [x] Create `usePlaylists` hook: `createPlaylist`, `deletePlaylist`, `addToPlaylist`, `removeFromPlaylist`, `getPlaylist`
- [x] Add playlist dropdown menu (`PlaylistAddIcon`) to `MovieCard`
- [x] Create `playlistsPage.tsx` with MUI Accordion list + create dialog
- [x] Create `playlistDetailsPage.tsx` using `useQueries` to fetch all movie details in parallel
- [x] Wrap both routes in `ProtectedRoute`

### Validation

- Creating a playlist appears immediately in the list ✅
- Adding a movie shows "(Added)" in the dropdown for that playlist ✅
- Playlist detail page renders full movie cards for all added movies ✅
- Deleting a playlist removes it from the list ✅
- Refreshing retains all playlists (DynamoDB persistence) ✅

---

## Feature 10 — Fantasy Movie (Basic)

### Spec

**Goal:** Users can create a custom fantasy movie record with core details.

**Acceptance criteria:**

- Form accepts: Title, Overview, Genres (multi-select from TMDB), Release Date, Runtime, Production Companies
- All required fields are validated before submit
- Submitted movie appears in the fantasy movie list at `/fantasy`
- Users can delete a fantasy movie from the list

**Skills applied:**

- `review-forms-with-react-hook-form` — `useForm`, `Controller` for the genre multi-select
- `custom-hooks` — `useFantasyMovies` hook: `addMovie`, `deleteMovie`, `getMovie`
- `server-state-caching` — `useQuery(["fantasy-movies"], getFantasyMovies)`

### Tasks

- [x] Add `getFantasyMovies()` and `updateFantasyMovies(movies)` to `user-api.ts`
- [x] Create `useFantasyMovies` hook with UUID generation on add
- [x] Create `fantasyMovieFormPage.tsx` with react-hook-form (`useForm`, `useFieldArray`, `Controller`)
- [x] Create `fantasyMoviePage.tsx` as a table listing all fantasy movies with a delete button
- [x] Wrap both routes in `ProtectedRoute`

### Validation

- Submitting with empty Title shows validation error ✅
- Submitting without selecting a genre shows validation error ✅
- Submitted movie appears in the table at `/fantasy` ✅
- Deleting a movie removes it from the list ✅
- Refreshing retains fantasy movies (DynamoDB persistence) ✅

---

## Feature 11 — Fantasy Movie Advanced (Cast + Poster Upload)

### Spec

**Goal:** Extend the fantasy movie form to support a cast list and a poster image uploaded to S3.

**Acceptance criteria:**

- Cast section allows adding/removing members dynamically
- Each cast member has Actor Name (required), Role Name (required), and Description (optional)
- Poster section shows a drag-and-drop upload zone
- Accepted formats: JPEG, PNG, WebP, GIF — max 5 MB
- Upload shows a live preview and a progress indicator
- After upload, the S3 public URL is stored as `posterPath` on the movie record

**Skills applied:**

- `review-forms-with-react-hook-form` — `useFieldArray` for dynamic cast list
- `api-fetching` — `getPresignedUploadUrl` + `uploadFileToS3` in `user-api.ts`

**Infrastructure (Assignment 1):**

- AWS S3 bucket with CORS (allow PUT from any origin)
- Lambda `generatePresignedUrl.ts` — generates a 60-second presigned PUT URL
- API route `POST /upload/presigned-url`

### Tasks

- [x] Add cast fields to `FormValues` interface in `fantasyMovieFormPage.tsx`
- [x] Use `useFieldArray({ name: "cast" })` for dynamic cast member rows
- [x] Create `PosterUpload.tsx` component (drag-and-drop, preview, status states)
- [x] Add `getPresignedUploadUrl(fileName, fileType)` and `uploadFileToS3(file)` to `user-api.ts`
- [x] Replace `posterPath` TextField with `<Controller>` wrapping `<PosterUpload>`
- [x] Create `lambdas/generatePresignedUrl.ts` in Assignment 1 repo
- [x] Add S3 bucket CDK construct and API route in `app-api.ts`

### Validation

- Adding cast members with missing Name or Role shows validation error ✅
- Selecting an image shows a local preview immediately ✅
- Upload progress indicator appears during S3 PUT ✅
- After upload, "Uploaded ✓" indicator appears ✅
- Submitted movie record contains the S3 URL as `posterPath` ✅
- File > 5 MB shows an error without uploading ✅

---

## Feature 12 — Movie Reviews Persisted to DynamoDB

### Spec

**Goal:** Users can write reviews for movies. Reviews are saved to DynamoDB and shown on the movie detail page.

**Acceptance criteria:**

- Review form appears on the movie detail page (protected route)
- Form accepts free-text review content
- Submitting calls `POST /movies/reviews` with `{ movieId, date, text }`
- Reviews are fetched via `GET /movies/{movieId}/reviews`
- Review list updates immediately after a successful submission (cache invalidation)

**Skills applied:**

- `review-forms-with-react-hook-form` — `useForm` for the review text field
- `server-state-caching` — `useQuery(["reviews", movieId], ...)` invalidated on submit mutation
- `api-fetching` — `getMovieReviews`, `addMovieReview` in `reviews-api.ts`

### Tasks

- [x] Create `src/api/reviews-api.ts` with `getMovieReviews(movieId)` and `addMovieReview(review)`
- [x] Create `ReviewForm.tsx` — `useForm` with submit handler calling `addMovieReview`
- [x] Create `MovieReviews.tsx` — `useQuery` to fetch and display reviews, renders `ReviewForm`
- [x] Add `<MovieReviews movieId={id} />` to `movieDetailPage.tsx`
- [x] On successful submit, call `queryClient.invalidateQueries(["reviews", movieId])`

### Validation

- Review form appears on the movie detail page when logged in ✅
- Submitting an empty review is prevented by validation ✅
- After submitting, new review appears in the list without a page refresh ✅
- Reviews persist after page refresh (DynamoDB storage) ✅

---

## Feature 13 — Backend Persistence (Outstanding tier)

### Spec

**Goal:** All user-specific data (favourites, playlists, fantasy movies) is stored in DynamoDB via dedicated Lambda endpoints, not in browser memory.

**Acceptance criteria:**

- Data survives page refresh
- Data is scoped per authenticated user (JWT-based identity)
- All mutations use optimistic or invalidation-based cache updates in React Query

**Skills applied:**

- `server-state-caching` — mutations with `onSuccess: () => queryClient.invalidateQueries(...)`
- `custom-hooks` — each domain (favourites, playlists, fantasy) has its own hook with query + mutation

### Tasks

- [x] `useFantasyMovies` — `addMovie` and `deleteMovie` call `updateFantasyMovies` then invalidate `["fantasy-movies"]`
- [x] `useFavouriteActors` / `useFavouriteTvSeries` — `toggleFavourite` and `reorderFavourites` call `updateFavourites` then invalidate `["favourites"]`
- [x] `usePlaylists` — all CRUD operations call `updatePlaylists` then invalidate `["playlists"]`

### Validation

- Logging out and back in retains all favourites, playlists, and fantasy movies ✅
- Two browser sessions for the same user see the same data ✅
- Mutations trigger a UI update within one render cycle ✅

---

## Feature 14 — Frontend CDN Deployment (AWS S3 + CloudFront)

### Spec

**Goal:** The production frontend build is served from AWS CloudFront for fast global delivery.

**Acceptance criteria:**

- `npm run build` produces a `dist/` folder
- `dist/` is synced to an S3 bucket configured for static website hosting
- CloudFront serves the bucket with HTTPS
- `index.html` has `no-cache` headers so new deploys take effect immediately
- All other assets have long-lived `immutable` cache headers (content-hashed filenames)
- The CI/CD pipeline in `.github/workflows/ci.yml` automates the sync and invalidation on push to `main`

### Tasks

- [x] Create S3 bucket `tmdb-app-assignment2-hoangphucle` with static website hosting enabled
- [x] Create CloudFront distribution pointing to the S3 bucket (distribution ID: `E3MJGKRIZJRJNB`)
- [x] Create `.github/workflows/ci.yml` with `build` → `deploy` jobs
- [x] `deploy` job: `aws s3 sync dist/ s3://...` + `aws cloudfront create-invalidation`
- [x] Store `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME`, `CLOUDFRONT_DISTRIBUTION_ID`, `VITE_TMDB_KEY` as GitHub secrets
- [x] Create dedicated IAM user `github-actions-deploy` with minimum permissions (S3 sync + CloudFront invalidation only)

### Validation

- Pushing to `main` triggers the GitHub Actions pipeline ✅
- Build job compiles TypeScript and produces `dist/` ✅
- Deploy job syncs to S3 and creates a CloudFront invalidation ✅
- CloudFront URL (`https://d1mogd19ctoyib.cloudfront.net`) serves the latest build ✅

---

## Summary Table

| Feature                                | Spec Tier      | Skills Applied                                                                   | Status  |
| -------------------------------------- | -------------- | -------------------------------------------------------------------------------- | ------- |
| Core movie pages                       | Good           | props-and-list-rendering, api-fetching, server-state-caching, material-ui-basics | ✅ Done |
| Actors & TV Series                     | Good           | openapi-type-layer, routing-and-navigation, server-state-caching                 | ✅ Done |
| Data hyperlinking                      | Good/Very Good | extended-link-routing-and-page-state, routing-and-navigation                     | ✅ Done |
| Multi-criteria filtering               | Good/Very Good | filtering-and-data-flow, custom-hooks, server-state-caching                      | ✅ Done |
| Pagination                             | Very Good      | server-state-caching, parallel-queries-and-cache-identity                        | ✅ Done |
| Authentication & protected routes      | Very Good      | context-for-shared-state, routing-and-navigation, api-fetching                   | ✅ Done |
| Favourite actors & TV series           | Very Good      | favourites-and-local-ui-state, custom-hooks, server-state-caching                | ✅ Done |
| Ordered favourites (drag & drop)       | Excellent      | custom-hooks, server-state-caching                                               | ✅ Done |
| Themed playlists                       | Excellent      | review-forms-with-react-hook-form, custom-hooks, parallel-queries                | ✅ Done |
| Fantasy movie basic                    | Good           | review-forms-with-react-hook-form, custom-hooks, server-state-caching            | ✅ Done |
| Fantasy movie advanced (cast + poster) | Excellent      | review-forms-with-react-hook-form, api-fetching                                  | ✅ Done |
| Movie reviews → DynamoDB               | Excellent      | review-forms-with-react-hook-form, server-state-caching, api-fetching            | ✅ Done |
| Backend persistence                    | Outstanding    | server-state-caching, custom-hooks                                               | ✅ Done |
| CloudFront CDN deployment              | Very Good      | — (infrastructure)                                                               | ✅ Done |
