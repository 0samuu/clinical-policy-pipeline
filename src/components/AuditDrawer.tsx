'use client';

import React, { useState } from 'react';
import { 
  Hash, ShieldCheck, X, ArrowDown, Clock, 
  CheckCircle2, AlertTriangle, FileCode, Copy, Check, Inbox 
} from 'lucide-react';
import { AuditRecord } from '@/lib/types';

interface AuditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  auditTrail: AuditRecord[];
}

export function AuditDrawer({ isOpen, onClose, auditTrail }: AuditDrawerProps) {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-xl bg-surface-card h-full shadow-2xl border-l border-border-subtle flex flex-col transition-colors duration-200">
        {/* Header */}
        <div className="p-6 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary tracking-tight">
                Cryptographic Audit Ledger
              </h2>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="flex items-center space-x-1 text-[11px] font-mono text-emerald-600 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SHA-256 Hash Chain</span>
                </span>
                <span className="text-text-muted text-[11px]">•</span>
                <span className="text-[11px] text-text-muted font-mono">{auditTrail.length} Real Records</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            id="btn-close-audit-ledger"
            className="p-2 rounded-lg bg-surface-elevated hover:bg-surface-elevated/80 text-text-muted hover:text-text-primary transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ledger Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-brand-primary/5 border border-brand-primary/20 text-xs text-text-muted flex items-start space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Every document upload and staff compliance acknowledgment is cryptographically sealed in an append-only PostgreSQL ledger. Any mutation or deletion attempt triggers a database-level termination.
            </p>
          </div>

          {auditTrail.length === 0 ? (
            <div className="p-8 text-center bg-surface-elevated/50 border border-border-subtle rounded-2xl space-y-2">
              <Inbox className="w-8 h-8 mx-auto text-text-muted opacity-60" />
              <div className="text-xs font-bold text-text-primary">Genesis State: Clean Slate</div>
              <p className="text-[11px] text-text-muted">
                No compliance actions or uploads have been recorded yet. The first document upload or signature will establish Block #1001 with Genesis Seed ($H_0$).
              </p>
            </div>
          ) : (
            auditTrail.map((record, index) => {
              const eventBadge =
                record.eventType === 'SECTION_ACKNOWLEDGE' ? 'bg-amber-500/10 text-amber-600 border-amber-500/30' :
                record.eventType === 'INGESTION_SEALED' ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30' :
                record.eventType === 'RLS_SESSION_SCOPED' ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30' :
                'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';

              return (
                <div key={record.id} className="relative">
                  {index > 0 && (
                    <div className="flex justify-center -my-2">
                      <div className="w-px h-4 bg-border-subtle flex items-center justify-center">
                        <ArrowDown className="w-3 h-3 text-brand-primary" />
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-surface-elevated border border-border-subtle hover:border-brand-primary/40 transition-all space-y-3 shadow-sm">
                    {/* Block Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-surface-card border border-border-subtle text-text-primary">
                          BLOCK #{record.sequenceId}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${eventBadge}`}>
                          {record.eventType}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 text-[11px] font-mono text-text-muted">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(record.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>

                    {/* Actor & Action Details */}
                    <div className="text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-text-primary">{record.actorName}</span>
                        <span className="text-[11px] text-text-muted font-mono">{record.actorRole}</span>
                      </div>
                      {record.sectionTitle && (
                        <p className="text-text-muted text-[11px]">
                          Target: <span className="text-text-primary font-medium">{record.sectionTitle}</span>
                        </p>
                      )}
                    </div>

                    {/* Cryptographic Hash Chain View */}
                    <div className="pt-2 border-t border-border-subtle space-y-1.5 font-mono text-[10px]">
                      <div className="flex items-center justify-between text-text-muted">
                        <span>Prev Hash ($H_{'{n-1}'}$):</span>
                        <span className="truncate max-w-[240px] opacity-80" title={record.previousHash}>
                          {record.previousHash.slice(0, 16)}...{record.previousHash.slice(-8)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between bg-surface-card p-2 rounded-lg border border-border-subtle">
                        <div className="truncate mr-2">
                          <span className="text-brand-primary font-semibold block">Current Hash ($H_n$):</span>
                          <span className="text-text-primary truncate block" title={record.currentHash}>
                            {record.currentHash}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(record.currentHash, record.id)}
                          className="p-1.5 rounded hover:bg-surface-elevated text-text-muted hover:text-text-primary transition-all flex-shrink-0"
                          title="Copy SHA-256 Hash"
                        >
                          {copiedHash === record.id ? (
                            <Check className="w-3.5 h-3.5 text-clinical-success" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-subtle bg-surface-elevated text-center">
          <span className="text-[11px] font-mono text-text-muted">
            Validated by PostgreSQL 16 `clinical_core.fn_enforce_audit_hash_chain()`
          </span>
        </div>
      </div>
    </div>
  );
}
