# CLAUDE.md

## Project Overview
TypeScript library for programmatically generating MIDI files. Builds to CJS, ESM, and browser IIFE via Rollup.

## Commands
- `npm run build` — build with Rollup
- `npm test` — build + run Mocha tests with NYC coverage
- `npm run lint:js` — ESLint
- `npm run watch` — watch mode

Only run tests when explicitly asked.

## Architecture
- Entry point: `src/main.ts`
- Source organized into `src/chunks/`, `src/midi-events/`, `src/meta-events/`
- Interface-based design: `AbstractEvent`, `Chunk`, `MetaEvent`, `MidiEvent`
- Tests in `test/` use Mocha + Node assert, import from compiled build (`build/index.js`)
- Tests validate output by comparing base64-encoded MIDI strings
- VexFlow integration (`src/vexflow.ts`) is experimental — treat with caution

## Code Conventions
- **Tabs** for indentation (4-space width), LF line endings
- PascalCase classes, camelCase methods/properties, UPPER_SNAKE_CASE constants
- kebab-case filenames
- Named exports from modules, default export object from `main.ts`
- JSDoc comments on public APIs
- No Prettier — ESLint only

## Key Patterns
- New event types should mirror existing ones in their category
- `Track.addEvent()` supports method chaining (returns `this`)
- Single production dependency: `@tonaljs/midi` for note name → MIDI number conversion

## Dependencies
- TypeScript 5, Rollup 2, Mocha 9, NYC 15
