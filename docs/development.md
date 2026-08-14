# Developer & Contributor Guide

This guide establishes the coding standards, design token architecture, testing practices, and release workflow for developers maintaining **Giselle's Concept**.

---

## 1. Codebase Organization

```
giselles-concept/
├── assets/                 # Static media assets
│   ├── brand/              # Vector logos & marks
│   ├── gifs/               # Animated UI recordings
│   ├── images/             # Photographic assets & product imagery
│   │   └── products/       # Standardized product photos
│   ├── mockups/            # Portfolio banner & device mockups
│   └── videos/             # Video walkthrough captures
├── docs/                   # Comprehensive technical documentation
│   ├── api.md              # Client-side API & schema reference
│   ├── architecture.md     # System architecture & token guide
│   ├── decisions.md        # Architecture Decision Records (ADRs)
│   ├── development.md      # Developer & engineering guidelines (this file)
│   ├── setup.md            # Installation & environment setup
│   └── usage.md            # UX and customer journey guide
├── tests/                  # Automated smoke & unit tests
│   └── cart.test.js        # Pure business logic test suite
├── index.html              # Lookbook Storefront HTML
├── product.html            # Product Detail Page HTML
├── style.css               # Global tokens, reset, typography, and layout
├── product.css             # Product customization & gallery styles
├── script.js               # Centralized Vanilla JS modular engine
└── package.json            # Node scripts and project metadata
```

---

## 2. Coding Standards & Conventions

### 2.1 HTML Standards
* **Semantic Landmark Elements**: Use `<header>`, `<main>`, `<section>`, `<aside>`, `<footer>`, `<nav>`, `<article>`.
* **Zero Inline JavaScript**: Do **not** use inline `onclick`, `onchange`, or `onsubmit` attributes. Declare actions with `data-action="<action-name>"`.
* **Zero Inline CSS**: Do **not** use `style="..."` attributes. Use CSS utility classes and design tokens.
* **Accessibility (a11y)**:
  * Form controls must have associated `<label>` tags (use `.sr-only` if visually concealed).
  * External links must specify `rel="noopener noreferrer"`.
  * Dialogs and overlays must specify `role="dialog"` and `aria-modal="true"`.

### 2.2 CSS Guidelines
* **Centralized Design Tokens**: Always consume variables from `:root` in `style.css` (e.g. `var(--accent-gold)`, `var(--text-primary)`).
* **Fluid Typography**: Use `clamp()` for responsive font sizes instead of fragmented media query overrides.
* **Mobile-First & Progressive Enhancement**: Write base rules for small viewports and scale up via `@media (min-width: ...)` or clamp calculations.

### 2.3 JavaScript Best Practices
* **Module Pattern**: Wrap features in an IIFE or clean modular object (`GisellesApp`) to prevent global scope contamination.
* **Event Delegation**: Attach listeners to document or stable parent containers checking for `data-action`.
* **Zero Console Logs in Production**: Do not commit `console.log` or `console.warn` statements.

---

## 3. Testing Workflow

The project includes an automated Node.js test suite for shopping bag calculations, pricing rules, and subscription discounts.

### Running Tests
```bash
npm test
```

### Adding New Tests
Add test assertions inside [`tests/cart.test.js`](../tests/cart.test.js) using Node's built-in `assert` module:

```javascript
// Example assertion
const cart = createCart();
cart.addItem(1, 3);
assert.strictEqual(cart.getSubtotal(), 75000, 'Subtotal calculation failed');
```

---

## 4. Git & Commit Guidelines

All commits must strictly follow the **Conventional Commits** specification:

```
<type>(optional-scope): description
```

### Approved Types
* `feat`: New feature or user-facing capability
* `fix`: Bug fix
* `refactor`: Code restructuring without functional alterations
* `docs`: Documentation updates
* `style`: Code style or formatting adjustments
* `test`: Adding or modifying tests
* `chore`: Build scripts, dependencies, or configuration changes

### Example Commits
* `feat(cart): add item removal undo mechanism`
* `fix(delivery): correct weekend transit calculation in estimator`
* `docs(api): document new discount schema attributes`
