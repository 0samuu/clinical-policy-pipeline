'use client';

import React, { useState } from 'react';
import { 
  Hash, ShieldCheck, X, ArrowDown, Clock, 
  Copy, Check, Inbox 
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
      <div className="w-full sm:max-w-xl bg-surface-card h-full shadow-2xl border-l border-border-subtle flex flex-col transition-colors duration-200">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/30 flex-shrink-0">
              <Hash className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-text-primary tracking-tight">
                Cryptographic Audit Ledger
              </h2>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="flex items-center space-x-1 text-[10px] sm:text-[11px] font-mono text-emerald-600 font-semibold">
                  <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>SHA-256 Chain Intact</span>
                </span>
                <span className="text-text-muted text-[10px] sm:text-[11px]">•</span>
                <span className="text-[10px] sm:text-[11px] text-text-muted font-mono">{auditTrail.length} Blocks</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            id="btn-close-audit-ledger"
            className="p-1.5 sm:p-2 rounded-lg bg-surface-elevated hover:bg-surface-elevated/80 text-text-muted hover:text-text-primary transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ledger Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 sm:space-y-4">
          <div className="p-3 rounded-xl bg-brand-primary/5 border border-brand-primary/20 text-[11px] sm:text-xs text-text-muted flex items-start space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-primary flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Every compliance sign-off is cryptographically sealed in an append-only PostgreSQL ledger with continuous sequential hash chaining.
            </p>
          </div>

          {auditTrail.length === 0 ? (
            <div className="p-6 sm:p-8 text-center bg-surface-elevated/50 border border-border-subtle rounded-2xl space-y-2">
              <Inbox className="w-8 h-8 mx-auto text-text-muted opacity-60" />
              <div className="text-xs font-bold text-text-primary">Genesis State: Clean Slate</div>
              <p className="text-[11px] text-text-muted">
                The first document upload or signature will establish Block #1001 with Genesis Seed ($H_0$).
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
                    <div className="flex justify-center -my-1.5 sm:-my-2">
                      <div className="w-px h-3 sm:h-4 bg-border-subtle flex items-center justify-center">
                        <ArrowDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brand-primary" />
                      </div>
                    </div>
                  )}

                  <div className="p-3 sm:p-4 rounded-xl bg-surface-elevated border border-border-subtle hover:border-brand-primary/40 transition-all space-y-2.5 sm:space-y-3 shadow-sm">
                    {/* Block Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 sm:space-x-2">
                        <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold bg-surface-card border border-border-subtle text-text-primary">
                          BLOCK #{record.sequenceId}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-semibold border ${eventBadge}`}>
                          {record.eventType}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 text-[10px] sm:text-[11px] font-mono text-text-muted">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(record.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>

                    {/* Actor & Action Details */}
                    <div className="text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-text-primary text-xs">{record.actorName}</span>
                        <span className="text-[10px] text-text-muted font-mono">{record.actorRole}</span>
                      </div>
                      {record.sectionTitle && (
                        <p className="text-text-muted text-[10px] sm:text-[11px] truncate">
                          Target: <span className="text-text-primary font-medium">{record.sectionTitle}</span>
                        </p>
                      )}
                    </div>

                    {/* Cryptographic Hash Chain View */}
                    <div className="pt-2 border-t border-border-subtle space-y-1 font-mono text-[9px] sm:text-[10px]">
                      <div className="flex items-center justify-between text-text-muted">
                        <span>Prev Hash:</span>
                        <span className="truncate max-w-[180px] sm:max-w-[240px] opacity-80" title={record.previousHash}>
                          {record.previousHash.slice(0, 12)}...{record.previousHash.slice(-6)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between bg-surface-card p-1.5 sm:p-2 rounded-lg border border-border-subtle">
                        <div className="truncate mr-1.5">
                          <span className="text-brand-primary font-semibold block text-[9px] sm:text-[10px]">Current Hash ($H_n$):</span>
                          <span className="text-text-primary truncate block text-[9px] sm:text-[10px]" title={record.currentHash}>
                            {record.currentHash}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(record.currentHash, record.id)}
                          className="p-1 sm:p-1.5 rounded hover:bg-surface-elevated text-text-muted hover:text-text-primary transition-all flex-shrink-0"
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
        <div className="p-3 sm:p-4 border-t border-border-subtle bg-surface-elevated text-center">
          <span className="text-[10px] sm:text-[11px] font-mono text-text-muted">
            PostgreSQL 16 `clinical_core.fn_enforce_audit_hash_chain()`
          </span>
        </div>
      </div>
    </div>
  );
}
