# Setup & Local Environment Guide

This guide outlines the prerequisites, environment setup, and deployment workflows for running **Giselle's Concept** locally or in production.

---

## 1. Prerequisites

Because **Giselle's Concept** is built using native Web Platform standards (HTML5, CSS3, ES6+ JavaScript), it has **zero mandatory binary dependencies**. You can run the application with any static HTTP server or modern web browser.

### Recommended Tooling (Optional)
* **Node.js**: v18.0.0+ (for test automation and package scripts)
* **npm**: v9.0.0+
* **Python**: 3.8+ (for quick local serving)
* **Modern Web Browser**: Chrome 100+, Firefox 100+, Safari 15.4+, Edge 100+

---

## 2. Local Setup Options

### Option A: Node.js / npm (Recommended for Developers)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sedmugen/giselles-concept.git
   cd giselles-concept
   ```

2. **Run business logic test suite**:
   ```bash
   npm test
   ```

3. **Start local development server**:
   ```bash
   npm start
   ```
   *The application will be accessible at `http://localhost:3000` (or `http://localhost:5000`).*

---

### Option B: Python Simple HTTP Server

If you do not have Node.js installed:

```bash
# Python 3
python -m http.server 8000
```
*Open `http://localhost:8000` in your web browser.*

---

### Option C: VS Code Live Server

1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension (`ritwickdey.LiveServer`).
3. Right-click [`index.html`](../index.html) and select **"Open with Live Server"**.

---

### Option D: Docker Container

You can serve the static site using a lightweight Nginx container:

```bash
# Run standalone Nginx container mounting current directory
docker run --name giselles-storefront -v $(pwd):/usr/share/nginx/html:ro -p 8080:80 -d nginx:alpine
```
*Access the site at `http://localhost:8080`.*

---

## 3. Environment Variables Configuration

Copy the template environment file:
```bash
cp .env.example .env
```

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `development` | Runtime environment identifier (`development` / `production`) |
| `PORT` | `3000` | Port for local HTTP server execution |
| `PUBLIC_URL` | `http://localhost:3000` | Base canonical domain for OpenGraph meta tags |
| `ENABLE_SUBSCRIPTIONS`| `true` | Feature flag to toggle recurring subscription checkout |
| `DEFAULT_CURRENCY` | `PKR` | Default price formatting currency code |

---

## 4. GitHub Pages Deployment

The static architecture is optimized for automated GitHub Pages hosting:

1. Navigate to **Settings** > **Pages** in the repository settings on GitHub.
2. Under **Build and deployment** > **Source**, select **Deploy from a branch**.
3. Set branch to `main` and folder to `/(root)`.
4. Click **Save**. The live URL will be provisioned at `https://sedmugen.github.io/giselles-concept/`.
