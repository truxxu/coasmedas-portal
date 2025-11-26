# Coding Standards

## TypeScript Guidelines
- Use strict TypeScript types - avoid `any`
- Prefer interfaces for object shapes, types for unions/intersections
- Use path aliases (`@/`) for all imports outside current directory

## Component Guidelines
- Follow Atomic Design pattern strictly:
  - **Atoms**: No dependencies on other components
  - **Molecules**: Combine only atoms
  - **Organisms**: Combine molecules and atoms
- Export components from index.ts in each directory
- Use functional components with TypeScript interfaces for props

## Naming Conventions
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Files: Match component name
- Hooks: camelCase starting with `use` (e.g., `useAuth.ts`)
- Constants: UPPER_SNAKE_CASE

## Styling
- Use Tailwind CSS classes - avoid inline styles or CSS modules
- Follow existing theme variables in `globals.css`
- Mobile-first responsive design
- Use semantic color names from theme system
