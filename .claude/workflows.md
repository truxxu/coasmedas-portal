# Development Workflows

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
yarn lint           # Check for linting errors
yarn build          # Ensure build succeeds
```
