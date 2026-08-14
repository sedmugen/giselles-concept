# Changelog

All notable changes to **Giselle's Concept** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-08-14

### Added
- **Visual Design System**: Complete sensory luxury lookbook theme utilizing *Cormorant Garamond* serif typography, *Plus Jakarta Sans*, and fluid responsive measurements.
- **Client-Side Cart Engine**: LocalStorage persistence, item addition/removal, real-time subtotal calculation, and sliding off-canvas bag drawer.
- **Product Detail Customizer**: Subscription frequency selector (15% discount model) and dynamic pricing calculations.
- **Delivery Date Estimator**: Regional shipping calculator factoring in California vs. Out-of-State transit schedules and daily 11:00 AM PST order cut-offs.
- **Interactive Lightbox Modal**: High-resolution pastry texture zoom dialog with keyboard navigation (`Escape`, `ArrowLeft`, `ArrowRight`).
- **Luxury Toast Notifications**: Accessible, non-blocking toast messaging system replacing native browser alerts.
- **Documentation Suite**: 10-section portfolio README, technical architecture guide (`docs/architecture.md`), Architecture Decision Records (`docs/decisions.md`), and API schema reference (`docs/api.md`).
- **Portfolio Standards Compliance**: Standardized folder structure (`assets/`, `docs/`), MIT License, `.gitignore`, and `.env.example`.

### Changed
- Refactored entire codebase to eliminate inline `onclick` handlers in favor of centralized event delegation with `data-action` attributes.
- Refactored inline CSS styles into clean, reusable utility classes in `style.css` and `product.css`.
- Renamed all image assets to clean kebab-case without spaces and organized into `assets/images/` and `assets/images/products/`.
- Elevated color contrast ratios for secondary and muted body text to satisfy WCAG AA standards.

### Security
- Added `rel="noopener noreferrer"` attributes to all external target links.
