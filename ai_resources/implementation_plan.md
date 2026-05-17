# Assignment 2 — React SPA Movies App (Target: Outstanding 90+)

## Skill → Folder Structure Mapping

All 21 project skills have been read and mapped to the folder structure below. The table shows exactly which skill drives which files/folders:

| #   | Skill                                     | What it mandates                                                   | Maps to                                                             |
| --- | ----------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------- |
| 1   | **vite-project-setup**                    | Vite + React + TS scaffold, dev/build/preview commands             | `vite.config.ts`, `package.json`, `.env`                            |
| 2   | **props-and-list-rendering**              | Typed props, `map()` for lists, reusable components                | `src/components/movieCard/`, `actorCard/`, `tvSeriesCard/`          |
| 3   | **state-and-effects**                     | `useState`, `useEffect` for dynamic data & side effects            | Used throughout pages before react-query migration                  |
| 4   | **material-ui-basics**                    | MUI components (Card, Grid, AppBar, Drawer, Typography, Chip)      | All components use MUI; `src/theme.ts` for custom theme             |
| 5   | **component-hierarchy-and-page-assembly** | Pages composed from child components in a clear tree               | `src/pages/` — each page assembles from `src/components/`           |
| 6   | **filtering-and-data-flow**               | Parent-owned filter state, data-down/action-up callbacks           | `src/components/filterMoviesCard/`, `filterActorsCard/`             |
| 7   | **favourites-and-local-ui-state**         | Immutable state updates for user selections, icon feedback         | `src/components/cardIcons/` (AddToFavourites, RemoveFromFavourites) |
| 8   | **api-fetching**                          | `fetch()` to TMDB, secrets in `import.meta.env`, error handling    | `src/api/tmdb-api.ts`                                               |
| 9   | **openapi-type-layer**                    | Generate types from TMDB OpenAPI spec, local aliases               | `src/types/tmdb.generated.ts`, `src/types/interfaces.ts`            |
| 10  | **routing-and-navigation**                | `BrowserRouter`, `Routes`, `Route`, parameterised URLs, `Link`     | `src/App.tsx` route config                                          |
| 11  | **refactoring-for-reuse**                 | Extract template components, remove duplication                    | `src/components/templateMovieListPage/`, `templateMoviePage/`       |
| 12  | **custom-hooks**                          | `use...` hooks that extract stateful logic                         | `src/hooks/useFiltering.ts`, `src/hooks/useMovie.ts`                |
| 13  | **component-composition**                 | Template with `children` prop for shared layout, different content | `src/components/templateMoviePage/` (`children` slot)               |
| 14  | **responsive-site-header**                | AppBar + Toolbar, `useMediaQuery`, mobile/desktop variants         | `src/components/siteHeader/`                                        |
| 15  | **extended-link-routing-and-page-state**  | `<Link state={...}>`, `useLocation` on destination page            | Review page receives movie+review via `Link` state                  |
| 16  | **render-props-configurable-actions**     | `action` render prop on cards for per-page icon behaviour          | `src/components/movieCard/` `action` prop pattern                   |
| 17  | **context-for-shared-state**              | `React.createContext`, Provider, `useContext` for favourites       | `src/contexts/moviesContext.tsx`                                    |
| 18  | **server-state-caching**                  | `QueryClientProvider`, `useQuery`, query keys, loading/error       | `src/main.tsx` (provider), all pages use `useQuery`                 |
| 19  | **parallel-queries-and-cache-identity**   | `useQueries` for array of IDs, cache key `["movie", id]`           | `src/pages/favouriteMoviesPage.tsx`                                 |
| 20  | **review-forms-with-react-hook-form**     | `useForm`, `Controller`, validation rules, submit/reset            | `src/components/reviewForm/`                                        |
| 21  | **storybook-maintenance**                 | Decorators for router/context/query providers in stories           | `src/stories/` (optional — for bonus)                               |

---

## Project Folder Structure

