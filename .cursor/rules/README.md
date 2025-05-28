# Cursor Rules

This directory contains project-specific rules for AI assistance in our codebase.

## Rules Structure

- `api-services.mdc`: Standards for API service files
  - Applies to: `src/services/*.ts`
  - Covers: Type safety, error handling, configuration, and authentication

- `components.mdc`: General React component standards
  - Applies to: `src/components/*.tsx`
  - Covers: Component structure, props, state management, styling, and event handling

- `lead-components.mdc`: Lead-specific component standards
  - Applies to: `src/components/Lead*.tsx`, `src/components/Filter*.tsx`
  - Covers: LeadCard, Filter components, shared styling, and type definitions

## How to Use

1. The rules are automatically applied when working with matching files
2. You can reference rules manually using `@rule-name` in your prompts
3. Rules help maintain consistency across the codebase

## Adding New Rules

1. Create a new `.mdc` file in this directory
2. Add metadata section with description and globs
3. Document standards and provide examples
4. Reference any template files using `@filename`

## Rule Categories

### API Services
- Type safety and error handling
- Authentication and headers
- Configuration management
- Response handling

### React Components
- Component structure
- Props and TypeScript
- State management
- Styling with Tailwind
- Event handling

### Lead Components
- LeadCard standards
- Filter component patterns
- Shared styling
- Type definitions
- Best practices 