# Aurelia Home Component Analysis

## Component Location
- **Path**: `src/components/home/`
- **Files**: 
  - `home-component.js` (84 lines) - Component logic
  - `home-component.html` (58 lines) - Template

## Injected Services & Dependencies
```javascript
@inject(SharedState, BindingEngine, ArticleService, TagService)
```

**Services:**
- `SharedState` - Global state management (isAuthenticated, currentUser)
- `BindingEngine` - Aurelia's property observer for reactive subscriptions
- `ArticleService` - Article CRUD operations (getList, get, create, update, destroy, favorite, unfavorite)
- `TagService` - Tag operations (getList)

## @bindable Properties (Inputs)
- **None** - This is a page component, not a reusable custom element, so it has no @bindable inputs

## State Properties
```javascript
articles = [];           // Array of article objects to display
shownList = 'all';       // Feed type: 'all' or 'feed'
tags = [];               // Array of popular tag strings
filterTag = undefined;   // Optional tag filter
currentPage = 1;         // Current pagination page
limit = 10;              // Articles per page
totalPages;              // Calculated array of page numbers
```

## Lifecycle Hooks

### bind()
- **Purpose**: Subscribe to authentication state changes
- **Implementation**: Uses BindingEngine.propertyObserver to watch SharedState.isAuthenticated
- **Cleanup**: Stores subscription for later disposal

### unbind()
- **Purpose**: Cleanup subscriptions when component is destroyed
- **Implementation**: Calls subscription.dispose()

### attached()
- **Purpose**: Fetch initial data when component mounts to DOM
- **Implementation**: 
  - Calls getArticles() to fetch article feed
  - Calls getTags() to fetch popular tags

## Methods & Event Handlers

### getArticles()
- **Purpose**: Fetch articles based on current feed type, pagination, and filters
- **Parameters**: Uses component state (shownList, currentPage, limit, filterTag)
- **Implementation**: 
  - Builds params object with limit/offset for pagination
  - Optionally adds tag filter
  - Calls articleService.getList(shownList, params)
  - Updates articles array and calculates totalPages

### getTags()
- **Purpose**: Fetch popular tags for sidebar
- **Implementation**: Calls tagService.getList() and updates tags array

### setListTo(type, tag)
- **Purpose**: Switch between feed types and apply tag filters
- **Parameters**: 
  - type: 'feed' or 'all'
  - tag: optional tag string
- **Guards**: Prevents 'feed' access if not authenticated
- **Implementation**: Updates shownList and filterTag, then calls getArticles()

### getFeedLinkClass()
- **Purpose**: Calculate CSS classes for feed link
- **Returns**: String with 'disabled' if not authenticated, 'active' if showing feed

### setPageTo(pageNumber)
- **Purpose**: Handle pagination navigation
- **Implementation**: Updates currentPage and calls getArticles()

## Template Bindings

### Conditional Rendering (if.bind)
```html
<li if.bind="sharedState.isAuthenticated">       <!-- Show "Your Feed" tab only when authenticated -->
<li if.bind="filterTag">                          <!-- Show tag filter pill when active -->
<div if.bind="tags.length === 0">                 <!-- Show "No tags" message when empty -->
```

### Dynamic Classes (class.bind)
```html
<a class.bind="shownList === 'feed' && !filterTag ? ' active' : ''">  <!-- Active tab styling -->
<a class.bind="shownList === 'all' && !filterTag ? 'active' : ''">    <!-- Active tab styling -->
```

### Event Handlers (click.delegate)
```html
<a click.delegate="setListTo('feed')">            <!-- Switch to "Your Feed" -->
<a click.delegate="setListTo('all')">             <!-- Switch to "Global Feed" -->
<a click.delegate="setListTo('all', tag)">        <!-- Apply tag filter -->
```

### Iteration (repeat.for)
```html
<a repeat.for="tag of tags">                      <!-- Loop through tags array -->
```

### String Interpolation
```html
${filterTag}                                      <!-- Display current filter tag -->
${tag}                                            <!-- Display tag name in loop -->
```

### Custom Element Bindings
```html
<article-list 
  articles.bind="articles"                        <!-- Pass articles array -->
  total-pages.bind="totalPages"                   <!-- Pass pagination data -->
  page-number.bind="pageNumber"                   <!-- Pass page number -->
  current-page.bind="currentPage"                 <!-- Pass current page -->
  set-page-cb.call="setPageTo(pageNumber)">       <!-- Pass callback for pagination -->
</article-list>
```

## Events & Callbacks
- **setPageTo(pageNumber)**: Callback passed to article-list component for pagination
- **setListTo(type, tag)**: Event handler for tab clicks and tag clicks
- All events use Aurelia's `click.delegate` for event delegation

## Dependencies on Custom Elements
- **article-list**: Reusable component for displaying paginated article grid
  - Located at: `src/resources/elements/article-list.html`
  - Accepts: articles, totalPages, currentPage, set-page-cb

## UI Structure & Layout
- **Banner section**: Green header with "conduit" title and tagline
- **Main container**: Bootstrap grid (row with col-md-9 and col-md-3)
- **Left column (col-md-9)**:
  - Feed toggle tabs (nav-pills)
    - "Your Feed" (conditional, requires auth)
    - "Global Feed" (always visible)
    - Tag filter pill (conditional, shows when filterTag is set)
  - Article list component
- **Right column (col-md-3)**:
  - Sidebar with "Popular Tags"
  - Tag list with clickable tag pills
  - "No tags" message when empty

## CSS Classes Used
- Layout: `home-page`, `container`, `page`, `row`, `col-md-9`, `col-md-3`
- Banner: `banner`, `logo-font`
- Feed tabs: `feed-toggle`, `nav`, `nav-pills`, `outline-active`, `nav-item`, `nav-link`, `active`
- Sidebar: `sidebar`, `tag-list`, `tag-pill`, `tag-default`
- Icons: `ion-pound` (Ionicons)

## Migration Notes for Next.js

### State Management
- Replace Aurelia's BindingEngine with React state hooks:
  - `articles`, `tags`, `shownList`, `filterTag`, `currentPage` → `useState`
  - SharedState.isAuthenticated → React Context (AuthContext)

### Lifecycle Hooks Mapping
```javascript
// Aurelia → React
bind() → useEffect(() => { /* subscribe */ }, [])
unbind() → useEffect cleanup: return () => { /* cleanup */ }
attached() → useEffect(() => { getArticles(); getTags(); }, [])
```

### Service Injection
- Replace Aurelia DI with:
  - Direct imports: `import { articleService } from '@/lib/services/article-service'`
  - React Context for SharedState: `const { isAuthenticated } = useAuth()`

### Template Bindings Conversion
```javascript
// if.bind → JSX conditional
{sharedState.isAuthenticated && <li>...</li>}

// class.bind → template literals
className={`nav-link ${shownList === 'feed' && !filterTag ? 'active' : ''}`}

// click.delegate → onClick
onClick={() => setListTo('feed')}

// repeat.for → map
{tags.map(tag => <a key={tag}>...</a>)}
```

### Custom Elements
- `<article-list>` needs to be migrated as a React component
- Will need to check if it already exists in Next.js or migrate it separately
