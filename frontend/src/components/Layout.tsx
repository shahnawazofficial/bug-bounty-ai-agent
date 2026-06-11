import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield, LayoutDashboard, GitBranch, AlertTriangle,
  LogOut, User, Sparkles, FileText, Settings,
  ChevronLeft, ChevronRight, ChevronDown, Activity,
  BookOpen, DollarSign, Bell, Search, Zap, X
} from 'lucide-react';

interface Props { children: ReactNode; }

export default function Layout({ children }: Props) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navItems = [
    { icon: <LayoutDashboard size={16} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <GitBranch size={16} />, label: 'Repositories', path: '/repositories' },
    { icon: <AlertTriangle size={16} />, label: 'Vulnerabilities', path: '/vulnerabilities' },
    { icon: <FileText size={16} />, label: 'Reports', path: '/reports' },
  ];

  const bottomNavItems = [
    { icon: <BookOpen size={16} />, label: 'How it Works', path: '/how-it-works' },
    { icon: <DollarSign size={16} />, label: 'Pricing', path: '/pricing' },
    { icon: <Settings size={16} />, label: 'Settings', path: '/settings' },
  ];

  const notifications = [
    { id: 1, title: 'Critical vulnerability found', desc: 'SQL Injection in payment-service', time: '2m ago', type: 'critical' },
    { id: 2, title: 'Scan completed', desc: 'awesome-project scanned successfully', time: '15m ago', type: 'success' },
    { id: 3, title: 'New secret detected', desc: 'API key exposed in mobile-app', time: '1h ago', type: 'warning' },
  ];

  function NavLink({ icon, label, path }: { icon: React.ReactNode; label: string; path: string }) {
    const isActive = location.pathname === path ||
      (path !== '/dashboard' && path !== '/repositories' && location.pathname.startsWith(path));
    return (
      <Link
        to={path}
        id={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
        title={isCollapsed ? label : undefined}
        style={{
          display: 'flex', alignItems: 'center',
          gap: isCollapsed ? 0 : 10,
          padding: isCollapsed ? '10px 0' : '9px 12px',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          borderRadius: 10,
          color: isActive ? 'var(--accent)' : 'var(--text-muted)',
          background: isActive ? 'rgba(0, 255, 157, 0.07)' : 'transparent',
          textDecoration: 'none',
          fontSize: 13,
          fontWeight: 500,
          transition: 'all 0.15s ease',
          borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
          position: 'relative',
        }}
        onMouseEnter={e => {
          if (!isActive) {
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)';
            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)';
          }
        }}
        onMouseLeave={e => {
          if (!isActive) {
            (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)';
          }
        }}
      >
        <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>{icon}</span>
        {!isCollapsed && (
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
        )}
        {isActive && !isCollapsed && (
          <span style={{
            marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%',
            background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)',
            flexShrink: 0
          }} />
        )}
      </Link>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* ─── Sidebar ─── */}
      <aside style={{
        width: isCollapsed ? 60 : 230,
        background: '#0A0A0A',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 100, transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
      }}>

        {/* Logo */}
        <div style={{
          padding: isCollapsed ? '18px 0' : '16px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: 10, flexShrink: 0
        }}>
          <img src="/buglogo.png" alt="Bug Bounty AI" style={{
            width: 30, height: 30, borderRadius: 8,
            objectFit: 'cover', flexShrink: 0, boxShadow: '0 0 16px rgba(0, 255, 157, 0.4)'
          }} />
          {!isCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
                color: '#fff', letterSpacing: '-0.02em', whiteSpace: 'nowrap'
              }}>
                Bug Bounty AI
              </div>
              <div style={{
                fontSize: 9, color: 'var(--accent)', fontWeight: 600,
                whiteSpace: 'nowrap', letterSpacing: '0.08em', textTransform: 'uppercase'
              }}>
                Security Platform
              </div>
            </div>
          )}
        </div>

        {/* Main Nav */}
        <nav style={{
          flex: 1, padding: isCollapsed ? '14px 8px' : '14px 10px',
          display: 'flex', flexDirection: 'column', gap: 2,
          overflowY: 'auto', overflowX: 'hidden'
        }}>
          {/* Section label */}
          {!isCollapsed && (
            <div style={{
              fontSize: 9, fontWeight: 700, color: 'var(--text-disabled)',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              padding: '0 12px', marginBottom: 6
            }}>Main</div>
          )}
          {navItems.map(item => <NavLink key={item.label} {...item} />)}

          <div style={{ height: 1, background: 'var(--border-subtle)', margin: '10px 4px' }} />

          {!isCollapsed && (
            <div style={{
              fontSize: 9, fontWeight: 700, color: 'var(--text-disabled)',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              padding: '0 12px', marginBottom: 6
            }}>Resources</div>
          )}
          {bottomNavItems.map(item => <NavLink key={item.label} {...item} />)}
        </nav>

        {/* Upgrade Banner */}
        {!isCollapsed && (
          <div style={{ padding: '0 10px 10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(0,255,157,0.06), rgba(0,217,255,0.04))',
              border: '1px solid rgba(0,255,157,0.15)',
              borderRadius: 12, padding: '14px 14px 12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Zap size={12} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: 11.5, fontWeight: 700, color: '#fff' }}>Upgrade to Pro</span>
              </div>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 10 }}>
                Unlimited scans, custom rules & AI-powered analysis.
              </p>
              <Link to="/pricing" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                width: '100%', padding: '7px 0',
                background: 'var(--accent)', borderRadius: 8,
                color: '#000', fontSize: 11, fontWeight: 700,
                textDecoration: 'none', letterSpacing: '-0.01em',
                boxShadow: '0 0 16px rgba(0, 255, 157, 0.25)',
              }}>
                <Sparkles size={11} /> Upgrade Now
              </Link>
            </div>
          </div>
        )}

        {/* User section */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', flexShrink: 0 }}>
          {user && (
            <div ref={userMenuRef} style={{ padding: '8px' }}>
              <button
                onClick={() => setUserMenuOpen(o => !o)}
                id="user-menu-btn"
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  gap: 8, background: 'transparent',
                  border: '1px solid transparent',
                  borderRadius: 10, padding: isCollapsed ? '8px 0' : '8px 10px',
                  cursor: 'pointer', transition: 'all 0.15s',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-subtle)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent';
                }}
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    border: '1.5px solid rgba(0,255,157,0.3)'
                  }} />
                ) : (
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'var(--accent)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <User size={14} color="#000" />
                  </div>
                )}
                {!isCollapsed && (
                  <>
                    <div style={{ flex: 1, overflow: 'hidden', textAlign: 'left' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#f3f4f6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.username}</div>
                      <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em' }}>FREE PLAN</div>
                    </div>
                    <ChevronDown size={12} style={{
                      color: 'var(--text-muted)', flexShrink: 0,
                      transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }} />
                  </>
                )}
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div style={{
                  position: 'absolute', bottom: '100%', left: 10, right: 10,
                  background: '#111', border: '1px solid var(--border-default)',
                  borderRadius: 12, padding: 6, zIndex: 200,
                  boxShadow: '0 -8px 40px rgba(0,0,0,0.7)',
                  marginBottom: 6,
                  animation: 'fadeIn 0.12s ease',
                }}>
                  <div style={{
                    padding: '10px 12px 8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 4
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{user.username}</div>
                    {user.email && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{user.email}</div>}
                  </div>
                  {[
                    { to: '/profile', icon: <User size={13} />, label: 'View Profile', id: 'dropdown-profile' },
                    { to: '/settings', icon: <Settings size={13} />, label: 'Settings', id: 'dropdown-settings' },
                  ].map(item => (
                    <Link key={item.to} to={item.to} id={item.id}
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 12px', borderRadius: 8,
                        color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500,
                        transition: 'all 0.12s',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)';
                        (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                        (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)';
                      }}
                    >
                      <span style={{ color: 'var(--accent)' }}>{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                  <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />
                  <button
                    onClick={() => { setUserMenuOpen(false); logout(); }}
                    id="dropdown-logout"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 12px', borderRadius: 8, color: 'var(--sev-critical)',
                      fontSize: 13, background: 'transparent', border: 'none',
                      cursor: 'pointer', width: '100%', textAlign: 'left',
                      fontWeight: 500, fontFamily: 'var(--font-sans)', transition: 'all 0.12s'
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 59, 59, 0.06)'}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}
                  >
                    <LogOut size={13} /> Sign Out
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
              gap: 8, background: 'transparent', border: 'none', borderTop: '1px solid var(--border-subtle)',
              color: 'var(--text-disabled)', fontSize: 11, padding: '10px 16px',
              cursor: 'pointer', transition: 'color 0.2s',
              fontFamily: 'var(--font-sans)', letterSpacing: '0.04em',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-disabled)'}
          >
            {isCollapsed ? <ChevronRight size={13} /> : <><ChevronLeft size={13} /> Collapse</>}
          </button>
        </div>
      </aside>

      {/* ─── Main ─── */}
      <main style={{
        flex: 1,
        marginLeft: isCollapsed ? 60 : 230,
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        transition: 'margin-left 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Top Bar */}
        <div style={{
          height: 56, borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', position: 'sticky', top: 0, zIndex: 50, flexShrink: 0
        }}>
          {/* Search */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {searchOpen ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', border: '1px solid var(--accent)', borderRadius: 10, padding: '6px 12px', width: 280 }}>
                <Search size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search repos, vulns, scans..."
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13, width: '100%', fontFamily: 'var(--font-sans)' }}
                />
                <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                  <X size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                id="topbar-search-btn"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                  borderRadius: 10, padding: '6px 14px', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: 12, transition: 'all 0.15s',
                  fontFamily: 'var(--font-sans)'
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-default)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-subtle)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
                }}
              >
                <Search size={13} />
                <span>Search...</span>
                <span style={{ fontSize: 10, color: 'var(--text-disabled)', fontFamily: 'var(--font-mono)', background: 'var(--bg-elevated)', padding: '1px 5px', borderRadius: 4, marginLeft: 6 }}>⌘K</span>
              </button>
            )}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

            {/* Quick Scan */}
            <Link to="/repositories" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--accent)', color: '#000',
              padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
              textDecoration: 'none', transition: 'all 0.15s',
              boxShadow: '0 0 16px rgba(0, 255, 157, 0.2)'
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 28px rgba(0, 255, 157, 0.4)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 16px rgba(0, 255, 157, 0.2)';
              }}
            >
              <Zap size={12} strokeWidth={2.5} />
              New Scan
            </Link>

            {/* Notifications */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                id="topbar-notifications-btn"
                onClick={() => setNotifOpen(o => !o)}
                style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.15s', position: 'relative',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-default)'}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-subtle)'}
              >
                <Bell size={14} style={{ color: 'var(--text-muted)' }} />
                <span className="notification-dot" />
              </button>

              {notifOpen && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 8,
                  width: 300, background: '#111', border: '1px solid var(--border-default)',
                  borderRadius: 14, boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                  zIndex: 200, animation: 'fadeIn 0.12s ease', overflow: 'hidden'
                }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Notifications</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', background: 'rgba(0,255,157,0.1)', padding: '2px 7px', borderRadius: 10, border: '1px solid rgba(0,255,157,0.2)' }}>3 NEW</span>
                  </div>
                  <div>
                    {notifications.map(n => (
                      <div key={n.id} style={{
                        padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)',
                        display: 'flex', gap: 10, cursor: 'pointer', transition: 'background 0.12s'
                      }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                      >
                        <div style={{
                          width: 7, height: 7, borderRadius: '50%', marginTop: 4, flexShrink: 0,
                          background: n.type === 'critical' ? 'var(--sev-critical)' : n.type === 'success' ? 'var(--accent)' : 'var(--sev-medium)'
                        }} />
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{n.title}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{n.desc}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-disabled)', marginTop: 3 }}>{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '10px 16px', textAlign: 'center' }}>
                    <span style={{ fontSize: 11, color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>View all notifications</span>
                  </div>
                </div>
              )}
            </div>

            {/* Avatar */}
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} style={{
                    width: 30, height: 30, borderRadius: '50%',
                    border: '1.5px solid rgba(0,255,157,0.3)', cursor: 'pointer'
                  }}
                    onClick={() => navigate('/profile')}
                  />
                ) : (
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                  }}
                    onClick={() => navigate('/profile')}
                  >
                    <User size={14} color="#000" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, position: 'relative' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
