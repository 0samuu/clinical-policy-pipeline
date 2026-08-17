'use client';

import React from 'react';
import { Users, Eye, Sparkles, UserCheck } from 'lucide-react';
import { UserCredential } from '@/lib/auth';

interface PresenceBarProps {
  currentUser: UserCredential;
  activeSectionTitle?: string;
}

export function PresenceBar({ currentUser, activeSectionTitle }: PresenceBarProps) {
  return (
    <div className="flex items-center justify-between bg-surface-card border border-border-subtle rounded-2xl px-5 py-3 shadow-sm transition-colors duration-200">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-text-muted uppercase tracking-wider">
          <UserCheck className="w-4 h-4 text-brand-primary" />
          <span>Active Staff Session</span>
        </div>
        <div className="hidden sm:block h-4 w-px bg-border-subtle" />
        <div className="hidden sm:flex items-center space-x-1.5 text-xs text-text-muted">
          <Eye className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
          <span>Viewing:</span>
          <span className="font-semibold text-text-primary truncate max-w-xs">
            {activeSectionTitle || 'Clinical Policy Workspace'}
          </span>
        </div>
      </div>

      {/* Current Active Staff Badge */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-surface-elevated px-3 py-1.5 rounded-full border border-border-subtle">
          <div className={`w-6 h-6 rounded-full ${currentUser.avatarColor} text-white font-mono font-bold text-[10px] flex items-center justify-center relative`}>
            {currentUser.avatarInitials}
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-clinical-success ring-1 ring-white animate-pulse" />
          </div>
          <div className="text-left text-xs">
            <span className="font-bold text-text-primary mr-1">{currentUser.name}</span>
            <span className="font-mono text-[10px] text-text-muted">({currentUser.role})</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-surface-elevated text-[11px] font-mono text-text-muted border border-border-subtle">
          <span className="w-1.5 h-1.5 rounded-full bg-clinical-success animate-pulse" />
          <span>RLS Context Scoped</span>
        </div>
      </div>
    </div>
  );
}