```
assignment2-ewd/
├── .env                                    # VITE_TMDB_KEY (skill 8: api-fetching)
├── .env.example                            # Template without secrets
├── vite.config.ts                          # Vite config (skill 1: vite-project-setup)
├── package.json
├── tsconfig.json
├── index.html
│
├── public/
│   └── icons.svg
│
└── src/
    ├── main.tsx                            # ReactDOM + QueryClientProvider + BrowserRouter
    │                                       #   (skill 18: server-state-caching, skill 10: routing)
    ├── App.tsx                             # Route table + SiteHeader + Context providers
    │                                       #   (skill 10: routing-and-navigation)
    ├── theme.ts                            # MUI createTheme customisation
    │                                       #   (skill 4: material-ui-basics)
    │
    ├── types/                              # (skill 9: openapi-type-layer)
    │   ├── interfaces.ts                   # App-facing type aliases
    │   └── tmdb.generated.ts               # Generated types from TMDB OpenAPI spec
    │
    ├── api/                                # (skill 8: api-fetching)
    │   ├── tmdb-api.ts                     # All TMDB fetch functions (movies, actors, TV, genres, search)
    │   └── backend-api.ts                  # Assignment 1 API (auth, reviews, favourites, fantasy)
    │
    ├── contexts/                           # (skill 17: context-for-shared-state)
    │   ├── moviesContext.tsx                # Favourites, must-watch lists, addTo/removeFrom
    │   └── authContext.tsx                  # Auth state, token, login/logout actions
    │
    ├── hooks/                              # (skill 12: custom-hooks)
    │   ├── useFiltering.ts                 # Reusable filter state extraction
    │   └── useMovie.ts                     # Movie detail fetch hook (before react-query)
    │
    ├── components/                         # Reusable UI components
    │   │
    │   ├── siteHeader/                     # (skill 14: responsive-site-header)
    │   │   └── index.tsx                   # AppBar + Toolbar, useMediaQuery, mobile menu
    │   │
    │   ├── movieCard/                      # (skill 2: props, skill 16: render-props)
    │   │   └── index.tsx                   # Card with typed props + action render prop
    │   │
    │   ├── movieList/                      # (skill 2: props-and-list-rendering)
    │   │   └── index.tsx                   # Grid of MovieCards via .map()
    │   │
    │   ├── movieDetails/                   # (skill 4: material-ui-basics)
    │   │   └── index.tsx                   # Full movie detail panel with MUI components
    │   │
    │   ├── movieReviews/                   # (skill 15: extended-link-routing)
    │   │   └── index.tsx                   # Review excerpts with Link state to full review
    │   │
    │   ├── headerMovieList/                # (skill 5: component-hierarchy)
    │   │   └── index.tsx                   # Title header for list pages
    │   │
    │   ├── filterMoviesCard/               # (skill 6: filtering-and-data-flow)
    │   │   └── index.tsx                   # Genre dropdown + title search, callbacks to parent
    │   │
    │   ├── cardIcons/                      # (skill 7: favourites-and-local-ui-state)
    │   │   ├── addToFavourites.tsx          # Heart icon → context addToFavourites
    │   │   ├── removeFromFavourites.tsx     # Remove icon → context removeFromFavourites
    │   │   ├── addToMustWatch.tsx           # Playlist icon for upcoming movies
    │   │   └── writeReview.tsx              # Pen icon → navigate to review form
    │   │
    │   ├── templateMovieListPage/          # (skill 11: refactoring-for-reuse)
    │   │   └── index.tsx                   # Shared list page layout: header + filter + grid
    │   │
    │   ├── templateMoviePage/              # (skill 13: component-composition)
    │   │   └── index.tsx                   # Shared detail layout with children prop
    │   │
    │   ├── reviewForm/                     # (skill 20: review-forms-with-react-hook-form)
    │   │   └── index.tsx                   # useForm + Controller + validation + submit
    │   │
    │   ├── spinner/                        # (skill 18: server-state-caching — loading state)
    │   │   └── index.tsx                   # CircularProgress spinner
    │   │
    │   ├── pagination/                     # Very Good tier — page controls
    │   │   └── index.tsx                   # Prev/Next + page number display
    │   │
    │   ├── actorCard/                      # (skill 2: props-and-list-rendering)
    │   │   └── index.tsx                   # Actor card with photo + name
    │   │
    │   ├── actorDetails/                   # (skill 4: material-ui-basics)
    │   │   └── index.tsx                   # Actor biography, filmography
    │   │
    │   ├── filterActorsCard/               # (skill 6: filtering-and-data-flow)
    │   │   └── index.tsx                   # Actor-specific filters
    │   │
    │   ├── tvSeriesCard/                   # (skill 2: props-and-list-rendering)
    │   │   └── index.tsx                   # TV series card
    │   │
    │   ├── tvSeriesDetails/                # (skill 4: material-ui-basics)
    │   │   └── index.tsx                   # TV series detail panel
    │   │
    │   ├── fantasyMovieForm/               # (skill 20 pattern: react-hook-form)
    │   │   └── index.tsx                   # Fantasy movie creation form
    │   │
    │   ├── playlistForm/                   # (skill 20 pattern: react-hook-form)
    │   │   └── index.tsx                   # Playlist creation form
    │   │
    │   └── protectedRoute/                 # Very Good tier — auth guard
    │       └── index.tsx                   # Redirects to /login if not authenticated
    │
    ├── pages/                              # (skill 5: component-hierarchy-and-page-assembly)
    │   │                                   # Each page assembles components into a complete view
    │   │
    │   │── homePage.tsx                    # Discover movies (TMDB /discover/movie)
    │   │── movieDetailsPage.tsx            # Movie detail + reviews (/movies/:id)
    │   │── movieReviewPage.tsx             # Full review (Link state from skill 15)
    │   │── addMovieReviewPage.tsx          # Review form page
    │   │── favouriteMoviesPage.tsx         # Favourites via useQueries (skill 19)
    │   │── upcomingMoviesPage.tsx           # Upcoming movies
    │   │── popularMoviesPage.tsx            # Popular movies (new list view)
    │   │── topRatedMoviesPage.tsx           # Top rated movies (new list view)
    │   │── nowPlayingMoviesPage.tsx         # Now playing movies (new list view)
    │   │── similarMoviesPage.tsx            # Similar movies (/movies/:id/similar)
    │   │── movieSearchPage.tsx              # Multi-criteria search form + results
    │   │── actorsPage.tsx                   # Popular actors list
    │   │── actorDetailsPage.tsx             # Actor bio + filmography (/actors/:id)
    │   │── tvSeriesPage.tsx                 # Popular TV series list
    │   │── tvSeriesDetailsPage.tsx          # TV series detail (/tv/:id)
    │   │── fantasyMoviePage.tsx             # Create fantasy movie form
    │   │── fantasyMovieListPage.tsx         # List user's fantasy movies
    │   │── fantasyMovieDetailsPage.tsx      # View one fantasy movie
    │   │── playlistsPage.tsx                # List user's playlists
    │   │── playlistDetailsPage.tsx          # View one playlist's movies
    │   │── loginPage.tsx                    # Auth signin form
    │   └── signupPage.tsx                   # Auth signup + confirm form
    │
    └── stories/                            # (skill 21: storybook-maintenance — optional)
        ├── movieCard.stories.tsx
        └── siteHeader.stories.tsx
```

