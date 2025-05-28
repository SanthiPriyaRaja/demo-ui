# Multi-Tenant React Login Application

A production-ready React application with authentication and multi-tenancy support built with TypeScript, Tailwind CSS, and React Router.

## Features

- 🔐 **Authentication System**: Login/logout with form validation
- 🏢 **Multi-tenancy**: Support for multiple tenants via subdomain or query parameters
- 🎨 **Modern UI**: Beautiful interface built with Tailwind CSS
- 🛡️ **Protected Routes**: Route protection based on authentication state
- 📱 **Responsive Design**: Mobile-first responsive design
- 🔄 **State Management**: Context-based state management for auth and tenants
- 🌐 **API Integration**: Axios-based API service with tenant-aware configuration

## Project Structure

```
src/
├── assets/                 # Static assets
├── components/
│   └── ui/                # Reusable UI components
│       ├── Button.tsx     # Button component with variants
│       └── Input.tsx      # Input component with validation
├── features/
│   ├── auth/              # Authentication feature
│   │   └── AuthContext.tsx
│   └── tenant/            # Multi-tenancy feature
│       └── TenantContext.tsx
├── hooks/                 # Custom React hooks
│   └── useTenant.ts
├── pages/                 # Page components
│   ├── Login.tsx          # Login page
│   └── Dashboard.tsx      # Protected dashboard
├── routes/                # Routing configuration
│   ├── AppRouter.tsx      # Main router
│   └── ProtectedRoute.tsx # Route protection
├── services/              # External services
│   └── api.ts             # Axios API service
├── utils/                 # Utility functions
│   └── tenant.ts          # Tenant parsing utilities
├── App.tsx                # Main app component
└── main.tsx               # App entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd demo-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Authentication

**Demo Credentials:**
- Email: `admin@example.com`
- Password: `password`

### Multi-tenancy

The application supports multi-tenancy in two ways:

1. **Query Parameter**: Add `?tenant=demo` to any URL
   - Example: `http://localhost:5173/?tenant=demo`
   - Example: `http://localhost:5173/dashboard?tenant=test`

2. **Subdomain** (for production): 
   - `demo.yourdomain.com`
   - `test.yourdomain.com`

### Available Tenants

- `default` - Default Tenant
- `tenant1` - Tenant 1 (maps to `technxt` in API)
- `tenant2` - Tenant 2 (maps to `iorta` in API)
- `demo` - Demo Tenant  
- `test` - Test Tenant
- `technxt` - TechNXT (direct mapping)
- `iorta` - Iorta (direct mapping)

### Tenant Mapping

The application includes a tenant mapping system that converts frontend tenant names to backend tenant IDs:

| Frontend Tenant | Backend API Tenant ID |
|----------------|----------------------|
| `tenant1`      | `technxt`           |
| `tenant2`      | `iorta`             |
| `default`      | `default`           |
| `demo`         | `demo`              |
| `test`         | `test`              |
| `technxt`      | `technxt`           |
| `iorta`        | `iorta`             |

This mapping is handled automatically in the API service via the `getTenantApiId()` function in `src/utils/tenant.ts`.

### Testing Multi-tenancy

1. Visit `http://localhost:5175/register` (note: port may vary)
2. **Test Tenant Dropdown:**
   - Select "Tenant 1 (TechNXT)" from the dropdown
   - Notice the badge shows "tenant1 → technxt"
   - Fill out the registration form and submit
   - Check browser console: `API Request - Frontend Tenant: tenant1, Backend Tenant ID: technxt`
   - Verify in Network tab: `x-tenant-id: technxt` header is sent

3. **Test Different Tenants:**
   - Try selecting "Tenant 2 (Iorta)" → should send `x-tenant-id: iorta`
   - Try "Demo Tenant" → should send `x-tenant-id: demo`

4. **URL-based Testing:**
   - Visit `http://localhost:5175/?tenant=tenant1`
   - Notice the dropdown pre-selects "Tenant 1 (TechNXT)"
   - Login with demo credentials or try registration

5. **Dashboard Testing:**
   - Use the "Switch Tenant" buttons to change tenants
   - Verify the tenant mapping in the browser's Network tab

## Key Components

### Authentication Context (`src/features/auth/AuthContext.tsx`)
- Manages user authentication state
- Provides login/logout functionality
- Handles token storage in localStorage
- Tenant-aware user sessions

### Tenant Context (`src/features/tenant/TenantContext.tsx`)
- Manages current tenant state
- Provides tenant switching functionality
- Integrates with API service for tenant-specific requests

### API Service (`src/services/api.ts`)
- Axios-based HTTP client
- Automatic tenant header injection
- JWT token management
- Error handling and redirects

### Tenant Utilities (`src/utils/tenant.ts`)
- Parse tenant from subdomain or query parameters
- Generate tenant-specific API URLs
- URL manipulation for tenant switching

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://api.example.com
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment Considerations

### Multi-tenant Subdomain Setup

For production subdomain-based multi-tenancy:

1. Configure your DNS to point `*.yourdomain.com` to your server
2. Set up your web server (nginx/Apache) to handle wildcard subdomains
3. Update the `getTenantFromSubdomain` function if needed

### Environment Configuration

- Set `VITE_API_BASE_URL` to your production API endpoint
- Configure tenant-specific API endpoints in `getTenantApiUrl`
- Update authentication endpoints in the AuthContext

## Security Features

- JWT token storage in localStorage
- Automatic token cleanup on logout
- Tenant isolation (auth state cleared on tenant switch)
- Protected routes with automatic redirects
- Form validation and error handling

## Customization

### Adding New Tenants

1. Update the `availableTenants` array in `TenantContext.tsx`
2. Add tenant-specific configuration in `tenant.ts`
3. Update API endpoints if needed

### Styling

The application uses Tailwind CSS. Customize the design by:
- Modifying component classes
- Updating the Tailwind configuration
- Adding custom CSS in `src/index.css`

### API Integration

Replace the mock authentication in `AuthContext.tsx` with real API calls:

```typescript
const login = async (email: string, password: string) => {
  const response = await apiService.post('/auth/login', { email, password });
  // Handle real API response
};
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

### Registration with Tenant Selection

The registration page now includes a tenant dropdown that allows users to:

1. **Select their tenant** from a dropdown menu
2. **See real-time mapping** - the UI shows both frontend tenant name and backend API ID
3. **Submit registration** with the correct tenant header

**Available Tenant Options:**
- Tenant 1 (TechNXT) → `x-tenant-id: technxt`
- Tenant 2 (Iorta) → `x-tenant-id: iorta`  
- Demo Tenant → `x-tenant-id: demo`
- Test Tenant → `x-tenant-id: test`
- Default Tenant → `x-tenant-id: default`

The selected tenant is automatically passed in the `x-tenant-id` header when making the registration API call.

### Testing Multi-tenancy
