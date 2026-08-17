# Client User Guide: Medical Policy Reading & Real-Time Documentation Pipeline

**System Name:** Helena Taylor Clinical Documentation Suite  
**Compliance Standard:** HIPAA Privacy & Security Rules • HITECH Act • SOC 2 Type II • GDPR  
**Version:** 1.0.0 Production  

---

## 1. Executive Summary & Purpose

The **Medical Policy Reading & Real-Time Documentation Pipeline** is an enterprise clinical web application designed for medical directors, practice owners, head nurses, clinic managers, and staff nurses. It provides:

1. **High-Contrast Clinical Policy Reader:** Dense, distraction-free reading of hospital SOPs, surgical protocols, and ICD-10/CPT coverage criteria.
2. **Instant Document Upload & Ingestion:** Upload hospital policy files (`.pdf`, `.docx`, `.txt`, `.md`) with automatic section partitioning and Protected Health Information (PHI) sanitization.
3. **Real-Time Staff Presence:** Live collaborator indicators showing which staff members are actively reviewing specific document sections.
4. **Tamper-Proof Cryptographic Audit Ledger:** Legally binding, append-only SHA-256 hash chains ($H_n$) recording every document view and section acknowledgment for non-repudiation and clinical regulatory compliance.

---

## 2. Access & Login Credentials Matrix

To access the system, navigate to the **Sign-In Portal** at `/auth/signin` and enter your assigned clinical credentials, or click your role card to auto-fill:

| User ID | Password | Clinical Title & Role | Department | Access Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **`ADMIN001`** | `admin` | **System Administrator** | IT & Compliance | Full administrative rights, policy management & audit exports |
| **`OWNER`** | `owner0123!` | **Practice Owner / CMO** | Executive Management | Executive review, policy approval, all departmental access |
| **`HEADNURSE`** | `headnurse0220!` | **Head Nurse / Director**| Nursing Administration| Clinical review, staff compliance sign-offs, SOP approvals |
| **`CLINICMANAGER`**| `clinicmanager1234...` | **Clinic Operations Manager** | Operations & Quality | Operations oversight, protocol compliance verification |
| **`OBNURSE1`** | `obnurse1234!` | **OB/GYN Staff Nurse I** | Obstetrics & Gynecology| OB/GYN protocol reading, clinical acknowledgments |
| **`OBNURSE2`** | `obnurse2234!` | **OB/GYN Staff Nurse II**| Obstetrics & Gynecology| OB/GYN protocol reading, clinical acknowledgments |

---

## 3. How to Upload Medical Policies & Protocols

The application starts with a clean slate ready for your clinic's authentic documents.

### Method A: Uploading Your Own File
1. Click the **"Upload Policy Document"** button in the top navigation bar (or on the empty state canvas).
2. **Drag and drop** your file (`.pdf`, `.docx`, `.txt`, `.md`, or `.json`) or click to browse.
3. The system will automatically populate the document text and extract the title.
4. Set the **Department**, **Category** (e.g. *ICD-10 Coverage*, *CPT Surgical*, *Oncology/Biologics*), and **CPT / ICD-10 Codes**.
5. Click **"Upload & Publish Policy"**.
6. The policy is instantly encrypted (AES-256-GCM), structured into reader sections, and sealed on the cryptographic audit ledger.

### Method B: Using Quick Clinical Templates
1. In the Upload Modal, click one of the quick template buttons:
   * **OB/GYN Protocol:** Pre-loads a comprehensive *Labor & Delivery Clinical Protocol: Oxytocin Induction & Fetal Monitoring* with CPT 59400/59510 and ICD-10 O80 codes.
   * **Surgical Time-Out:** Pre-loads the *Universal Protocol for Preventing Wrong Site, Wrong Procedure Surgery*.
2. Review the structured sections and click **"Upload & Publish Policy"**.

---

## 4. How to Read & Acknowledge Policies

1. **Select a Policy:** Click any policy pill in the top bar (e.g., `POL-OB-2026-101`) or search by title/code.
2. **Navigate Sections:** Use the **Table of Contents** on the left sidebar to jump between sections.
3. **Review Clinical Criteria:** Read the high-contrast clinical text, applicable ICD-10/CPT codes, and clinical authorities.
4. **Sign Compliance Review:**
   * At the bottom of the section, click **"Acknowledge & Sign Compliance Review"**.
   * A cryptographic SHA-256 hash block is generated and sealed in PostgreSQL under your authenticated User ID.
   * The section displays a green **"Compliance Acknowledged & Hash Sealed"** verification badge.

---

## 5. Real-Time Staff Presence & Collaboration

* The **Presence Bar** at the top of the reader displays your active clinical session and status.
* When multiple staff members are reviewing documents simultaneously, their color-coded avatars appear with live heartbeat pulses and the title of the section they are currently inspecting.

---

## 6. Inspecting the Cryptographic Audit Ledger

To verify the tamper-proof compliance record:
1. Click the **"Audit Trail"** button in the navigation bar.
2. A slide-over ledger drawer opens displaying the sequential block chain:
   * **Block #:** Sequential ledger index (e.g., Block #1001).
   * **Event Type:** `INGESTION_SEALED` or `SECTION_ACKNOWLEDGE`.
   * **Actor & Role:** Full name and staff role (e.g., *Dr. Helena Taylor (Owner)*).
   * **Timestamps:** Exact UTC timestamp down to milliseconds.
   * **Previous Hash ($H_{n-1}$):** Cryptographic link to the preceding block.
   * **Current Hash ($H_n$):** SHA-256 fingerprint ($\text{SHA256}(H_{n-1} \parallel \text{payload})$).
3. Click the **Copy** icon next to any hash to copy it for audit verification reports.
4. Attempted modifications or deletions are blocked at the database engine level.

---

## 7. Light & Dark Clinical Theme Modes

* Click the **Sun / Moon** icon in the upper right corner to toggle between:
  * **Dark Mode:** Deep Obsidian Slate palette optimized for low-light clinical workstations and reduced eye strain.
  * **Light Mode:** High-contrast Warm Alabaster palette with WCAG AAA accessibility for daytime reading.

---

## 8. Security & Data Protection Guarantee

* **Zero-Leakage Architecture:** Internal database schemas, microservices, and ports are completely obscured behind an opaque Backend-for-Frontend (BFF) layer.
* **Envelope Encryption:** Document chunks are encrypted at rest using AES-256-GCM with per-document Data Encryption Keys (DEKs) wrapped by a KMS Key Encryption Key (KEK).
* **Safe Harbor PHI Sanitization:** Microsoft Presidio scrubs direct patient identifiers before vector indexing or persistent caching.
* **Role-Based Row-Level Security (RLS):** All database transactions strictly enforce PostgreSQL session contexts (`SET LOCAL app.current_user_id`).
