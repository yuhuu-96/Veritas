// ─── Network Configuration ─────────────────────────────────────
export const SHELBY_RPC = 'https://api.shelbynet.shelby.xyz/shelby';
export const APTOS_FULLNODE = 'https://api.shelbynet.shelby.xyz/v1';
export const SHELBY_CONTRACT = '0xc63d6a5efb0080a6029403131715bd4971e1149f7cc099aac69bb0069b3ddbf5';

// ─── Storage Duration Options ──────────────────────────────────
export const STORAGE_DURATIONS = [
  { label: '24 hours (Demo)', value: '86400000000' },
  { label: '30 days', value: '2592000000000' },
  { label: '1 year', value: '31536000000000' },
  { label: '5 years', value: '157680000000000' },
] as const;

export const DEFAULT_STORAGE_DURATION = '31536000000000'; // 1 year

// ─── Resume Schema ─────────────────────────────────────────────
export const RESUME_SCHEMA = 'veritas/resume/v1';
export const RESUME_VERSION = '1';

// ─── Sample Profiles ───────────────────────────────────────────
export const SAMPLE_PROFILES = [
  {
    name: 'Alexandra Chen',
    title: 'Senior Product Designer',
    email: 'alex@example.com',
    location: 'Singapore',
    avatar: '👩‍💻',
    skills: ['Figma', 'Web3 UX', 'User Research'],
    role: 'Senior Product Designer · Singapore',
  },
  {
    name: 'Marcus Wiesel',
    title: 'Blockchain Engineer',
    email: 'marcus@example.com',
    location: 'Berlin',
    avatar: '👨‍🔬',
    skills: ['Rust', 'Move', 'Aptos', 'Solidity'],
    role: 'Blockchain Engineer · Berlin',
  },
  {
    name: 'Yuki Tanaka',
    title: 'Creative Director',
    email: 'yuki@example.com',
    location: 'Tokyo',
    avatar: '🧑‍🎨',
    skills: ['Branding', 'Motion', 'NFTs'],
    role: 'Creative Director · Tokyo',
  },
] as const;