---

## Route Table

```tsx
// src/App.tsx — (skill 10: routing-and-navigation)
<BrowserRouter>
  <SiteHeader /> {/* skill 14: responsive-site-header */}
  <MoviesContextProvider>
    {" "}
    {/* skill 17: context-for-shared-state */}
    <AuthContextProvider>
      <Routes>
        {/* ─── PUBLIC ROUTES ─── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/movies/:id" element={<MovieDetailsPage />} />
        <Route path="/movies/upcoming" element={<UpcomingMoviesPage />} />
        <Route path="/movies/popular" element={<PopularMoviesPage />} />
        <Route path="/movies/top-rated" element={<TopRatedMoviesPage />} />
        <Route path="/movies/now-playing" element={<NowPlayingMoviesPage />} />
        <Route path="/movies/:id/similar" element={<SimilarMoviesPage />} />
        <Route path="/actors" element={<ActorsPage />} />
        <Route path="/actors/:id" element={<ActorDetailsPage />} />
        <Route path="/tv" element={<TVSeriesPage />} />
        <Route path="/tv/:id" element={<TVSeriesDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* ─── PROTECTED ROUTES ─── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/movies/favourites" element={<FavouriteMoviesPage />} />
          <Route path="/reviews/:id" element={<MovieReviewPage />} />
          <Route path="/reviews/form" element={<AddMovieReviewPage />} />
          <Route path="/movies/search" element={<MovieSearchPage />} />
          <Route path="/fantasy-movies" element={<FantasyMovieListPage />} />
          <Route path="/fantasy-movies/new" element={<FantasyMoviePage />} />
          <Route
            path="/fantasy-movies/:id"
            element={<FantasyMovieDetailsPage />}
          />
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/playlists/:id" element={<PlaylistDetailsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthContextProvider>
  </MoviesContextProvider>
</BrowserRouter>
```

