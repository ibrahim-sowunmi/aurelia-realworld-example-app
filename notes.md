# Aurelia to Next.js Migration Notes

## Profile Component Migration

### Aurelia Implementation
- Three separate components:
  - `ProfileComponent` - Main profile with user info and tabs
  - `ProfileArticleComponent` - User's own articles
  - `ProfileFavoritesComponent` - User's favorited articles
- Uses nested routing with child routes for articles/favorites
- Uses dependency injection for ProfileService
- Has computed property `isUser` to check if viewing own profile
- Has method to toggle following status

### Next.js Implementation
- Created three client components:
  - `[username]/page.tsx` - Main profile component
  - `[username]/articles/page.tsx` - User's articles (nested route)
  - `[username]/favorites/page.tsx` - Favorited articles (nested route)
- Uses App Router for nested routes 
- Uses React hooks to fetch and manage profile data
- Replaces computed property with derived state
- Replaces DI with direct service imports and hooks
- Uses the shared ArticleList component

### Key Conversions
- `@inject(SharedState, ProfileService)` → Direct imports and useAuth() hook
- `activate(params)` → useEffect() with useParams()
- `@computedFrom()` → Simple derived value
- Aurelia binding (`if.bind`, etc.) → React conditional rendering
- Router configuration → App Router file-based routing
- Event handlers → React event handlers

## Authentication Protection

### Aurelia Implementation
- `AuthorizeStep` class in `src/app.js`
- Added to router pipeline with `config.addAuthorizeStep(AuthorizeStep)`
- Routes with `settings: {auth: true}` require authentication
- Redirects to login page if user is not authenticated

### Next.js Implementation
- Created a client `ProtectedRoute` component that:
  - Uses `useAuth()` hook to check `isAuthenticated` and `isLoading`
  - Redirects to `/login` if not authenticated
  - Shows loading state while checking authentication
  - Renders children only if authenticated
- Added layout components for protected routes:
  - `app/settings/layout.tsx`
  - `app/editor/[[slug]]/layout.tsx`
- Both layouts wrap their children with the `ProtectedRoute` component
- Protected routes work with the App Router structure
- Maintains the same behavior as the original Aurelia application

### Protected Routes
- `/settings` - User settings page
- `/editor/[[slug]]` - Create/edit article page (optional slug parameter)

## Home Component Analysis

### Source Files
- `src/components/home/home-component.js`
- `src/components/home/home-component.html`
- Uses `article-list` custom element

### Dependencies (DI)
- `SharedState` - global app state for authentication
- `BindingEngine` - for reactive updates
- `ArticleService` - article data fetching
- `TagService` - tag data fetching

### Properties
- `articles`: Article[] - current list of articles
- `shownList`: string - 'all' or 'feed' 
- `tags`: string[] - list of popular tags
- `filterTag`: string - currently selected tag filter
- `pageNumber`: number - current page
- `totalPages`: number[] - array of page numbers
- `currentPage`: number - active page
- `limit`: number - articles per page

### Lifecycle Hooks
- `bind()`: Subscribes to authentication state changes
- `unbind()`: Disposes subscription
- `attached()`: Fetches articles and tags

### Methods
- `getArticles()`: Fetches articles based on feed type, tag, page
- `getTags()`: Fetches popular tags
- `setListTo(type, tag)`: Changes feed type and/or tag filter
- `getFeedLinkClass()`: Manages feed tab styling
- `setPageTo(pageNumber)`: Changes page

### Template Bindings
- `if.bind="isAuthenticated"` - conditional Your Feed tab
- `repeat.for="tag of tags"` - tag list rendering
- `click.delegate="setListTo('all')"` - tab click handler
- `class.bind="getFeedLinkClass()"` - dynamic class
- `article-list` element with bound properties

### Next.js Implementation

#### Component Structure
- Client component with React hooks
- ArticleList and ArticlePreview child components
- State managed with useState
- Side effects with useEffect

#### Key Conversions
1. **DI Injection** → Direct imports and hooks
   - `SharedState` → `useAuth()` hook 
   - `ArticleService` → Direct import
   - `TagService` → Direct import
   - `BindingEngine` → React's useState/useEffect

2. **Lifecycle Hooks**
   - `bind()/unbind()` → useEffect with cleanup
   - `attached()` → useEffect for initial data fetching

3. **Template Conversions**
   - `if.bind` → `{condition && <Component/>}`
   - `repeat.for` → `{array.map(item => ...)}`
   - `click.delegate` → `onClick={handler}`
   - `${variable}` → `{variable}`
   - Custom element → React component

4. **State Management**
   - Two-way binding → Controlled components
   - Observable properties → useState
   - Side effects → useEffect with dependencies

## Auth Component Analysis

### Source Files
- `src/components/auth/auth-component.js`
- `src/components/auth/auth-component.html`
- No separate CSS file

### Component Structure
**Single component handles both login and register** based on `type` property from route config.

### Dependencies (DI)
- `UserService` - handles authentication API calls
- `SharedState` - global app state (not directly used in component, but UserService updates it)
- `Router` - navigation after successful auth

### Properties
- `type`: 'login' | 'register' (set from route config name)
- `username`: string (only for register)
- `email`: string
- `password`: string
- `errors`: object | null (API error messages)

### Lifecycle Hooks
- `activate(params, routeConfig)`: Sets `type` from `routeConfig.name`
- `determineActivationStrategy()`: Returns `activationStrategy.replace` to force component recreation when switching between login/register

### Computed Properties
- `canSave`: Returns boolean based on form validity
  - Login: requires email && password
  - Register: requires username && email && password

### Methods
- `submit()`: Calls `userService.attemptAuth(type, credentials)`, navigates to home on success, displays errors on failure

### Template Bindings
- `if.bind="type === 'register'"` - conditional username field
- `if.bind="type === 'login'"` - conditional link text
- `value.bind` - two-way binding for form inputs
- `click.trigger="submit()"` - form submission
- `disabled.bind="!canSave"` - button state
- `repeat.for="error of controller.errors"` - error list (seems unused based on .js code)
- `repeat.for="key of errors | keys"` - error object display

### Migration Strategy for Next.js

#### Approach
Create separate login and register page components that share a common form component.

#### Component Structure
```
app/
  login/page.tsx - client component with auth check redirect
  register/page.tsx - client component with auth check redirect
  components/
    AuthForm.tsx - shared form component
```

#### Key Conversions
1. **DI Injection** → Direct imports and Context hooks
   - `UserService` → `userService` direct import
   - `SharedState` → `useAuth()` hook from AuthContext
   - `Router` → `useRouter()` from Next.js

2. **Lifecycle Hooks**
   - `activate()` → Not needed, type determined by route/page
   - `determineActivationStrategy()` → Not needed in Next.js

3. **Two-way Binding** → Controlled components
   - `value.bind="email"` → `value={email} onChange={e => setEmail(e.target.value)}`

4. **Computed Properties** → useMemo or inline logic
   - `canSave` → `const canSave = useMemo(...)` or inline check

5. **Template Conditionals**
   - `if.bind="type === 'register'"` → `{type === 'register' && <input ... />}`
   - `repeat.for="key of errors | keys"` → `{Object.keys(errors).map(key => ...)}`

#### State Management
- Use `useState` for form fields (username, email, password)
- Use `useState` for errors
- Use `useAuth()` from AuthContext for login/register methods
- Use `useRouter()` for navigation after successful auth

#### Auth Check
- Both pages should redirect to home if already authenticated
- Use `useAuth()` to check `isAuthenticated` in `useEffect`
