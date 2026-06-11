import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Sparkles, GitBranch, ArrowRight, CheckCircle2, ChevronRight, Lock, Brain, Wrench } from 'lucide-react';

export default function HowItWorksPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const steps = [
    {
      number: '01',
      title: 'GitHub Authentication Sync',
      icon: <GitBranch size={18} style={{ color: 'var(--cyan)' }} />,
      desc: 'Connect your GitHub workspace safely using zero-retention protocols. Import only repositories you wish to scan.',
      color: 'var(--cyan)',
      details: ['One-click GitHub OAuth authorization', 'Audits both public and private code repositories', 'Strict read-only repository scope mappings']
    },
    {
      number: '02',
      title: 'Multi-Core Scanner Execution',
      icon: <Shield size={18} style={{ color: 'var(--accent)' }} />,
      desc: 'Execute static analysis rules (Semgrep SAST), secrets audits (Gitleaks), and software packages composition scanning (Trivy).',
      color: 'var(--accent)',
      details: ['Semgrep checks code syntax blocks against rule indexes', 'Gitleaks scan intercepts hardcoded API tokens & keys', 'Trivy composition analysis audits package CVEs']
    },
    {
      number: '03',
      title: 'Gemini AI Threat Triage',
      icon: <Brain size={18} style={{ color: 'var(--cyan)' }} />,
      desc: 'Our intelligence engine triages code context to clarify root vulnerability vectors, potential exploits, and threat levels.',
      color: 'var(--cyan)',
      details: ['Traces control flow pathways to identify vulnerabilities', 'Explains vulnerability context in plain, clear language', 'Triage matches threats to CVE standards database']
    },
    {
      number: '04',
      title: 'AI Remediation & Patching',
      icon: <Wrench size={18} style={{ color: 'var(--accent)' }} />,
      desc: 'Receive copy-paste ready safe code patches generated for your codebase structure. Review diff changes side-by-side.',
      color: 'var(--accent)',
      details: ['Produces complete corrected replacement patches', 'Step-by-step code correction documentation', 'Fast one-click copying straight to your editor workspace']
    }
  ];

  return (
    <div className="page cyber-grid">
      
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Operation Pipeline Architecture</h1>
          <p className="page-subtitle">Understand how scanners index repositories, run rulesets, and invoke Gemini AI remediation models</p>
        </div>
        <button
          onClick={() => navigate(token ? '/dashboard' : '/login')}
          className="btn btn-ghost btn-sm"
        >
          Back to {token ? 'Dashboard' : 'Home'}
        </button>
      </div>

      {/* Hero Interactive Flow diagram */}
      <div className="card" style={{
        padding: 30, marginBottom: 24, border: '1px solid rgba(0, 255, 157, 0.15)',
        background: 'linear-gradient(135deg, rgba(0, 255, 157, 0.04), rgba(0, 217, 255, 0.02))'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'GitHub Sync', desc: 'Secure Handshake' },
            { label: 'Security Scanners', desc: 'SAST, Secrets & CVEs' },
            { label: 'Gemini Agent', desc: 'Explains threat logic' },
            { label: 'Remediation', desc: 'Deploy correction patch' }
          ].map((node, i) => (
            <React.Fragment key={i}>
              <div style={{ textAlign: 'center', flex: 1, minWidth: 150 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', background: 'rgba(0, 255, 157, 0.08)',
                  border: '1px solid rgba(0, 255, 157, 0.25)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', margin: '0 auto 10px', fontWeight: 700, color: 'var(--accent)', fontSize: 13,
                  boxShadow: '0 0 12px rgba(0, 255, 157, 0.15)'
                }}>
                  {i + 1}
                </div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', marginBottom: 2, fontFamily: 'var(--font-display)' }}>{node.label}</h4>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{node.desc}</p>
              </div>
              {i < 3 && <ArrowRight size={16} style={{ color: 'var(--text-muted)', alignSelf: 'center', opacity: 0.5 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Detailed Steps Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {steps.map((step, i) => (
          <div key={i} className="card" style={{
            padding: 24, display: 'grid', gridTemplateColumns: '80px 1fr', gap: 24, alignItems: 'start'
          }}>
            <div style={{
              fontSize: 32, fontWeight: 800, color: step.color,
              fontFamily: 'var(--font-display)', opacity: 0.4,
              textAlign: 'center', borderRight: '1.5px solid var(--border-subtle)', paddingRight: 20
            }}>
              {step.number}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: `${step.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {step.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-display)' }}>{step.title}</h3>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>{step.desc}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 8 }}>
                {step.details.map((detail, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: step.color, marginTop: 2 }}>✓</span>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.45 }}>{detail}</span>
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