**Parameterised routes (Good tier):** `/movies/:id`, `/actors/:id`, `/tv/:id`, `/movies/:id/similar`, `/fantasy-movies/:id`, `/playlists/:id`, `/reviews/:id`

---

## Skill Application per Phase

### Phase 1: Scaffold & Foundation (Day 1)

**Skills applied:** 1 (vite-project-setup), 4 (material-ui-basics), 9 (openapi-type-layer)

- Install dependencies: `react-router-dom`, `@tanstack/react-query`, `@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/icons-material`, `react-hook-form`
- Create `.env` with `VITE_TMDB_KEY`
- Generate `tmdb.generated.ts` from TMDB OpenAPI spec
- Create `interfaces.ts` with local type aliases
- Create `theme.ts` with MUI theme
- Create `src/api/tmdb-api.ts` with all fetch functions
- Set up `QueryClientProvider` in `main.tsx`

### Phase 2: Core Movie Pages (Days 2-3)

**Skills applied:** 2 (props-and-list-rendering), 3 (state-and-effects), 5 (page-assembly), 6 (filtering), 7 (favourites), 8 (api-fetching), 10 (routing), 11 (refactoring), 12 (custom-hooks), 13 (composition), 14 (responsive-header), 16 (render-props), 17 (context), 18 (server-state-caching)

- Build all core components: movieCard, movieList, movieDetails, filterMoviesCard, cardIcons, siteHeader, spinner, templateMovieListPage, templateMoviePage
- Build pages: homePage, movieDetailsPage, favouriteMoviesPage, upcomingMoviesPage, popularMoviesPage, topRatedMoviesPage, nowPlayingMoviesPage
- Set up routing in App.tsx
- Set up MoviesContext for favourites/must-watch
- Replace `useEffect` fetching with `useQuery` throughout

### Phase 3: Additional Entities — Actors & TV Series (Day 4)

**Skills applied:** 2, 5, 6, 8, 10, 11, 18

- actorCard, actorDetails, filterActorsCard
- tvSeriesCard, tvSeriesDetails
- actorsPage, actorDetailsPage, tvSeriesPage, tvSeriesDetailsPage
- Reuse templateMovieListPage pattern for actors/TV grids

### Phase 4: Fantasy Movie (Day 5 basic, Days 9-10 advanced)

**Skills applied:** 20 (react-hook-form), 17 (context), 4 (material-ui)

- **Basic:** fantasyMovieForm with Title, Overview, Genres, Release Date, Runtime, Production Company(s)
- **Advanced:** Cast management (role name + description), poster upload
- fantasyMoviePage, fantasyMovieListPage, fantasyMovieDetailsPage

### Phase 5: Reviews & Extended Routing (Days 5-6)

**Skills applied:** 15 (extended-link-routing), 19 (parallel-queries), 20 (review-forms)

- reviewForm using react-hook-form
- movieReviews component with `<Link state={{ review, movie }}>` for full review navigation
- addMovieReviewPage, movieReviewPage
- favouriteMoviesPage using `useQueries` for parallel detail fetches

### Phase 6: Authentication & Protected Routes (Days 6-7)

**Skills applied:** 8 (api-fetching to backend), 10 (routing)

