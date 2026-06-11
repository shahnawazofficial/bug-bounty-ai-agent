import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield, LayoutDashboard, GitBranch, AlertTriangle,
  LogOut, User, Sparkles, Lock, FileText, Settings,
  Layers, Sliders, ChevronLeft, ChevronRight, HelpCircle
} from 'lucide-react';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <GitBranch size={18} />, label: 'Repositories', path: '/repositories' },
    { icon: <Sliders size={18} />, label: 'Scans', path: '/repositories' }, // Scans route maps to repos scan control
    { icon: <AlertTriangle size={18} />, label: 'Vulnerabilities', path: '/vulnerabilities' },
    { icon: <Lock size={18} />, label: 'Secrets', path: '/vulnerabilities' }, // Secrets mapped to vulns
    { icon: <FileText size={18} />, label: 'Reports', path: '/how-it-works' }, // Reports directs to How it works explanation
    { icon: <Layers size={18} />, label: 'Integrations', path: '/repositories' },
    { icon: <Settings size={18} />, label: 'Settings', path: '/repositories' },
    { icon: <HelpCircle size={18} />, label: 'How it Works', path: '/how-it-works' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#030712' }}>
      
      {/* Sidebar */}
      <aside style={{
        width: isCollapsed ? 72 : 240,
        background: '#0a0f1d',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Logo */}
        <div style={{ 
          padding: isCollapsed ? '20px 0' : '20px 18px', 
          borderBottom: '1px solid rgba(255,255,255,0.05)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: 12 
        }}>
          <div style={{ 
            width: 32, height: 32, borderRadius: 8, 
            background: 'linear-gradient(135deg, #6366f1, #a855f7)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            flexShrink: 0,
            boxShadow: '0 0 12px rgba(99, 102, 241, 0.3)'
          }}>
            <Shield size={16} color="white" />
          </div>
          {!isCollapsed && (
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: '#ffffff', letterSpacing: '-0.01em' }}>
                Bug Bounty AI
              </div>
              <div style={{ fontSize: 10, color: '#4b5563', fontWeight: 500 }}>AI-Powered Security Platform</div>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path + '/'));
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                id={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 8,
                  color: isActive ? '#818cf8' : '#9ca3af',
                  background: isActive ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.color = '#f3f4f6';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#9ca3af';
                  }
                }}
              >
                <span style={{ flexShrink: 0, color: isActive ? '#818cf8' : 'inherit' }}>{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Pro Upgrade Box */}
        {!isCollapsed && (
          <div style={{ padding: '0 12px 12px' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.03))',
              border: '1px solid rgba(99, 102, 241, 0.15)',
              borderRadius: 12, padding: 14, position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Sparkles size={14} style={{ color: '#a78bfa' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#ffffff' }}>Upgrade to Pro</span>
              </div>
              <p style={{ fontSize: 10, color: '#9ca3af', lineHeight: 1.4, marginBottom: 10 }}>
                Unlock advanced scans, custom rules, and priority support.
              </p>
              <button style={{
                width: '100%', padding: '8px 12px', background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                border: 'none', borderRadius: 8, color: '#ffffff', fontSize: 11, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
              }}>
                <Sparkles size={12} /> Upgrade Now
              </button>
            </div>
          </div>
        )}

        {/* Collapse button and Sign out */}
        <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: 8, background: 'transparent', border: 'none', color: '#6b7280', fontSize: 12,
              padding: '8px', cursor: 'pointer', transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#9ca3af'}
            onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /> Collapse</>}
          </button>

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px', marginTop: 6, borderTop: '1px solid rgba(255,255,255,0.03)' }}>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.username} style={{ width: 24, height: 24, borderRadius: '50%' }} />
              ) : (
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={12} color="white" />
                </div>
              )}
              {!isCollapsed && (
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.username}
                  </div>
                </div>
              )}
              <button
                onClick={logout}
                title="Sign Out"
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280',
                  padding: 2, display: 'flex', alignItems: 'center'
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
              >
                <LogOut size={13} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main style={{ 
        flex: 1, 
        marginLeft: isCollapsed ? 72 : 240, 
        minHeight: '100vh', 
        background: '#030712',
        transition: 'margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {children}
      </main>
    </div>
  );
}
