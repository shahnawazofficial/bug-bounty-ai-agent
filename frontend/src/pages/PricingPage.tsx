import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Star, Crown, Check, Lock, ArrowLeft } from 'lucide-react';

export default function PricingPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Basic',
      icon: <Shield size={20} style={{ color: '#10b981' }} />,
      iconBg: 'rgba(16, 185, 129, 0.1)',
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
      btnText: 'Get Started for ₹10',
      btnStyle: {
        background: 'transparent',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        color: '#10b981'
      },
      popular: false
    },
    {
      name: 'Pro',
      icon: <Star size={20} style={{ color: '#a78bfa' }} />,
      iconBg: 'rgba(167, 139, 250, 0.1)',
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
      btnText: 'Get Started for ₹50',
      btnStyle: {
        background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
        border: 'none',
        color: '#ffffff'
      },
      popular: true
    },
    {
      name: 'Premium',
      icon: <Crown size={20} style={{ color: '#3b82f6' }} />,
      iconBg: 'rgba(59, 130, 246, 0.1)',
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
      btnText: 'Get Started for ₹100',
      btnStyle: {
        background: '#2563eb',
        border: 'none',
        color: '#ffffff'
      },
      popular: false
    }
  ];

  return (
    <div style={{
      padding: '40px 24px', maxWidth: 1100, margin: '0 auto', minHeight: '100vh',
      color: '#f3f4f6', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', justifyContent: 'center'
    }} className="animate-fadeIn">
      
      {/* Header Back Button */}
      <div style={{ marginBottom: 30 }}>
        <button
          onClick={() => navigate(token ? '/dashboard' : '/login')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: '#9ca3af',
            fontWeight: 500, transition: 'all 0.2s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            e.currentTarget.style.color = '#9ca3af';
          }}
        >
          <ArrowLeft size={14} /> Back to {token ? 'Dashboard' : 'Home'}
        </button>
      </div>

      {/* Main Titles */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.15)',
          padding: '6px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#818cf8',
          textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16
        }}>
          💎 Simple, Transparent Pricing
        </div>
        <h1 style={{
          fontSize: '36px', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif',
          color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 12px 0'
        }}>
          Choose the Plan That Fits Your <span style={{ color: '#818cf8' }}>Security</span> Needs
        </h1>
        <p style={{ color: '#9ca3af', fontSize: 14, maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
          Start small and scale as you grow. All plans include core security scanning powered by AI, Semgrep, Gitleaks, and Trivy.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'stretch',
        marginBottom: 40
      }}>
        {plans.map((plan, i) => (
          <div
            key={i}
            style={{
              background: '#0a0f1d',
              border: plan.popular ? '2px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: 16,
              padding: '30px 24px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: plan.popular ? '0 0 30px rgba(99, 102, 241, 0.15)' : 'none',
              transform: plan.popular ? 'scale(1.02)' : 'none',
              zIndex: plan.popular ? 2 : 1
            }}
          >
            {/* Most Popular Label */}
            {plan.popular && (
              <div style={{
                position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                background: '#6366f1', color: '#ffffff', fontSize: 9, fontWeight: 800,
                padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.05em'
              }}>
                Most Popular
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
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: 11, color: '#6b7280', margin: '2px 0 0 0' }}>{plan.desc}</p>
              </div>
            </div>

            {/* Price section */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
              <span style={{ fontSize: 20, fontWeight: 600, color: plan.popular ? '#818cf8' : '#ffffff' }}>₹</span>
              <span style={{ fontSize: 36, fontWeight: 800, color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>{plan.price}</span>
              <span style={{ fontSize: 12, color: '#4b5563' }}>/month</span>
            </div>

            {/* Features list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, marginBottom: 28 }}>
              {plan.features.map((feature, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: plan.popular ? '#818cf8' : '#34d399', fontSize: 13, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 12, color: '#d1d5db', lineHeight: 1.4 }}>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              style={{
                width: '100%', padding: '12px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8, ...plan.btnStyle
              }}
              onMouseEnter={e => {
                if (plan.name === 'Basic') {
                  e.currentTarget.style.background = 'rgba(16, 185, 129, 0.05)';
                } else {
                  e.currentTarget.style.opacity = '0.9';
                }
              }}
              onMouseLeave={e => {
                if (plan.name === 'Basic') {
                  e.currentTarget.style.background = 'transparent';
                } else {
                  e.currentTarget.style.opacity = '1';
                }
              }}
            >
              {plan.btnText}
            </button>
          </div>
        ))}
      </div>

      {/* Footer Info section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#9ca3af' }}>
          <Shield size={12} style={{ color: '#818cf8' }} />
          <span>All plans include bank-level security and data privacy.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#4b5563' }}>
          <Lock size={10} />
          <span>Cancel anytime. No hidden fees.</span>
        </div>
      </div>

    </div>
  );
}
