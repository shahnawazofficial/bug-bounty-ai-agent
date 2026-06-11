import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Zap, Lock, Eye, Target, ChevronRight } from 'lucide-react';

function GithubIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

const features = [
  { icon: <Shield size={20} />, title: 'Multi-Scanner Engine', desc: 'Semgrep, Gitleaks & Trivy running in parallel' },
  { icon: <Zap size={20} />, title: 'Instant Results', desc: 'AI-powered findings with severity scoring' },
  { icon: <Lock size={20} />, title: 'Secret Detection', desc: 'Catch hardcoded credentials before they leak' },
  { icon: <Eye size={20} />, title: 'Full Visibility', desc: 'Track vulnerabilities across all repositories' },
];

const stats = [
  { value: '10K+', label: 'Scans Run' },
  { value: '500K+', label: 'Vulns Found' },
  { value: '2K+', label: 'Repos Secured' },
  { value: '99.9%', label: 'Uptime' },
];

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  return (
    <div className="min-h-screen cyber-grid flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div style={{
          position: 'absolute', top: '20%', left: '10%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '10%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
      </div>

      {/* Navbar */}
      <nav style={{ borderBottom: '1px solid var(--border)', padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={18} color="white" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>
            Bug Bounty AI
          </span>
        </div>
        <span className="badge badge-success">Beta</span>
      </nav>

      {/* Hero */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', position: 'relative', zIndex: 10 }}>
        {/* Tag */}
        <div className="animate-fadeIn" style={{ marginBottom: 24 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 20,
            background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
            fontSize: 13, color: '#60a5fa', fontWeight: 500,
          }}>
            <Target size={14} />
            AI-Powered Security Platform
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fadeIn" style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: 'clamp(36px, 6vw, 72px)',
          fontWeight: 800,
          textAlign: 'center',
          lineHeight: 1.1,
          marginBottom: 20,
          maxWidth: 800,
        }}>
          Hunt Bugs Before
          <br />
          <span className="gradient-text">Attackers Do</span>
        </h1>

        <p className="animate-fadeIn" style={{
          color: 'var(--text-secondary)',
          fontSize: 18,
          textAlign: 'center',
          maxWidth: 520,
          marginBottom: 48,
          lineHeight: 1.7,
        }}>
          Connect your GitHub repositories and run automated security scans powered by Semgrep, Gitleaks, and Trivy — all in one dashboard.
        </p>

        {/* CTA Button */}
        <div className="animate-fadeIn" style={{ marginBottom: 64 }}>
          <button
            onClick={login}
            disabled={isLoading}
            id="github-login-btn"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              background: 'linear-gradient(135deg, #1f2937, #111827)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 12,
              padding: '16px 32px',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              fontFamily: 'Inter, sans-serif',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.6), 0 0 20px rgba(59,130,246,0.2)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
            }}
          >
            <GithubIcon size={22} />
            {isLoading ? 'Loading...' : 'Sign in with GitHub'}
            <ChevronRight size={18} style={{ opacity: 0.6 }} />
          </button>
        </div>

        {/* Stats */}
        <div className="animate-fadeIn" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
          maxWidth: 600, width: '100%', marginBottom: 64,
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'Space Grotesk, sans-serif' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16,
          maxWidth: 640, width: '100%',
        }}>
          {features.map((f, i) => (
            <div key={i} className="card animate-fadeIn" style={{ padding: 20 }}>
              <div style={{ color: 'var(--accent-blue)', marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '20px 40px', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, position: 'relative', zIndex: 10 }}>
        Bug Bounty AI Agent • Built for security engineers, developers & bug bounty hunters
      </footer>
    </div>
  );
}
