'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle, ChevronRight, Lock, 
  Search, ShieldAlert, BookOpen, Clock, 
  Sparkles, Check, Hash, AlertCircle, FileCheck, 
  Upload, PlusCircle, Inbox 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PolicyDocument, PolicySection } from '@/lib/types';
import { recordSectionAcknowledgmentAction } from '@/app/actions/reader';
import { UserCredential } from '@/lib/auth';

interface DocumentReaderProps {
  policies: PolicyDocument[];
  selectedPolicyId: string | null;
  onSelectPolicy: (id: string) => void;
  onOpenUpload: () => void;
  onOpenAudit: () => void;
  currentUser: UserCredential;
}

export function DocumentReader({
  policies,
  selectedPolicyId,
  onSelectPolicy,
  onOpenUpload,
  onOpenAudit,
  currentUser,
}: DocumentReaderProps) {
  const currentDoc = policies.find((p) => p.id === selectedPolicyId) || policies[0] || null;
  const [activeSectionId, setActiveSectionId] = useState<string>(currentDoc?.sections?.[0]?.id || '');
  const [acknowledgedSections, setAcknowledgedSections] = useState<Set<string>>(new Set());
  const [isSigning, setIsSigning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSignedHash, setLastSignedHash] = useState<string | null>(null);

  useEffect(() => {
    if (currentDoc?.sections?.length) {
      setActiveSectionId(currentDoc.sections[0].id);
      setAcknowledgedSections(new Set());
    }
  }, [currentDoc]);

  const activeSection = currentDoc?.sections?.find((s) => s.id === activeSectionId) || currentDoc?.sections?.[0] || null;

  const handleSignCompliance = async () => {
    if (!activeSection || !currentDoc) return;
    setIsSigning(true);

    try {
      const result = await recordSectionAcknowledgmentAction({
        documentId: currentDoc.id,
        sectionId: activeSection.id,
        sectionTitle: activeSection.title,
        actorName: currentUser.name,
        actorRole: currentUser.role,
      });

      setAcknowledgedSections((prev) => new Set(prev).add(activeSection.id));
      setLastSignedHash(result.newAuditRecord.currentHash);

      // Micro-animation celebration
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#0E7490', '#60B4BF', '#F09020', '#10B981'],
      });
    } finally {
      setIsSigning(false);
    }
  };

  // Clean Slate Empty State View
  if (policies.length === 0) {
    return (
      <div className="bg-surface-card border border-border-subtle rounded-3xl p-8 sm:p-14 text-center shadow-clinical-card space-y-6 max-w-3xl mx-auto my-6 transition-colors duration-200">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
          <Inbox className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-text-primary tracking-tight">
            Clean Slate: No Medical Policies Uploaded Yet
          </h2>
          <p className="text-xs text-text-muted leading-relaxed">
            Upload your clinical guidelines, hospital SOPs, or OB/GYN protocols to initialize real-time documentation, multi-staff presence, and cryptographic audit hashing.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={onOpenUpload}
            id="btn-empty-state-upload"
            className="px-6 py-3 rounded-2xl bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-xs inline-flex items-center space-x-2 shadow-sm transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload First Medical Policy Document</span>
          </button>
        </div>

        <div className="pt-6 border-t border-border-subtle grid grid-cols-1 sm:grid-cols-3 gap-3 text-left text-xs text-text-muted">
          <div className="p-3 rounded-xl bg-surface-elevated space-y-1">
            <span className="font-bold text-text-primary block">1. File Ingestion</span>
            <p className="text-[11px]">Upload .pdf, .docx, .txt, or .md files. Headers and sections are parsed automatically.</p>
          </div>
          <div className="p-3 rounded-xl bg-surface-elevated space-y-1">
            <span className="font-bold text-text-primary block">2. Multi-Staff Review</span>
            <p className="text-[11px]">Attending doctors, head nurses, and managers collaborate with live presence pulses.</p>
          </div>
          <div className="p-3 rounded-xl bg-surface-elevated space-y-1">
            <span className="font-bold text-text-primary block">3. Cryptographic Proof</span>
            <p className="text-[11px]">Compliance sign-offs generate sequential SHA-256 blocks anchored in PostgreSQL.</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredPolicies = policies.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Selector & Search Bar */}
      <div className="bg-surface-card border border-border-subtle rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <span className="text-xs font-mono font-bold text-text-muted uppercase tracking-wider flex-shrink-0">
            Policies ({policies.length}):
          </span>
          {policies.map((p) => {
            const isSelected = p.id === currentDoc?.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPolicy(p.id)}
                id={`btn-select-policy-${p.id}`}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 border ${
                  isSelected
                    ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                    : 'bg-surface-elevated text-text-muted hover:text-text-primary border-border-subtle hover:border-brand-primary/30'
                }`}
              >
                <span>{p.policyNumber}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-surface-card text-text-muted'}`}>
                  v{p.version}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search ICD-10, CPT, Title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="input-policy-search"
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <button
            onClick={onOpenUpload}
            id="btn-add-more-policies"
            className="p-2 rounded-xl bg-surface-elevated hover:bg-surface-elevated/80 border border-border-subtle text-brand-primary"
            title="Upload Another Policy"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Clinical Reader Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Table of Contents */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-surface-card border border-border-subtle rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono text-brand-primary font-bold">
                  {currentDoc.category.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-mono text-emerald-600 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  {currentDoc.status}
                </span>
              </div>
              <h2 className="text-sm font-bold text-text-primary leading-tight">
                {currentDoc.title}
              </h2>
              <p className="text-[11px] text-text-muted mt-1">
                {currentDoc.department} • Author: {currentDoc.author}
              </p>
            </div>

            <hr className="border-border-subtle" />

            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted font-bold block">
                Policy Sections ({currentDoc.sections.length})
              </span>

              {currentDoc.sections.map((section) => {
                const isActive = section.id === activeSectionId;
                const isAck = acknowledgedSections.has(section.id);

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSectionId(section.id)}
                    id={`toc-btn-${section.id}`}
                    className={`w-full text-left p-3 rounded-xl text-xs font-medium transition-all flex items-center justify-between border ${
                      isActive
                        ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/40 shadow-sm'
                        : 'bg-surface-elevated text-text-muted hover:text-text-primary border-border-subtle hover:border-brand-primary/20'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate mr-2">
                      {isAck ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-accent flex-shrink-0 animate-pulse" />
                      )}
                      <span className="truncate font-semibold">{section.title}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isActive ? 'translate-x-0.5 text-brand-primary' : 'opacity-40'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audit Verification Link */}
          <div className="bg-surface-card border border-border-subtle rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-brand-primary text-xs font-bold">
              <ShieldAlert className="w-4 h-4 text-brand-primary" />
              <span>Signed by Current User: {currentUser.userId}</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Your staff acknowledgments are cryptographically sealed with previous hash chaining.
            </p>
            <button
              onClick={onOpenAudit}
              className="w-full py-2 rounded-xl bg-surface-elevated hover:bg-surface-elevated/80 border border-border-subtle text-[11px] font-mono text-text-primary font-semibold flex items-center justify-center space-x-2 transition-all"
            >
              <Clock className="w-3.5 h-3.5 text-brand-accent" />
              <span>Open Audit Trail</span>
            </button>
          </div>
        </div>

        {/* Right Area: Dense High-Contrast Clinical Viewer Canvas */}
        <div className="lg:col-span-8 space-y-6">
          {activeSection ? (
            <div className="bg-surface-card border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-clinical-card space-y-6 transition-colors duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-5">
                <div>
                  <span className="text-[11px] font-mono text-brand-primary font-bold uppercase tracking-wider">
                    Page {activeSection.pageNumber} of {currentDoc.sections.length} • Section Viewport
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight mt-1">
                    {activeSection.title}
                  </h3>
                </div>

                <span className={`self-start sm:self-auto px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                  activeSection.coverageStatus === 'MANDATORY'
                    ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/30'
                    : 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                }`}>
                  {activeSection.coverageStatus} COVERAGE
                </span>
              </div>

              {/* Codes */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono text-text-muted mr-1">Applicable Codes:</span>
                {activeSection.cptCodes.map((cpt) => (
                  <span key={cpt} className="px-2.5 py-1 rounded-lg bg-surface-elevated text-text-primary font-mono text-xs font-semibold border border-border-subtle">
                    {cpt}
                  </span>
                ))}
                {activeSection.icdCodes.map((icd) => (
                  <span key={icd} className="px-2.5 py-1 rounded-lg bg-surface-elevated text-brand-accent font-mono text-xs font-semibold border border-border-subtle">
                    {icd}
                  </span>
                ))}
              </div>

              {/* Text */}
              <div className="p-5 rounded-2xl bg-surface-elevated/40 border-l-4 border-brand-primary space-y-4">
                <p className="text-sm text-text-primary leading-relaxed font-sans font-medium whitespace-pre-line">
                  {activeSection.content}
                </p>
                <div className="text-[11px] font-mono text-text-muted pt-2 border-t border-border-subtle/60 flex items-center space-x-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Clinical Authority: {activeSection.guidelineExcerpt}</span>
                </div>
              </div>

              {/* Bottom Sign-off / Acknowledgment Footer */}
              <div className="pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2 text-xs text-text-muted font-mono">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Session: {currentUser.name} ({currentUser.userId})</span>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  {acknowledgedSections.has(activeSection.id) ? (
                    <div className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-semibold flex items-center justify-center space-x-2">
                      <Check className="w-4 h-4" />
                      <span>Compliance Acknowledged & Hash Sealed</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleSignCompliance}
                      disabled={isSigning}
                      id="btn-sign-compliance-action"
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold flex items-center justify-center space-x-2 shadow-sm transition-all"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>{isSigning ? 'Computing SHA-256...' : 'Acknowledge & Sign Compliance Review'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Last Signed Hash Preview */}
              {lastSignedHash && (
                <div className="p-3 rounded-xl bg-surface-elevated border border-border-subtle text-[11px] font-mono text-text-muted flex items-center justify-between">
                  <div className="truncate mr-2">
                    <span className="text-emerald-600 font-semibold mr-1">Sealed Block Hash:</span>
                    <span className="text-text-primary truncate">{lastSignedHash}</span>
                  </div>
                  <button
                    onClick={onOpenAudit}
                    className="text-brand-primary hover:underline text-[10px] whitespace-nowrap"
                  >
                    View in Chain
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-surface-card border border-border-subtle rounded-2xl p-12 text-center text-text-muted">
              Select a section to begin clinical reading.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
