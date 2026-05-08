import { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useToast } from '../hooks/useToast';

export default function Navbar() {
  const { connect, disconnect, connected, account, wallets } = useWallet();
  const { showToast } = useToast();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleSelectWallet = async (walletName: string) => {
    setConnecting(walletName);
    try {
      await connect(walletName);
      showToast(`✓ Connected to ${walletName}`, 'success');
      setShowWalletModal(false);
    } catch (err) {
      showToast(`Failed to connect to ${walletName}`, 'error');
      console.error(err);
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      showToast('Wallet disconnected', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  const addrStr = account?.address ? account.address.toString() : '';
  const shortAddr = addrStr ? addrStr.slice(0, 6) + '...' + addrStr.slice(-4) : '';

  // Prioritise Petra - put it first if present
  const sortedWallets = [...(wallets ?? [])].sort((a) => {
    const name = (a as unknown as { name: string }).name?.toLowerCase() ?? '';
    return name.includes('petra') ? -1 : 0;
  });

  return (
    <>
      <nav id="main-nav">
        <div className="nav-logo">
          <img src="/veritasicon.png" alt="Veritas" style={{ width: 34, height: 34, objectFit: 'contain', flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span className="nav-logo-text">VERITAS</span>
            <span className="nav-logo-sub">on-chain resume</span>
          </div>
        </div>

        <ul className="nav-links">
          <li><a href="#how">How It Works</a></li>
          <li><a href="#app">Build Resume</a></li>
          <li><a href="#verify">Verify</a></li>
          <li><a href="#explore">Explore</a></li>
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href="https://docs.shelby.xyz/tools/wallets/petra-setup#apt-faucet"
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.15em',
              color: 'var(--gold)',
              textDecoration: 'none',
              border: '1px solid rgba(200,151,58,0.3)',
              padding: '6px 12px',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(200,151,58,0.1)';
              e.currentTarget.style.borderColor = 'var(--gold)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(200,151,58,0.3)';
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v6" />
              <path d="M12 18v4" />
              <path d="M4.93 10.93l4.24 4.24" />
              <path d="M14.83 14.83l4.24 4.24" />
              <path d="M2 12h6" />
              <path d="M18 12h4" />
              <path d="M4.93 4.93l4.24 4.24" />
              <path d="M14.83 4.83l4.24 4.24" />
            </svg>
            FAUCET
          </a>
          {connected && account ? (
            <div className="wallet-indicator" style={{ display: 'flex' }} onClick={handleDisconnect} title="Click to disconnect">
              <div className="wallet-dot" />
              <span>{shortAddr}</span>
            </div>
          ) : (
            <button className="btn-connect" id="connectWalletBtn" onClick={() => setShowWalletModal(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="6" width="20" height="12" rx="2"/>
                <path d="M22 10H18a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h4"/>
              </svg>
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      {/* Wallet Selector Modal */}
      {showWalletModal && (
        <div className="modal-overlay show" onClick={e => e.target === e.currentTarget && setShowWalletModal(false)}>
          <div className="modal" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <span className="modal-title">Connect Wallet</span>
              <button className="modal-close" onClick={() => setShowWalletModal(false)}>�-</button>
            </div>
            <div className="modal-body">
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(245,240,232,0.4)', letterSpacing: '0.12em', marginBottom: 20, lineHeight: 1.6 }}>
                Select an Aptos-compatible wallet to connect. Install{' '}
                <a href="https://petra.app/" target="_blank" rel="noreferrer" style={{ color: 'var(--gold)' }}>Petra Wallet</a>{' '}
                if you don't have one yet.
              </p>

              {sortedWallets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(245,240,232,0.3)', letterSpacing: '0.14em' }}>
                    No wallets detected.
                  </p>
                  <a href="https://petra.app/" target="_blank" rel="noreferrer"
                    style={{ display: 'block', marginTop: 16, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--gold)', letterSpacing: '0.15em' }}>
                    Install Petra Wallet →
                  </a>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {sortedWallets.map((wallet) => {
                    const w = wallet as unknown as { name: string; icon?: string; url?: string };
                    const isPetra = w.name?.toLowerCase().includes('petra');
                    const isConnecting = connecting === w.name;
                    return (
                      <button
                        key={w.name}
                        onClick={() => handleSelectWallet(w.name)}
                        disabled={isConnecting}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          padding: '14px 18px',
                          background: isPetra ? 'rgba(200,151,58,0.08)' : 'rgba(245,240,232,0.03)',
                          border: `1px solid ${isPetra ? 'rgba(200,151,58,0.5)' : 'rgba(245,240,232,0.1)'}`,
                          cursor: isConnecting ? 'wait' : 'pointer',
                          transition: 'all 0.2s',
                          width: '100%',
                          textAlign: 'left' as const,
                          opacity: isConnecting ? 0.6 : 1,
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = isPetra ? 'rgba(200,151,58,0.5)' : 'rgba(245,240,232,0.1)'; }}
                      >
                        {/* Wallet icon or fallback */}
                        <div style={{
                          width: 36, height: 36, borderRadius: 8,
                          background: 'rgba(200,151,58,0.15)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 18, flexShrink: 0, overflow: 'hidden',
                        }}>
                          {w.icon ? (
                            <img src={w.icon} alt={w.name} style={{ width: 24, height: 24, objectFit: 'contain' }} />
                          ) : '👛'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--parchment)', marginBottom: 2 }}>
                            {w.name}
                            {isPetra && (
                              <span style={{ marginLeft: 8, fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.14em', color: 'var(--gold)', background: 'rgba(200,151,58,0.15)', padding: '2px 6px' }}>
                                RECOMMENDED
                              </span>
                            )}
                          </div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(245,240,232,0.3)', letterSpacing: '0.1em' }}>
                            {isConnecting ? 'Connecting...' : 'Aptos · AIP-62'}
                          </div>
                        </div>
                        <span style={{ color: 'var(--gold)', fontSize: 14 }}>→</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(245,240,232,0.2)', letterSpacing: '0.12em', lineHeight: 1.7 }}>
                Only Aptos-compatible wallets are shown. Your wallet must support the Shelbynet network to publish resumes.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
