import { useState } from 'react';
import { useShelbyVerify } from '../hooks/useShelbyVerify';
import { useToast } from '../hooks/useToast';
import type { ResumeData } from '../types/resume';

export default function Verify() {
  const [input, setInput] = useState('');
  const { verify, isVerifying, result, error } = useShelbyVerify();
  const { showToast } = useToast();

  const handleVerify = async () => {
    if (!input.trim()) { showToast('Please enter a Blob ID', 'info'); return; }
    showToast('Fetching from Shelby network...', 'info');
    const res = await verify(input.trim());
    if (res) showToast('✓ Verification passed', 'success');
    else if (error) showToast(error, 'error');
  };

  return (
    <section id="verify">
      <p className="section-eyebrow">/ 03 — Verify</p>
      <h2 className="section-title">Verify a Credential</h2>
      <p style={{ color: 'rgba(245,240,232,0.5)', fontSize: 17, maxWidth: 520, marginBottom: 48 }}>
        Enter a Shelby Blob ID to trustlessly verify any Veritas resume on the decentralised network.
      </p>

      <div className="verify-input-group">
        <input type="text" className="verify-input" placeholder="Enter Blob ID (e.g. 0xab3f...c912)" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleVerify()} />
        <button className="verify-btn" onClick={handleVerify} disabled={isVerifying}>
          {isVerifying ? 'Verifying...' : 'Verify →'}
        </button>
      </div>

      {result && (
        <div className="verify-result show">
          <div className="verify-result-header">
            <div className="verify-status">
              <div className="verify-status-dot" />
              Verified on Aptos · Shelby Integrity Check Passed
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', color: 'rgba(245,240,232,0.3)' }}>
              Verified {new Date(result.verifiedAt).toLocaleTimeString()}
            </span>
          </div>
          <div className="verify-result-body">
            <div className="verify-meta">
              <div className="verify-meta-item">
                <div className="verify-meta-label">Blob ID</div>
                <div className="verify-meta-value">{result.blobId.slice(0, 10)}...{result.blobId.slice(-6)}</div>
              </div>
              <div className="verify-meta-item">
                <div className="verify-meta-label">Owner Address</div>
                <div className="verify-meta-value">{result.owner.slice(0, 10)}...</div>
              </div>
              <div className="verify-meta-item">
                <div className="verify-meta-label">Aptos TX Hash</div>
                <div className="verify-meta-value">{result.txHash.slice(0, 14)}...</div>
              </div>
            </div>
            <VerifiedResume data={result.resumeData} />
          </div>
        </div>
      )}
    </section>
  );
}

function VerifiedResume({ data }: { data: ResumeData }) {
  const id = data.identity;
  return (
    <div className="preview-resume" style={{ marginTop: 0, border: '1px solid rgba(200,151,58,0.2)' }}>
      {/* Profile photo + name header */}
      <div className="resume-profile-photo">
        {id.profileImage && (
          <div className="resume-photo-frame" style={{ position: 'relative' }}>
            {/* Decorative gold ring */}
            <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '1px solid rgba(200,151,58,0.35)', pointerEvents: 'none' }} />
            <img src={id.profileImage} alt={id.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        )}
        <div>
          <div className="resume-name">{id.name}</div>
          <div className="resume-title">{id.title}</div>
        </div>
      </div>
      {[id.email, id.location].filter(Boolean).length > 0 && (
        <div className="resume-contact">{[id.email, id.location].filter(Boolean).map((c, i) => <span key={i}>{c}</span>)}</div>
      )}
      {data.experience.length > 0 && (
        <div className="resume-section">
          <div className="resume-section-title">Experience</div>
          {data.experience.map((e, i) => (
            <div className="resume-entry" key={i}>
              <div className="resume-entry-header">
                <div className="resume-entry-title">{e.position}</div>
                <div className="resume-entry-date">{e.start} – {e.end || 'Present'}</div>
              </div>
              <div className="resume-entry-org">{e.company}</div>
              {e.description && <div className="resume-entry-desc">{e.description}</div>}
            </div>
          ))}
        </div>
      )}
      {data.education.length > 0 && (
        <div className="resume-section">
          <div className="resume-section-title">Education</div>
          {data.education.map((e, i) => (
            <div className="resume-entry" key={i}>
              <div className="resume-entry-header">
                <div className="resume-entry-title">{e.degree}</div>
                <div className="resume-entry-date">{e.start} – {e.end}</div>
              </div>
              <div className="resume-entry-org">{e.institution}</div>
            </div>
          ))}
        </div>
      )}
      {data.skills.length > 0 && (
        <div className="resume-section">
          <div className="resume-section-title">Skills</div>
          <div className="resume-skills-list">{data.skills.map((s, i) => <span className="resume-skill-chip" key={i}>{s}</span>)}</div>
        </div>
      )}
    </div>
  );
}
