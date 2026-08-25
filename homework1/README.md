# FitFlow Landing Page — Assignment Roadmap & Guide

## 1. What is this Project? (In Simple Words)

You are building a responsive landing page website for a fitness company called **FitFlow**.

- **Landing Page**: A single-page website that introduces the brand and gets visitors to sign up.
- **Responsive**: The layout looks great on mobile phones, tablets, and desktop computers without breaking.
- **Technologies**: Pure **HTML5** and **CSS** (using Flexbox and CSS Grid).
- **Core Goal**: Build clean code and practice using AI properly as an engineering assistant across 3 specific stages.

---

## 2. Page Sections Breakdown

### Section 1: Header (Navigation Bar)
- **Logo / Brand Name**: "FitFlow".
- **Navigation Links**: Home, Programs, Trainers, About, Contact.
- **Call-to-Action (CTA) Button**: "Get Started".
- **Responsive behavior**: Must work smoothly across mobile, tablet, and desktop screens.

### Section 2: Hero Section (Top Banner)
- **Main Heading**: "Build a Stronger, Healthier You".
- **Description**: "Personalized workouts, expert guidance, and simple tools to help you stay consistent and reach your fitness goals."
- **Primary CTA Button**: "Start Your Journey".
- **Visuals**: Balanced layout with strong typography and background or hero image.

### Section 3: Features Section (3 Cards)
- **Card 1**: Personalized Workouts (*Workouts designed around your goals and fitness level.*)
- **Card 2**: Expert Trainers (*Learn from experienced trainers and follow structured programs.*)
- **Card 3**: Track Your Progress (*Monitor your progress and stay motivated over time.*)
- **Layout**: Uses Flexbox or CSS Grid (multi-column on desktop, stacked on mobile).

### Section 4: Programs Section (6 Cards)
- 6 fitness program cards:
  1. Strength Training
  2. Cardio
  3. Yoga
  4. HIIT
  5. Mobility
  6. Full Body Workout
- **Each card must contain**:
  - Program image
  - Program name
  - Short description
  - Difficulty badge / level (e.g., Beginner, Intermediate, Advanced)
  - CTA button (e.g., "Explore Program" or "Join Now")
- **Bonus**: Use modern fluid CSS Grid (`grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`) to adapt without extra media queries.

### Section 5: Call-to-Action (CTA) Section
- **Heading**: "Ready to Start Your Fitness Journey?"
- **Supporting sentence**: A motivating invitation to join today.
- **Button**: "Get Started".

### Section 6: Footer (Bottom of the Page)
- Brand name and short description.
- Navigation links.
- Social media links / icons.
- Copyright text (e.g., `© 2026 FitFlow. All rights reserved.`).

---

## 3. Technical Requirements

### HTML5
- Semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- Proper heading hierarchy (`<h1>` for Hero, `<h2>` for sections, `<h3>` for cards).
- Descriptive `alt` attributes for all images.
- Proper use of `<a>` for links and `<button>` for actions.

### CSS
- CSS Variables for color palette, fonts, spacing, and border-radius.
- CSS Reset and Box-Sizing (`box-sizing: border-box`).
- Flexbox for navigation, headers, and component alignment.
- CSS Grid for cards and multi-column sections.
- CSS Transitions on hover states for buttons and links.
- Mobile-first or desktop-down media queries for responsive layouts.

---

## 4. AI Workflow & Required Prompts

You must document and submit 3 specific AI interactions:

| Task | Objective | What to ask / provide |
| :--- | :--- | :--- |
| **Task 1: Planning** | Plan semantic HTML structure | Ask AI to suggest a semantic HTML outline based on the requirements. (Do not ask it to write the final code). |
| **Task 2: Code Review** | Review code quality & accessibility | Ask AI to review your HTML/CSS for accessibility, semantic structure, responsive layout, and clean CSS. |
| **Task 3: Debugging** | Solve a real layout or styling bug | Provide a problem description (Expected vs. Actual behavior + code snippet) and ask AI to explain the root cause before fixing. |

---

## 5. Deliverables Checklist

- [ ] `index.html` (Semantic, accessible HTML structure)
- [ ] `style.css` (Clean, responsive CSS with Flexbox & Grid)
- [ ] Image assets (Images for hero, features, and 6 programs)
- [ ] Desktop Screenshot
- [ ] Mobile Screenshot
- [ ] AI Documentation (3 prompts used + answers)
- [ ] Short Reflection Write-up:
  - *What did AI help me with?*
  - *What did I have to understand and verify myself?*
