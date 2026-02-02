# Architecture

This folder describes the architecture of the Resume Intelligence Platform: components, data flow, queues, and deployment.

## Overview

The platform is a **queue-based microservices** system that:

1. Accepts resume uploads (PDF, DOCX, images) via an API gateway and upload service.
2. Runs **OCR** (Tesseract) on documents that need text extraction.
3. Runs **NLP parsing** (Python/SpaCy) to extract skills, experience, education, contact info.
4. **Matches** resumes to job roles and computes scores (BullMQ worker).
5. **Exports** resume data to CSV on demand (BullMQ worker).
6. **Aggregates insights** for the analytics dashboard (Python worker).
7. Serves a **React frontend** and REST APIs for jobs, resumes, and analytics.

All application services are containerized (Docker) and can run via **Docker Compose** (dev/staging) or **Docker Swarm** (production-style scaling).

---

## High-level diagram

See the system design diagrams in the repo:

- [Resume Intelligence Platform — system design](../system-design/Resume_Inteligence_Platform_System_Design.png) — high-level architecture.
- [Resume processing job flow](../system-design/Resume_Processing_Job_Flow.png) — sequence: upload → OCR → parser → matcher → dashboard and export.

---

## Components

### Entry and APIs

| Component | Role | Port (default) | Tech |
|-----------|------|----------------|------|
| **API Gateway** | Single entry point; proxies to upload-service and analytics-api | 3000 | Node.js, Fastify |
| **Upload Service** | File upload, validation, enqueue OCR → parser → matcher | 3001 | Node.js, Fastify |
| **Analytics API** | Dashboard APIs: jobs, resumes, analytics, export triggers | 3002 | Node.js, Fastify |
| **Frontend** | React SPA (resumes, jobs, upload, analytics) | 80 (Compose) / 8080 (dev) | React, Vite, Tailwind |

### Workers (async)

| Worker | Role | Queue(s) | Tech |
|--------|------|----------|------|
| **OCR Worker** | Extract text from PDF/images (Tesseract) | Consumes `ocr-queue` (Redis list) | Python |
| **Parser Worker** | Parse extracted text (skills, experience, education, etc.) | Consumes `parser-queue` (Redis list) | Python, SpaCy |
| **Matcher Worker** | Score resume–job match | BullMQ `matcher-queue` | Node.js |
| **Export Worker** | Generate CSV export | BullMQ `export-queue` | Node.js |
| **Insights Worker** | Aggregate data for analytics | Redis list / internal | Python |

### Data stores

| Store | Role |
|-------|------|
| **PostgreSQL** | Resumes, jobs, parsed data, match scores, users (if any). |
| **Redis** | Queues (BullMQ + Redis lists for Python workers), optional caching. |

### Infrastructure (optional)

| Component | Role |
|-----------|------|
| **Prometheus** | Metrics (e.g. 9090). |
| **Grafana** | Dashboards (e.g. 3030). |
| **Loki / Promtail** | Log aggregation. |
| **Alertmanager** | Alert routing. |
| **Nginx** | Reverse proxy (optional). |

---

## Data flow

### Resume processing pipeline

1. **Upload**  
   Client → API Gateway → Upload Service. File is stored (e.g. volume `uploads`), record created in DB, status e.g. `pending`.

2. **OCR**  
   Upload service pushes a job to **`ocr-queue`** (Redis list). OCR worker (Python) picks it up, runs Tesseract, pushes result to **`parser-queue`**.

3. **Parsing**  
   Parser worker (Python) reads from **`parser-queue`**, extracts entities (skills, experience, education, contact), writes to DB, updates status to `parsed` (or `failed`). On success, it triggers the matcher (e.g. HTTP call to upload-service or push to **matcher-queue**).

4. **Matching**  
   Matcher worker (Node, BullMQ) processes **`matcher-queue`**, computes resume–job scores, persists to DB.

5. **Export**  
   User requests export → Analytics API enqueues **`export-queue`** → Export worker generates CSV and stores in `exports` volume; user downloads via API.

6. **Insights**  
   Insights worker aggregates data for the analytics dashboard (e.g. skills distribution, experience bands).

### Queue summary

| Queue | Producer | Consumer | Payload |
|-------|----------|----------|--------|
| `ocr-queue` (Redis list) | Upload Service | OCR Worker (Python) | resumeId, filePath, fileName, mimeType |
| `parser-queue` (Redis list) | Upload Service (or OCR Worker) | Parser Worker (Python) | resumeId, extractedText |
| `matcher-queue` (BullMQ) | Upload Service / Parser | Matcher Worker (Node) | resumeId |
| `export-queue` (BullMQ) | Analytics API | Export Worker (Node) | export request params |

---

## Deployment

### Docker Compose

- **Full stack:** `infra/docker-compose/docker-compose.microservices.yml` — gateway, upload, analytics, all workers, frontend, Postgres, Redis.
- **Dev:** `docker-compose.dev.yml` — Postgres + Redis only; run apps locally.
- **Scaled:** `docker-compose.scale.yml` — override for more upload-service replicas.

Commands (from repo root):

```bash
pnpm run docker:microservices   # full stack
pnpm run docker:dev             # infra only
pnpm run docker:start:scale     # scaled upload
```

### Docker Swarm

- **Stack:** `infra/swarm/stack.yml` — same services with `deploy.replicas` (e.g. upload-service, api-gateway, analytics-api, matcher-worker, parser-worker).
- **Deploy:** `pnpm run swarm:deploy` or `./scripts/deploy-swarm.sh`.
- **Scale upload:** `./scripts/scale-upload.sh 5`.

### Ports (reference)

| Service | Compose | Local dev |
|---------|---------|-----------|
| Frontend | 80 | 8080 |
| API Gateway | 3000 | 3000 |
| Upload Service | 3001 | 3001 |
| Analytics API | 3002 | 3002 |
| PostgreSQL | 5432 | 5432 |
| Redis | 6379 | 6379 |
| Prometheus | 9090 | 9090 |
| Grafana | 3030 | 3030 |

---

## Shared packages (monorepo)

- **config** — Env, ports, DB/Redis config.
- **logger** — Structured logging.
- **queue-lib** — BullMQ producers/consumers (Node).
- **resume-nlp** — NLP helpers (Node).
- **role-matching** — Matching/scoring logic.

Workers and APIs use these packages for consistency and reuse.

---

## Related docs

- [System design](../system-design/Resume_Inteligence_Platform_System_Design.png) · [Processing flow](../system-design/Resume_Processing_Job_Flow.png)
- [Infrastructure](../../infra/README.md) — Compose files, Swarm, backup, monitoring.
- [Runbooks](../runbooks/README.md) — Operations and incident response.
