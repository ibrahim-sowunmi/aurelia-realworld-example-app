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
