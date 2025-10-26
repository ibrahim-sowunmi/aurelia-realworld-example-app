# Migration Notes

## Service Layer Migration - COMPLETE ✓

**Date**: October 26, 2025

All services from `src/shared/services/` have been successfully migrated to `nextjs-migration/lib/services/` with complete parity:

### Migrated Services

1. **Article Service** (`articles.ts`)
   - ✓ getList(type, params) - fetch articles or feed
   - ✓ getArticle(slug) - fetch single article
   - ✓ createArticle(data) - create new article
   - ✓ updateArticle(slug, data) - update existing article
   - ✓ deleteArticle(slug) - delete article
   - ✓ favoriteArticle(slug) - favorite article
   - ✓ unfavoriteArticle(slug) - unfavorite article

2. **Profile Service** (`profiles.ts`)
   - ✓ getProfile(username) - fetch user profile
   - ✓ followProfile(username) - follow user
   - ✓ unfollowProfile(username) - unfollow user

3. **Comment Service** (`comments.ts`)
   - ✓ getComments(slug) - fetch article comments
   - ✓ createComment(slug, data) - add comment to article
   - ✓ deleteComment(slug, commentId) - delete comment

4. **Tag Service** (`tags.ts`)
   - ✓ getList() - fetch all tags

5. **User Service** (`user.ts`)
   - ✓ getCurrentUser() - fetch current user
   - ✓ login(credentials) - authenticate user
   - ✓ register(credentials) - register new user
   - ✓ updateUser(userData) - update user profile
   - ✓ logout() - clear authentication

### Implementation Details

All services follow the established pattern from `lib/api.ts`:
- Use the `api` helper for HTTP requests
- Properly typed with TypeScript interfaces from `@/types`
- Authentication headers automatically handled via `jwtService.getAuthorizationHeader()`
- Async/await pattern for all operations
- Exported as object literals (not classes) for easier consumption in React hooks

### Verification

Compared each TypeScript service with its Aurelia counterpart:
- All methods from Aurelia services are present in Next.js versions
- API endpoints match exactly
- Request/response handling is equivalent
- Type safety is enforced through TypeScript interfaces

---

## Shared State Migration - COMPLETE ✓

**Date**: October 26, 2025

The Aurelia SharedState singleton has been successfully replaced with React Context API in `nextjs-migration/contexts/AuthContext.tsx`.

### Aurelia SharedState (`src/shared/state/shared-state.js`)

Simple singleton class with:
- `currentUser` - User instance holding authentication data
- `isAuthenticated` - Boolean flag for auth status
- Uses `BindingEngine.propertyObserver` for reactive updates
- Injectable singleton pattern

### Next.js AuthContext (`contexts/AuthContext.tsx`)

Comprehensive React Context implementation providing:
- ✓ `user` state - Replaces `currentUser` (User | null)
- ✓ `isAuthenticated` - Computed from `!!user`
- ✓ `isLoading` - Loading state for async operations
- ✓ `login()` - Authenticate user and save token
- ✓ `register()` - Register new user and save token
- ✓ `logout()` - Clear user data and token
- ✓ `updateUser()` - Update user profile
- ✓ `populate()` - Load current user from token on mount

### Migration Details

**Replaced Patterns:**
- Singleton DI → React Context API
- `BindingEngine.propertyObserver` → `useState` + `useEffect`
- Direct property mutation → Immutable state updates
- Manual subscription management → Automatic re-rendering via hooks

**Improvements:**
- Type safety with TypeScript interfaces
- Automatic token validation on app load
- Loading states for better UX
- Built-in error handling
- Clean separation of concerns
- Easy consumption via `useAuth()` hook

### Verification

- ✓ All SharedState properties mapped to AuthContext
- ✓ Property observer pattern replaced with React hooks
- ✓ No other shared state files found in Aurelia project
- ✓ AuthContext integrated with userService and jwtService
- ✓ Custom hook (`useAuth()`) prevents context usage errors
