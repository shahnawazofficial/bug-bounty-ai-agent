import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Sparkles, GitBranch, ArrowRight, Play, CheckCircle2, ChevronRight, Lock, Brain, Wrench } from 'lucide-react';

export default function HowItWorksPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const steps = [
    {
      number: '01',
      title: 'Connect Repositories',
      icon: <GitBranch size={22} style={{ color: '#818cf8' }} />,
      desc: 'Connect your GitHub account securely in one click. Import only the repositories you want to secure.',
      color: '#818cf8',
      details: ['One-click GitHub OAuth authorization', 'Scan public or private repositories', 'Zero read/write permission to code storage (privacy first)']
    },
    {
      number: '02',
      title: 'Run Automated Security Scans',
      icon: <Shield size={22} style={{ color: '#00d4ff' }} />,
      desc: 'Run powerful automated security scanners concurrently. Spot vulnerabilities, leaks, and outdated packages.',
      color: '#00d4ff',
      details: ['Semgrep: Custom rules for static code analysis (SAST)', 'Gitleaks: Check hardcoded credentials, keys, and tokens', 'Trivy: Scan dependencies and third-party package security']
    },
    {
      number: '03',
      title: 'Gemini AI Analysis',
      icon: <Sparkles size={22} style={{ color: '#a78bfa' }} />,
      desc: 'Our AI engine analyzes the detected security issues to provide actionable code explanations and exploit severity.',
      color: '#a78bfa',
      details: ['Understands precise code context and flow', 'Generates easy-to-read explanations of why it is dangerous', 'Identifies potential attack scenarios']
    },
    {
      number: '04',
      title: 'Remediate & Fix',
      icon: <Wrench size={22} style={{ color: '#34d399' }} />,
      desc: 'Get precise code remediation suggestions to resolve vulnerabilities. Copy fixed code directly.',
      color: '#34d399',
      details: ['Before-and-after code block examples', 'Step-by-step resolution documentation', 'Interactive copy features to speed up fixes']
    }
  ];

  return (
    <div style={{
      padding: '40px 32px', maxWidth: 1000, margin: '0 auto', minHeight: '100vh',
      color: '#f3f4f6', fontFamily: 'Inter, sans-serif'
    }} className="animate-fadeIn">
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: '#ffffff' }}>How Bug Bounty AI Works</h1>
          <p style={{ color: '#9ca3af', fontSize: 14, marginTop: 4 }}>Understand our automated security scanning and AI analysis pipeline</p>
        </div>
        <button
          onClick={() => navigate(token ? '/dashboard' : '/login')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            padding: '10px 20px', borderRadius: 10, cursor: 'pointer', fontSize: 13, color: '#f3f4f6',
            fontWeight: 600, transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
        >
          Back to {token ? 'Dashboard' : 'Home'}
        </button>
      </div>

      {/* Hero Interactive Flow diagram */}
      <div className="card animate-fadeIn" style={{
        padding: 30, marginBottom: 40, border: '1px solid rgba(99, 102, 241, 0.2)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.03))'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'GitHub OAuth', desc: 'Secure Integration' },
            { label: 'Multi-Scanners', desc: 'Semgrep / Gitleaks / Trivy' },
            { label: 'Gemini AI API', desc: 'Explain & Remediate' },
            { label: 'Developer Fix', desc: 'Secure Codebase' }
          ].map((node, i) => (
            <React.Fragment key={i}>
              <div style={{ textAlign: 'center', flex: 1, minWidth: 150 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', margin: '0 auto 10px', fontWeight: 700, color: '#818cf8', fontSize: 14
                }}>
                  {i + 1}
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 2 }}>{node.label}</h4>
                <p style={{ fontSize: 11, color: '#9ca3af' }}>{node.desc}</p>
              </div>
              {i < 3 && <ArrowRight size={18} style={{ color: '#4b5563', alignSelf: 'center', opacity: 0.5 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Detailed Steps Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {steps.map((step, i) => (
          <div key={i} className="card animate-fadeIn" style={{
            padding: 24, display: 'grid', gridTemplateColumns: '80px 1fr', gap: 24, alignItems: 'start'
          }}>
            <div style={{
              fontSize: 36, fontWeight: 800, color: step.color,
              fontFamily: 'Space Grotesk, sans-serif', opacity: 0.4,
              textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.06)', paddingRight: 20
            }}>
              {step.number}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: `${step.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {step.icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>{step.title}</h3>
              </div>
              <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.6, marginBottom: 16 }}>{step.desc}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 10 }}>
                {step.details.map((detail, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: step.color, marginTop: 2 }}>✓</span>
                    <span style={{ fontSize: 12, color: '#d1d5db', lineHeight: 1.4 }}>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
