# Aurelia to Next.js Migration Notes

## Auth Component Analysis (login/register)

### Location
- Aurelia: `src/components/auth/auth-component.js` + `auth-component.html`
- Next.js Target: `nextjs-migration/app/login/page.tsx` and `nextjs-migration/app/register/page.tsx`

### Injected Services
- `UserService` - handles authentication (attemptAuth method)
- `SharedState` - global state management
- `Router` - navigation

### Component State
- `type` - 'login' or 'register' (set from route config)
- `username` - only for register
- `email` - for both login and register
- `password` - for both login and register
- `errors` - validation/API errors

### Lifecycle Hooks
- `determineActivationStrategy()` - returns activationStrategy.replace (forces component recreation)
- `activate(params, routeConfig)` - sets type based on routeConfig.name

### Computed Properties
- `canSave` getter - validates required fields based on type
  - login: email && password
  - register: username && email && password

### Methods
- `submit()` - submits credentials to userService.attemptAuth, navigates to home on success, displays errors on failure

### Template Bindings
- `if.bind="type === 'login'"` / `if.bind="type === 'register'"` - conditional rendering
- `repeat.for="error of controller.errors"` - error list iteration
- `repeat.for="key of errors | keys"` - error object iteration with keys value converter
- `value.bind="username"` - two-way binding for username input
- `value.bind="email"` - two-way binding for email input
- `value.bind="password"` - two-way binding for password input
- `click.trigger="submit()"` - form submission
- `disabled.bind="!canSave"` - button disabled state
- `route-href="route: login"` / `route-href="route: register"` - navigation links
- String interpolation: `${type === 'login' ? 'in' : 'up'}`

### Conversion Plan for React

1. Split into two separate components: LoginPage and RegisterPage
2. Replace UserService injection with useAuth() hook from AuthContext
3. Replace Router navigation with Next.js useRouter()
4. Replace SharedState with AuthContext
5. Convert two-way bindings to controlled inputs with useState
6. Convert activate() to useEffect or remove (type can be determined by which page file)
7. Convert canSave getter to useMemo or inline computation
8. Convert template syntax to JSX
9. Handle errors with useState
10. Use the existing userService from lib/services/user.ts

## Home Component Analysis

### Location
- Aurelia: `src/components/home/home-component.js` + `src/components/home/home-component.html`
- Next.js Target: `nextjs-migration/app/page.tsx`

### Injected Services
- `SharedState` - for checking authentication status
- `BindingEngine` - for observing property changes
- `ArticleService` - for fetching articles
- `TagService` - for fetching tags

### Component State
- `articles` - array of articles to display
- `shownList` - current feed view ('all' or 'feed')
- `tags` - array of popular tags
- `filterTag` - optional tag to filter articles by
- `pageNumber`, `totalPages`, `currentPage`, `limit` - pagination state

### Lifecycle Hooks
- `bind()` - sets up a subscription to `sharedState.isAuthenticated`
- `unbind()` - cleans up the subscription
- `attached()` - calls `getArticles()` and `getTags()` to load initial data

### Methods
- `getArticles()` - fetches articles based on current filters and pagination
- `getTags()` - fetches popular tags
- `setListTo(type, tag)` - changes the feed view (all/feed) and tag filter
- `getFeedLinkClass()` - returns CSS classes for the feed tab based on auth state
- `setPageTo(pageNumber)` - changes pagination and reloads articles

### Template Bindings
- `if.bind="sharedState.isAuthenticated"` - conditional rendering of Your Feed tab
- `class.bind="shownList === 'feed' && !filterTag ? ' active' : ''"` - dynamic class binding
- `click.delegate="setListTo('feed')"` - event delegation
- `if.bind="filterTag"` - conditional rendering of tag filter
- `repeat.for="tag of tags"` - iteration for tag list
- `articles.bind="articles"` - binding to custom element
- `total-pages.bind="totalPages"` - binding to custom element
- `set-page-cb.call="setPageTo(pageNumber)"` - callback binding to custom element
- `${filterTag}` - string interpolation

### Custom Elements
- `<article-list>` - component to display article list with pagination

### Conversion Plan for React
1. Create a functional HomePage component 
2. Use React hooks to replace DI:
   - `useAuth()` for authentication state
   - `useState()` for local state (articles, shownList, etc.)
   - `useEffect()` for data fetching on mount
3. Import services directly instead of injecting them
4. Convert template to JSX:
   - `if.bind` → conditional rendering with `&&` or ternary
   - `repeat.for` → `map()`
   - `click.delegate` → `onClick`
   - `class.bind` → computed className or conditional classes
5. Create a separate ArticleList component
6. Handle data fetching with useEffect or React Query
7. Convert property binding to props passing
8. Add proper TypeScript types for all props and state
