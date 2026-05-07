import { SAMPLE_PROFILES } from '../config/constants';

interface ExploreProfile {
  name: string;
  title: string;
  email: string;
  location: string;
  skills: readonly string[];
  role: string;
  profileImage?: string;
}

interface ExploreProps {
  onLoadProfile: (profile: ExploreProfile) => void;
}

function AvatarFallback({ name }: { name: string }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, rgba(200,151,58,0.25), rgba(200,151,58,0.08))',
      fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700,
      color: 'var(--gold)', letterSpacing: '0.05em',
    }}>
      {initials}
    </div>
  );
}

export default function Explore({ onLoadProfile }: ExploreProps) {
  return (
    <section id="explore">
      <p className="section-eyebrow">/ 04 — Directory</p>
      <h2 className="section-title">Public Resume Directory</h2>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(245,240,232,0.35)', letterSpacing: '0.08em', lineHeight: 1.7, maxWidth: 520, marginBottom: 48 }}>
        Browse publicly verified resumes on the Veritas network. All profiles are on-chain and independently verifiable by anyone.
      </p>

      <div className="explore-grid">
        {SAMPLE_PROFILES.map((p, i) => {
          const profile = p as ExploreProfile;
          return (
            <div className="explore-card" key={i} onClick={() => onLoadProfile(profile)}>
              {/* Top bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                {/* Avatar */}
                <div className="explore-card-avatar">
                  {profile.profileImage ? (
                    <img src={profile.profileImage} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <AvatarFallback name={p.name} />
                  )}
                </div>
                {/* Verified badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', border: '1px solid rgba(74,222,128,0.25)', background: 'rgba(74,222,128,0.05)' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 4px #4ade80' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.2em', color: '#4ade80' }}>VERIFIED</span>
                </div>
              </div>

              {/* Name + Role */}
              <div className="explore-card-name">{p.name}</div>
              <div className="explore-card-role">{p.role}</div>

              {/* Divider */}
              <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />

              {/* Skills */}
              <div className="explore-card-tags">
                {p.skills.map((s, j) => <span className="mini-tag" key={j}>{s}</span>)}
              </div>

              {/* Bottom — View button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.14em', color: 'rgba(245,240,232,0.18)' }}>
                  SHELBY PROTOCOL
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', color: 'var(--gold-dim)', display: 'flex', alignItems: 'center', gap: 4 }} className="explore-view-btn">
                  VIEW PROFILE
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom feature bar */}
      <div className="explore-feature-bar">
        <div className="explore-feature-item">
          <div className="explore-feature-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
            </svg>
          </div>
          <div>
            <div className="explore-feature-label">More Profiles</div>
            <div className="explore-feature-sub">Loaded from Shelby Network</div>
          </div>
        </div>
        <div className="explore-feature-divider" />
        <div className="explore-feature-item">
          <div className="explore-feature-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <div>
            <div className="explore-feature-label">Search & Filter</div>
            <div className="explore-feature-sub">By Skill / Role / Location</div>
          </div>
        </div>
        <div className="explore-feature-divider" />
        <div className="explore-feature-item">
          <div className="explore-feature-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <div className="explore-feature-label">Publish Yours</div>
            <div className="explore-feature-sub">Join the verified network</div>
          </div>
        </div>
      </div>
    </section>
  );
}
