// ─── Resume Data Types ─────────────────────────────────────────
export interface ResumeIdentity {
  name: string;
  title: string;
  email: string;
  location: string;
  website: string;
  social: string;
  summary: string;
  wallet: string | null;
  profileImage?: string; // base64 data URL
}

export interface ExperienceEntry {
  position: string;
  company: string;
  start: string;
  end: string;
  location: string;
  description: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  start: string;
  end: string;
  description: string;
}

export interface ResumeData {
  schema: string;
  identity: ResumeIdentity;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  meta: {
    published_at: string;
    version: string;
  };
}

export interface PublishResult {
  blobId: string;
  txHash: string;
}

export interface VerifyResult {
  blobId: string;
  owner: string;
  txHash: string;
  resumeData: ResumeData;
  verifiedAt: string;
}

// ─── App State Types ───────────────────────────────────────────
export type EntryType = 'experience' | 'education';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
