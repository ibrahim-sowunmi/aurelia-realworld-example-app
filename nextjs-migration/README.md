# Next.js 15 Migration

This directory contains the Next.js 15 migration of the Aurelia RealWorld (Conduit) application. The migration follows a phased approach where both applications coexist during the transition period.

## 📋 Migration Status

### ✅ Completed
- **Home Page** (`app/home/page.tsx`)
  - Article feed with pagination
  - Tag filtering from sidebar
  - Global Feed tab
  - Empty state handling
  - Fully styled with RealWorld CSS

- **Global Layout** (`app/layout.tsx`)
  - Header with navigation (authenticated/unauthenticated states)
  - Footer with attribution
  - AuthProvider context for global authentication state
  - CDN-linked styles (Ionicons, Google Fonts, RealWorld CSS)

- **Service Layer Integration**
  - `lib/services/articles.ts` - Article fetching with pagination
  - `lib/services/tags.ts` - Popular tags fetching
  - `lib/config.ts` - API configuration (https://api.realworld.show/api)

- **State Management**
  - Migrated from Aurelia's `BindingEngine` to React hooks (`useState`, `useEffect`)
  - `AuthContext` for global authentication state (replaces `SharedState`)

- **Routing**
  - App Router with file-system based routing
  - Redirect from root (`/`) to `/home`
  - Dynamic routes for articles and profiles

### 🚧 Placeholder Routes (Not Yet Implemented)
- `/login` - Sign in form
- `/register` - Sign up form
- `/article/[slug]` - Article detail page with comments
- `/profile/[username]` - User profile with articles/favorites tabs
- `/settings` - User settings page
- `/editor` - Article creation/editing page

## 🚀 Getting Started

### Prerequisites
- Node.js 24.1.0+ (managed via nvm)
- npm or pnpm

### Installation

1. Navigate to the nextjs-migration directory:
```bash
cd nextjs-migration
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the Next.js development server (runs on port 3001):
```bash
npm run dev
```

The app will be available at: http://localhost:3001

### Production Build

Build the production-ready application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

### Type Checking

Verify TypeScript compilation without emitting files:
```bash
npx tsc --noEmit
```

## 📂 Project Structure

```
nextjs-migration/
├── app/                      # Next.js App Router pages
│   ├── home/                # Home page with article feed
│   ├── article/[slug]/      # Article detail (placeholder)
│   ├── profile/[username]/  # User profile (placeholder)
│   ├── login/               # Login page (placeholder)
│   ├── register/            # Register page (placeholder)
│   ├── layout.tsx           # Root layout with Header/Footer
│   └── page.tsx             # Root page (redirects to /home)
├── components/              # Shared React components
│   ├── Header.tsx           # Navigation header
│   └── Footer.tsx           # Site footer
├── contexts/                # React Context providers
│   └── AuthContext.tsx      # Authentication state
├── lib/                     # Shared utilities and services
│   ├── services/            # API service layer
│   │   ├── articles.ts      # Article operations
│   │   └── tags.ts          # Tag operations
│   └── config.ts            # API configuration
├── types/                   # TypeScript type definitions
│   └── index.ts             # Shared types (Article, User, etc.)
└── screenshots/             # Migration comparison screenshots
    └── migration_comparison.md
```

## 🔄 Aurelia vs Next.js Comparison

| Feature | Aurelia | Next.js 15 |
|---------|---------|-----------|
| **State Management** | `BindingEngine`, `SharedState` | React hooks, `AuthContext` |
| **Routing** | Centralized router config | File-system based App Router |
| **Templates** | Separate `.html` files | JSX/TSX inline |
| **Data Binding** | Two-way binding (`value.bind`) | Controlled components |
| **Lifecycle** | `activate`, `attached`, `unbind` | `useEffect` hooks |
| **DI** | Constructor injection | React Context, props |
| **Components** | Class-based with decorators | Functional components |

## 🧪 Testing

### Manual Testing Checklist
- [ ] Home page loads with articles
- [ ] Pagination works correctly
- [ ] Tag filtering updates the feed
- [ ] Empty state displays when no articles
- [ ] Navigation links work
- [ ] Responsive layout on mobile
- [ ] Consistent styling with Aurelia version

### Running Both Apps Side-by-Side

**Aurelia (port 8080):**
```bash
cd ~/repos/aurelia-realworld-example-app
npx au run --watch
```

**Next.js (port 3001):**
```bash
cd ~/repos/aurelia-realworld-example-app/nextjs-migration
npm run dev
```

Compare: http://localhost:8080 vs http://localhost:3001/home

## 📝 Migration Notes

### Key Decisions
- **API Endpoint**: Changed from `api.realworld.io/api` to `api.realworld.show/api`
- **Styling**: Using CDN-linked RealWorld CSS (`demo.productionready.io/main.css`)
- **No Test Framework**: Following playbook guidance to avoid unnecessary refactors
- **Coexistence Strategy**: Next.js app lives in `nextjs-migration/` subdirectory

### Known Issues / Future Work
- Path import inconsistency (mix of `../` and `@/` aliases)
- Placeholder routes need full implementation
- Authentication flow not yet implemented
- No automated component tests

## 🔗 Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [RealWorld API Spec](https://realworld-docs.netlify.app/specifications/backend/endpoints/)
- [Aurelia Documentation](https://aurelia.io/docs)
- [Migration Playbook](../docs/migration-playbook.md) (if exists)

## 👥 Contributors

- Developed by Devin AI
- Requested by Ibrahim Sowunmi (@ibrahim-sowunmi)
- Link to Devin run: https://app.devin.ai/sessions/aa9711b86ab443f3a7f440632cd8a61b

---

**Next Steps:**
1. Implement authentication (login/register pages)
2. Migrate article detail page with comments
3. Migrate user profile pages
4. Implement article editor
5. Add middleware for route protection
6. Consider adding automated tests
