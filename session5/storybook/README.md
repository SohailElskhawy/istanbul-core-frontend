# Image Gallery & Storybook Component System

A responsive, accessible, and polished Image Gallery application built with React, TypeScript, Vite, CSS Modules, and Storybook.

---

## Tech Stack

- **React 19** & **TypeScript**
- **Vite** (Next-generation frontend tooling)
- **CSS Modules** & **CSS Custom Properties (Design Tokens)**
- **Storybook 10** (Component Story Format, Controls, Autodocs, A11y Addon)
- **Vitest** & **React Testing Library** with `@testing-library/user-event`

---

## Getting Started

### Installation

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Start Storybook

```bash
npm run storybook
```

### Run Tests

```bash
npm test
```

### Build Production Bundle & Storybook

```bash
npm run build
npm run build-storybook
npm run lint
```

---

## Architecture Overview

The project uses a simple, component-driven structure separating reusable UI primitives from application page composition:

```
src/
├── components/
│   ├── Button/           # Reusable button primitive with primary, secondary, danger variants
│   ├── FilterButton/     # Accessible filter pill with count badges and indicator dot
│   ├── ImageCard/        # Semantic keyboard-accessible card with fallback error state
│   ├── ImageGrid/        # Responsive CSS Grid container (1 to 4 columns)
│   ├── ImageModal/       # Accessible preview dialog with focus management and backdrop click
│   ├── Skeleton/         # Subtle pulse skeleton loading placeholders
│   └── EmptyState/       # Friendly zero-results UI with reset action
├── data/
│   └── images.ts         # High-resolution mock gallery items across 4 categories
├── types/
│   └── image.ts          # Strict TypeScript interfaces and category union types
├── pages/
│   ├── GalleryPage.tsx   # Gallery page orchestrating filters, grid, and preview modal
│   └── GalleryPage.module.css
├── styles/
│   ├── tokens.css        # Central design tokens (colors, spacing, shadows, radii, typography)
│   └── global.css        # Base reset, accessible focus styles, reduced-motion preferences
├── test/
│   └── setup.ts          # Vitest test configuration and jest-dom matchers
├── App.tsx               # Root application entry
└── main.tsx              # React DOM mounting
```

---

## State Management Decision

Local state and lifted state were chosen because the application's state belongs to the `GalleryPage` and does not require a global state management solution.

The page maintains `selectedCategory` and `selectedImage` with React's `useState` hook and passes down props and callbacks to presentational components. Adding Redux, Zustand, or global Context would introduce unnecessary boilerplate and complexity for this scoped application.

---

## Why Storybook is Used

Storybook allows reusable UI components and their states to be developed, viewed, documented, and tested independently from the application.

Each component is built in isolation with interactive controls, explicit accessibility checks, and comprehensive states:
- **Button**: Primary, Secondary, Danger, Disabled, Long Text
- **FilterButton**: Default, Active, With Count, Disabled
- **ImageCard**: Default, Long Title, Portrait, Landscape, Broken Image Fallback
- **ImageGrid**: Single Image, Three Images, Many Images, Empty
- **ImageModal**: Default, Portrait, Landscape, Long Title
- **Skeleton**: Default Grid, Single Card
- **EmptyState**: Default, With Action
