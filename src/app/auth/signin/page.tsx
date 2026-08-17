'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, Key, Lock, CheckCircle2, ArrowRight, 
  Activity, UserCheck, AlertCircle, Users 
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CLINICAL_CREDENTIALS, validateCredentials, UserCredential } from '@/lib/auth';

export default function MedicalSignInPage() {
  const router = useRouter();
  const [userId, setUserId] = useState('OWNER');
  const [password, setPassword] = useState('owner0123!');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectCredential = (cred: UserCredential) => {
    setUserId(cred.userId);
    setPassword(cred.password);
    setErrorMessage(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const user = validateCredentials(userId, password);
    if (!user) {
      setErrorMessage('Invalid User ID or Password. Please check your credentials.');
      setIsSubmitting(false);
      return;
    }

    // Save session in localStorage for client-side state synchronization
    if (typeof window !== 'undefined') {
      localStorage.setItem('clinical_active_user', JSON.stringify(user));
    }

    setTimeout(() => {
      router.push('/');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col justify-between p-4 sm:p-6 transition-colors duration-200">
      {/* Top Bar */}
      <header className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-text-primary">HELENA TAYLOR</span>
            <span className="text-[10px] ml-2 px-2 py-0.5 rounded-full bg-brand-primary/15 text-brand-primary font-mono font-bold">
              CLINICAL PORTAL
            </span>
          </div>
        </div>

        <ThemeToggle />
      </header>

      {/* Main Login Workspace */}
      <main className="max-w-xl w-full mx-auto my-6">
        <div className="bg-surface-card border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-clinical-card space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">Clinical Staff Sign-In</h1>
            <p className="text-xs text-text-muted">Enter your authorized clinical User ID and Password</p>
          </div>

          {/* Quick Credential Chips for Rapid Access */}
          <div className="bg-surface-elevated p-4 rounded-2xl border border-border-subtle space-y-2.5">
            <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-text-muted uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-brand-accent" />
              <span>Select Authorized Role to Auto-Fill:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CLINICAL_CREDENTIALS.map((cred) => {
                const isSelected = userId.toUpperCase() === cred.userId.toUpperCase();
                return (
                  <button
                    key={cred.userId}
                    type="button"
                    onClick={() => handleSelectCredential(cred)}
                    id={`btn-cred-${cred.userId}`}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-brand-primary text-white border-brand-primary shadow-sm font-semibold'
                        : 'bg-surface-card hover:bg-surface-card/80 text-text-primary border-border-subtle hover:border-brand-primary/40'
                    }`}
                  >
                    <div className="text-xs font-bold truncate">{cred.userId}</div>
                    <div className={`text-[10px] truncate ${isSelected ? 'text-white/80' : 'text-text-muted'}`}>
                      {cred.role.split('/')[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-text-muted uppercase tracking-wider mb-1.5">
                User ID
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g. OWNER or ADMIN001"
                  required
                  id="input-login-userid"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-elevated border border-border-subtle text-xs font-mono font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-text-muted uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  id="input-login-password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-elevated border border-border-subtle text-xs font-mono text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              id="btn-submit-clinical-login"
              className="w-full py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center space-x-2"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Clinical Reader'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Credential Reference Matrix */}
          <div className="pt-4 border-t border-border-subtle text-[11px] text-text-muted space-y-1.5 font-mono">
            <div className="font-bold text-text-primary mb-1">Authorized Staff Credentials:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              <div>• <span className="font-bold text-text-primary">ADMIN001</span> : admin</div>
              <div>• <span className="font-bold text-text-primary">OWNER</span> : owner0123!</div>
              <div>• <span className="font-bold text-text-primary">HEADNURSE</span> : headnurse0220!</div>
              <div>• <span className="font-bold text-text-primary">CLINICMANAGER</span> : clinicmanager1234...</div>
              <div>• <span className="font-bold text-text-primary">OBNURSE1</span> : obnurse1234!</div>
              <div>• <span className="font-bold text-text-primary">OBNURSE2</span> : obnurse2234!</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-text-muted">
        Zero-Trust Clinical Documentation Access • HIPAA & GDPR Compliance Monitored
      </footer>
    </div>
  );
}
