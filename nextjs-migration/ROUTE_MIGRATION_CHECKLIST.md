# Route Migration Checklist

This document tracks the migration progress of each route from Aurelia to Next.js.

## Routes

### Home Page (/)
- [x] Page component created
- [x] Services migrated (articles, tags)
- [x] Template and lifecycle ports
- [x] Tests added for ArticleList component
- [x] Initial smoke test in dev
- [ ] Final feature parity verification
  - [x] UI parity (layout, components)
  - [x] Data parity (articles list, tags)
  - [ ] Edge cases (empty state, loading state)
  - [ ] Accessibility (keyboard, screen reader)

### Login Page (/login)
- [x] Page component created
- [x] Services migrated (user auth)
- [x] Template and lifecycle ports
- [x] Tests added (4 test cases, 100% statement coverage)
- [ ] Smoke test in dev
- [x] Feature parity verification
  - [x] UI parity (Next.js Link, form layout)
  - [x] Data parity (form submission, canSave validation)
  - [x] Edge cases (errors, loading states, redirects)
  - [ ] Accessibility (keyboard, screen reader)

### Register Page (/register)
- [x] Page component created
- [x] Services migrated (user registration)
- [x] Template and lifecycle ports
- [x] Tests added (4 test cases, 100% statement coverage)
- [ ] Smoke test in dev
- [x] Feature parity verification
  - [x] UI parity (Next.js Link, form layout)
  - [x] Data parity (form submission, canSave validation)
  - [x] Edge cases (errors, loading states, redirects)
  - [ ] Accessibility (keyboard, screen reader)

### Settings Page (/settings)
- [x] Page component created
- [x] Services migrated (user settings)
- [x] Template and lifecycle ports
- [x] Tests added (4/6 tests passing)
- [ ] Smoke test in dev
- [ ] Feature parity verification
  - [x] UI parity
  - [x] Data parity (form fields, update)
  - [x] Edge cases (errors, logout)
  - [ ] Accessibility

### Editor Page (/editor/[slug])
- [x] Page component created
- [x] Services migrated (article creation/editing)
- [x] Template and lifecycle ports
- [ ] Tests added
- [ ] Smoke test in dev
- [ ] Feature parity verification
  - [ ] UI parity
  - [ ] Data parity (form submission, tags)
  - [ ] Edge cases (errors, slug handling)
  - [ ] Accessibility

### Article Page (/article/[slug])
- [x] Page component created
- [x] Services migrated (article, comments)
- [x] Template and lifecycle ports
- [ ] Tests added
- [ ] Smoke test in dev
- [ ] Feature parity verification
  - [x] UI parity
  - [ ] Data parity (article content, comments)
  - [ ] Edge cases (loading, 404)
  - [ ] Accessibility

### Profile Page (/[username])
- [x] Page component created
- [x] Services migrated (profile, articles)
- [x] Template and lifecycle ports
- [ ] Tests added
- [ ] Smoke test in dev
- [ ] Feature parity verification
  - [x] UI parity
  - [ ] Data parity (profile info, articles)
  - [ ] Edge cases (following, unfollowing)
  - [ ] Accessibility

## Global Features
- [x] Authentication middleware
- [x] Server-side data fetching
- [x] API services migration
- [x] UI components (ArticlePreview, etc.)
- [x] Markdown rendering
- [x] Date formatting
- [ ] Form validation
