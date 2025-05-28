# Multi-Tenant React Application

This is a React application built with TypeScript and Tailwind CSS that demonstrates multi-tenancy capabilities. The application can serve different content, styling, and configurations based on the domain/hostname.

## Features

- Multi-tenant support based on domain/hostname
- TypeScript for type safety
- Tailwind CSS for styling
- Responsive design
- Tenant-specific theming
- Context-based tenant management

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

To start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Multi-Tenant Configuration

The application supports multiple tenants through the `src/config/tenants.ts` file. Each tenant can have its own:

- Theme colors
- Logo
- Name
- Domain configuration

To test different tenants locally:
1. Add entries to your hosts file mapping different domains to localhost
2. Configure the domains in `src/config/tenants.ts`
3. Access the application using the configured domains

## Project Structure

```
src/
├── contexts/          # React contexts including TenantContext
├── types/            # TypeScript type definitions
├── config/           # Configuration files including tenant configs
├── components/       # React components
└── App.tsx          # Main application component
```

## Customization

To add a new tenant:
1. Add the tenant configuration to `src/config/tenants.ts`
2. Add any tenant-specific assets (logos, etc.)
3. The application will automatically handle the new tenant based on the domain

## Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## License

MIT
