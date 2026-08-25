# Task 1: Semantic HTML Structure Plan

## Recommended Page Outline

```text
body
├── a                         Skip link: “Skip to main content”
│
├── header
│   └── nav                   aria-label="Primary navigation"
│       ├── a                 FitFlow logo → #home
│       ├── ul
│       │   ├── Home          → #home
│       │   ├── Programs      → #programs
│       │   ├── Trainers      → #trainers
│       │   ├── About         → #about
│       │   └── Contact       → #contact
│       └── a                 “Get Started” CTA → signup destination
│
├── main                      id="main-content"
│   │
│   ├── section               Hero, id="home"
│   │   ├── div               Text content
│   │   │   ├── h1            Build a Stronger, Healthier You
│   │   │   ├── p             Hero description
│   │   │   └── a             Start Your Journey
│   │   └── figure
│   │       └── img           Descriptive alt text
│   │
│   ├── section               Features, aria-labelledby="features-title"
│   │   ├── h2                Why Choose FitFlow?
│   │   └── ul                Feature collection
│   │       ├── li → article
│   │       │   ├── h3        Personalized Workouts
│   │       │   └── p
│   │       ├── li → article
│   │       │   ├── h3        Expert Trainers
│   │       │   └── p
│   │       └── li → article
│   │           ├── h3        Track Your Progress
│   │           └── p
│   │
│   ├── section               Programs, id="programs"
│   │   ├── h2                Explore Our Programs
│   │   ├── p                 Optional section introduction
│   │   └── ul                Program collection
│   │       └── li → article  Repeated six times
│   │           ├── img
│   │           ├── h3        Program name
│   │           ├── p         Description
│   │           ├── p         Difficulty level
│   │           └── a         Explore Program
│   │
│   ├── section               Trainers, id="trainers"
│   │   ├── h2
│   │   └── content
│   │
│   ├── section               About, id="about"
│   │   ├── h2
│   │   └── p
│   │
│   ├── section               Call to action
│   │   ├── h2                Ready to Start Your Fitness Journey?
│   │   ├── p                 Supporting invitation
│   │   └── a                 Get Started
│   │
│   └── section               Contact, id="contact"
│       ├── h2
│       └── contact details or form
│
└── footer
    ├── div
    │   ├── a                 FitFlow logo/home link
    │   └── p                 Short brand description
    ├── nav                   aria-label="Footer navigation"
    │   └── ul                Navigation links
    ├── nav                   aria-label="Social media"
    │   └── ul                External social links
    └── p
        └── small             © 2026 FitFlow. All rights reserved.
```

## Semantic and Accessibility Decisions

- Use one `<h1>` for the hero. Section titles use `<h2>`, and card titles use `<h3>`.
- Represent repeated cards as a `<ul>` because the cards form a collection.
- Use `<article>` for each card when it can be understood independently.
- Use `<a>` for calls to action that navigate somewhere. Reserve `<button>` for actions such as submitting a form or opening the mobile navigation menu.
- Give every content section a heading, even if a heading needs to be visually hidden.
- Ensure every navigation link corresponds to a real section ID. Because the requirements include Trainers, About, and Contact links, those sections should exist or the links should be omitted.
- Give images meaningful alternative text, such as `Woman performing a strength-training exercise`, rather than generic text such as `fitness image`.
- Give icon-only social links accessible names, such as `aria-label="FitFlow on Instagram"`.
- Use separate accessible labels for the primary, footer, and social navigation regions.

## Heading Hierarchy

1. `<h1>`: Build a Stronger, Healthier You
2. `<h2>`: One heading for each main page section
3. `<h3>`: Feature names and program names inside their respective sections

This structure is a planning outline for the assignment. It is intentionally not the final HTML implementation.
