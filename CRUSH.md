CRUSH guide for this repo (React 19 + Vite 6 + TypeScript 5)

Build/run
- Install: npm install
- Dev server: npm run dev
- Production build: npm run build
- Preview build: npm run preview

Typecheck/lint/test
- Typecheck: npx tsc -p tsconfig.json --noEmit
- Lint: no linter configured; if ESLint is added, use: npx eslint . --ext .ts,.tsx
- Tests: no test runner configured; recommended Vitest. Examples (when vitest is installed):
  - All tests: npx vitest
  - Single file: npx vitest run path/to/file.test.ts
  - Single test by name: npx vitest -t "test name substring"

Code style
- Imports: use named imports; prefer import type { X } from '...'; keep relative paths. A TS path alias @/* exists but avoid using it unless Vite tsconfig-paths is configured.
- Formatting: Prettier defaults (2 spaces, semicolons, single quotes, trailing commas where valid). JSX self-close when possible.
- Types: avoid any; prefer interfaces for object shapes and type for unions. Components as React.FC<Props> with explicit prop types.
- Naming: PascalCase for components/types; camelCase for variables/functions; booleans start with is/has/can; event handlers prefixed handle; custom hooks start with use.
- Error handling: wrap JSON/localStorage access in try/catch; guard DOM queries (e.g., root element) and early-return on invalid input; fail soft and log once.
- React patterns: prefer useCallback/useMemo for stable deps; exhaustive deps in hooks; functional state updates; keep derived values memoized.
- Accessibility: provide aria-labels for icon-only buttons; keep interactive elements keyboard-accessible.

Repository conventions
- No Cursor/Copilot rules found. If .cursor/rules/* or .github/copilot-instructions.md are added, follow them and update this file.
- Secrets: store in .env.local (README mentions GEMINI_API_KEY). Do not log secrets or commit .env files.
