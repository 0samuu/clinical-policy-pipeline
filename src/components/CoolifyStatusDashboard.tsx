'use client';

import React, { useState } from 'react';
import { 
  Server, Shield, Database, Cpu, HardDrive, 
  CheckCircle2, RefreshCw, GitBranch, Terminal, 
  ExternalLink, Layers, Network, Lock, Zap 
} from 'lucide-react';

export function CoolifyStatusDashboard() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployLogs, setDeployLogs] = useState<string[]>([
    "[Coolify PaaS] Mesh network 'clinical-internal-mesh' (internal: true) initialized.",
    "[Coolify PaaS] Traefik v3.0 reverse proxy listening on :443 (TLS auto-renewed).",
    "[Next.js BFF] App Router container healthy (Memory: 214MB / 2048MB Limit).",
    "[PHP Gateway] PHP 8.3-FPM PSR-15 Gateway listening on internal :8000.",
    "[Python Worker] PyMuPDF + Presidio model (en_core_web_lg) loaded into memory.",
    "[Redis 7] Stream consumer group 'group:doc_processors' connected (AOF active).",
    "[PostgreSQL 16] pgvector extension active, RLS enforced on clinical_core schema.",
    "[Keycloak 24] OIDC Realm 'clinical-realm' ready with RFC 8693 backchannel logout webhook."
  ]);

  const services = [
    { name: 'clinical-traefik-proxy', role: 'Edge Ingress & TLS Termination', status: 'Healthy', port: '443/TCP (Public)', mem: '42MB / 512MB', cpu: '0.4%' },
    { name: 'clinical-nextjs-bff', role: 'Next.js 14+ App Router & Server Actions', status: 'Healthy', port: '3000/TCP (Mesh Only)', mem: '214MB / 2048MB', cpu: '1.2%' },
    { name: 'clinical-php-gateway', role: 'PHP 8.3 PSR-15 RBAC & RLS Gateway', status: 'Healthy', port: '8000/TCP (Internal)', mem: '128MB / 1024MB', cpu: '0.8%' },
    { name: 'clinical-ws-presence', role: 'Node.js WebSocket Presence Engine', status: 'Healthy', port: '3001/TCP (Mesh Only)', mem: '68MB / 512MB', cpu: '0.5%' },
    { name: 'clinical-python-worker', role: 'PyMuPDF + Presidio PHI Worker', status: 'Healthy', port: 'None (Celery/Redis Queue)', mem: '1,840MB / 4096MB', cpu: '2.1%' },
    { name: 'clinical-postgres-db', role: 'PostgreSQL 16 + pgvector (RLS + Triggers)', status: 'Healthy', port: '5432/TCP (Internal)', mem: '480MB / 3072MB', cpu: '1.5%' },
    { name: 'clinical-redis-mesh', role: 'Redis 7 Ephemeral Presence & DLQ', status: 'Healthy', port: '6379/TCP (Internal)', mem: '84MB / 1024MB', cpu: '0.6%' },
    { name: 'clinical-keycloak-iam', role: 'Keycloak 24 OIDC + WebAuthn FIDO2', status: 'Healthy', port: '8080/TCP (Mesh Proxy)', mem: '620MB / 2048MB', cpu: '1.1%' },
  ];

  const handleTriggerDeploy = () => {
    setIsDeploying(true);
    setDeployLogs(prev => [
      `[${new Date().toLocaleTimeString()}] Git webhook received: refs/heads/main @ commit a49f2b1`,
      `[${new Date().toLocaleTimeString()}] Building container images in parallel...`,
      ...prev
    ]);

    setTimeout(() => {
      setIsDeploying(false);
      setDeployLogs(prev => [
        `[${new Date().toLocaleTimeString()}] Zero-downtime deployment finished successfully. Mesh healthy.`,
        ...prev
      ]);
    }, 2200);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-surface-card border border-border-subtle rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-text-primary">Coolify Self-Hosted Mesh Topology</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                ALL 8 SERVICES HEALTHY
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Isolated internal Docker bridge network (`internal: true`). Only Next.js is bound to public ingress.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleTriggerDeploy}
            disabled={isDeploying}
            id="btn-coolify-deploy"
            className="px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold flex items-center space-x-2 shadow-sm transition-all"
          >
            {isDeploying ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <span>{isDeploying ? 'Deploying to Coolify...' : 'Trigger Git-Push Deploy'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Microservices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((svc) => (
          <div
            key={svc.name}
            className="p-4 rounded-xl bg-surface-card border border-border-subtle hover:border-brand-primary/40 transition-all space-y-3 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-text-primary truncate" title={svc.name}>
                {svc.name}
              </span>
              <span className="flex items-center space-x-1 text-[10px] font-mono text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{svc.status}</span>
              </span>
            </div>

            <div className="text-[11px] text-text-muted leading-snug">
              {svc.role}
            </div>

            <div className="pt-2 border-t border-border-subtle space-y-1 text-[10px] font-mono text-text-muted">
              <div className="flex justify-between">
                <span>Binding:</span>
                <span className="text-text-primary">{svc.port}</span>
              </div>
              <div className="flex justify-between">
                <span>RAM Usage:</span>
                <span className="text-text-primary">{svc.mem}</span>
              </div>
              <div className="flex justify-between">
                <span>CPU Load:</span>
                <span className="text-text-primary">{svc.cpu}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Network & Zero-Leakage Topology Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-surface-card border border-border-subtle rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 text-text-primary font-bold text-sm">
            <Network className="w-4 h-4 text-brand-primary" />
            <span>Network Boundaries & Zero-Leakage Enforcement</span>
          </div>

          <div className="space-y-2.5 text-xs text-text-muted leading-relaxed">
            <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle flex items-start space-x-2.5">
              <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-text-primary">Opaque Next.js BFF Layer:</span>
                <p>No browser requests ever contact PHP, Python, or PostgreSQL directly. All calls go through Next.js Server Actions.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle flex items-start space-x-2.5">
              <Shield className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-text-primary">Diagnostic Header Stripping:</span>
                <p>Traefik & Next.js suppress `X-Powered-By`, `Server`, and framework telemetry across all HTTP/WSS responses.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle flex items-start space-x-2.5">
              <Database className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-text-primary">Envelope Encryption (AES-256-GCM):</span>
                <p>Per-document DEKs are wrapped with a KMS Master KEK. PostgreSQL chunks are encrypted before write.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Coolify Deployment Logs */}
        <div className="lg:col-span-6 bg-surface-card border border-border-subtle rounded-2xl p-6 space-y-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-text-primary font-bold text-sm">
              <Terminal className="w-4 h-4 text-brand-primary" />
              <span>Coolify Orchestration Log Stream</span>
            </div>
            <span className="text-[10px] font-mono text-text-muted">Live Stream</span>
          </div>

          <div className="flex-1 bg-surface-bg border border-border-subtle rounded-xl p-4 font-mono text-[11px] text-text-muted overflow-y-auto max-h-56 space-y-1.5">
            {deployLogs.map((log, idx) => (
              <div key={idx} className="leading-snug">
                {log.includes('successfully') ? (
                  <span className="text-emerald-500 font-semibold">{log}</span>
                ) : log.includes('error') ? (
                  <span className="text-rose-500 font-semibold">{log}</span>
                ) : (
                  <span>{log}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
