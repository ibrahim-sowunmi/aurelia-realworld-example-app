# Conduit Styling Migration Notes

## Styling Issues Identified

After comparing the Aurelia and Next.js implementations, I've identified that the Next.js app is missing critical styling resources that are present in the Aurelia app.

### Aurelia Styling (Original)

The Aurelia app imports three critical external stylesheets in `index.ejs`:

1. **Ionicons**: 
   ```html
   <link href="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet" type="text/css">
   ```
   - Used for all icons throughout the application (follow/unfollow, edit profile, etc.)

2. **Google Fonts**: 
   ```html
   <link href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic" rel="stylesheet" type="text/css">
   ```
   - Provides the typography throughout the application

3. **Custom Bootstrap 4 Theme**:
   ```html
   <link rel="stylesheet" href="//demo.productionready.io/main.css">
   ```
   - This is the primary stylesheet for Conduit, containing all the Bootstrap-based styling

### Next.js Styling (Current)

The Next.js app currently uses a completely different styling approach:

1. **Tailwind CSS**:
   ```css
   @import "tailwindcss";
   ```
   - The app uses Tailwind instead of Bootstrap

2. **Custom Fonts**:
   ```javascript
   import { Geist, Geist_Mono } from "next/font/google";
   ```
   - Uses Geist fonts instead of the Google Fonts used in Aurelia

3. **Basic CSS Variables**:
   ```css
   :root {
     --background: #ffffff;
     --foreground: #171717;
   }
   ```
   - Has minimal CSS variables but none of the Conduit styling

## Missing Components

1. **Bootstrap Grid System**: The layout classes (`container`, `row`, `col-md-*`, etc.)
2. **Conduit Theme Elements**: Banner styling, card styling, button styling
3. **Ionicons**: All icon elements are unstyled
4. **Typography**: Font families and styling

## Action Plan

To fix the styling issues:

1. Add the three external CSS imports to the Next.js app's `layout.tsx`
2. Remove/replace the conflicting Tailwind and Geist font imports
3. Update any CSS classes that might be in conflict
4. Verify styling parity between the Aurelia and Next.js apps
