-- =============================================================================
-- MEDICAL POLICY READING & REAL-TIME DOCUMENTATION PIPELINE
-- POSTGRESQL 16 HARDENED DDL WITH ROW-LEVEL SECURITY & CRYPTOGRAPHIC HASH CHAIN
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

CREATE SCHEMA IF NOT EXISTS clinical_core;
CREATE SCHEMA IF NOT EXISTS iam_keycloak;

SET search_path TO clinical_core, public;

-- Master Reference Tables
CREATE TABLE clinical_core.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE clinical_core.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_key VARCHAR(64) NOT NULL UNIQUE,
    role_name VARCHAR(128) NOT NULL,
    permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE clinical_core.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    oidc_sub VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    department_id UUID NOT NULL REFERENCES clinical_core.departments(id) ON DELETE RESTRICT,
    role_id UUID NOT NULL REFERENCES clinical_core.roles(id) ON DELETE RESTRICT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    mfa_enforced BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE INDEX idx_users_oidc_sub ON clinical_core.users(oidc_sub);
CREATE INDEX idx_users_dept_role ON clinical_core.users(department_id, role_id);

-- Documents & Encrypted Chunks
CREATE TABLE clinical_core.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_number VARCHAR(64) NOT NULL UNIQUE,
    title VARCHAR(512) NOT NULL,
    category VARCHAR(128) NOT NULL,
    version VARCHAR(32) NOT NULL DEFAULT '1.0.0',
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
    department_id UUID NOT NULL REFERENCES clinical_core.departments(id) ON DELETE RESTRICT,
    created_by UUID NOT NULL REFERENCES clinical_core.users(id),
    dek_encrypted BYTEA NOT NULL,
    dek_iv BYTEA NOT NULL,
    dek_tag BYTEA NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE INDEX idx_documents_dept_status ON clinical_core.documents(department_id, status);

CREATE TABLE clinical_core.document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES clinical_core.documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    section_title VARCHAR(255) NOT NULL,
    page_number INTEGER NOT NULL,
    encrypted_content BYTEA NOT NULL,
    content_iv BYTEA NOT NULL,
    content_tag BYTEA NOT NULL,
    scrubbed_snippet TEXT NOT NULL,
    embedding vector(1536),
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    CONSTRAINT uq_doc_chunk_idx UNIQUE(document_id, chunk_index)
);

CREATE INDEX idx_doc_chunks_doc_id ON clinical_core.document_chunks(document_id);

-- Active Presence
CREATE TABLE clinical_core.active_presences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES clinical_core.users(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES clinical_core.documents(id) ON DELETE CASCADE,
    session_id VARCHAR(128) NOT NULL,
    current_section VARCHAR(255),
    last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    client_ip_hash VARCHAR(64) NOT NULL,
    CONSTRAINT uq_user_doc_session UNIQUE(user_id, document_id, session_id)
);

-- Cryptographic Audit Ledger
CREATE TABLE clinical_core.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_id BIGSERIAL UNIQUE,
    event_type VARCHAR(64) NOT NULL,
    actor_id UUID NOT NULL REFERENCES clinical_core.users(id),
    actor_role VARCHAR(64) NOT NULL,
    document_id UUID REFERENCES clinical_core.documents(id) ON DELETE SET NULL,
    section_id VARCHAR(255),
    action_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address_hash VARCHAR(64) NOT NULL,
    user_agent_snippet VARCHAR(255) NOT NULL,
    previous_hash VARCHAR(64) NOT NULL,
    current_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

-- Cryptographic Hash Trigger Function
CREATE OR REPLACE FUNCTION clinical_core.fn_enforce_audit_hash_chain()
RETURNS TRIGGER AS $$
DECLARE
    v_prev_hash VARCHAR(64);
    v_canonical_payload TEXT;
    v_genesis_seed CONSTANT VARCHAR(64) := '0000000000000000000000000000000000000000000000000000000000000000';
BEGIN
    PERFORM pg_advisory_xact_lock(987654321);

    SELECT current_hash INTO v_prev_hash
    FROM clinical_core.audit_logs
    ORDER BY sequence_id DESC
    LIMIT 1;

    IF v_prev_hash IS NULL THEN
        v_prev_hash := v_genesis_seed;
    END IF;

    v_canonical_payload := v_prev_hash || '|' ||
                           NEW.event_type || '|' ||
                           NEW.actor_id::text || '|' ||
                           NEW.actor_role || '|' ||
                           COALESCE(NEW.document_id::text, 'NULL') || '|' ||
                           COALESCE(NEW.section_id, 'NULL') || '|' ||
                           NEW.action_payload::text || '|' ||
                           NEW.ip_address_hash || '|' ||
                           to_char(NEW.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"');

    NEW.previous_hash := v_prev_hash;
    NEW.current_hash := encode(digest(v_canonical_payload, 'sha256'), 'hex');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_audit_logs_hash_chain
BEFORE INSERT ON clinical_core.audit_logs
FOR EACH ROW
EXECUTE FUNCTION clinical_core.fn_enforce_audit_hash_chain();

-- Immutability Enforcer Trigger
CREATE OR REPLACE FUNCTION clinical_core.fn_block_audit_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'CRITICAL SECURITY VIOLATION: Audit logs are immutable and cryptographically sealed. Operation % is strictly rejected under HIPAA/GDPR policies.', TG_OP
        USING ERRCODE = '28000';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_logs_immutability
BEFORE UPDATE OR DELETE ON clinical_core.audit_logs
FOR EACH ROW
EXECUTE FUNCTION clinical_core.fn_block_audit_mutation();

-- Row Level Security (RLS)
ALTER TABLE clinical_core.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_core.documents FORCE ROW LEVEL SECURITY;
ALTER TABLE clinical_core.document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_core.document_chunks FORCE ROW LEVEL SECURITY;
ALTER TABLE clinical_core.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_core.audit_logs FORCE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION clinical_core.current_app_user_id() RETURNS UUID AS $$
    SELECT NULLIF(current_setting('app.current_user_id', true), '')::UUID;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION clinical_core.current_app_user_role() RETURNS VARCHAR AS $$
    SELECT NULLIF(current_setting('app.current_user_role', true), '')::VARCHAR;
$$ LANGUAGE sql STABLE;

CREATE POLICY pol_documents_read ON clinical_core.documents
FOR SELECT
USING (
    clinical_core.current_app_user_role() IN ('ROLE_POLICY_ADMIN', 'ROLE_COMPLIANCE_OFFICER')
    OR status = 'APPROVED'
);

CREATE POLICY pol_audit_logs_select ON clinical_core.audit_logs
FOR SELECT
USING (
    clinical_core.current_app_user_role() IN ('ROLE_POLICY_ADMIN', 'ROLE_COMPLIANCE_OFFICER')
    OR actor_id = clinical_core.current_app_user_id()
);
