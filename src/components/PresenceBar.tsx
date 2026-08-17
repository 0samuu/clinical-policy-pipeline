'use client';

import React from 'react';
import { UserCheck, Eye } from 'lucide-react';
import { UserCredential } from '@/lib/auth';

interface PresenceBarProps {
  currentUser: UserCredential;
  activeSectionTitle?: string;
}

export function PresenceBar({ currentUser, activeSectionTitle }: PresenceBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-surface-card border border-border-subtle rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 gap-2 sm:gap-4 shadow-sm transition-colors duration-200">
      <div className="flex items-center space-x-2 sm:space-x-3 overflow-hidden">
        <div className="flex items-center space-x-1.5 text-[11px] sm:text-xs font-mono font-bold text-text-muted uppercase tracking-wider flex-shrink-0">
          <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-primary" />
          <span className="hidden xs:inline">Session:</span>
        </div>
        <div className="hidden sm:block h-3.5 w-px bg-border-subtle flex-shrink-0" />
        <div className="flex items-center space-x-1.5 text-xs text-text-muted truncate min-w-0">
          <Eye className="w-3.5 h-3.5 text-brand-accent animate-pulse flex-shrink-0" />
          <span className="truncate font-medium text-text-primary text-[11px] sm:text-xs">
            {activeSectionTitle || 'Clinical Workspace'}
          </span>
        </div>
      </div>

      {/* Current Active Staff Badge */}
      <div className="flex items-center justify-between sm:justify-end space-x-2 flex-shrink-0">
        <div className="flex items-center space-x-2 bg-surface-elevated px-2.5 py-1 rounded-full border border-border-subtle text-xs">
          <div className={`w-5 h-5 rounded-full ${currentUser.avatarColor} text-white font-mono font-bold text-[9px] flex items-center justify-center relative flex-shrink-0`}>
            {currentUser.avatarInitials}
            <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-clinical-success ring-1 ring-white animate-pulse" />
          </div>
          <span className="font-bold text-text-primary text-[11px] sm:text-xs truncate max-w-[140px]">
            {currentUser.name}
          </span>
        </div>

        <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-surface-elevated text-[10px] font-mono text-emerald-600 border border-border-subtle flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-clinical-success animate-pulse" />
          <span>RLS Scoped</span>
        </div>
      </div>
    </div>
  );
}
