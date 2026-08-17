import { PolicyDocument, Collaborator, AuditRecord } from './types';

// Clean Slate: No dummy policies, no dummy logs. Ready for actual document uploads and authentic user reviews.
export const INITIAL_POLICIES: PolicyDocument[] = [];

export const INITIAL_COLLABORATORS: Collaborator[] = [];

export const INITIAL_AUDIT_TRAIL: AuditRecord[] = [];
