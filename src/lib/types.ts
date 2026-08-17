export interface PolicySection {
  id: string;
  title: string;
  pageNumber: number;
  content: string;
  cptCodes: string[];
  icdCodes: string[];
  coverageStatus: 'MANDATORY' | 'CONDITIONAL' | 'INVESTIGATIONAL';
  guidelineExcerpt: string;
}

export interface PolicyDocument {
  id: string;
  policyNumber: string;
  title: string;
  category: 'CPT_SURGICAL' | 'ICD10_COVERAGE' | 'CLINICAL_TRIAL' | 'ONCOLOGY_BIOLOGICS';
  version: string;
  status: 'APPROVED' | 'UNDER_REVIEW' | 'DRAFT';
  effectiveDate: string;
  department: string;
  author: string;
  sections: PolicySection[];
}

export interface Collaborator {
  id: string;
  name: string;
  role: 'Attending Physician' | 'Nurse Reviewer' | 'Compliance Officer' | 'Clinical Director';
  department: string;
  avatarInitials: string;
  avatarColor: string;
  currentSectionId: string;
  status: 'online' | 'idle' | 'reviewing';
  lastHeartbeat: string;
}

export interface AuditRecord {
  id: string;
  sequenceId: number;
  eventType: 'DOCUMENT_ACCESS' | 'SECTION_ACKNOWLEDGE' | 'COMPLIANCE_SIGN' | 'INGESTION_SEALED' | 'RLS_SESSION_SCOPED';
  actorName: string;
  actorRole: string;
  documentId: string;
  sectionTitle?: string;
  timestamp: string;
  previousHash: string;
  currentHash: string;
  status: 'VERIFIED_CHAIN' | 'PENDING';
}

export interface IngestionStep {
  step: number;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  details?: string;
}
