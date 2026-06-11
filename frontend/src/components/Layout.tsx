import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield, LayoutDashboard, GitBranch, AlertTriangle,
  LogOut, User, Sparkles, FileText, Settings,
  ChevronLeft, ChevronRight, ChevronDown, Activity,
  BookOpen, DollarSign
} from 'lucide-react';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navItems = [
    { icon: <LayoutDashboard size={17} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <GitBranch size={17} />, label: 'Repositories', path: '/repositories' },
    { icon: <Activity size={17} />, label: 'Scans', path: '/repositories' },
    { icon: <AlertTriangle size={17} />, label: 'Vulnerabilities', path: '/vulnerabilities' },
    { icon: <FileText size={17} />, label: 'Reports', path: '/reports' },
  ];

  const bottomNavItems = [
    { icon: <BookOpen size={17} />, label: 'How it Works', path: '/how-it-works' },
    { icon: <DollarSign size={17} />, label: 'Pricing', path: '/pricing' },
    { icon: <Settings size={17} />, label: 'Settings', path: '/settings' },
  ];

  function NavLink({ icon, label, path }: { icon: React.ReactNode; label: string; path: string }) {
    const isActive = location.pathname === path || (path !== '/dashboard' && path !== '/repositories' && location.pathname.startsWith(path + '/'));
    const isScans = label === 'Scans' && location.pathname.startsWith('/repositories');

    return (
      <Link
        to={path}
        id={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
        title={isCollapsed ? label : undefined}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: isCollapsed ? '10px 0' : '9px 12px',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          borderRadius: 8,
          color: isActive ? '#818cf8' : '#6b7280',
          background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
          textDecoration: 'none', fontSize: 13, fontWeight: 500,
          transition: 'all 0.18s ease',
          borderLeft: isActive ? '2px solid #6366f1' : '2px solid transparent',
          position: 'relative',
        }}
        onMouseEnter={e => {
          if (!isActive) {
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)';
            (e.currentTarget as HTMLAnchorElement).style.color = '#d1d5db';
          }
        }}
        onMouseLeave={e => {
          if (!isActive) {
            (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
            (e.currentTarget as HTMLAnchorElement).style.color = '#6b7280';
          }
        }}
      >
        <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>{icon}</span>
        {!isCollapsed && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
      </Link>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#030712' }}>

      {/* Sidebar */}
      <aside style={{
        width: isCollapsed ? 64 : 228,
        background: '#06090f',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 100, transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
      }}>

        {/* Logo */}
        <div style={{
          padding: isCollapsed ? '18px 0' : '18px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: 10, flexShrink: 0
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 7,
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, boxShadow: '0 0 14px rgba(79, 70, 229, 0.35)'
          }}>
            <Shield size={15} color="white" />
          </div>
          {!isCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13.5, color: '#fff', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                Bug Bounty AI
              </div>
              <div style={{ fontSize: 9.5, color: '#374151', fontWeight: 500, whiteSpace: 'nowrap' }}>Security Platform</div>
            </div>
          )}
        </div>

        {/* Main Nav */}
        <nav style={{ flex: 1, padding: isCollapsed ? '12px 8px' : '12px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', overflowX: 'hidden' }}>
          {navItems.map(item => <NavLink key={item.label} {...item} />)}

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '8px 4px' }} />

          {bottomNavItems.map(item => <NavLink key={item.label} {...item} />)}
        </nav>

        {/* Pro Upgrade */}
        {!isCollapsed && (
          <div style={{ padding: '0 10px 10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(79,70,229,0.08), rgba(124,58,237,0.04))',
              border: '1px solid rgba(79,70,229,0.18)',
              borderRadius: 10, padding: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Sparkles size={12} style={{ color: '#a78bfa' }} />
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#fff' }}>Upgrade to Pro</span>
              </div>
              <p style={{ fontSize: 10, color: '#6b7280', lineHeight: 1.45, marginBottom: 10 }}>
                Unlimited scans, custom rules & priority support.
              </p>
              <Link to="/pricing" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                width: '100%', padding: '7px 0',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                borderRadius: 7, color: '#fff', fontSize: 11, fontWeight: 600,
                textDecoration: 'none',
              }}>
                <Sparkles size={11} /> Upgrade Now
              </Link>
            </div>
          </div>
        )}

        {/* User + Collapse */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', flexShrink: 0 }}>
          {/* User section */}
          {user && (
            <div
              ref={userMenuRef}
              style={{ padding: '10px', position: 'relative' }}
            >
              <button
                onClick={() => setUserMenuOpen(o => !o)}
                id="user-menu-btn"
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  gap: 8, background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: 8, padding: isCollapsed ? '8px 0' : '8px 10px',
                  cursor: 'pointer', transition: 'all 0.2s',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.02)'}
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={13} color="white" />
                  </div>
                )}
                {!isCollapsed && (
                  <>
                    <div style={{ flex: 1, overflow: 'hidden', textAlign: 'left' }}>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: '#f3f4f6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.username}</div>
                      <div style={{ fontSize: 9.5, color: '#4b5563', fontWeight: 500 }}>Free Plan</div>
                    </div>
                    <ChevronDown size={12} style={{ color: '#4b5563', flexShrink: 0, transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                  </>
                )}
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div style={{
                  position: 'absolute', bottom: '100%', left: 10, right: 10,
                  background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10, padding: 6, zIndex: 200,
                  boxShadow: '0 -8px 32px rgba(0,0,0,0.6)',
                  marginBottom: 4, animation: 'fadeIn 0.15s ease',
                }}>
                  <Link to="/profile" id="dropdown-profile"
                    onClick={() => setUserMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 7, color: '#d1d5db', fontSize: 13, textDecoration: 'none', transition: 'all 0.15s', fontWeight: 500 }}
                    onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'}>
                    <User size={14} style={{ color: '#818cf8' }} /> Profile
                  </Link>
                  <Link to="/settings" id="dropdown-settings"
                    onClick={() => setUserMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 7, color: '#d1d5db', fontSize: 13, textDecoration: 'none', transition: 'all 0.15s', fontWeight: 500 }}
                    onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'}>
                    <Settings size={14} style={{ color: '#818cf8' }} /> Settings
                  </Link>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
                  <button
                    onClick={() => { setUserMenuOpen(false); logout(); }}
                    id="dropdown-logout"
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 7, color: '#f87171', fontSize: 13, background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.15s', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)'}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Collapse toggle */}
          <button
            onClick={() => setIsCollapsed(c => !c)}
            id="sidebar-collapse-btn"
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: 8, background: 'transparent', border: 'none',
              color: '#374151', fontSize: 11.5, padding: '10px 18px',
              cursor: 'pointer', transition: 'color 0.2s', borderTop: '1px solid rgba(255,255,255,0.03)',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#6b7280'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#374151'}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /> Collapse</>}
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main style={{
        flex: 1,
        marginLeft: isCollapsed ? 64 : 228,
        minHeight: '100vh',
        background: '#030712',
        transition: 'margin-left 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'auto',
      }}>
        {children}
      </main>
    </div>
  );
}