- authContext for token management
- `src/api/backend-api.ts` — signin, signup, confirm-signup endpoints
- loginPage, signupPage
- protectedRoute component wrapping private routes

### Phase 7: Advanced Features (Days 7-9)

**Skills applied:** 6, 12, 18

- **Pagination**: page parameter on all list pages, react-query `keepPreviousData`
- **Multi-criteria search**: movieSearchPage with genre, year, rating, language
- **Ordered favourites**: drag-reorder or manual up/down
- **Playlists**: playlistForm, playlistsPage, playlistDetailsPage
- **Favourite actors/TV series**: extend context

### Phase 8: Backend Persistence & Deployment (Days 10-14)

**Skills applied:** 8 (api-fetching to backend)

**New backend endpoints (Assignment 1 repo):**

| Endpoint                | Method | Auth | DynamoDB Pattern                       |
| ----------------------- | ------ | ---- | -------------------------------------- |
| `/favourites`           | GET    | ✅   | `PK: u#<email>`, `SK: fav#<movieId>`   |
| `/favourites`           | POST   | ✅   | Same                                   |
| `/favourites/{movieId}` | DELETE | ✅   | Same                                   |
| `/fantasy-movies`       | GET    | ✅   | `PK: u#<email>`, `SK: fantasy#<uuid>`  |
| `/fantasy-movies`       | POST   | ✅   | Same                                   |
| `/fantasy-movies/{id}`  | GET    | ✅   | Same                                   |
| `/fantasy-movies/{id}`  | DELETE | ✅   | Same                                   |
| `/playlists`            | GET    | ✅   | `PK: u#<email>`, `SK: playlist#<uuid>` |
| `/playlists`            | POST   | ✅   | Same                                   |
| `/playlists/{id}`       | PUT    | ✅   | Same                                   |
| `/playlists/{id}`       | DELETE | ✅   | Same                                   |

**Frontend:** Replace context storage with backend API calls via react-query mutations

**Deployment:**

- S3 bucket + CloudFront for frontend CDN
- CDK automated deployment

---

## Open Questions

> [!IMPORTANT]
> **Q1: TMDB API Key** — Do you have a TMDB API key? I'll need it for `.env`.

> [!IMPORTANT]
> **Q2: Backend Deployed?** — Is your Assignment 1 backend currently deployed to AWS? I need the API Gateway URL.

> [!NOTE]
> **Q3: Storybook** — Skill 21 covers Storybook maintenance. Do you want Storybook set up, or skip it and focus on features?

> [!NOTE]
> **Q4: OpenAPI generation** — Skill 9 uses generated types from the TMDB OpenAPI spec. I can either generate them from the official TMDB spec, or write manual interfaces. Which do you prefer?

---

## Verification Plan

### Per-Phase

- `npm run dev` → navigate all new pages, verify data loads
- `npm run build` → TypeScript compiles without errors
- Browser testing of auth flow, protected routes, form submissions

### End-to-End

- Full flow: signup → login → browse → favourite → review → fantasy movie → playlist → logout
- Responsive check at mobile/tablet/desktop widths
- CloudFront URL accessible publicly

---

## Timeline Summary

| Day   | What Gets Done                                | Grade Reached     |
| ----- | --------------------------------------------- | ----------------- |
| 1     | Scaffold, dependencies, types, theme, API     | —                 |
| 2-3   | Core movie pages, routing, filtering, caching | Good (40%)        |
| 4     | Actors + TV Series                            | Good (50%)        |
| 5     | Basic fantasy movie + reviews                 | Good (50%)        |
| 6-7   | Auth + protected routes                       | Very Good (55%)   |
| 7-8   | Pagination + multi-criteria search            | Very Good (65%)   |
| 8-9   | Ordered favs, playlists, fav actors/TV        | Excellent (75%)   |
| 9-10  | Advanced fantasy movie (cast + poster)        | Excellent (80%)   |
| 10-12 | Backend endpoints + persistence               | Outstanding (85%) |
| 13-14 | Deployment + polish                           | Outstanding (90+) |
| 15    | README, demo video, final commits             | —                 |
