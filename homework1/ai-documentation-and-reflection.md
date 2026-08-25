# FitFlow AI Documentation and Reflection

## Task 1: Planning

### Prompt

> Based on the FitFlow landing-page requirements, suggest a semantic HTML5 outline for the page. Include the header/navigation, hero, features, programs, CTA, and footer. Show the correct heading hierarchy and explain which elements should be used for repeated cards, navigation links, images, and calls to action. Do not write the final HTML or CSS code.

### AI answer

The page should use one `<header>`, a labelled `<nav>`, one `<main>`, and a `<footer>`. The hero should contain the single `<h1>`, while each major section should use an `<h2>` and each feature or program card should use an `<h3>`.

Repeated features and programs can be represented as unordered lists, with each item containing an `<article>`. Each article should include its image, heading, description, difficulty level where relevant, and CTA link. Images should have descriptive `alt` text, and navigation regions should have accessible labels such as `aria-label="Primary navigation"` and `aria-label="Footer navigation"`.

Calls to action that navigate to another section should use `<a>` elements. A `<button>` would be appropriate for an action such as opening a mobile menu or submitting a form. The page should also include a skip link to help keyboard users move directly to the main content.

The detailed planning outline is also available in [task-1-semantic-html-outline.md](task-1-semantic-html-outline.md).

## Task 2: Code Review

### Prompt

> Review the current FitFlow `index.html` and `style.css` for accessibility, semantic HTML, responsive layout, and clean CSS. Check the heading hierarchy, image alternative text, navigation links, use of Flexbox and Grid, CSS variables, hover states, and mobile behavior. Identify what is working well and list any improvements that should be made before submission.

### AI answer

The implementation is well aligned with the assignment requirements:

- The document uses semantic `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, and `<footer>` elements.
- There is one `<h1>` for the hero, followed by `<h2>` section headings and `<h3>` card headings.
- The skip link, labelled navigation regions, visible focus outlines, descriptive image `alt` text, and `prefers-reduced-motion` rule support accessibility.
- Repeated feature and program cards are grouped in unordered lists and laid out with CSS Grid.
- The navigation and footer use Flexbox/Grid, and the page includes responsive media queries for tablet and desktop widths.
- Buttons and links have hover transitions, while CTA links correctly use anchors because they navigate to page sections.
- Local image paths and all section anchor targets resolve correctly.

Recommended improvements before a polished final submission:

1. Replace the remaining hard-coded footer colors such as `#d9e4e4` and `#aebfc0` with named CSS variables so the full color palette is centralized.
2. Replace the generic social-media URLs with the actual FitFlow profile URLs if the project has real accounts. If the links are only placeholders for the assignment, label them as placeholder links in the project notes.
3. Consider expanding the Trainers and About sections with more meaningful content or visual elements. They currently satisfy the navigation requirement but are intentionally brief.
4. Test the page with keyboard navigation and a screen reader, and check the desktop and mobile screenshots at the same viewport sizes used during testing.

## Task 3: Debugging

### Problem description

While testing the programs section on a narrow mobile viewport, the cards could overflow horizontally when the grid used a fixed `280px` minimum column size.

**Expected behavior:** The program cards should fit inside the viewport without horizontal scrolling. On small screens, they should appear as one full-width column.

**Actual behavior:** A viewport narrower than `280px` forced the grid track to remain wider than the available space, which caused horizontal overflow.

### Prompt

> I have a responsive CSS Grid for six program cards. On a very narrow mobile viewport, the cards create horizontal overflow because the grid columns have a `280px` minimum. Explain the root cause first, then provide a CSS fix that keeps the cards at least about `280px` wide when possible but allows them to shrink to the viewport width when necessary.

### AI answer

The root cause is the minimum value in `minmax(280px, 1fr)`. CSS Grid is required to keep each column at least `280px` wide, even when the container is narrower than that value. The grid therefore becomes wider than the viewport.

The fix is to cap the minimum track size at the available container width while preserving the preferred minimum size on larger screens:

```css
#features ul,
#programs ul {
    grid-template-columns: repeat(
        auto-fit,
        minmax(min(100%, 17.5rem), 1fr)
    );
}
```

`min(100%, 17.5rem)` means the minimum is normally `17.5rem` (about `280px`), but it can shrink to `100%` when the viewport is narrower. This prevents horizontal overflow and allows the cards to stack naturally on mobile.

This fix is implemented in [style.css](style.css), and the responsive result is shown in [mobile.png](screenshots/mobile.png).

## Reflection

### What did AI help me with?

AI helped me plan the semantic structure before writing the page, review the accessibility and responsive CSS decisions, and explain the cause of the mobile grid overflow. It was especially useful for checking that repeated cards belonged in lists, that headings followed a logical hierarchy, and that navigation CTAs should be links when they move the user to another section.

### What did I have to understand and verify myself?

I had to decide which content belonged in each section, choose the images and write accurate alternative text, and implement the HTML and CSS. I also had to verify that every image path loaded, every navigation target existed, the layout worked at desktop and mobile widths, and the screenshots represented the finished page. AI suggestions still needed to be checked against the actual browser result and the assignment requirements.
