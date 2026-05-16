# Enterprise Web Development — Assignment 2

## Student Information

| Field          | Value                                              |
| -------------- | -------------------------------------------------- |
| **Name**       | Hoang Phuc Le                                      |
| **Student ID** | 20115747                                           |
| **Email**      | 20115747@setu.ie                                   |
| **Course**     | MSc Computer Science — Enterprise Software Systems |

---

## Deployment URLs

| Environment                  | URL                                                                         |
| ---------------------------- | --------------------------------------------------------------------------- |
| Vercel (frontend, dev proxy) | https://enterprise-web-development-assignme.vercel.app/                     |
| AWS S3 Static Hosting        | http://tmdb-app-assignment2-hoangphucle.s3-website-us-east-1.amazonaws.com/ |
| AWS CloudFront (CDN)         | https://d1mogd19ctoyib.cloudfront.net/                                      |
| AWS API Gateway (App API)    | https://ia6fqqgrrb.execute-api.us-east-1.amazonaws.com/dev                  |
| AWS API Gateway (Auth API)   | https://nrh7wfd204.execute-api.us-east-1.amazonaws.com/dev                  |

---

## Tech Stack

| Layer         | Technology                                 |
| ------------- | ------------------------------------------ |
| UI Framework  | React 19 + TypeScript                      |
| Routing       | React Router v7                            |
| State / Cache | TanStack React Query v5                    |
| UI Components | Material UI v9                             |
| Forms         | React Hook Form v7                         |
| Drag & Drop   | @hello-pangea/dnd                          |
| Build Tool    | Vite                                       |
| Backend       | AWS Lambda (Node.js 22) + API Gateway      |
| Database      | AWS DynamoDB                               |
| Auth          | AWS Cognito (via custom Lambda authorizer) |
| File Storage  | AWS S3 (presigned URL upload)              |
| CDN           | AWS CloudFront                             |
| IaC           | AWS CDK v2                                 |

---

## Running Locally

### Prerequisites

