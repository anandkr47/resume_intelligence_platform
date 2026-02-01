# Load Testing & Capacity

Load tests help find **upload capacity** (requests/sec, p95 latency) so you can size **Docker Swarm upload-service replicas** and scale the upload pool.

## Prerequisites

- **k6**: Not required on your machine. The npm scripts (`pnpm run load-test`, etc.) use `scripts/run-k6.sh`, which runs k6 via **Docker** (grafana/k6) if k6 is not in your PATH. Alternatively, [install k6](https://k6.io/docs/get-started/installation/) (e.g. `brew install k6`) for faster local runs.
- **Docker**: Required to run load tests if k6 is not installed.
- **Artillery** (optional): To run Artillery upload tests, install from repo root: `pnpm add -wD artillery form-data` then `pnpm install`.
- Stack running (local or Swarm). For gateway on host use default `BASE_URL=http://localhost:3000`; the script maps this to `host.docker.internal` when using Docker.

## Running Tests

### 1. Single-file upload (baseline)

```bash
# Via API gateway (default)
BASE_URL=http://localhost:3000 pnpm exec k6 run load-testing/k6/upload.test.js

# Or use npm script
pnpm run load-test
```

### 2. Capacity test (find max RPS)

Ramps VUs to 100 and holds; use output to see **sustainable RPS** and **p95** before errors rise.

```bash
BASE_URL=http://localhost:3000 pnpm exec k6 run load-testing/k6/upload-capacity.test.js
```

From the summary:
- **http_reqs** → requests per second (RPS) at peak
- **http_req_duration p(95)** → latency; if this exceeds threshold, add replicas or tune `UPLOAD_MAX_CONCURRENT`
- **http_req_failed** → error rate; keep &lt; 5–10%

### 3. Batch upload (multiple files per request)

```bash
BASE_URL=http://localhost:3000 FILES_PER_REQUEST=5 pnpm exec k6 run load-testing/k6/upload-batch.test.js
```

### 4. Artillery (alternative)

From repo root (so `form-data` is available):

```bash
cd load-testing/artillery && pnpm init -y && pnpm add form-data
# From repo root:
node -e "require('form-data')"  # or ensure form-data is in root package.json
artillery run load-testing/artillery/upload.yml
```

Or add to root: `pnpm add -wD artillery form-data` and `pnpm install`, then:

```bash
pnpm exec artillery run load-testing/artillery/upload.yml
```

## Interpreting Results

| Metric | Use |
|--------|-----|
| **RPS at target p95** | Sustainable throughput (e.g. 50 RPS at p95 &lt; 3s). |
| **Error rate** | Keep &lt; 5%; if higher, reduce load or add replicas. |
| **p95 latency** | If &gt; 5s, scale replicas or increase `UPLOAD_MAX_CONCURRENT` per replica. |

## Sizing upload-service replicas

1. Run **capacity test** against current replica count (e.g. 3).
2. Note **max RPS** where error rate stays &lt; 5% and p95 &lt; 5s → call this **RPS_per_replica** (approximate).
3. Choose **target_RPS** (e.g. 200 uploads/sec).
4. **Replicas** ≈ `target_RPS / RPS_per_replica` (round up).

Example: capacity test gives ~40 RPS per replica at 3 replicas → RPS_per_replica ≈ 40. For 200 RPS → 200/40 = 5 replicas.

## Scaling the upload pool (Docker Swarm)

After sizing:

```bash
# Scale to 5 upload-service replicas (stack name: resume-platform)
./scripts/scale-upload.sh 5

# Or manually
docker service scale resume-platform_upload-service-node=5
```

Check status:

```bash
docker service ps resume-platform_upload-service-node
docker service ls
```

## Capacity tuning (per replica)

Env vars (see `.env.swarm` and `deployments/swarm/stack.yml`):

| Variable | Meaning | Suggested |
|----------|---------|-----------|
| `DB_POOL_MAX` | Max DB connections per upload-service replica | 20 |
| `UPLOAD_MAX_CONCURRENT` | Max concurrent uploads per replica (0 = no limit) | 50 under burst |

Set before deploy or override in stack env. More replicas = more total capacity; `UPLOAD_MAX_CONCURRENT` caps concurrency per process to avoid OOM under burst.
