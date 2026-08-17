'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { PresenceBar } from '@/components/PresenceBar';
import { DocumentReader } from '@/components/DocumentReader';
import { AuditDrawer } from '@/components/AuditDrawer';
import { UploadDocumentModal } from '@/components/UploadDocumentModal';
import { INITIAL_POLICIES, INITIAL_AUDIT_TRAIL } from '@/lib/data';
import { PolicyDocument, AuditRecord } from '@/lib/types';
import { CLINICAL_CREDENTIALS, UserCredential } from '@/lib/auth';
import { fetchPolicyDocumentsAction, fetchAuditTrailAction } from '@/app/actions/reader';

export default function HomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserCredential>(CLINICAL_CREDENTIALS[1]); // Default to OWNER
  const [policies, setPolicies] = useState<PolicyDocument[]>(INITIAL_POLICIES);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);
  const [auditTrail, setAuditTrail] = useState<AuditRecord[]>(INITIAL_AUDIT_TRAIL);

  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Load session from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('clinical_active_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.userId) {
            setCurrentUser(parsed);
          }
        } catch (e) {
          // ignore
        }
      }
    }
  }, []);

  const refreshAuditTrail = async () => {
    const fresh = await fetchAuditTrailAction();
    if (fresh) {
      setAuditTrail(fresh);
    }
  };

  const handlePolicyUploaded = (newPolicy: PolicyDocument) => {
    setPolicies((prev) => [newPolicy, ...prev]);
    setSelectedPolicyId(newPolicy.id);
    refreshAuditTrail();
  };

  const handleSwitchUser = () => {
    router.push('/auth/signin');
  };

  const currentDoc = policies.find((p) => p.id === selectedPolicyId) || policies[0] || null;

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col transition-colors duration-200">
      {/* Brand Navbar */}
      <Navbar
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenAudit={() => setIsAuditDrawerOpen(true)}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        unreadAuditsCount={auditTrail.length}
      />

      {/* Main Clinical Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Real-time Presence Bar for Active Staff */}
        <PresenceBar
          currentUser={currentUser}
          activeSectionTitle={currentDoc?.title}
        />

        {/* Core Medical Policy Reader Canvas */}
        <DocumentReader
          policies={policies}
          selectedPolicyId={selectedPolicyId}
          onSelectPolicy={(id) => setSelectedPolicyId(id)}
          onOpenUpload={() => setIsUploadModalOpen(true)}
          onOpenAudit={() => setIsAuditDrawerOpen(true)}
          currentUser={currentUser}
        />
      </div>

      {/* Slide-over Audit Drawer */}
      <AuditDrawer
        isOpen={isAuditDrawerOpen}
        onClose={() => setIsAuditDrawerOpen(false)}
        auditTrail={auditTrail}
      />

      {/* Document Upload Modal */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        currentUser={currentUser}
        onSuccess={handlePolicyUploaded}
      />
    </div>
  );
}
