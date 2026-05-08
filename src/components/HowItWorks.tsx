import { IconWallet, IconDocument, IconChain, IconHash, IconShield, IconInfinity } from './icons/StepIcons';

const steps = [
  {
    num: '01', Icon: IconWallet, title: 'Connect Wallet',
    desc: 'Connect your Aptos wallet (Petra, Martian, or any AIP-62 compatible wallet). Your wallet address becomes your permanent, verifiable identity on Veritas.',
    tech: 'Via: Aptos Wallet Adapter · AIP-62 Standard',
  },
  {
    num: '02', Icon: IconDocument, title: 'Build Your Resume',
    desc: 'Fill in your work experience, education, and skills. Your data is structured as a verifiable JSON object, ready for on-chain storage with cryptographic integrity.',
    tech: 'Format: JSON Schema · Structured Data',
  },
  {
    num: '03', Icon: IconChain, title: 'Publish On-Chain',
    desc: "Your resume JSON is uploaded to Shelby's decentralized hot storage. A cryptographic commitment is written to the Aptos blockchain - immutably linking you to your truth.",
    tech: 'Via: Shelby SDK · Aptos Mainnet',
  },
  {
    num: '04', Icon: IconHash, title: 'Get Your Blob ID',
    desc: 'Receive a unique Shelby Blob ID - a permanent, shareable identifier for your resume. Share this ID with employers or anyone who needs to verify your credentials.',
    tech: 'Output: Shelby Blob Hash · Aptos Tx Hash',
  },
  {
    num: '05', Icon: IconShield, title: 'Anyone Can Verify',
    desc: 'Employers enter your Blob ID into the Verify tab. The data is retrieved from Shelby and cross-checked against the Aptos blockchain commitment - trustlessly.',
    tech: 'Via: Shelby RPC · Aptos Indexer',
  },
  {
    num: '06', Icon: IconInfinity, title: 'Permanent & Yours',
    desc: 'No central authority can alter or delete your verified credentials. Your professional truth lives on a decentralized network - censorship-resistant and permanently accessible.',
    tech: 'Network: Shelby Devnet → Mainnet · Aptos L1',
  },
];

export default function HowItWorks() {
  return (
    <section id="how">
      <p className="section-eyebrow">/ 01 - Protocol</p>
      <h2 className="section-title">How Veritas Works</h2>
      <div className="steps-grid">
        {steps.slice(0, 3).map(({ num, Icon, title, desc, tech }) => (
          <div className="step-card" key={num}>
            <span className="step-number">Step {num}</span>
            <div className="step-icon-svg"><Icon /></div>
            <div className="step-title">{title}</div>
            <p className="step-desc">{desc}</p>
            <div className="step-tech">{tech}</div>
          </div>
        ))}
      </div>
      <div className="steps-grid" style={{ marginTop: '1px' }}>
        {steps.slice(3).map(({ num, Icon, title, desc, tech }) => (
          <div className="step-card" key={num}>
            <span className="step-number">Step {num}</span>
            <div className="step-icon-svg"><Icon /></div>
            <div className="step-title">{title}</div>
            <p className="step-desc">{desc}</p>
            <div className="step-tech">{tech}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
