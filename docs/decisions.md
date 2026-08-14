# Architecture Decision Records (ADRs)

This document records the key architectural choices, trade-offs, and technical rationales established during the engineering of **Giselle's Concept**.

---

## ADR 001: Frameworkless Vanilla JS Architecture

### Context
When building a modern e-commerce concept, common defaults include React, Next.js, or Vue. However, for an editorial showcase demonstrating core CS and web engineering competency, large frameworks introduce significant bundle overhead, hydration latency, build tooling complexity, and dependency bloat.

### Decision
Implement the entire application using semantic HTML5, modern CSS3 (Custom Properties & Grid), and Vanilla ES6+ JavaScript without external frontend frameworks.

### Consequences
* **Positive**: Instant initial load time (<100ms), 0 KB JavaScript compilation payload, zero build-step requirement, maximum portability, direct DOM accessibility.
* **Negative**: Manual DOM manipulation for dynamic cart re-rendering instead of declarative component rendering.

---

## ADR 002: Client-Side LocalStorage Shopping Bag Engine

### Context
A complete e-commerce experience requires shopping bag state to persist across page reloads and cross-page navigation (from `index.html` to `product.html`). Without an active backend database in a static showcase, state persistence must occur client-side.

### Decision
Store normalized cart items in the browser's `localStorage` under the key `giselles_cart`. Include defensive deserialization and validation to discard corrupted or malformed data.

### Consequences
* **Positive**: Full session persistence across refreshes and page hops with zero network latency.
* **Negative**: Storage is domain-isolated and client-bound (does not sync across separate devices).

---

## ADR 003: CSS Custom Properties Design System & Fluid Typography

### Context
The visual requirements demand a sensory, luxury aesthetic with editorial proportions, custom serif typography, and balanced whitespace. Hardcoded pixel measurements lead to brittle responsive behaviors and inconsistent color palettes.

### Decision
Adopt a centralized CSS Custom Properties token architecture (`:root` in `style.css`) paired with mathematical fluid typography (`clamp()`).

### Consequences
* **Positive**: Single point of control for theme colors, spacing scales, and fonts. Seamless typography scaling across 320px mobile screens to 4K displays without jumping between media queries.
* **Negative**: Requires modern browser support (fully supported across all modern evergreen browsers).

---

## ADR 004: Event Delegation with Semantic Data Attributes

### Context
Scattering inline `onclick` attributes across HTML files creates tightly-coupled code, hinders Content Security Policies (CSP), and creates memory leaks if elements are dynamically injected.

### Decision
Eliminate all inline `onclick` handlers in favor of top-level document event delegation using `data-action`, `data-product-id`, and `data-feature` attributes.

### Consequences
* **Positive**: Clean separation of markup and behavior; single unified event listener handles all clicks; dynamically rendered elements automatically inherit actions without re-binding.
* **Negative**: Central event switch statement must handle all action cases cleanly.

---

## ADR 005: Zero-Dependency Pure Node Test Strategy

### Context
Automated testing for business logic (pricing rules, subscription discounts, subtotal calculations) is essential for software quality. However, pulling in Jest or Mocha introduces hundreds of megabytes of `node_modules` dependencies.

### Decision
Utilize Node.js's native `assert` module inside `tests/cart.test.js` to execute zero-dependency pure unit smoke tests against shopping cart calculations.

### Consequences
* **Positive**: Extremely fast test execution (<50ms), zero dependency installation needed, works in any Node.js environment out of the box.
* **Negative**: Limited to testing pure business logic without browser DOM rendering (which is verified through manual QA).
