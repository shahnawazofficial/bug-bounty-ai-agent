import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Shield, Target, ChevronRight, Play, Sparkles, Lock, Box,
  Brain, FileText, Bell, Search, Settings, Home, Activity,
  Database, Calendar, ArrowUpRight, Check
} from 'lucide-react';

function GithubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#030712', color: '#f3f4f6', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      
      {/* Background gradients and grid pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />
        {/* Glowing Orbs */}
        <div style={{
          position: 'absolute', top: '10%', left: '15%',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)'
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '10%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(80px)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '30%',
          width: '700px', height: '700px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(100px)'
        }} />
      </div>

      {/* Header / Navbar */}
      <header style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        background: 'rgba(3, 7, 18, 0.5)', backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
          }}>
            <Shield size={16} color="white" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>
            Bug Bounty AI
          </span>
        </div>

        {/* Center Links */}
        <nav style={{ display: 'flex', gap: 32 }}>
          {['Features', 'How it Works', 'Pricing', 'Docs', 'Blog'].map((link) => (
            link === 'How it Works' ? (
              <a key={link} href="/how-it-works" style={{
                fontSize: 14, color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s', fontWeight: 500
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#f3f4f6'}
              onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
              >
                {link}
              </a>
            ) : (
              <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} style={{
                fontSize: 14, color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s', fontWeight: 500
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#f3f4f6'}
              onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
              >
                {link}
              </a>
            )
          ))}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', color: '#a78bfa',
            background: 'rgba(167, 139, 250, 0.1)', border: '1px solid rgba(167, 139, 250, 0.25)',
            padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase'
          }}>
            Beta
          </span>
          <button
            onClick={login}
            disabled={isLoading}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#f3f4f6',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            <GithubIcon size={16} />
            Sign in with GitHub
          </button>
        </div>
      </header>

      {/* Hero Content Section */}
      <section style={{
        position: 'relative', zIndex: 10, flex: 1,
        padding: '80px 48px 60px', display: 'grid', gridTemplateColumns: '1.1fr 1fr',
        gap: 60, maxWidth: 1300, margin: '0 auto', width: '100%', alignItems: 'center'
      }}>
        {/* Left Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          {/* Badge */}
          <div style={{ marginBottom: 20 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#a5b4fc',
              letterSpacing: '0.05em', textTransform: 'uppercase'
            }}>
              <Sparkles size={12} />
              AI-Powered Security Platform
            </span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: 'clamp(38px, 4.5vw, 56px)', fontWeight: 800,
            fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.08,
            letterSpacing: '-0.02em', marginBottom: 20, color: '#ffffff'
          }}>
            Hunt Bugs Before
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #38bdf8, #818cf8, #c084fc)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Attackers Do</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 16, color: '#9ca3af', lineHeight: 1.6, marginBottom: 36,
            maxWidth: 520
          }}>
            Connect your GitHub repositories and run automated security scans powered by Semgrep, Gitleaks, and Trivy — all in one intelligent dashboard.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, width: '100%' }}>
            <button
              onClick={login}
              disabled={isLoading}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                color: '#ffffff', border: 'none', padding: '14px 28px', borderRadius: 10,
                fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(99, 102, 241, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.3)';
              }}
            >
              <GithubIcon size={18} />
              {isLoading ? 'Connecting...' : 'Sign in with GitHub'}
              <ChevronRight size={16} />
            </button>

            <button
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#e5e7eb', padding: '14px 28px', borderRadius: 10,
                fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              <Play size={16} fill="currentColor" />
              View Demo
            </button>
          </div>

          {/* Secure disclaimer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6b7280', fontSize: 12 }}>
            <Shield size={14} style={{ color: '#4f46e5' }} />
            Your code is always secure. We never store your code.
          </div>
        </div>

        {/* Right Dashboard Mock Panel */}
        <div style={{ position: 'relative' }}>
          {/* Outer glow background */}
          <div style={{
            position: 'absolute', inset: -2, borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.1), rgba(16,185,129,0.1))',
            filter: 'blur(10px)', zIndex: 0
          }} />

          {/* Real Mock Dashboard Container */}
          <div style={{
            position: 'relative', zIndex: 1, background: '#0a0f1d',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16,
            display: 'flex', overflow: 'hidden', height: 440,
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}>
            {/* Sidebar */}
            <div style={{
              width: 52, borderRight: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '16px 0', gap: 20, background: '#0b1122'
            }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={14} style={{ color: '#818cf8' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, width: '100%', alignItems: 'center' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', borderLeft: '2px solid #6366f1', color: '#6366f1' }}>
                  <Home size={16} />
                </div>
                <Search size={16} style={{ color: '#4b5563' }} />
                <Activity size={16} style={{ color: '#4b5563' }} />
                <FileText size={16} style={{ color: '#4b5563' }} />
                <Database size={16} style={{ color: '#4b5563' }} />
              </div>
              <Settings size={16} style={{ color: '#4b5563' }} />
            </div>

            {/* Dashboard Content */}
            <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>Dashboard</h3>
                  <p style={{ fontSize: 11, color: '#4b5563' }}>Overview of your security scans</p>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#9ca3af',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                  padding: '4px 10px', borderRadius: 6
                }}>
                  <Calendar size={12} /> Last 7 days
                </div>
              </div>

              {/* Stat Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {[
                  { label: 'Repositories', val: '24', trend: '+12 this week', color: '#818cf8' },
                  { label: 'Vulnerabilities', val: '156', trend: '-8% from last week', color: '#ef4444' },
                  { label: 'Secrets Detected', val: '32', trend: '+5 this week', color: '#f59e0b' },
                  { label: 'Scan Time Saved', val: '18h', trend: '+3h this week', color: '#10b981' }
                ].map((stat, idx) => (
                  <div key={idx} style={{
                    background: '#0d1527', border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', justifyItems: 'space-between'
                  }}>
                    <span style={{ fontSize: 9, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{stat.label}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', margin: '4px 0' }}>{stat.val}</span>
                    <span style={{ fontSize: 8, color: stat.color, fontWeight: 500 }}>{stat.trend}</span>
                  </div>
                ))}
              </div>

              {/* Split Details Section */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.3fr', gap: 16, flex: 1 }}>
                
                {/* Vulnerability Severity Chart */}
                <div style={{
                  background: '#0d1527', border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column'
                }}>
                  <h4 style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', marginBottom: 8 }}>Vulnerabilities by Severity</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                    {/* Donut circle representation */}
                    <div style={{ position: 'relative', width: 70, height: 70, flexShrink: 0 }}>
                      <svg width="70" height="70" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />
                        {/* Critical Segment (Red) */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ef4444" strokeWidth="3.2" strokeDasharray="15 85" strokeDashoffset="25" />
                        {/* High Segment (Orange) */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f97316" strokeWidth="3.2" strokeDasharray="30 70" strokeDashoffset="10" />
                        {/* Medium Segment (Yellow) */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#eab308" strokeWidth="3.2" strokeDasharray="40 60" strokeDashoffset="-20" />
                        {/* Low Segment (Blue) */}
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="3.2" strokeDasharray="15 85" strokeDashoffset="-60" />
                      </svg>
                      <div style={{
                        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', lineHeight: 1
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#ffffff' }}>156</span>
                        <span style={{ fontSize: 7, color: '#4b5563', textTransform: 'uppercase' }}>Total</span>
                      </div>
                    </div>
                    {/* Severity Labels */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
                      {[
                        { name: 'Critical', count: '23', color: '#ef4444' },
                        { name: 'High', count: '45', color: '#f97316' },
                        { name: 'Medium', count: '62', color: '#eab308' },
                        { name: 'Low', count: '26', color: '#3b82f6' }
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 9 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: item.color }} />
                            <span style={{ color: '#9ca3af' }}>{item.name}</span>
                          </div>
                          <span style={{ fontWeight: 600, color: '#ffffff' }}>{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Scans */}
                <div style={{
                  background: '#0d1527', border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h4 style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af' }}>Recent Scans</h4>
                    <span style={{ fontSize: 9, color: '#6366f1', cursor: 'pointer' }}>View all</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, justifyContent: 'center' }}>
                    {[
                      { name: 'awesome-project', time: '2m ago', vulns: '24 vuln' },
                      { name: 'payment-service', time: '15m ago', vulns: '8 vuln' },
                      { name: 'mobile-app', time: '1h ago', vulns: '12 vuln' },
                      { name: 'frontend-app', time: '3h ago', vulns: '5 vuln' }
                    ].map((scan, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '5px 8px', background: 'rgba(255,255,255,0.01)',
                        border: '1px solid rgba(255,255,255,0.03)', borderRadius: 6
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 9, color: '#ffffff', fontWeight: 500 }}>{scan.name}</span>
                          <span style={{
                            fontSize: 7, color: '#10b981', background: 'rgba(16,185,129,0.08)',
                            padding: '1px 4px', borderRadius: 4, border: '1px solid rgba(16,185,129,0.15)'
                          }}>Completed</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 8, color: '#6b7280' }}>
                          <span style={{ color: '#9ca3af' }}>{scan.vulns}</span>
                          <span>•</span>
                          <span>{scan.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted row / badges section */}
      <section style={{
        position: 'relative', zIndex: 10,
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: 'rgba(255, 255, 255, 0.01)',
        padding: '30px 48px'
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: 18, fontWeight: 600 }}>
            Trusted by security researchers and developers
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            {[
              { icon: <Shield size={14} />, text: 'Semgrep Powered' },
              { icon: <Sparkles size={14} />, text: 'AI Enhanced' },
              { icon: <Target size={14} />, text: 'Multi-Scanner Engine' },
              { icon: <Box size={14} />, text: 'Enterprise Ready' },
              { icon: <Check size={14} />, text: 'Privacy First' }
            ].map((badge, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#9ca3af' }}>
                <span style={{ color: '#818cf8' }}>{badge.icon}</span>
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Powerful Features Grid Section */}
      <section style={{ position: 'relative', zIndex: 10, padding: '100px 48px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', textTransform: 'uppercase'
          }}>
            Powerful Features
          </span>
          <h2 style={{ fontSize: 30, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: '#ffffff', marginTop: 10, marginBottom: 8 }}>
            Everything you need for comprehensive security
          </h2>
          <p style={{ fontSize: 15, color: '#9ca3af' }}>
            One platform. All the tools. Smarter results.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            {
              icon: <div style={{ color: '#38bdf8' }}>&lt;/&gt;</div>,
              title: 'Static Code Analysis',
              desc: 'Advanced SAST with Semgrep to find security vulnerabilities in your code.'
            },
            {
              icon: <Lock size={18} style={{ color: '#f43f5e' }} />,
              title: 'Secret Detection',
              desc: 'Find hardcoded secrets, API keys, tokens, and sensitive information.'
            },
            {
              icon: <Box size={18} style={{ color: '#fb923c' }} />,
              title: 'Dependency Scanning',
              desc: 'Detect vulnerable dependencies and outdated packages with Trivy.'
            },
            {
              icon: <Brain size={18} style={{ color: '#818cf8' }} />,
              title: 'AI Security Analysis',
              desc: 'Get AI-powered explanations, remediation tips, and security recommendations.'
            },
            {
              icon: <FileText size={18} style={{ color: '#a78bfa' }} />,
              title: 'Smart Reports',
              desc: 'Generate beautiful reports with insights and export in multiple formats.'
            },
            {
              icon: <Bell size={18} style={{ color: '#34d399' }} />,
              title: 'Real-time Alerts',
              desc: 'Get notified about new vulnerabilities and security issues instantly.'
            }
          ].map((feature, i) => (
            <div key={i} style={{
              background: '#070b15', border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 16, padding: 24, transition: 'all 0.25s',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: 16, fontSize: 14, fontWeight: 700
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 8, fontFamily: 'Space Grotesk, sans-serif' }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.5 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '30px 48px', borderTop: '1px solid rgba(255,255,255,0.05)',
        textAlign: 'center', color: '#4b5563', fontSize: 12, position: 'relative', zIndex: 10,
        background: 'rgba(3, 7, 18, 0.4)'
      }}>
        Bug Bounty AI Agent &bull; Built for security engineers, developers & bug bounty hunters
      </footer>
    </div>
  );
}
