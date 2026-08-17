# Coolify Self-Hosted PaaS Deployment Guide

**Application:** Medical Policy Reading & Real-Time Documentation Pipeline  
**Target Environment:** Self-Hosted Coolify (Docker Engine with Traefik Edge Proxy)  
**Security Architecture:** Zero-Leakage Mesh (`internal: true` bridge network)

---

## Architecture Overview in Coolify

When deployed to Coolify via `docker-compose.yml`, the application provisions an isolated 8-tier micro-pipeline:

```
[ Public Client / Browser ]
           │
           │ HTTPS / WSS (:443 - TLS Terminated via Traefik)
           ▼
[ Traefik Edge Proxy ] ────────► [ Next.js 14+ BFF Layer (:3000) ]
                                          │
    ┌─────────────────────────────────────┴─────────────────────────────────────┐
    │                Isolated Internal Mesh Network (internal: true)             │
    ▼                                     ▼                                     ▼
[ PHP 8.3 PSR-15 Gateway ]     [ Node.js WebSocket Engine ]     [ Keycloak 24 IAM ]
  - Scopes DB RLS Context        - Real-Time Staff Presence       - OIDC & WebAuthn
    │                                     │                                     │
    ├─────────────────────────────────────┼─────────────────────────────────────┤
    ▼                                     ▼                                     ▼
[ Redis 7 Cluster ] ─────────► [ Python 3.12 Presidio Worker ] ─► [ PostgreSQL 16 DB ]
  - Ephemeral Presence Bus       - PyMuPDF OCR Layout Sorting       - pgvector Extension
  - Celery / DLQ Streams         - Presidio PHI Sanitization        - SHA-256 Hash Trigger
  - OIDC Revocation Blacklist    - AES-256 Envelope Encryption      - Row-Level Security
```

---

## Step 1: Push Code to Your GitHub Account

Ensure your local repository at `/home/nagumo/.gemini/antigravity-ide/scratch/clinical-policy-pipeline` is committed and pushed to your GitHub account:

```bash
cd /home/nagumo/.gemini/antigravity-ide/scratch/clinical-policy-pipeline

# 1. Initialize git (if not already done)
git init

# 2. Add all project files
git add .

# 3. Commit
git commit -m "feat: Medical Policy Reading & Documentation Pipeline"

# 4. Set main branch
git branch -M main

# 5. Link to your GitHub repository
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/clinical-policy-pipeline.git

# 6. Push
git push -u origin main
```

---

## Step 2: Deploy in Coolify Dashboard

1. **Log in to your Coolify Instance:** Open your self-hosted Coolify web dashboard (e.g. `https://coolify.yourdomain.com`).
2. **Create New Project / Resource:**
   - Click on **Projects** → Select or create your Clinical Project.
   - Click **+ New Resource** → Select **Docker Compose**.
3. **Connect GitHub Source:**
   - Select **GitHub** as the source (using your logged-in GitHub integration).
   - Select your repository: `clinical-policy-pipeline`.
   - Set the Branch: `main`.
4. **Environment Variables Configuration:**
   In the **Environment Variables** tab in Coolify, add the following production variables:

   ```ini
   NODE_ENV=production
   NEXTAUTH_SECRET=clinical_prod_secret_9941a82c_secure
   NEXTAUTH_URL=https://policies.yourhospital.org

   POSTGRES_DB=clinical_db
   POSTGRES_USER=clinical_admin
   POSTGRES_PASSWORD=generate_strong_postgres_password_here
   
   REDIS_PASSWORD=generate_strong_redis_password_here
   
   APP_MASTER_KEK=generate_32_character_aes_kek_key_12345678
   
   KEYCLOAK_ADMIN=admin
   KEYCLOAK_ADMIN_PASSWORD=generate_strong_keycloak_password
   ```

5. **Deploy Resource:**
   - Click **Deploy**.
   - Coolify will build and start all 8 containers, establish the `clinical-internal-mesh` network, configure Traefik TLS routing, and initialize the PostgreSQL schema.
6. **Assign Public FQDN:**
   - In Coolify, set the Domains field for `nextjs-bff` to `https://policies.yourhospital.org`.
   - Traefik will automatically issue a Let's Encrypt SSL/TLS certificate.

---

## Resource Sizing in Coolify

| Service | Memory Limit | CPU Limit | Purpose |
| :--- | :--- | :--- | :--- |
| `traefik` | `512 MB` | `1.0 Core` | Public HTTPS edge routing & diagnostic header stripping |
| `nextjs-bff` | `2048 MB` | `2.0 Cores` | Server Actions, SSR reader canvas, opaque API proxy |
| `php-gateway` | `1024 MB` | `1.5 Cores` | PSR-15 RBAC enforcement & PostgreSQL RLS injector |
| `node-presence-ws`| `512 MB` | `1.0 Core` | Real-time WebSocket presence heartbeats |
| `python-doc-worker`| `4096 MB` | `4.0 Cores` | Presidio NLP model (`en_core_web_lg`) & PyMuPDF OCR |
| `postgres-db` | `3072 MB` | `2.0 Cores` | PostgreSQL 16, pgvector, AES-256 chunks, SHA-256 triggers |
| `redis-cluster` | `1024 MB` | `1.0 Core` | Ephemeral presence sliding window, Celery DLQ, AOF |
| `keycloak-iam` | `2048 MB` | `2.0 Cores` | OpenID Connect, WebAuthn FIDO2, backchannel logout |

---

## Healthcheck & Verification in Coolify

After deployment, verify the container states in Coolify:
- `curl -s -I https://policies.yourhospital.org/` → Returns `HTTP/1.1 200 OK` with `X-Frame-Options: DENY`.
- `docker ps` → All 8 containers show `Up (healthy)`.
- Database verifies sequential SHA-256 trigger on `clinical_core.audit_logs`.
