import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Star, Crown, Check, Lock, ArrowLeft, Zap } from 'lucide-react';

export default function PricingPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Basic',
      icon: <Shield size={18} style={{ color: 'var(--cyan)' }} />,
      iconBg: 'var(--cyan-dim)',
      desc: 'Perfect for getting started',
      price: '10',
      features: [
        '5 Repository Scans / month',
        '10 Secret Detections / month',
        'Basic Vulnerability Scan (Semgrep)',
        'Trivy Dependency Scanning',
        'Scan History (7 days)',
        'Community Support'
      ],
      btnText: 'Activate Basic (₹10)',
      btnStyle: {
        background: 'transparent',
        border: '1px solid var(--border-strong)',
        color: '#ffffff'
      },
      popular: false
    },
    {
      name: 'Pro',
      icon: <Zap size={18} style={{ color: 'var(--accent)' }} />,
      iconBg: 'var(--accent-dim)',
      desc: 'For developers & security enthusiasts',
      price: '50',
      features: [
        '25 Repository Scans / month',
        '50 Secret Detections / month',
        'Advanced Vulnerability Scan (Semgrep)',
        'Trivy + Gitleaks Scanning',
        'AI-Powered Vulnerability Insights',
        'Export Reports (PDF)',
        'Scan History (30 days)',
        'Priority Support'
      ],
      btnText: 'Activate Pro (₹50)',
      btnStyle: {
        background: 'var(--accent)',
        border: 'none',
        color: '#000000',
        boxShadow: '0 0 16px rgba(0, 255, 157, 0.2)'
      },
      popular: true
    },
    {
      name: 'Premium',
      icon: <Crown size={18} style={{ color: '#FFD700' }} />,
      iconBg: 'rgba(255, 215, 0, 0.08)',
      desc: 'For professionals & teams',
      price: '100',
      features: [
        'Unlimited Repository Scans',
        'Unlimited Secret Detections',
        'Advanced Vulnerability Scan (Semgrep)',
        'Trivy + Gitleaks + Custom Rules',
        'AI-Powered Vulnerability Insights',
        'Export Reports (PDF, CSV, JSON)',
        'Scan History (Unlimited)',
        'Email Alerts & Notifications',
        'Priority Support'
      ],
      btnText: 'Activate Premium (₹100)',
      btnStyle: {
        background: 'transparent',
        border: '1px solid var(--accent)',
        color: 'var(--accent)'
      },
      popular: false
    }
  ];

  return (
    <div className="page cyber-grid" style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      
      {/* Header Back Button */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => navigate(token ? '/dashboard' : '/login')}
          className="btn btn-ghost btn-sm"
        >
          <ArrowLeft size={13} /> Back to {token ? 'Dashboard' : 'Home'}
        </button>
      </div>

      {/* Main Titles */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--accent-dim)', border: '1px solid rgba(0, 255, 157, 0.25)',
          padding: '6px 14px', borderRadius: 20, fontSize: 10, fontWeight: 700, color: 'var(--accent)',
          textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16
        }}>
          💎 Premium Protection Tiers
        </div>
        <h1 style={{
          fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-display)',
          color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 12px 0'
        }}>
          Transparent Cybersecurity Plans
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
          Choose your security tier. Instantly scan commits, catch credentials exposure, and generate AI-guided secure code patches.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, alignItems: 'stretch',
        marginBottom: 32
      }}>
        {plans.map((plan, i) => (
          <div
            key={i}
            className="card"
            style={{
              background: 'var(--bg-card)',
              border: plan.popular ? '2px solid var(--accent)' : '1px solid var(--border-default)',
              borderRadius: 16,
              padding: '30px 24px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: plan.popular ? '0 0 32px rgba(0, 255, 157, 0.15)' : 'none',
              transform: plan.popular ? 'scale(1.02)' : 'none',
              zIndex: plan.popular ? 2 : 1
            }}
          >
            {/* Most Popular Label */}
            {plan.popular && (
              <div style={{
                position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                background: 'var(--accent)', color: '#000000', fontSize: 9, fontWeight: 800,
                padding: '4px 14px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.06em'
              }}>
                Recommended
              </div>
            )}

            {/* Header section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, background: plan.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {plan.icon}
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', margin: 0, fontFamily: 'var(--font-display)' }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0 0' }}>{plan.desc}</p>
              </div>
            </div>

            {/* Price section */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 20 }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-secondary)' }}>₹</span>
              <span style={{ fontSize: 32, fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-display)' }}>{plan.price}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>/month</span>
            </div>

            {/* Features list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, marginBottom: 28 }}>
              {plan.features.map((feature, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', fontSize: 12, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.45 }}>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => alert(`Redirecting to subscription workflow for plan ${plan.name}...`)}
              className="btn btn-lg"
              style={{
                width: '100%',
                ...plan.btnStyle
              }}
            >
              {plan.btnText}
            </button>
          </div>
        ))}
      </div>

      {/* Footer Info section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
          <Shield size={12} style={{ color: 'var(--accent)' }} />
          <span>All subscriptions processed securely via encrypted channels.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-disabled)' }}>
          <Lock size={10} />
          <span>No lock-in contracts. Downgrade or terminate at any cycle end.</span>
        </div>
      </div>

    </div>
  );
}
