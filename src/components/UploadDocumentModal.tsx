'use client';

import React, { useState, useRef } from 'react';
import { 
  FileUp, Upload, CheckCircle2, ShieldCheck, 
  X, Sparkles, AlertCircle, RefreshCw 
} from 'lucide-react';
import { uploadMedicalPolicyAction } from '@/app/actions/reader';
import { PolicyDocument } from '@/lib/types';
import { UserCredential } from '@/lib/auth';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserCredential;
  onSuccess: (newPolicy: PolicyDocument) => void;
}

export function UploadDocumentModal({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}: UploadDocumentModalProps) {
  const [title, setTitle] = useState('');
  const [policyNumber, setPolicyNumber] = useState(`POL-${Math.floor(1000 + Math.random() * 9000)}`);
  const [category, setCategory] = useState<'CPT_SURGICAL' | 'ICD10_COVERAGE' | 'CLINICAL_TRIAL' | 'ONCOLOGY_BIOLOGICS'>('ICD10_COVERAGE');
  const [department, setDepartment] = useState(currentUser.department || 'Obstetrics & Gynecology');
  const [cptCodesString, setCptCodesString] = useState('CPT 59400, CPT 59510');
  const [icdCodesString, setIcdCodesString] = useState('ICD-10 O80, ICD-10 O82');
  const [rawText, setRawText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawText(content || '');
    };
    reader.readAsText(file);
  };

  const handleApplyTemplate = (type: string) => {
    if (type === 'ob_gyn') {
      setTitle('Labor & Delivery Clinical Protocol: Oxytocin Induction & Fetal Monitoring');
      setPolicyNumber('POL-OB-2026-101');
      setCategory('ICD10_COVERAGE');
      setDepartment('Obstetrics & Gynecology');
      setCptCodesString('CPT 59400, CPT 59510, CPT 59610');
      setIcdCodesString('ICD-10 O80, ICD-10 O82.0, ICD-10 O62.2');
      setRawText(
`1.0 Clinical Indications & Bishop Scoring Criteria
Oxytocin administration for labor induction is indicated when medical or obstetrical indications exist (e.g., preeclampsia, post-term pregnancy ≥ 41 weeks, premature rupture of membranes). A pre-induction Bishop score ≥ 8 indicates high likelihood of successful vaginal delivery. If Bishop score is < 6, cervical ripening agents must precede oxytocin infusion.

2.0 Continuous Electronic Fetal Heart Rate (FHR) Monitoring Directives
Continuous category I FHR tracing is mandatory throughout infusion. Baseline infusion begins at 0.5 to 2 mU/min and may be titrated upwards by 1 to 2 mU/min every 15-30 minutes until a standard uterine contraction pattern (3-5 contractions per 10 minutes) is achieved. In the presence of Category II or III FHR abnormalities, oxytocin must be immediately discontinued and intrauterine resuscitation initiated.

3.0 Nursing Documentation & Postpartum Hemorrhage Prevention
Attending and OB nurses must record maternal vital signs every 30 minutes and contraction frequency/duration every 15 minutes. Following placental delivery, prophylactic oxytocin (20 units in 1,000 mL crystalloid solution or 10 units IM) must be administered routinely to prevent uterine atony and postpartum hemorrhage.`);
    } else if (type === 'general_safety') {
      setTitle('Universal Protocol for Preventing Wrong Site, Wrong Procedure, Wrong Person Surgery');
      setPolicyNumber('POL-SURG-2026-204');
      setCategory('CPT_SURGICAL');
      setDepartment('Surgical Services & Clinical Operations');
      setCptCodesString('CPT 99100, CPT 99140');
      setIcdCodesString('ICD-10 Z01.818');
      setRawText(
`1.0 Pre-Procedure Verification Process
The clinical team must verify the patient's identity using at least two independent identifiers (Full Name, Date of Birth, or Hospital ID band). Verification must confirm that the procedure, site, and informed consent match the EHR schedule and relevant diagnostic/radiological studies.

2.0 Surgical Site Marking Standards
The licensed independent practitioner performing the procedure must mark the operative site with a permanent surgical marker prior to the patient entering the procedure suite. The mark must remain visible after completion of the skin preparation and sterile draping.

3.0 Final "Time-Out" Execution Prior to Incision
A formal Time-Out must be conducted immediately prior to starting the procedure. The entire surgical team (Surgeon, Anesthesiologist, Circulating Nurse, Scrub Tech) must cease all activity and verbally agree on: correct patient identity, correct site and side, correct procedure to be performed, and availability of required implants or equipment.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a policy title.');
      return;
    }
    if (!rawText.trim()) {
      setErrorMsg('Please upload a file or enter clinical policy content.');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);

    try {
      const result = await uploadMedicalPolicyAction({
        title: title.trim(),
        policyNumber: policyNumber.trim(),
        category: category,
        department: department.trim(),
        author: currentUser.name,
        authorRole: currentUser.role,
        effectiveDate: new Date().toISOString().split('T')[0],
        rawText: rawText.trim(),
        cptCodesString: cptCodesString.trim(),
        icdCodesString: icdCodesString.trim(),
      });

      if (result.success) {
        onSuccess(result.policy);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to upload and process policy document.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-2xl bg-surface-card rounded-3xl border border-border-subtle shadow-2xl p-4 sm:p-8 space-y-4 sm:space-y-6 transition-colors duration-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-3 sm:pb-4">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-brand-primary/10 text-brand-primary border border-brand-primary/30 flex-shrink-0">
              <FileUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
                Upload Policy Document
              </h2>
              <p className="text-[11px] sm:text-xs text-text-muted truncate max-w-[200px] sm:max-w-none">
                Author: <span className="text-brand-primary font-semibold">{currentUser.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            id="btn-close-upload-modal"
            className="p-1.5 sm:p-2 rounded-lg bg-surface-elevated hover:bg-surface-elevated/80 text-text-muted hover:text-text-primary transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Clinical Template Selector */}
        <div className="bg-surface-elevated p-2.5 sm:p-3 rounded-2xl border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-[11px] sm:text-xs font-mono font-semibold text-text-muted flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            <span>Load Template:</span>
          </span>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => handleApplyTemplate('ob_gyn')}
              className="flex-1 sm:flex-none px-2.5 py-1 rounded-lg bg-surface-card hover:bg-surface-card/80 text-[11px] font-semibold text-text-primary border border-border-subtle transition-all text-center"
            >
              OB/GYN Protocol
            </button>
            <button
              type="button"
              onClick={() => handleApplyTemplate('general_safety')}
              className="flex-1 sm:flex-none px-2.5 py-1 rounded-lg bg-surface-card hover:bg-surface-card/80 text-[11px] font-semibold text-text-primary border border-border-subtle transition-all text-center"
            >
              Surgical Time-Out
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          {/* File Drag-and-Drop Area */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.md,.pdf,.doc,.docx,.json"
              className="hidden"
              id="file-upload-input"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border-subtle hover:border-brand-primary rounded-2xl p-4 sm:p-6 text-center cursor-pointer bg-surface-elevated/40 hover:bg-surface-elevated transition-all group"
            >
              <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-text-muted group-hover:text-brand-primary transition-colors" />
              <div className="mt-1.5 text-xs font-semibold text-text-primary truncate">
                {fileName ? `Selected: ${fileName}` : 'Tap to Browse or Drop Document File'}
              </div>
              <p className="text-[10px] sm:text-[11px] text-text-muted mt-0.5">
                Supports .pdf, .docx, .txt, .md with auto-sectioning
              </p>
            </div>
          </div>

          {/* Title & Policy Number Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] sm:text-xs font-mono font-semibold text-text-muted mb-1">
                Policy Document Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Clinical Practice Guideline on OB/GYN Care"
                id="input-upload-title"
                required
                className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-surface-elevated border border-border-subtle text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-mono font-semibold text-text-muted mb-1">
                Policy Number
              </label>
              <input
                type="text"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
                id="input-upload-number"
                className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-surface-elevated border border-border-subtle text-xs font-mono text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>

          {/* Department & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div>
              <label className="block text-[11px] sm:text-xs font-mono font-semibold text-text-muted mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                id="input-upload-dept"
                className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-mono font-semibold text-text-muted mb-1">
                Policy Category
              </label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                id="select-upload-category"
                className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="ICD10_COVERAGE">ICD-10 Coverage Policy</option>
                <option value="CPT_SURGICAL">CPT Surgical Guideline</option>
                <option value="ONCOLOGY_BIOLOGICS">Oncology / Biologics</option>
                <option value="CLINICAL_TRIAL">Clinical Trial Protocol</option>
              </select>
            </div>
          </div>

          {/* Codes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div>
              <label className="block text-[11px] sm:text-xs font-mono font-semibold text-text-muted mb-1">
                CPT Codes (Comma Separated)
              </label>
              <input
                type="text"
                value={cptCodesString}
                onChange={(e) => setCptCodesString(e.target.value)}
                placeholder="CPT 59400, CPT 59510"
                id="input-upload-cpt"
                className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs font-mono text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-mono font-semibold text-text-muted mb-1">
                ICD-10 Codes (Comma Separated)
              </label>
              <input
                type="text"
                value={icdCodesString}
                onChange={(e) => setIcdCodesString(e.target.value)}
                placeholder="ICD-10 O80, ICD-10 O82"
                id="input-upload-icd"
                className="w-full px-3 py-2 rounded-xl bg-surface-elevated border border-border-subtle text-xs font-mono text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>

          {/* Document Body / Text */}
          <div>
            <label className="block text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-text-muted mb-1">
              Document Text Content / Structured Sections *
            </label>
            <textarea
              rows={5}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste policy text here. Paragraphs separated by blank lines will be automatically partitioned into structured clinical reader sections."
              id="textarea-upload-raw"
              required
              className="w-full px-3 py-2 rounded-2xl bg-surface-elevated border border-border-subtle text-xs font-mono text-text-primary leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-1.5 text-[10px] sm:text-[11px] font-mono text-emerald-600 self-start sm:self-auto">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>AES-256 Envelope + SHA-256 Hash Chain</span>
            </div>

            <div className="flex space-x-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-border-subtle text-xs font-semibold text-text-muted hover:text-text-primary bg-surface-elevated text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                id="btn-submit-upload-policy"
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold flex items-center justify-center space-x-2 shadow-sm transition-all"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sealing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Publish Policy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
