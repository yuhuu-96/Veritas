import { useEffect, useRef } from 'react';

function animateCount(el: HTMLElement, target: number, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start).toLocaleString();
    }
  }, 16);
}

export default function Hero() {
  const statResumesRef = useRef<HTMLDivElement>(null);
  const statVerifiedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (statResumesRef.current) animateCount(statResumesRef.current, 247);
      if (statVerifiedRef.current) animateCount(statVerifiedRef.current, 1893);
    }, 800);
    return () => clearTimeout(timeout);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section id="hero">
        <div className="hero-bg" />
        <div className="hero-rule" />
        <p className="hero-eyebrow">Decentralized · Immutable · Verifiable</p>
        <h1 className="hero-title"><em>Veri</em>tas</h1>
        <p className="hero-latin">from Latin — "truth"</p>
        <p className="hero-tagline">
          In a world of fake credentials, Veritas makes your career story provably real.
          Your resume, immutably stored on Shelby — verified on Aptos.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => scrollTo('app')}>
            Build Your Resume →
          </button>
          <button className="btn-secondary" onClick={() => scrollTo('verify')}>
            Verify a Credential
          </button>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-value mono" ref={statResumesRef}>0</div>
          <div className="stat-label">Resumes Published</div>
        </div>
        <div className="stat-item">
          <div className="stat-value mono" ref={statVerifiedRef}>0</div>
          <div className="stat-label">Credentials Verified</div>
        </div>
        <div className="stat-item">
          <div className="stat-value mono">Shelbynet</div>
          <div className="stat-label">Storage Network</div>
        </div>
        <div className="stat-item">
          <div className="stat-value mono">Aptos</div>
          <div className="stat-label">Blockchain Layer</div>
        </div>
      </div>
    </>
  );
}
