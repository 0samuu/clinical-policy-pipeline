# Medical Policy Reading & Real-Time Documentation Pipeline

[![HIPAA Compliant](https://img.shields.io/badge/Security-HIPAA%20%2F%20GDPR-0E7490.svg)](#)
[![Next.js 14](https://img.shields.io/badge/Frontend-Next.js%2014%20App%20Router-black.svg)](https://nextjs.org/)
[![PostgreSQL 16](https://img.shields.io/badge/Database-PostgreSQL%2016%20%2B%20pgvector-336791.svg)](https://www.postgresql.org/)
[![Coolify PaaS](https://img.shields.io/badge/Deploy-Coolify%20Self--Hosted-purple.svg)](https://coolify.io/)

An enterprise-grade, zero-leakage web application for hospitals and medical practices, featuring dense clinical policy reading, drag-and-drop document upload, real-time multi-staff presence, and append-only cryptographic SHA-256 audit ledger.

---

## 🌟 Key Features

* **Dense Clinical Policy Reader:** High-contrast reading canvas optimized for medical directives, ICD-10, and CPT surgical codes.
* **Document Ingestion Engine:** Drag-and-drop file upload (`.pdf`, `.docx`, `.txt`, `.md`) with automatic section partitioning.
* **Cryptographic Tamper-Proof Audit:** Automated sequential SHA-256 hash chains ($H_n$) triggered on every compliance sign-off.
* **Real-Time Staff Presence:** Live collaborator avatars with heartbeat pulses backed by Redis mesh.
* **Zero-Leakage BFF Architecture:** Opaque Next.js Server Actions concealing internal microservices from client inspection.
* **Clinical Theme Engine:** Tailored Helena Taylor design tokens supporting both High-Contrast Light and Low-Eye-Strain Dark modes.

---

## 🔐 Clinical Staff Login Matrix

| User ID | Password | Role | Department |
| :--- | :--- | :--- | :--- |
| `ADMIN001` | `admin` | System & Policy Admin | IT & Clinical Compliance |
| `OWNER` | `owner0123!` | Medical Practice Owner / CMO | Executive Management |
| `HEADNURSE` | `headnurse0220!` | Head Nurse / Director of Nursing | Nursing Administration |
| `CLINICMANAGER` | `clinicmanager1234...` | Clinic Operations Manager | Operations & Quality |
| `OBNURSE1` | `obnurse1234!` | OB/GYN Staff Nurse I | Obstetrics & Gynecology |
| `OBNURSE2` | `obnurse2234!` | OB/GYN Staff Nurse II | Obstetrics & Gynecology |

---

## 🚀 Coolify Self-Hosted Deployment

This project includes a production-ready `docker-compose.yml` orchestrating all 8 microservices:
1. `traefik` (Edge HTTPS routing & diagnostic header stripping)
2. `nextjs-bff` (Next.js 14+ App Router on port `:3000`)
3. `php-gateway` (PHP 8.3 PSR-15 API gateway with PostgreSQL RLS context injection)
4. `node-presence-ws` (Node.js WebSocket presence engine)
5. `python-doc-worker` (Presidio PHI sanitization & PyMuPDF OCR worker)
6. `postgres-db` (PostgreSQL 16 + pgvector with hash triggers)
7. `redis-cluster` (Redis 7 AOF persistence)
8. `keycloak-iam` (OIDC IAM & WebAuthn)

### Quick Deploy in Coolify:
1. In your Coolify instance, create a **Docker Compose** resource from this GitHub repository (`0samuu/clinical-policy-pipeline`).
2. Add the environment variables from `.env.example`.
3. Click **Deploy**.

---

## 📖 Documentation
* [CLIENT_USER_GUIDE.md](./CLIENT_USER_GUIDE.md): Client instructions for medical staff and practice owners.
* [COOLIFY_DEPLOYMENT_GUIDE.md](./COOLIFY_DEPLOYMENT_GUIDE.md): Detailed infrastructure and container sizing specs.
