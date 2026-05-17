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

### Good (40-50%)

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

All remote data fetched via **TanStack React Query** with caching and filtering.

#### Parameterised Routes

`/movies/:id` · `/actors/:id` · `/tv/:id` · `/playlists/:id`

#### Data Hyperlinking

- Genre chips on movie detail page link back to the home page with that genre pre-selected
- Actor cards link to actor detail pages
- TV series cards link to series detail pages
- Playlist movie cards link to movie detail pages

---

### Very Good (50-70%)

#### Pagination

Home, Actors, TV Series pages support pagination:

#### Multi-Criteria Search (Home page)

| Filter             | Control               |
| ------------------ | --------------------- |
| Title search       | Text input            |
| Genres             | Multi-checkbox select |
| Sort by            | Dropdown              |
| Vote average       | Min/max number inputs |
| Release date range | From/to date pickers  |

#### Private & Public Routes

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
- Email confirmation
- Sign in returns a JWT stored in `localStorage`
- All protected API calls include `Authorization: Bearer <token>`
- Custom Lambda authorizer validates the JWT against the Cognito JWKS endpoint
- Assignment 1 integration

#### AWS S3 Integration

When a user selects a poster image, the frontend calls POST /upload/presigned-url to request a pre-signed S3 upload URL from Lambda. The browser then uploads the image directly to S3.

#### Frontend CDN - AWS CloudFront

The production build is deployed to an **S3 bucket** and served through **CloudFront** for global edge caching.

---

### Excellent (70-90%)

#### Ordered Favourites — Drag & Drop

Both the Favourite Actors and Favourite TV Series pages use `@hello-pangea/dnd` for drag-and-drop reordering.

#### Themed Movie Playlists

- Create a new playlist
- Add any movie to any playlist from its card (dropdown menu on the card)
- Playlist detail page fetches all movies
- Delete individual playlists

#### Fantasy Movie — Advanced

Form supports:

- **Cast members** — dynamic list with Actor Name (required), Role Name (required), and Description
- **Poster upload** — drag-and-drop image upload directly to S3

#### Persist Movie Reviews to DynamoDB

- Reviews are written to DynamoDB via `POST /movies/reviews` (AWS Lambda + API Gateway)
- Reviews are fetched per movie via `GET /movies/{movieId}/reviews`
- The review form appears on the Movie Detail page (protected route)

#### Fullstack Deployment

| Component      | Platform                                                    |
| -------------- | ----------------------------------------------------------- |
| Frontend       | AWS S3 + CloudFront                                         |
| Auth API       | AWS Lambda + API Gateway + Cognito                          |
| App API        | AWS Lambda + API Gateway + DynamoDB                         |
| Poster storage | AWS S3 (presigned URL)                                      |
| IaC            | AWS CDK v2 (two stacks: `AuthApiStack`, `Assignment1Stack`) |

---

### Outstanding (90+)

#### Backend Persistence via New API Endpoints

All user data is persisted to **DynamoDB** through dedicated Lambda endpoints:

| Data                  | Endpoint                                          |
| --------------------- | ------------------------------------------------- |
| Favourite actors & TV | `GET/PUT /user/favourites`                        |
| Playlists             | `GET/PUT /user/playlists`                         |
| Fantasy movies        | `GET/PUT /user/fantasy-movies`                    |
| Movie reviews         | `GET /movies/{id}/reviews` `POST /movies/reviews` |

### SDD

I used Claude then I create folder ./skills and update all the lab skills in that folder and ask Claude to generate the SDD based on those skills. The SDD is located at [./SDD.md](./SDD.md).

## AI Usage

See [AI_USAGE.md](./AI_USAGE.md) for full documentation of AI tool usage during development.
