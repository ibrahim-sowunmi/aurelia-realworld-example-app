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
