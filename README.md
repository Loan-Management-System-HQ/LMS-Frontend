# LMS-Frontend

This is the frontend for the Loan Management System, a modern web application built with React.

## Tech Stack & Dependencies

The project is built with a modern, efficient, and type-safe stack:

-   **Framework**: React 19
-   **Language**: TypeScript (with SWC for fast compilation)
-   **UI Toolkit**: Material UI
-   **Node.js Version**: 22 LTS (managed via `fnm`)
-   **Package Manager**: `pnpm` (for fast and disk-efficient dependency management)
-   **Containerization**: Docker

## How to Run with Docker

The `Dockerfile.Frontend` is configured to support both local development with hot-reloading and an optimized production build.

---

### 1. For Development

This mode is ideal for coding. It starts a development server that automatically reloads when you save changes to your code.

**Step 1: Build the development Docker image**

Open your terminal in the `LMS-Frontend` directory and run:

```bash
docker build --tag lms-frontend:dev-container --target dev -f Dockerfile.Frontend .
```

**Step 2: Run the development container**

This command starts the container and syncs your local source code directory with the container's working directory. This is what enables live updates.

```bash
docker run -it --rm -p 5173:5173 -v "$(pwd)":/lms-app-frontend lms-frontend:dev-container
```


-   **URL**: Your application will be available at [http://localhost:5173](http://localhost:5173).
-   Changes you make to the code on your machine will be reflected instantly in the browser.

---

### 2. For Production

This mode builds the final, optimized static files and serves them with a minimal web server, ready for deployment.

**Step 1: Build the production Docker image**

```bash
docker build -t lms-frontend:latest-container -f Dockerfile.Frontend .
```

*Note: By not specifying a `--target`, Docker automatically builds the final stage in the file, which is our production stage.*

**Step 2: Run the production container**

```bash
docker run -it --rm -p 3000:3000 lms-frontend:latest-container
```

-   **URL**: The production version of your app can be viewed at [http://localhost:3000](http://localhost:3000).

---

## Alternative way to run docker (Preferred)
Start in background (build and run)
```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

Check status
```bash
docker compose -f docker-compose.dev.yml logs -f
```

View logs
```bash
docker-compose -f docker-compose.dev.yml logs -f
```

Stop
```bash
docker-compose -f docker-compose.dev.yml down
```

-   **URL**: Your application will be available at [http://localhost:3000](http://localhost:3000).
-   Changes you make to the code on your machine will be reflected instantly in the browser.
