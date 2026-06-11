import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Target, ChevronRight, Play, Sparkles, Lock, Box, Brain, FileText, Bell, Check } from 'lucide-react';

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      
      {/* Background Grids */}
      <div className="fixed inset-0 pointer-events-none z-0 cyber-grid" />
      <div className="fixed inset-0 pointer-events-none z-0 cyber-dots" />
      
      {/* Header */}
      <header style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 40px', borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(5, 5, 5, 0.8)', backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(0, 255, 157, 0.35)'
          }}>
            <Shield size={16} color="#000" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em', color: '#fff' }}>
            Bug Bounty AI
          </span>
        </div>

        {/* Center Links */}
        <nav style={{ display: 'flex', gap: 28 }}>
          {[
            { label: 'Platform Features', href: '#features' },
            { label: 'How it Works', href: '/how-it-works' },
            { label: 'Pricing Plan', href: '/pricing' },
          ].map((link) => (
            <a key={link.label} href={link.href} style={{
              fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.15s', fontWeight: 500
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent)',
            background: 'rgba(0, 255, 157, 0.08)', border: '1px solid rgba(0, 255, 157, 0.25)',
            padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase'
          }}>
            SYSTEM: ONLINE
          </span>
          <button
            onClick={login}
            disabled={isLoading}
            className="btn btn-ghost btn-sm"
          >
            <GithubIcon size={14} />
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        position: 'relative', zIndex: 10, flex: 1,
        padding: '80px 40px 60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: 60, maxWidth: 1200, margin: '0 auto', width: '100%', alignItems: 'center'
      }}>
        {/* Left Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ marginBottom: 20 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(0, 255, 157, 0.08)',
              border: '1px solid rgba(0, 255, 157, 0.25)',
              padding: '6px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: 'var(--accent)',
              letterSpacing: '0.06em', textTransform: 'uppercase'
            }}>
              <Sparkles size={11} />
              AI SECURITY AGENT & ANALYTICS
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(34px, 4vw, 50px)', fontWeight: 800,
            fontFamily: 'var(--font-display)', lineHeight: 1.1,
            letterSpacing: '-0.03em', marginBottom: 20, color: '#ffffff'
          }}>
            Automate Vulnerability Scanning with
            <br />
            <span style={{ color: 'var(--accent)', textShadow: '0 0 15px rgba(0, 255, 157, 0.2)' }}>Artificial Intelligence</span>
          </h1>

          <p style={{
            fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 32,
            maxWidth: 520
          }}>
            Connect your GitHub repositories, orchestrate high-accuracy scans with Semgrep, Trivy, and Gitleaks, and let AI triage and rewrite insecure code automatically.
          </p>

          <div style={{ display: 'flex', gap: 16, marginBottom: 24, width: '100%', flexWrap: 'wrap' }}>
            <button
              onClick={login}
              disabled={isLoading}
              className="btn btn-primary btn-lg"
              style={{ padding: '14px 28px' }}
            >
              <GithubIcon size={18} />
              {isLoading ? 'Connecting GitHub...' : 'Connect GitHub Account'}
              <ChevronRight size={16} />
            </button>

            <a
              href="#features"
              className="btn btn-secondary btn-lg"
              style={{ padding: '14px 28px' }}
            >
              <Play size={14} fill="currentColor" />
              Explore Features
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 12 }}>
            <Shield size={14} style={{ color: 'var(--accent)' }} />
            Zero Trust Architecture. We never persist your codebase structure.
          </div>
        </div>

        {/* Right Dashboard Mock Panel */}
        <div style={{ position: 'relative' }}>
          {/* Real Mock Dashboard Container */}
          <div style={{
            position: 'relative', zIndex: 1, background: 'var(--bg-card)',
            border: '1px solid var(--border-default)', borderRadius: 16,
            display: 'flex', overflow: 'hidden', height: 420,
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
          }}>
            {/* Sidebar Mock */}
            <div style={{
              width: 52, borderRight: '1px solid var(--border-subtle)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '16px 0', gap: 20, background: 'var(--bg-secondary)'
            }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={14} style={{ color: 'var(--accent)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, width: '100%', alignItems: 'center' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', borderLeft: '2px solid var(--accent)', color: 'var(--accent)' }}>
                  <Target size={16} />
                </div>
                <Box size={16} style={{ color: 'var(--text-muted)' }} />
                <FileText size={16} style={{ color: 'var(--text-muted)' }} />
                <Brain size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>

            {/* Dashboard Content Mock */}
            <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-display)' }}>Security Dashboard</h3>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Status: Active Shields</p>
                </div>
                <span className="badge badge-success">78% Health</span>
              </div>

              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[
                  { label: 'Repos', val: '24', col: 'var(--cyan)' },
                  { label: 'Vulns', val: '156', col: 'var(--sev-critical)' },
                  { label: 'Secrets', val: '32', col: 'var(--sev-high)' }
                ].map((stat, idx) => (
                  <div key={idx} style={{
                    background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                    borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column'
                  }}>
                    <span style={{ fontSize: 8, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.label}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', margin: '2px 0' }}>{stat.val}</span>
                    <span style={{ fontSize: 8, color: stat.col, fontWeight: 600 }}>Active Shield</span>
                  </div>
                ))}
              </div>

              {/* Console Mock */}
              <div style={{
                background: '#050505', border: '1px solid var(--border-subtle)', borderRadius: 10,
                padding: '12px 14px', flex: 1, fontFamily: 'var(--font-mono)', fontSize: 11,
                display: 'flex', flexDirection: 'column', gap: 4, overflow: 'hidden'
              }}>
                <div style={{ color: 'var(--accent)' }}>$ bugbounty-agent scan --all</div>
                <div style={{ color: 'var(--text-muted)' }}>[INFO] Indexing local git references... Done</div>
                <div style={{ color: 'var(--cyan)' }}>[SEMGREP] Running security ruleset (128 rules)...</div>
                <div style={{ color: 'var(--sev-critical)' }}>[ALERT] SQL Injection vulnerability found at line 42</div>
                <div style={{ color: 'var(--text-primary)' }}>[AI] Formulating auto-mitigation patch...</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Badges */}
      <section style={{
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-secondary)',
        padding: '24px 40px'
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          {[
            { icon: <Shield size={14} />, text: 'Semgrep Engine Powered' },
            { icon: <Brain size={14} />, text: 'Claude / GPT Patch Generation' },
            { icon: <Target size={14} />, text: 'Automated Trivy CVE Scans' },
            { icon: <Check size={14} />, text: 'Gitleaks Secrets Defense' }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--accent)' }}>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', color: '#ffffff' }}>
            Enterprise Security Infrastructure
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6 }}>
            Modern AI code auditing combined with industry-standard scanners.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[
            { title: 'Static Code Audits (SAST)', desc: 'Run lightweight Semgrep rules across your repositories to catch logic bugs, buffer overflows, and bad practices.', color: 'var(--accent)' },
            { title: 'Secret Exposure Guard', desc: 'Scan commits and files for exposed private keys, OAuth tokens, AWS credentials, and other leaked credentials with Gitleaks.', color: 'var(--cyan)' },
            { title: 'Software Composition Analysis (SCA)', desc: 'Identify CVEs and security flaws within third-party node packages, Python dependencies, and Docker images.', color: 'var(--sev-high)' },
            { title: 'AI Automated Remediation', desc: 'Receive code patch proposals directly in the dashboard to instantly resolve critical security issues without breaking functionality.', color: 'var(--accent)' }
          ].map((feature, i) => (
            <div key={i} className="card" style={{ padding: 24, background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: feature.color }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-display)' }}>{feature.title}</h3>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '24px 40px', borderTop: '1px solid var(--border-subtle)',
        textAlign: 'center', color: 'var(--text-muted)', fontSize: 12,
        background: 'var(--bg-secondary)'
      }}>
        Bug Bounty AI Security &bull; Empowering security teams with smart code verification agents
      </footer>
    </div>
  );
}
