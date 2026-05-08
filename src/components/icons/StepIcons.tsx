// Professional SVG icon components for the HowItWorks steps

export const IconWallet = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    {/* Card body */}
    <rect x="1.5" y="5.5" width="21" height="14" rx="2.5" ry="2.5"/>
    {/* Chip */}
    <rect x="5" y="9" width="5" height="4" rx="0.8" strokeWidth="1.2"/>
    {/* Chip lines */}
    <line x1="5" y1="11" x2="10" y2="11" strokeWidth="0.8"/>
    <line x1="7.5" y1="9" x2="7.5" y2="13" strokeWidth="0.8"/>
    {/* Magnetic stripe hint */}
    <line x1="1.5" y1="16" x2="22.5" y2="16" strokeWidth="2" strokeOpacity="0.35"/>
  </svg>
);

export const IconDocument = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    {/* Document outline */}
    <path d="M13.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5L13.5 2z"/>
    {/* Folded corner */}
    <polyline points="13.5 2 13.5 8.5 20 8.5"/>
    {/* Text lines */}
    <line x1="8" y1="12.5" x2="16" y2="12.5"/>
    <line x1="8" y1="15.5" x2="16" y2="15.5"/>
    <line x1="8" y1="18.5" x2="12" y2="18.5"/>
    {/* Badge / check */}
    <circle cx="8.5" cy="9.5" r="1.2" fill="currentColor" strokeWidth="0"/>
  </svg>
);

export const IconChain = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    {/* Blockchain cubes connected */}
    <rect x="2" y="9" width="6" height="6" rx="1"/>
    <rect x="9" y="9" width="6" height="6" rx="1"/>
    <rect x="16" y="9" width="6" height="6" rx="1"/>
    {/* Connecting lines */}
    <line x1="8" y1="12" x2="9" y2="12"/>
    <line x1="15" y1="12" x2="16" y2="12"/>
    {/* Top connections suggesting network */}
    <path d="M5 9V6M12 9V6M19 9V6" strokeDasharray="1.5 1.5" strokeOpacity="0.5"/>
    <path d="M5 6H19" strokeDasharray="1.5 1.5" strokeOpacity="0.5"/>
  </svg>
);

export const IconHash = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    {/* Fingerprint-like ID icon */}
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
    {/* QR-like inner pattern */}
    <rect x="8" y="8" width="3" height="3" rx="0.5" strokeWidth="1.2"/>
    <rect x="13" y="8" width="3" height="3" rx="0.5" strokeWidth="1.2"/>
    <rect x="8" y="13" width="3" height="3" rx="0.5" strokeWidth="1.2"/>
    {/* Dot */}
    <rect x="14" y="14" width="2" height="2" rx="0.3" fill="currentColor" strokeWidth="0"/>
  </svg>
);

export const IconShield = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    {/* Shield */}
    <path d="M12 2L3.5 5.5V11c0 5.25 3.8 9.74 8.5 11 4.7-1.26 8.5-5.75 8.5-11V5.5L12 2z"/>
    {/* Check mark */}
    <polyline points="8.5 12 11 14.5 15.5 9.5" strokeWidth="1.6"/>
  </svg>
);

export const IconInfinity = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    {/* Decentralized network nodes */}
    <circle cx="12" cy="12" r="2"/>
    <circle cx="4.5" cy="7" r="1.5"/>
    <circle cx="19.5" cy="7" r="1.5"/>
    <circle cx="4.5" cy="17" r="1.5"/>
    <circle cx="19.5" cy="17" r="1.5"/>
    {/* Edges */}
    <line x1="6" y1="7.8" x2="10.3" y2="10.8"/>
    <line x1="18" y1="7.8" x2="13.7" y2="10.8"/>
    <line x1="6" y1="16.2" x2="10.3" y2="13.2"/>
    <line x1="18" y1="16.2" x2="13.7" y2="13.2"/>
    <line x1="4.5" y1="8.5" x2="4.5" y2="15.5"/>
    <line x1="19.5" y1="8.5" x2="19.5" y2="15.5"/>
  </svg>
);
