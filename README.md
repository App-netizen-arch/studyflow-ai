# StudyFlow AI

StudyFlow AI is a focused full-stack study assistant that turns a student's notes into structured summaries, key points, and interactive flashcards. It is designed as a portfolio-quality demonstration of frontend engineering, backend APIs, persistent data, AI integration, validation, and product UX.

## Features

- Note editor with title, subject, word/character counts, and persistent storage
- AI operations: Summary, Key Points, Flashcards
- Structured JSON generation with Gemini on the server
- Dashboard with search, recent notes, and meaningful study statistics
- Interactive flashcards with flip, progress, keyboard-accessible controls, and difficulty/topic labels
- Full note CRUD: create, view, edit, delete
- Retry/regenerate and copy result actions
- Loading, empty, validation, provider, and rate-limit states
- Responsive layouts for desktop, tablet, and mobile
- Accessible labels, focus states, semantic controls, and reduced-motion support

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS 4, Prisma, PostgreSQL, Zod, and Google's `@google/genai` SDK. The AI layer is isolated in `lib/ai.ts` so another provider can be introduced without changing the UI or data model.

## Local setup

A PostgreSQL database is required for the current production-ready setup. Neon is a convenient hosted option, and Docker/Postgres works locally as well.

```bash
git clone https://github.com/App-netizen-arch/studyflow-ai.git
cd studyflow-ai
npm install
cp .env.example .env
```

Set `DATABASE_URL` to your PostgreSQL connection string and add your Gemini API key, then run:

```bash
npx prisma generate
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

### Environment variables

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
GEMINI_API_KEY="your_google_ai_studio_key"
GEMINI_MODEL="gemini-2.5-flash"
```

`OPENAI_API_KEY` and `ANTHROPIC_API_KEY` are reserved for future provider adapters. No provider secret is read by client components.

## AI architecture

The route `/api/ai/[operation]` validates the operation and note ownership, applies a lightweight per-IP request limit, then calls the server-side provider adapter. Gemini is asked for `application/json` plus a response schema, so the app stores typed structured data instead of parsing arbitrary prose.

## Database architecture

The app uses Prisma with PostgreSQL. The initial schema lives in `prisma/migrations/20260818_init/migration.sql`, and the build process runs `prisma migrate deploy` before the Next.js build so a configured production database is brought up to date automatically.

The production database connection is intentionally external to the repository. On Vercel, provision a PostgreSQL database through a marketplace provider such as Neon and bind its connection string to the project's `DATABASE_URL` environment variable.

## Deployment

1. Provision a PostgreSQL database for the project.
2. Add `DATABASE_URL` and `GEMINI_API_KEY` to the Vercel **Production** environment.
3. Redeploy `main`. The build runs Prisma migrations automatically.
4. Verify `/api/notes` returns HTTP 200 from the deployed site.

Keep secrets out of Git. The repository only contains `.env.example`.

## Testing

```bash
npm test
npm run lint
npm run build
```

The included tests cover note validation and supported AI operations. The critical end-to-end path is: create note → generate result → persist result → refresh/reopen note → use result UI.

## Portfolio talking points

This project demonstrates:

- Full-stack Next.js App Router architecture
- Server-side AI integration with structured output
- API validation and consistent error contracts
- Prisma relational schema and PostgreSQL persistence
- UX state design for loading, failure, empty, and success states
- Responsive/accessibility-conscious UI engineering
- Basic abuse protection and secret handling

## Known limitations

Authentication is intentionally kept lightweight in v1 through a demo workspace user so the core product remains easy to run. A production deployment should replace this with a real authenticated user/session layer.

## Future improvements

A natural next iteration would add real authentication, richer flashcard study modes, result versioning, and background generation jobs for very large notes.
