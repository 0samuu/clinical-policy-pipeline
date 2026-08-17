'use client';

import React from 'react';
import { 
  Activity, FileText, Upload, Clock, ChevronDown 
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { UserCredential } from '@/lib/auth';

interface NavbarProps {
  onOpenUpload: () => void;
  onOpenAudit: () => void;
  currentUser: UserCredential;
  onSwitchUser: () => void;
  unreadAuditsCount: number;
}

export function Navbar({
  onOpenUpload,
  onOpenAudit,
  currentUser,
  onSwitchUser,
  unreadAuditsCount,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-surface-card/90 backdrop-blur-md border-b border-border-subtle transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Anchor */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary shadow-sm">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight text-text-primary">
                HELENA TAYLOR
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-primary/15 text-brand-primary border border-brand-primary/30">
                CLINICAL SUITE
              </span>
            </div>
            <p className="text-[11px] text-text-muted font-medium">Medical Policy & Real-Time Documentation</p>
          </div>
        </div>

        {/* Action Controls & Utilities */}
        <div className="flex items-center space-x-3">
          {/* Prominent Upload Policy Button */}
          <button
            onClick={onOpenUpload}
            id="btn-nav-upload-doc"
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold shadow-sm transition-all animate-fadeIn"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Policy Document</span>
          </button>

          {/* Cryptographic Audit Drawer Button */}
          <button
            onClick={onOpenAudit}
            id="btn-nav-audit"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-border-subtle bg-surface-card hover:bg-surface-elevated text-text-primary text-xs font-semibold transition-all relative"
            title="Inspect Cryptographic Audit Ledger"
          >
            <Clock className="w-3.5 h-3.5 text-brand-accent" />
            <span className="hidden sm:inline">Audit Trail</span>
            {unreadAuditsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            )}
          </button>

          {/* Logged-in User Profile Chip */}
          <div 
            onClick={onSwitchUser}
            className="flex items-center space-x-2 p-1.5 pl-2.5 rounded-xl border border-border-subtle bg-surface-elevated hover:bg-surface-elevated/80 cursor-pointer transition-all"
            title="Click to Switch User Account / Sign In"
          >
            <div className={`w-6 h-6 rounded-lg ${currentUser.avatarColor} text-white font-mono font-bold text-[10px] flex items-center justify-center`}>
              {currentUser.avatarInitials}
            </div>
            <div className="hidden lg:block text-left pr-1">
              <div className="text-xs font-bold text-text-primary leading-tight truncate max-w-[130px]">
                {currentUser.name.split(' ')[0]}
              </div>
              <div className="text-[10px] font-mono text-text-muted truncate max-w-[130px]">
                {currentUser.userId}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
          </div>

          {/* Theme Switcher */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
