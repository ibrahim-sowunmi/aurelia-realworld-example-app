# Aurelia to Next.js Migration Notes

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
