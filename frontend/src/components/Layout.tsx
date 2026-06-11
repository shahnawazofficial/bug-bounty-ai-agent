import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield, LayoutDashboard, GitBranch, AlertTriangle,
  LogOut, User, ChevronRight,
} from 'lucide-react';

const navItems = [
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/dashboard' },
  { icon: <GitBranch size={18} />, label: 'Repositories', path: '/repositories' },
  { icon: <AlertTriangle size={18} />, label: 'Vulnerabilities', path: '/vulnerabilities' },
];

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shield size={18} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>Bug Bounty AI</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Security Platform</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)', padding: '8px 16px 4px', textTransform: 'uppercase' }}>
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                id={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User profile */}
        {user && (
          <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
            <div className="card" style={{ padding: '12px', borderRadius: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--border)' }} />
                ) : (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={16} color="white" />
                  </div>
                )}
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.username}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {user._count?.repositories ?? 0} repos
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                id="logout-btn"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'transparent', border: '1px solid var(--border)',
                  borderRadius: 6, color: 'var(--text-secondary)', padding: '6px 10px',
                  fontSize: 12, cursor: 'pointer', width: '100%', fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#ef4444';
                  (e.currentTarget as HTMLButtonElement).style.color = '#f87171';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
                }}
              >
                <LogOut size={13} /> Sign Out
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: 240, minHeight: '100vh', background: 'var(--bg-primary)' }}>
        {children}
      </main>
    </div>
  );
}
