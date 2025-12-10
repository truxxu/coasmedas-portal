# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Portal Transaccional Coasmedas** - A Next.js 16 portal application using App Router, TypeScript, Tailwind CSS v4, and Atomic Design component architecture. The project is in early development stages with infrastructure configured but minimal implementation.

**Backend API**: This portal consumes the Coasmedas Banking API (REST). See API documentation in `.claude/knowledge/api/`

## Development Commands

### Running the Application
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Key Development Notes
- **Language**: Project uses Spanish (lang="es") for content
- **Node Version**: Requires Node.js >=18
- **Package Manager**: npm

## Architecture

### Next.js App Router (v16)
This project uses the **App Router** (not Pages Router):
- Routes are defined in `/app` directory using file-based routing
- `app/layout.tsx` provides root layout with metadata and fonts
- `app/page.tsx` maps to `/` route
- New routes: create `app/[route-name]/page.tsx`
- API routes: create in `app/api/[endpoint]/route.ts`

### Component Structure: Atomic Design Pattern
Components follow Atomic Design methodology in `/src`:

```
src/
├── atoms/       # Basic building blocks (Button, Input, Label, etc.)
├── molecules/   # Simple combinations of atoms (SearchBar, FormField, etc.)
└── organisms/   # Complex sections (Navbar, Forms, Tables, etc.)
```

**Import Path**: Use `@/` alias for root imports:
```typescript
import { Button } from "@/src/atoms";
import { SearchBar } from "@/src/molecules";
```

### Styling with Tailwind CSS v4
- Global styles in `/app/globals.css`
- Uses new Tailwind v4 syntax: `@import "tailwindcss"`
- Theme variables defined in `:root` for light/dark mode
- CSS variables: `--background`, `--foreground`, `--font-sans`, `--font-mono`
- Dark mode enabled via `prefers-color-scheme`

### TypeScript Configuration
- **Path Alias**: `@/*` maps to root directory
- **Strict Mode**: Enabled
- **Target**: ES2017
- **JSX**: React 19 transform

### Current State
The project has infrastructure configured but component directories (`atoms/`, `molecules/`, `organisms/`) are currently empty placeholders. When implementing new features, follow the Atomic Design pattern and create components at the appropriate level.

## Tech Stack
- **Next.js**: 16.0.3 (App Router)
- **React**: 19.2.0
- **TypeScript**: ^5
- **Tailwind CSS**: ^4
- **ESLint**: ^9 with Next.js configuration

## Important Patterns
- Components should be created following Atomic Design hierarchy
- Use App Router conventions for routing and layouts
- Leverage TypeScript path aliases for clean imports
- Follow Tailwind CSS v4 theme system for styling consistency

---

## Additional Guidelines

@.claude/coding-standards.md
@.claude/workflows.md
@.claude/documentation-policy.md
@.claude/design-system.md

## Backend API Documentation

@.claude/knowledge/api/README.md

## Features

### Prehome Landing Page
@.claude/knowledge/features/00-prehome/spec.md
@.claude/knowledge/features/00-prehome/references.md
@.claude/knowledge/features/00-prehome/implementation-plan.md


- do not run the app by yourself, nor build it nor run automated tests. Also, do not make commits