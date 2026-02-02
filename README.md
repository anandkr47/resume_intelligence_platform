# Resume Intelligence Platform

An automated, scalable resume parsing and analytics platform that processes resumes, extracts key information, matches candidates to job roles, and provides actionable insights.

## Features

- **Multi-format upload** — PDF, DOCX, and image formats
- **OCR processing** — Text extraction from scanned documents (Tesseract)
- **NLP extraction** — Skills, experience, education, contact info
- **Role matching** — Resume-to-job matching with scoring
- **Analytics dashboard** — Skills, experience, education, match insights
- **CSV export** — Export parsed resume data
- **Scalable architecture** — Queue-based microservices, Docker Swarm
- **Load testing** — k6 for capacity planning

## System design

High-level architecture of the Resume Intelligence Platform:

![Resume Intelligence System Design](docs/system-design/Resume_Inteligence_System_Design.png)

---

## Tech Stack

| Layer        | Technology                          |
|-------------|--------------------------------------|
| Frontend    | React, TypeScript, Vite, Tailwind, ApexCharts |
| API         | Node.js, TypeScript, Fastify        |
| Queue       | BullMQ (Redis)                       |
| OCR         | Tesseract (Python)                   |
| Parser/NLP  | Python (SpaCy) / Node.js             |
| Database    | PostgreSQL                           |
| Monorepo    | Turborepo, pnpm                      |
| Deployment  | Docker, Docker Compose, Docker Swarm |

---

## Project Structure

```
resume-intelligence-platform/
├── apps/                          # Deployable applications
│   ├── api-gateway-node/          # API gateway (entry point, proxies)
│   ├── upload-service-node/       # File upload, queue OCR/parser jobs
│   ├── analytics-api-node/       # Dashboard, jobs, resumes, export APIs
│   ├── matcher-worker-node/       # BullMQ worker: resume–job matching
│   ├── export-worker-node/       # BullMQ worker: CSV export
│   ├── ocr-worker-python/        # OCR text extraction (Redis list)
│   ├── parser-worker-python/     # Resume parsing (Redis list)
│   ├── insights-worker-python/  # Insights aggregation (Redis list)
│   └── frontend-dashboard/       # React SPA
├── packages/                     # Shared libraries
│   ├── config/                   # Shared config (env, ports)
│   ├── logger/                   # Shared logger
│   ├── queue-lib/                # BullMQ producers/consumers
│   ├── resume-nlp/               # NLP utilities (Node)
│   └── role-matching/            # Matching/scoring logic
├── infra/                        # Infrastructure config (see infra/README.md)
│   ├── docker-compose/           # Compose files (dev, prod, microservices)
│   ├── swarm/                    # Docker Swarm stack
│   ├── ansible/                  # Server provisioning
│   ├── backup/                   # Backup scripts (Postgres, Redis)
│   ├── docker/                   # Monitoring stack (Prometheus, Grafana, Loki)
│   ├── health-checks/            # Health check script
│   ├── monitoring/               # Prometheus, Grafana, Alertmanager
│   └── postgres/                 # Init SQL and migrations
├── docs/                         # Documentation
│   └── system-design/            # System design diagrams
├── scripts/                      # Build, deploy, seed, migrate, stop-swarm
├── load-testing/                 # k6 configs
├── package.json                  # Root scripts, turbo
├── pnpm-workspace.yaml
└── turbo.json
```

---

## Prerequisites

- **Node.js** 18+
- **pnpm** 8+ — `npm install -g pnpm`
- **Docker** and **Docker Compose**
- **Python 3.9+** (optional, for local parser/OCR development)

---

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd resume-intelligence-platform
pnpm install
```

### 2. Environment

```bash
cp .env.example .env
# Edit .env (DB, Redis, ports, etc.)
```

### 3. Build

```bash
pnpm build
```

---

## Startup

### Option A: Docker Compose (all microservices)

Start everything (PostgreSQL, Redis, gateway, APIs, workers, frontend):

```bash
# Use existing images
pnpm run docker:microservices

# Or build images then start
pnpm run docker:start:build

# Or use the script (with status/output)
pnpm run docker:start
./scripts/start-all-services.sh --build

# Full stack with monitoring (Prometheus, Grafana, Loki)
pnpm run docker:start:full
```

Direct Compose:

```bash
docker-compose -f infra/docker-compose/docker-compose.microservices.yml up -d
```

### Option B: Local development (infra in Docker)

1. Start only PostgreSQL and Redis:

```bash
pnpm run docker:dev
# Or: docker-compose -f infra/docker-compose/docker-compose.dev.yml up
```

2. Run apps locally (separate terminals):

```bash
pnpm --filter @resume-platform/api-gateway dev
pnpm --filter @resume-platform/upload-service dev
pnpm --filter @resume-platform/analytics-api dev
pnpm --filter @resume-platform/frontend-dashboard dev
# Workers: matcher-worker-node, ocr-worker-python, parser-worker-python, etc.
```

### Option C: Docker Swarm (production-style)

```bash
docker swarm init
pnpm run swarm:deploy
# Check: docker stack services resume-platform
```

Stop Swarm stack:

```bash
pnpm run swarm:stop
# Or: bash scripts/stop-swarm.sh
```

---

## Access

| Service        | URL                    |
|----------------|------------------------|
| Frontend       | http://localhost:80 (Compose) or :8080 (local dev) |
| API Gateway    | http://localhost:3000  |
| Upload Service | http://localhost:3001  |
| Analytics API  | http://localhost:3002  |
| PostgreSQL     | localhost:5432         |
| Redis          | localhost:6379         |

Health: `curl http://localhost:3000/health`

---

## Scripts (root)

| Script              | Description                    |
|---------------------|--------------------------------|
| `pnpm build`        | Build all packages/apps        |
| `pnpm dev`          | Run all apps in dev            |
| `pnpm lint`         | Lint                           |
| `pnpm type-check`   | TypeScript check               |
| `pnpm docker:dev`   | Start dev Compose (e.g. DB, Redis) |
| `pnpm docker:microservices` | Start full microservices stack |
| `pnpm docker:start` | Start via start-all-services.sh |
| `pnpm docker:start:build` | Build and start            |
| `pnpm docker:down`  | Stop Compose stack             |
| `pnpm docker:logs`  | Follow logs                    |
| `pnpm seed:jobs`    | Seed job roles (bash scripts/seed-jobs.sh) |
| `pnpm swarm:deploy` | Deploy Swarm stack             |
| `pnpm swarm:stop`   | Remove Swarm stack             |
| `pnpm load-test`    | Run k6 upload test             |

---

## Database and data

- **Migrations:** `./scripts/migrate-db.sh`
- **Backup:** `pnpm infra:backup:postgres` or `./infra/backup/scripts/backup-postgres.sh`
- **Seed jobs:** `pnpm run seed:jobs` (or `bash scripts/seed-jobs.sh`)

---

## Troubleshooting

- **Port in use:** Change port in Compose or stop the process using the port (e.g. `lsof -i :3000`).
- **Services not starting:** Check `docker-compose ... logs` and ensure PostgreSQL/Redis are up first.
- **Queue jobs not running:** Verify Redis is running and worker containers (matcher, ocr, parser) are up.
- **DB connection errors:** Confirm `.env` and that Postgres is ready before starting app services.

---

## License

MIT
