# Contributing to Giselle's Concept

Thank you for your interest in contributing to **Giselle's Concept**! This project is maintained as a portfolio showcase under the canonical GitHub profile [`sedmugen`](https://github.com/sedmugen).

---

## 1. Code of Conduct

Please maintain a respectful, constructive, and collaborative environment across all issues and pull requests.

---

## 2. Git Workflow

### Branch Naming
Follow the structured category pattern:
```
<category>/<short-description>
```
*Categories*: `feature/`, `bugfix/`, `docs/`, `refactor/`, `style/`, `test/`, `chore/`

*Example*: `feature/stripe-checkout-integration`, `docs/update-architecture`

### Conventional Commits
All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
```
<type>(optional-scope): description
```
*Approved types*: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`, `perf`, `build`, `ci`

*Rules*:
* Imperative mood, first line under ~72 characters.
* One logical change per commit.
* Avoid generic messages like `Update`, `Fix`, `Changes`.

---

## 3. Development Guidelines

1. **Keep it Vanilla**: Do not introduce heavy frontend frameworks (React, Vue, etc.) unless discussing a major architecture migration in an issue first.
2. **Design Integrity**: Adhere to the established CSS Custom Properties token system defined in `style.css`.
3. **Accessibility First**: Ensure all interactive elements include appropriate ARIA attributes, keyboard navigation, and semantic HTML tags.
4. **Zero Dead Code**: Remove all debug `console.log` statements, unused styles, and commented-out code before submitting PRs.
