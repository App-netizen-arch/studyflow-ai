# StudyFlow AI

> **Status: Prototype / In Progress**

StudyFlow AI is an early-stage study assistant concept that explores how a web application could turn a student's notes into structured summaries, key points, and interactive flashcards.

This repository represents the **frontend/product prototype and AI integration groundwork**. The project was not taken through to a fully deployed, production-ready AI product, so some documented capabilities remain planned or partially implemented.

## What is currently here

- Study dashboard and note-management experience
- Note creation, viewing, editing, and deletion flows
- UI for AI-assisted summaries, key points, and flashcards
- Responsive layouts for desktop, tablet, and mobile
- Accessible controls, focus states, validation, loading, empty, and error states
- Next.js/React application structure
- PostgreSQL/Prisma data-model groundwork
- Server-side Gemini integration groundwork using Google's `@google/genai` SDK

## Project Status

The repository should be understood as a **portfolio prototype**, not as a finished production AI application.

The AI layer was started but the project was not developed far enough to deliver a complete, production-ready end-to-end AI workflow in the deployed application.

This distinction is intentional so the repository accurately represents the current state of the work.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Zod
- Google Gemini SDK (`@google/genai`)

## Local Setup

A PostgreSQL database is required for the current project structure.

```bash
git clone https://github.com/App-netizen-arch/studyflow-ai.git
cd studyflow-ai
npm install
cp .env.example .env
```

Configure the environment variables required by the current codebase, then run:

```bash
npx prisma generate
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

The project is designed to keep provider credentials outside the repository.

```env
DATABASE_URL="your_postgresql_connection_string"
GEMINI_API_KEY="your_google_ai_studio_key"
GEMINI_MODEL="your_supported_gemini_model"
```

**Never commit real secrets or API keys to Git.**

## AI Integration

The repository contains groundwork for server-side Gemini integration. AI requests are intended to be handled through the server rather than exposing provider credentials in client components.

Because this project remains a prototype, AI functionality should not be assumed to be fully production-ready or equivalent to a deployed commercial AI service.

## Testing

```bash
npm test
npm run lint
npm run build
```

The repository includes tests for core validation and supported application behavior.

## Why this project exists

StudyFlow AI was built as an exploration of:

- AI-assisted study workflows
- full-stack application architecture
- structured AI output
- persistent data models
- product UX for educational software

The project may be extended in the future with real authentication, a complete production AI workflow, richer study modes, result versioning, and background processing.

## License

See the repository's license and dependency terms before redistributing the project or its third-party components.