- Node.js 18+
- A TMDB API key (https://www.themoviedb.org/settings/api)

### Frontend setup

```bash
# Clone the repo
git clone https://github.com/hoangphuc552001/Enterprise-Web-Development---Assignment-2
cd Enterprise-Web-Development---Assignment-2

# Install dependencies
npm install

# Create environment file
echo "VITE_TMDB_KEY=your_tmdb_key_here" > .env

# Start the development server (port 3001)
npm run dev
```

The Vite dev server proxies `/api/tmdb` requests to a local proxy server on port 5000, or you can point it at the deployed Vercel edge function.

### Backend (Assignment 1)

The backend is already deployed to AWS. To deploy changes yourself:

```bash
cd ../assignment1
npm install
npx cdk deploy Assignment1Stack
```

---

## Application Features

### Good tier — Foundation (40–50%)

#### New Views / Pages (15 total)

| Page               | Route            | Description                                   |
| ------------------ | ---------------- | --------------------------------------------- |
| Home               | `/`              | Movie discovery with multi-criteria filtering |
| Movie Detail       | `/movies/:id`    | Full movie info, reviews, add to playlist     |
| Actors             | `/actors`        | Paginated popular actors listing              |
| Actor Detail       | `/actors/:id`    | Actor bio, birthday, known-for                |
| TV Series          | `/tv`            | Paginated TV series listing                   |
| TV Series Detail   | `/tv/:id`        | Series info, genres, seasons                  |
| Fantasy Movies     | `/fantasy`       | List of user-created fantasy movies           |
| Fantasy Movie Form | `/fantasy/new`   | Create a new fantasy movie                    |
| Favourite Actors   | `/fav-actors`    | Drag-and-drop ordered list                    |
| Favourite TV       | `/fav-tv`        | Drag-and-drop ordered list                    |
| Playlists          | `/playlists`     | Manage themed playlists                       |
| Playlist Detail    | `/playlists/:id` | View all movies in a playlist                 |
| Login              | `/login`         | Sign in with Cognito                          |
| Sign Up            | `/signup`        | Register new account                          |
| Confirm            | `/confirm`       | Email confirmation code                       |

#### Additional Data Entities

- **Actor** — profile image, biography, birthday, place of birth, known-for department
- **TV Series** — poster, backdrop, genres, seasons, air dates, production companies

#### Server State Caching

All remote data fetched via **TanStack React Query** with automatic background refetch, stale-while-revalidate, and per-query cache keys (including page number and filter params).

#### Parameterised Routes

`/movies/:id` · `/actors/:id` · `/tv/:id` · `/playlists/:id`

#### Data Hyperlinking

- Genre chips on movie detail page link back to the home page with that genre pre-selected
- Actor cards link to actor detail pages
- TV series cards link to series detail pages
- Playlist movie cards link to movie detail pages

---

### Very Good tier — Adapt & Experiment (50–70%)

#### Pagination

All listing pages support pagination:

- **Home** — up to 500 pages of movie results (TMDB max)
- **Actors** — paginated popular actors
- **TV Series** — paginated discover results

Each page change scrolls to top and updates the React Query cache key so results are cached per page.

#### Multi-Criteria Search (Home page)

| Filter             | Control               | Notes                                |
| ------------------ | --------------------- | ------------------------------------ |
| Title search       | Text input            | 500 ms debounce                      |
| Genres             | Multi-checkbox select | AND filter                           |
| Sort by            | Dropdown              | Popularity or release date, asc/desc |
| Vote average       | Min/max number inputs | 500 ms debounce                      |
| Release date range | From/to date pickers  | 500 ms debounce                      |

When a title search is active, sort is automatically disabled (TMDB constraint).  
Any filter change resets pagination to page 1.

#### Private & Public Routes

All routes that require authentication are wrapped in `ProtectedRoute`. Unauthenticated users are redirected to `/login` with the original URL preserved as location state, so they land back on the right page after signing in.

| Protected        | Public     |
| ---------------- | ---------- |
| `/movies/:id`    | `/`        |
| `/actors/:id`    | `/actors`  |
| `/tv/:id`        | `/tv`      |
| `/fantasy`       | `/login`   |
| `/fantasy/new`   | `/signup`  |
| `/fav-actors`    | `/confirm` |
| `/fav-tv`        |            |
| `/playlists`     |            |
| `/playlists/:id` |            |

#### Authentication — AWS Cognito

- Sign up with username, email and password
- Email confirmation via 6-digit code
- Sign in returns a JWT stored in `localStorage`
- All protected API calls include `Authorization: Bearer <token>`
- Custom Lambda authorizer validates the JWT against the Cognito JWKS endpoint

#### Third-Party Service Integration — AWS S3

Poster image upload in the Fantasy Movie form:

1. User picks a file (drag-and-drop or browse)
2. Frontend calls `POST /upload/presigned-url` → Lambda generates a 60-second pre-signed S3 PUT URL
3. Browser uploads the file **directly to S3** (no data passes through Lambda)
4. The permanent S3 URL is stored as `posterPath` on the fantasy movie record

#### Frontend CDN — AWS CloudFront

The production build is deployed to an **S3 bucket** and served through **CloudFront** for global edge caching. A separate Vercel deployment handles the TMDB API proxy edge function.

---

### Excellent tier — Independent Learner (70–90%)

#### Ordered Favourites — Drag & Drop

Both the Favourite Actors and Favourite TV Series pages use `@hello-pangea/dnd` for drag-and-drop reordering. The new order is persisted to DynamoDB immediately on drop via the `PUT /user/favourites` endpoint.

#### Themed Movie Playlists

- Create a playlist with a **name** and **theme description**
- Each playlist stores an array of movie IDs
- Add any movie to any playlist from its card (dropdown menu on the card)
- Movies already in a playlist are shown as disabled with an "(Added)" label
- Playlist detail page fetches all movies in parallel with `useQueries` and renders them as a full `MovieList`
- Delete individual playlists

#### Fantasy Movie — Advanced

Beyond the basic fields (Title, Overview, Genres, Release Date, Runtime, Production Companies), the form also supports:

- **Cast members** — dynamic list with Actor Name (required), Role Name (required), and Description
- **Poster upload** — drag-and-drop image upload directly to S3 (JPEG/PNG/WebP/GIF, max 5 MB) with live preview and upload status indicator

#### Persist Movie Reviews to DynamoDB

- Reviews are written to DynamoDB via `POST /movies/reviews` (AWS Lambda + API Gateway)
- Each review stores `movieId`, `date` (YYYY-MM-DD), and `text`
- Reviews are fetched per movie via `GET /movies/{movieId}/reviews`
- The review form appears on the Movie Detail page (protected route)
- React Query invalidates the reviews cache on successful submission

#### Fullstack Deployment

| Component      | Platform                                                    |
| -------------- | ----------------------------------------------------------- |
| Frontend       | AWS S3 + CloudFront                                         |
| Auth API       | AWS Lambda + API Gateway + Cognito                          |
| App API        | AWS Lambda + API Gateway + DynamoDB                         |
| Poster storage | AWS S3 (presigned URL)                                      |
| IaC            | AWS CDK v2 (two stacks: `AuthApiStack`, `Assignment1Stack`) |

---

### Outstanding tier (90+)

#### Backend Persistence via New API Endpoints

All user data is persisted to **DynamoDB** through dedicated Lambda endpoints:

| Data                  | Endpoint                                          | DynamoDB Key                      |
| --------------------- | ------------------------------------------------- | --------------------------------- |
| Favourite actors & TV | `GET/PUT /user/favourites`                        | `PK: u#{email}` `SK: favourites`  |
| Playlists             | `GET/PUT /user/playlists`                         | `PK: u#{email}` `SK: playlists`   |
| Fantasy movies        | `GET/PUT /user/fantasy-movies`                    | `PK: u#{email}` `SK: fantasy`     |
| Movie reviews         | `GET /movies/{id}/reviews` `POST /movies/reviews` | `PK: m#{movieId}` `SK: r#{email}` |

---

## API Reference

### TMDB API (proxied)

All calls go through `/api/tmdb` (Vercel edge function or local proxy on port 5000).

| Function                 | TMDB Endpoint       |
| ------------------------ | ------------------- |
| `getMovies(params)`      | `/discover/movie`   |
| `getMovie(id)`           | `/movie/{id}`       |
| `getPopularActors(page)` | `/person/popular`   |
| `getDiscoverTv(page)`    | `/discover/tv`      |
| `getActor(id)`           | `/person/{id}`      |
| `getTvSeries(id)`        | `/tv/{id}`          |
| `getGenres()`            | `/genre/movie/list` |

### App API (AWS Lambda)

Base URL: `https://ia6fqqgrrb.execute-api.us-east-1.amazonaws.com/dev`

All endpoints require `Authorization: Bearer <token>` except where noted.

| Method | Path                    | Description                         |
| ------ | ----------------------- | ----------------------------------- |
| GET    | `/user/favourites`      | Get favourite actor & TV IDs        |
| PUT    | `/user/favourites`      | Update favourite actor & TV IDs     |
| GET    | `/user/playlists`       | Get all playlists                   |
| PUT    | `/user/playlists`       | Replace all playlists               |
| GET    | `/user/fantasy-movies`  | Get fantasy movie list              |
| PUT    | `/user/fantasy-movies`  | Replace fantasy movie list          |
| GET    | `/movies/{id}/reviews`  | Get reviews for a movie (public)    |
| POST   | `/movies/reviews`       | Add a review                        |
| PUT    | `/movies/{id}/reviews`  | Update a review                     |
| POST   | `/upload/presigned-url` | Get S3 presigned PUT URL for poster |

### Auth API (AWS Cognito)

Base URL: `https://nrh7wfd204.execute-api.us-east-1.amazonaws.com/dev`

| Method | Path                   | Description             |
| ------ | ---------------------- | ----------------------- |
| POST   | `/auth/signup`         | Register new user       |
| POST   | `/auth/confirm-signup` | Confirm email with code |
| POST   | `/auth/signin`         | Sign in, returns JWT    |

---

## Project Structure

```
src/
├── api/               # API call functions
│   ├── auth-api.ts    # Cognito auth endpoints
│   ├── reviews-api.ts # Movie reviews endpoints
│   ├── tmdb-api.ts    # TMDB movie/actor/TV endpoints
│   └── user-api.ts    # User data + S3 upload endpoints
├── components/        # Reusable UI components
│   ├── ActorCard.tsx
│   ├── ActorList.tsx
│   ├── MovieCard.tsx
│   ├── MovieList.tsx
│   ├── MovieReviews.tsx
│   ├── PageHeader.tsx
│   ├── PosterUpload.tsx
│   ├── ProtectedRoute.tsx
│   ├── ReviewForm.tsx
│   ├── SiteNavigation.tsx
│   ├── TvSeriesCard.tsx
│   └── TvSeriesList.tsx
├── contexts/
│   └── AuthContext.tsx # Auth state (token, username, login/logout)
├── hooks/             # Custom React hooks
│   ├── useDebounce.ts
│   ├── useFantasyMovies.ts
│   ├── useFavouriteActors.ts
│   ├── useFavouriteTvSeries.ts
│   └── usePlaylists.ts
├── pages/             # Route-level page components
├── types/
│   └── interfaces.ts  # TypeScript interfaces
└── App.tsx            # Route definitions
```

---

## AI Usage

See [AI_USAGE.md](./AI_USAGE.md) for full documentation of AI tool usage during development.
