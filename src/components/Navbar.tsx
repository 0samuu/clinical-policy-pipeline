'use client';

import React, { useState } from 'react';
import { 
  Activity, Upload, Clock, ChevronDown, Menu, X, UserCheck 
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-surface-card/95 backdrop-blur-md border-b border-border-subtle transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Anchor */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary shadow-sm flex-shrink-0">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-text-primary">
                HELENA TAYLOR
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold bg-brand-primary/15 text-brand-primary border border-brand-primary/30">
                CLINICAL
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-text-muted font-medium hidden sm:block">
              Medical Policy & Real-Time Documentation
            </p>
          </div>
        </div>

        {/* Desktop Action Controls */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Prominent Upload Policy Button */}
          <button
            onClick={onOpenUpload}
            id="btn-nav-upload-doc"
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold shadow-sm transition-all"
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
            <span>Audit Trail</span>
            {unreadAuditsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            )}
          </button>

          {/* User Profile Chip */}
          <div 
            onClick={onSwitchUser}
            className="flex items-center space-x-2 p-1.5 pl-2.5 rounded-xl border border-border-subtle bg-surface-elevated hover:bg-surface-elevated/80 cursor-pointer transition-all"
            title="Click to Switch User Account / Sign In"
          >
            <div className={`w-6 h-6 rounded-lg ${currentUser.avatarColor} text-white font-mono font-bold text-[10px] flex items-center justify-center`}>
              {currentUser.avatarInitials}
            </div>
            <div className="text-left pr-1">
              <div className="text-xs font-bold text-text-primary leading-tight truncate max-w-[110px]">
                {currentUser.name.split(' ')[0]}
              </div>
              <div className="text-[10px] font-mono text-text-muted truncate max-w-[110px]">
                {currentUser.userId}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
          </div>

          <ThemeToggle />
        </div>

        {/* Mobile Quick Action Buttons */}
        <div className="flex md:hidden items-center space-x-1.5">
          <button
            onClick={onOpenUpload}
            id="btn-mobile-upload"
            className="p-2 rounded-xl bg-brand-primary text-white shadow-sm flex items-center justify-center"
            title="Upload Document"
          >
            <Upload className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAudit}
            id="btn-mobile-audit"
            className="p-2 rounded-xl border border-border-subtle bg-surface-card text-brand-accent relative flex items-center justify-center"
            title="Audit Trail"
          >
            <Clock className="w-4 h-4" />
            {unreadAuditsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-brand-accent absolute top-1.5 right-1.5 animate-pulse" />
            )}
          </button>

          <ThemeToggle />

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="btn-mobile-menu"
            className="p-2 rounded-xl border border-border-subtle bg-surface-elevated text-text-primary"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border-subtle bg-surface-card px-4 py-3 space-y-3 animate-fadeIn shadow-lg">
          {/* User Profile Card on Mobile */}
          <div 
            onClick={() => { setMobileMenuOpen(false); onSwitchUser(); }}
            className="p-3 rounded-2xl bg-surface-elevated border border-border-subtle flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-xl ${currentUser.avatarColor} text-white font-mono font-bold text-xs flex items-center justify-center`}>
                {currentUser.avatarInitials}
              </div>
              <div>
                <div className="text-xs font-bold text-text-primary">{currentUser.name}</div>
                <div className="text-[10px] font-mono text-text-muted">{currentUser.userId} • {currentUser.role}</div>
              </div>
            </div>
            <span className="text-[11px] font-mono text-brand-primary font-semibold">Switch</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenUpload(); }}
              className="w-full py-2.5 px-3 rounded-xl bg-brand-primary text-white text-xs font-semibold flex items-center justify-center space-x-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Policy</span>
            </button>

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAudit(); }}
              className="w-full py-2.5 px-3 rounded-xl border border-border-subtle bg-surface-elevated text-text-primary text-xs font-semibold flex items-center justify-center space-x-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-brand-accent" />
              <span>Audit Ledger</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
