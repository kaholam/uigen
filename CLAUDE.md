# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run setup         # First-time setup: install deps, generate Prisma client, run migrations
npm run dev           # Start dev server with Turbopack at http://localhost:3000
npm run build         # Production build
npm run lint          # ESLint
npm run test          # Vitest unit tests
npm run db:reset      # Reset SQLite database
```

To run a single test file:
```bash
npx vitest run src/path/to/file.test.ts
```

Environment: copy `.env.example` to `.env` and add `ANTHROPIC_API_KEY`. Without a key, the app uses a mock provider that returns static responses.

## Architecture

UIGen is a Next.js 15 app where users describe React components in chat and see them rendered live. The key architectural idea is a **virtual file system** — all generated code lives in memory; nothing is written to disk.

### Data Flow

1. User types in the chat panel (`src/components/chat/`)
2. Message is sent to `src/app/api/chat/route.ts` (streaming API route)
3. The route calls Claude with a system prompt (`src/lib/prompts/generation.tsx`) and two tools:
   - `str_replace_editor` — create/view/edit files in the virtual FS
   - `file_manager` — rename/delete files
4. Claude streams tool calls back; the client applies them to the virtual file system (`src/lib/file-system.ts`)
5. The preview panel (`src/components/preview/`) re-renders the virtual FS as a live component

### Key Files

| File | Role |
|------|------|
| `src/app/api/chat/route.ts` | Main AI integration; sets up tools and calls Claude |
| `src/lib/provider.ts` | Initializes the Anthropic model (`claude-haiku-4-5`); falls back to mock if no API key |
| `src/lib/file-system.ts` | In-memory virtual FS class used by AI tools and the editor |
| `src/lib/prompts/generation.tsx` | System prompt that instructs Claude how to generate components |
| `src/lib/tools/` | Tool implementations (`str_replace_editor`, `file_manager`) |
| `src/lib/contexts/` | `FileSystemContext` and `ChatContext` manage shared client-side state |
| `src/app/main-content.tsx` | Top-level layout: chat panel (left) + preview/editor tabs (right) |
| `prisma/schema.prisma` | SQLite schema: `User` → `Project` (stores serialized FS + message history as JSON) |

### State Management

- `FileSystemContext` — holds the virtual file tree; updated when AI tools run
- `ChatContext` — holds chat history and current project metadata
- Projects are persisted to SQLite (Prisma) for authenticated users; anonymous sessions track usage via `src/lib/anon-work-tracker.ts`

### UI Layout

Uses `react-resizable-panels` for the split layout. The right panel toggles between:
- **Preview** — `PreviewFrame` renders component output
- **Code** — `FileTree` + Monaco editor (`@monaco-editor/react`)

shadcn/ui (New York style, Lucide icons) is used throughout. Path alias `@/*` maps to `src/*`.

## Database Schema

The full schema is in `prisma/schema.prisma`. Reference it when working with anything database-related. Key models:

- **User** — `id`, `email`, `password`, `projects[]`
- **Project** — `id`, `name`, `userId` (optional), `messages` (JSON string, default `[]`), `data` (serialized virtual FS, default `{}`)

## Preferences

- Use comments sparingly. Only comment complex code.
