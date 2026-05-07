import { useState } from 'react';
import type { ResumeIdentity, ExperienceEntry, EducationEntry, ResumeData } from '../types/resume';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useToast } from '../hooks/useToast';
import { useShelbyPublish } from '../hooks/useShelbyPublish';
import { STORAGE_DURATIONS, DEFAULT_STORAGE_DURATION } from '../config/constants';

interface ResumeBuilderProps {
  identity: ResumeIdentity;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  updateIdentity: (field: keyof ResumeIdentity, value: string) => void;
  addExperience: (entry: ExperienceEntry) => void;
  updateExperience: (idx: number, entry: ExperienceEntry) => void;
  removeExperience: (idx: number) => void;
  addEducation: (entry: EducationEntry) => void;
  updateEducation: (idx: number, entry: EducationEntry) => void;
  removeEducation: (idx: number) => void;
  addSkill: (skill: string) => void;
  removeSkill: (idx: number) => void;
  getResumeData: () => ResumeData;
}

export default function ResumeBuilder(props: ResumeBuilderProps) {
  const { identity, experience, education, skills, updateIdentity, getResumeData } = props;
  const [activeTab, setActiveTab] = useState<'experience' | 'education' | 'skills'>('experience');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'experience' | 'education'>('experience');
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const [storageDuration, setStorageDuration] = useState(DEFAULT_STORAGE_DURATION);

  const { connected } = useWallet();
  const { showToast } = useToast();

  // ─── Profile Photo Upload ─────────────────────────────────────
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showToast('Photo must be under 2MB', 'error'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      updateIdentity('profileImage' as keyof typeof identity, reader.result as string);
      showToast('Profile photo added ✓', 'success');
    };
    reader.readAsDataURL(file);
  };
  const { publish, step, isPublishing, result: publishResult } = useShelbyPublish();

  // ─── Modal Form State ────────────────────────────────────────
  const [formTitle, setFormTitle] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formStart, setFormStart] = useState('');
  const [formEnd, setFormEnd] = useState('');
  const [formLoc, setFormLoc] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDegree, setFormDegree] = useState('');
  const [formInstitution, setFormInstitution] = useState('');

  const openModal = (type: 'experience' | 'education', idx?: number) => {
    setModalType(type);
    setEditIdx(idx ?? null);
    if (idx !== undefined && idx !== null) {
      if (type === 'experience') {
        const e = experience[idx];
        setFormTitle(e.position); setFormCompany(e.company); setFormStart(e.start);
        setFormEnd(e.end); setFormLoc(e.location); setFormDesc(e.description);
      } else {
        const e = education[idx];
        setFormDegree(e.degree); setFormInstitution(e.institution); setFormStart(e.start);
        setFormEnd(e.end); setFormDesc(e.description);
      }
    } else {
      setFormTitle(''); setFormCompany(''); setFormStart(''); setFormEnd('');
      setFormLoc(''); setFormDesc(''); setFormDegree(''); setFormInstitution('');
    }
    setModalOpen(true);
  };

  const saveEntry = () => {
    if (modalType === 'experience') {
      const entry: ExperienceEntry = { position: formTitle, company: formCompany, start: formStart, end: formEnd, location: formLoc, description: formDesc };
      editIdx !== null ? props.updateExperience(editIdx, entry) : props.addExperience(entry);
    } else {
      const entry: EducationEntry = { degree: formDegree, institution: formInstitution, start: formStart, end: formEnd, description: formDesc };
      editIdx !== null ? props.updateEducation(editIdx, entry) : props.addEducation(entry);
    }
    setModalOpen(false);
    showToast('Entry saved', 'success');
  };

  const handleAddSkill = () => {
    const val = skillInput.trim();
    if (!val) return;
    props.addSkill(val);
    setSkillInput('');
  };

  const handlePublish = async () => {
    if (!connected) { showToast('Please connect your wallet first', 'info'); return; }
    const data = getResumeData();
    if (!data.identity.name) { showToast('Please fill in at least your name', 'info'); return; }

    const result = await publish(data, storageDuration);
    if (result) {
      // Save locally for verification fallback
      localStorage.setItem(`veritas_blob_${result.blobId}`, JSON.stringify(data));
      showToast('✓ Resume published to Shelby!', 'success');
    }
  };

  const handleExportJSON = () => {
    const data = getResumeData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'veritas-resume.json'; a.click();
    URL.revokeObjectURL(url);
    showToast('JSON exported', 'info');
  };

  // ─── JSON Highlight ──────────────────────────────────────────
  const jsonData = getResumeData();
  // Strip profileImage from display to prevent base64 from exploding the JSON viewer
  const jsonForDisplay = {
    ...jsonData,
    identity: {
      ...jsonData.identity,
      profileImage: jsonData.identity.profileImage
        ? `[base64 image — ${Math.round((jsonData.identity.profileImage.length * 3) / 4 / 1024)}KB stored on-chain]`
        : undefined,
    },
  };
  const jsonHighlighted = JSON.stringify(jsonForDisplay, null, 2)
    .replace(/("[\w_]+")\s*:/g, '<span class="json-key">$1</span>:')
    .replace(/:\s*"([^"]*)"/g, ': <span class="json-str">"$1"</span>')
    .replace(/:\s*(\d+)/g, ': <span class="json-num">$1</span>')
    .replace(/:\s*(true|false|null)/g, ': <span class="json-bool">$1</span>');

  // ─── Resume Preview HTML ─────────────────────────────────────
  const hasContent = identity.name || identity.title || experience.length > 0 || education.length > 0;

  const stepLabels = ['Encoding JSON payload', 'Uploading blob to Shelby network', 'Writing commitment to Aptos blockchain', 'Finalising blob ID & transaction hash'];
  const stepKeys = ['encoding', 'uploading', 'committing', 'finalizing'] as const;

  return (
    <section id="app">
      <p className="section-eyebrow">/ 02 — Builder</p>
      <h2 className="section-title">Build Your On-Chain Resume</h2>

      <div className="app-layout">
        {/* LEFT: Form — overflow hidden prevents base64 from collapsing grid */}
        <div style={{ minWidth: 0, overflow: 'hidden' }}>
          {/* Identity Panel */}
          <div className="app-panel" style={{ marginBottom: 20 }}>
            <div className="panel-header">
              <span className="panel-title">Identity</span>
              <span className="panel-badge">Personal Info</span>
            </div>
            <div className="panel-body">
              {/* Photo Upload — compact inline strip */}
              <div className="photo-upload-strip">
                <div className="photo-frame-wrap">
                  <div className="photo-frame">
                    <div className="photo-frame-inner">
                      {identity.profileImage ? (
                        <img src={identity.profileImage} alt="Profile"
                          style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }} />
                      ) : (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(200,151,58,0.45)" strokeWidth="1.5">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <label htmlFor="photo-upload" className="photo-upload-btn" title="Upload photo">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0d0d0d" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </label>
                  <input id="photo-upload" type="file" accept="image/png,image/jpeg,image/webp" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--gold)', marginBottom: 4 }}>Profile Photo</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(245,240,232,0.28)', lineHeight: 1.7 }}>
                    Stored on-chain alongside your resume.<br/>
                    <span style={{ color: 'rgba(200,151,58,0.5)' }}>Recommended: PNG transparent background</span><br/>
                    (character/avatar only, no BG) · Max 2MB
                  </div>
                  {identity.profileImage && (
                    <button onClick={() => updateIdentity('profileImage' as keyof typeof identity, '')}
                      style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 9, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.1em', padding: 0 }}>
                      × Remove photo
                    </button>
                  )}
                </div>
              </div>


              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" placeholder="Alexandra Chen" value={identity.name} onChange={e => updateIdentity('name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Professional Title</label>
                  <input type="text" className="form-input" placeholder="Senior Product Designer" value={identity.title} onChange={e => updateIdentity('title', e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" placeholder="alex@example.com" value={identity.email} onChange={e => updateIdentity('email', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input type="text" className="form-input" placeholder="Singapore, SG" value={identity.location} onChange={e => updateIdentity('location', e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Website / Portfolio</label>
                  <input type="text" className="form-input" placeholder="https://yoursite.com" value={identity.website} onChange={e => updateIdentity('website', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">GitHub / LinkedIn</label>
                  <input type="text" className="form-input" placeholder="github.com/yourhandle" value={identity.social} onChange={e => updateIdentity('social', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Professional Summary</label>
                <textarea className="form-textarea" placeholder="Brief description of your professional identity and goals..." value={identity.summary} onChange={e => updateIdentity('summary', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Sections Panel */}
          <div className="app-panel" style={{ marginBottom: 20 }}>
            <div className="panel-header">
              <span className="panel-title">Career Sections</span>
              <span className="panel-badge">Experience · Education · Skills</span>
            </div>
            <div className="panel-body">
              <div className="tabs">
                {(['experience', 'education', 'skills'] as const).map(tab => (
                  <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {activeTab === 'experience' && (
                <div>
                  {experience.map((e, i) => (
                    <div className="entry-card" key={i}>
                      <div className="entry-card-title">{e.position || 'Untitled'}</div>
                      <div className="entry-card-sub">{e.company || '—'} · {e.start} {e.end ? `– ${e.end}` : ''}</div>
                      <div className="entry-card-actions">
                        <button className="icon-btn" onClick={() => openModal('experience', i)} title="Edit">✎</button>
                        <button className="icon-btn danger" onClick={() => props.removeExperience(i)} title="Remove">✕</button>
                      </div>
                    </div>
                  ))}
                  <button className="add-entry-btn" onClick={() => openModal('experience')}>+ Add Work Experience</button>
                </div>
              )}

              {activeTab === 'education' && (
                <div>
                  {education.map((e, i) => (
                    <div className="entry-card" key={i}>
                      <div className="entry-card-title">{e.degree || 'Untitled'}</div>
                      <div className="entry-card-sub">{e.institution || '—'} · {e.start} {e.end ? `– ${e.end}` : ''}</div>
                      <div className="entry-card-actions">
                        <button className="icon-btn" onClick={() => openModal('education', i)} title="Edit">✎</button>
                        <button className="icon-btn danger" onClick={() => props.removeEducation(i)} title="Remove">✕</button>
                      </div>
                    </div>
                  ))}
                  <button className="add-entry-btn" onClick={() => openModal('education')}>+ Add Education</button>
                </div>
              )}

              {activeTab === 'skills' && (
                <div>
                  <div className="skills-container">
                    {skills.map((s, i) => (
                      <span className="skill-tag" key={i}>{s}<span className="remove" onClick={() => props.removeSkill(i)}>×</span></span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <input type="text" className="form-input" placeholder="Add a skill..." style={{ flex: 1 }} value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddSkill()} />
                    <button className="btn-connect" onClick={handleAddSkill} style={{ padding: '10px 18px', fontSize: 10 }}>Add</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* JSON Payload Panel */}
          <div className="app-panel" style={{ marginBottom: 20 }}>
            <div className="panel-header">
              <span className="panel-title">JSON Payload</span>
              <span className="panel-badge">On-chain Data</span>
            </div>
            <div className="panel-body" style={{ padding: 0 }}>
              <div className="json-viewer" dangerouslySetInnerHTML={{ __html: jsonHighlighted }} />
            </div>
          </div>

          {/* Publish Panel */}
          <div className="app-panel">
            <div className="panel-header">
              <span className="panel-title">Publish to Shelby</span>
              <span className="panel-badge">Shelbynet Devnet</span>
            </div>
            <div className="panel-body">
              <div className="publish-info">
                <div className="info-chip"><div className="info-chip-dot" />RPC: api.shelbynet.shelby.xyz</div>
                <div className="info-chip"><div className="info-chip-dot" />Storage: ~10 TiB capacity</div>
                <div className="info-chip"><div className="info-chip-dot" />Aptos Shelbynet</div>
              </div>

              <div className="form-group">
                <label className="form-label">Storage Duration</label>
                <select className="form-select" value={storageDuration} onChange={e => setStorageDuration(e.target.value)}>
                  {STORAGE_DURATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>

              <button className="btn-publish" disabled={isPublishing} onClick={handlePublish}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                {isPublishing ? 'Publishing...' : 'Sign & Publish to Shelby'}
              </button>

              <button className="btn-outline" onClick={handleExportJSON}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export JSON (Offline)
              </button>

              {/* TX Progress */}
              {isPublishing && (
                <div className="tx-progress show">
                  <div className="tx-steps">
                    {stepLabels.map((label, i) => {
                      const key = stepKeys[i];
                      const currentIdx = stepKeys.indexOf(step as typeof stepKeys[number]);
                      const isDone = currentIdx > i;
                      const isActive = step === key;
                      return (
                        <div key={i} className={`tx-step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                          <div className="tx-step-icon">{isDone ? '✓' : isActive ? '↻' : '◌'}</div>
                          <span>{label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Published Result */}
              {publishResult && (
                <div style={{ marginTop: 16 }}>
                  <div className="form-label" style={{ marginBottom: 8 }}>✅ Published Successfully</div>
                  <div className="blob-hash">Blob ID: {publishResult.blobId}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(245,240,232,0.3)', marginTop: 8, letterSpacing: '0.1em' }}>
                    Aptos TX: <span style={{ color: 'var(--gold-dim)' }}>{publishResult.txHash}</span>
                  </div>
                  <button className="btn-outline" style={{ marginTop: 12 }} onClick={() => { navigator.clipboard.writeText(publishResult.blobId); showToast('Blob ID copied!', 'success'); }}>
                    Copy Blob ID to Clipboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Preview */}
        <div className="preview-panel">
          <div className="app-panel">
            <div className="panel-header">
              <span className="panel-title">Live Preview</span>
              <span className="panel-badge">Resume</span>
            </div>
            <div className="preview-resume">
              {!hasContent ? (
                <div className="resume-empty">Your resume will appear here as you fill in the form.</div>
              ) : (
                <>
                  {/* Profile photo + name header */}
                  <div className="resume-profile-photo">
                    {identity.profileImage && (
                      <div className="resume-photo-frame">
                        <img src={identity.profileImage} alt={identity.name || 'Profile'} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                    )}
                    <div>
                      {identity.name && <div className="resume-name">{identity.name}</div>}
                      {identity.title && <div className="resume-title">{identity.title}</div>}
                    </div>
                  </div>
                  {[identity.email, identity.location, identity.website, identity.social].filter(Boolean).length > 0 && (
                    <div className="resume-contact">
                      {[identity.email, identity.location, identity.website, identity.social].filter(Boolean).map((c, i) => <span key={i}>{c}</span>)}
                    </div>
                  )}
                  {identity.summary && (
                    <div className="resume-section">
                      <div className="resume-section-title">Summary</div>
                      <div style={{ fontSize: 13, lineHeight: 1.55, color: '#2a2010' }}>{identity.summary}</div>
                    </div>
                  )}
                  {experience.length > 0 && (
                    <div className="resume-section">
                      <div className="resume-section-title">Experience</div>
                      {experience.map((e, i) => (
                        <div className="resume-entry" key={i}>
                          <div className="resume-entry-header">
                            <div className="resume-entry-title">{e.position}</div>
                            <div className="resume-entry-date">{e.start}{e.end ? ` – ${e.end}` : ' – Present'}</div>
                          </div>
                          <div className="resume-entry-org">{e.company}</div>
                          {e.description && <div className="resume-entry-desc">{e.description}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                  {education.length > 0 && (
                    <div className="resume-section">
                      <div className="resume-section-title">Education</div>
                      {education.map((e, i) => (
                        <div className="resume-entry" key={i}>
                          <div className="resume-entry-header">
                            <div className="resume-entry-title">{e.degree}</div>
                            <div className="resume-entry-date">{e.start}{e.end ? ` – ${e.end}` : ''}</div>
                          </div>
                          <div className="resume-entry-org">{e.institution}</div>
                          {e.description && <div className="resume-entry-desc">{e.description}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                  {skills.length > 0 && (
                    <div className="resume-section">
                      <div className="resume-section-title">Skills</div>
                      <div className="resume-skills-list">{skills.map((s, i) => <span className="resume-skill-chip" key={i}>{s}</span>)}</div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {publishResult && (
            <div style={{ marginTop: 12, border: '1px solid rgba(74,222,128,0.3)', padding: '16px 20px', background: 'rgba(74,222,128,0.04)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
                Veritas Verified
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(245,240,232,0.4)', lineHeight: 1.6 }}>
                This resume is immutably stored on Shelby Protocol and verified on the Aptos blockchain.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Entry Modal */}
      {modalOpen && (
        <div className="modal-overlay show" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editIdx !== null ? 'Edit' : '+ Add'} {modalType === 'experience' ? 'Work Experience' : 'Education'}</span>
              <button className="modal-close" onClick={() => setModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              {modalType === 'experience' ? (
                <>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Job Title</label><input type="text" className="form-input" placeholder="Senior Engineer" value={formTitle} onChange={e => setFormTitle(e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Company</label><input type="text" className="form-input" placeholder="Acme Corp" value={formCompany} onChange={e => setFormCompany(e.target.value)} /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Start</label><input type="text" className="form-input" placeholder="Jan 2022" value={formStart} onChange={e => setFormStart(e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">End (blank = Present)</label><input type="text" className="form-input" placeholder="Dec 2023" value={formEnd} onChange={e => setFormEnd(e.target.value)} /></div>
                  </div>
                  <div className="form-group"><label className="form-label">Location</label><input type="text" className="form-input" placeholder="Remote · Singapore" value={formLoc} onChange={e => setFormLoc(e.target.value)} /></div>
                </>
              ) : (
                <>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Degree / Award</label><input type="text" className="form-input" placeholder="B.Sc. Computer Science" value={formDegree} onChange={e => setFormDegree(e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Institution</label><input type="text" className="form-input" placeholder="NUS Singapore" value={formInstitution} onChange={e => setFormInstitution(e.target.value)} /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Start Year</label><input type="text" className="form-input" placeholder="2018" value={formStart} onChange={e => setFormStart(e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">End Year</label><input type="text" className="form-input" placeholder="2022" value={formEnd} onChange={e => setFormEnd(e.target.value)} /></div>
                  </div>
                </>
              )}
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" placeholder="Describe key responsibilities..." value={formDesc} onChange={e => setFormDesc(e.target.value)} /></div>
              <button className="btn-publish" style={{ marginTop: 20 }} onClick={saveEntry}>Save Entry</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
