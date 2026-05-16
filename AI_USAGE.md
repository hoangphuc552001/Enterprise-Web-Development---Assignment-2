# AI Usage Documentation

## Tool Used

**Claude Code** (Anthropic) — an AI coding assistant integrated directly into the development environment via the Claude Code CLI.

---

## Overview

AI assistance was used selectively during this project, primarily for tasks that involved integrating AWS infrastructure (which has a steep configuration surface area) and debugging low-level runtime errors. Core application logic, component design, routing structure, and UI decisions were developed independently first, with AI used to accelerate specific implementation steps.

---

## Tasks AI Assisted With

### 1. S3 Poster Upload Flow

**What was asked:** Design and implement an image upload flow where the user picks an image in the Fantasy Movie form, it gets uploaded to AWS S3, and the resulting URL is stored as the poster path.

**What AI did:**

- Proposed the presigned URL architecture (browser → Lambda for presigned URL → browser PUT directly to S3)
- Generated the `PosterUpload.tsx` React component (drag-and-drop, preview, upload status states)
- Generated the `generatePresignedUrl.ts` Lambda handler
- Added S3 bucket CDK construct with CORS config and public-read policy
- Added the `POST /upload/presigned-url` API Gateway route to `app-api.ts`
- Added `getPresignedUploadUrl` and `uploadFileToS3` functions to `user-api.ts`

**How I reviewed it:**

- Read through every generated file before accepting it
- Ran `tsc --noEmit` to verify TypeScript compilation
- Tested the upload flow in the browser — selected a file, watched the presigned URL request in the Network tab, confirmed the S3 PUT succeeded and the image URL rendered in the form preview
- Checked the S3 bucket in the AWS console to confirm the object was created

**Issues found during testing:**

- The Lambda crashed on first invocation with `Cannot find module '@smithy/core/protocols'`. I reported the error to the AI; it diagnosed the cause (Lambda runtime ships older `@smithy/*` than `@aws-sdk/client-s3` v3.1048 requires) and fixed the CDK bundling config to bundle all AWS SDK packages rather than marking them as external

### 2. CDK Infrastructure for S3

**What was asked:** Add the necessary CDK constructs (S3 bucket, IAM permissions, Lambda, API route) to support the poster upload endpoint.

**What AI did:**

- Added `import * as s3` and `import * as iam` to `app-api.ts`
- Created `createPostersBucket()` method in the CDK construct
- Created `createPresignedUrlFn()` method with appropriate IAM grant (`bucket.grantPut`)
- Wired the new Lambda into `createApiGateway()` and added the route

**How I reviewed it:**

- Read the full diff in `app-api.ts` before deploying
- Ran `cdk deploy Assignment1Stack` and watched the CloudFormation changeset — confirmed only the expected resources were created (S3 bucket, IAM role, Lambda, API Gateway resources)
- Verified in AWS console: bucket existed, CORS rules were set, Lambda had the correct environment variables

### 3. Debugging the `@smithy/core/protocols` Runtime Error

**What was asked:** The deployed Lambda returned `Internal server error`. I checked CloudWatch logs and found `Cannot find module '@smithy/core/protocols'`.

**What AI did:**

- Explained that the Lambda Node.js 22 runtime ships an older version of `@smithy/*` that does not include the `protocols` sub-path export required by `@aws-sdk/client-s3` v3.1048+
- Changed the bundling config for `GeneratePresignedUrlFn` from `externalModules: ["shared", "@aws-sdk/client-s3", "@smithy/*"]` to `externalModules: ["shared"]`, so esbuild bundles the correct versions

**How I reviewed it:**

- Re-deployed and confirmed the Lambda initialised cleanly (no errors in CloudWatch)
- Successfully tested the presigned URL endpoint end to end

### 4. Protected Routes Audit & Fix

**What was asked:** Review all routes in `App.tsx` and identify which ones should be protected but aren't.

**What AI did:**

- Identified 5 routes (`/fantasy`, `/fantasy/new`, `/fav-actors`, `/fav-tv`, `/playlists`) that called authenticated APIs but lacked `ProtectedRoute` wrappers
- Also identified a bug: `/playlists` appeared twice — the unprotected version on line 60 shadowed the protected version below it, so `/playlists` was never actually gated
- Applied the fix: wrapped all 5 routes in `ProtectedRoute` and removed the duplicate

**How I reviewed it:**

- Read the before/after diff in `App.tsx`
- Tested manually: opened `/fantasy` while logged out → confirmed redirect to `/login` with return URL preserved → logged in → confirmed redirect back to `/fantasy`

---

## Parts of the Solution Significantly Influenced by AI

| Component / File                         | AI Influence                                   | My Contribution                               |
| ---------------------------------------- | ---------------------------------------------- | --------------------------------------------- |
| `PosterUpload.tsx`                       | High — component structure and logic generated | Reviewed, tested, accepted linter fixes       |
| `lambdas/generatePresignedUrl.ts`        | High — Lambda handler generated                | Reviewed logic, tested live                   |
| `lib/constructs/app-api.ts` (S3 section) | High — CDK constructs generated                | Reviewed changeset, verified in AWS console   |
| `src/api/user-api.ts` (upload functions) | Medium — two functions added                   | Reviewed and understood presigned URL pattern |
| `App.tsx` (route protection)             | Medium — fix identified and applied            | Manually tested redirect behaviour            |
| All other files                          | None — developed independently                 | Full authorship                               |

---

## Parts Developed Without AI

The following were developed independently without AI assistance:

- All page components (`homePage`, `movieDetailPage`, `actorsPage`, `actorDetailPage`, `tvSeriesPage`, `tvSeriesDetailPage`, `fantasyMoviePage`, `fantasyMovieFormPage`, `playlistsPage`, `playlistDetailsPage`, auth pages)
- All custom hooks (`useFantasyMovies`, `useFavouriteActors`, `useFavouriteTvSeries`, `usePlaylists`, `useDebounce`)
- Authentication context and flow (`AuthContext.tsx`, `ProtectedRoute.tsx`)
- All TMDB API integration (`tmdb-api.ts`)
- Multi-criteria filtering and pagination on the home page
- Drag-and-drop ordered favourites
- Playlist management (creation, deletion, add/remove movies)
- Movie reviews (form, display, DynamoDB persistence)
- Site navigation and overall app layout
- All Assignment 1 backend Lambda handlers (reviews, favourites, playlists, fantasy movies, auth)

---

## Chat History

The full AI chat history for this project is included in the repository at `ai_chat_history.txt`.

---

## Reflection

Using AI for infrastructure tasks (CDK, S3, IAM) significantly reduced the time spent reading AWS documentation for configuration that follows well-established patterns. For the debugging session, AI was able to diagnose a non-obvious runtime error (SDK version mismatch between bundled vs runtime packages) faster than manual investigation would have.

In all cases, I read the generated code before accepting it, ran type-checks and live tests, and was prepared to explain every line. The core application features — components, hooks, routing, filtering, drag-and-drop, playlists — were written by hand and reflect my own understanding of the React ecosystem.
