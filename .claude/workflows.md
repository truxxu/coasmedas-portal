# Development Workflows

## Adding Dependencies

**IMPORTANT**: Do NOT run `npm install` commands directly.

When new dependencies are needed:
1. Add them to `package.json` manually in the appropriate section
2. User will install them later with `npm install`
3. Document the reason for the dependency in comments if needed

Example:
```json
{
  "dependencies": {
    "react-hook-form": "^7.49.0",  // Form state management
    "yup": "^1.3.0"                // Schema validation
  }
}
```

## Adding New Components

### Creating an Atom
```bash
# Create component file in src/atoms/
# Update src/atoms/index.ts to export it
```

### Creating a Molecule
```bash
# Create component file in src/molecules/
# Import only from @/src/atoms
# Update src/molecules/index.ts to export it
```

### Creating an Organism
```bash
# Create component file in src/organisms/
# Import from @/src/atoms and @/src/molecules
# Update src/organisms/index.ts to export it
```

## Adding New Routes
```bash
# Create app/[route-name]/page.tsx
# Optional: Create app/[route-name]/layout.tsx for route-specific layout
```

## Adding API Endpoints
```bash
# Create app/api/[endpoint]/route.ts
# Export GET, POST, PUT, DELETE, etc. handlers
```

## Before Committing
```bash
npm run lint        # Check for linting errors
npm run build       # Ensure build succeeds
```
