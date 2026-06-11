import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Bell, Lock, Key, Save, Check, LogOut, GitBranch, Mail, Calendar } from 'lucide-react';

type Tab = 'profile' | 'security' | 'notifications' | 'account';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 20, fontFamily: 'Space Grotesk, sans-serif' }}>{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9ca3af', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: 11, color: '#4b5563', marginTop: 6, lineHeight: 1.4 }}>{hint}</p>}
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: () => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#f3f4f6', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 11, color: '#6b7280' }}>{desc}</div>
      </div>
      <button
        onClick={onChange}
        style={{
          width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
          background: checked ? '#6366f1' : 'rgba(255,255,255,0.08)',
          position: 'relative', transition: 'background 0.2s', flexShrink: 0
        }}
      >
        <span style={{
          position: 'absolute', top: 3, left: checked ? 23 : 3, width: 18, height: 18,
          borderRadius: '50%', background: '#fff', transition: 'left 0.2s', display: 'block'
        }} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [saved, setSaved] = useState(false);
  const [displayName, setDisplayName] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [notifs, setNotifs] = useState({
    scanComplete: true,
    criticalVulns: true,
    weeklyReport: false,
    newFeatures: true,
  });
  const [privacy, setPrivacy] = useState({
    publicProfile: false,
    shareStats: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User size={15} /> },
    { id: 'security', label: 'Security', icon: <Shield size={15} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
    { id: 'account', label: 'Account', icon: <Lock size={15} /> },
  ];

  return (
    <div style={{ padding: '32px 40px', color: '#f3f4f6', maxWidth: 900 }} className="animate-fadeIn">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: '#fff' }}>Settings</h1>
        <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>Manage your account preferences and security settings</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
        {/* Sidebar Tabs */}
        <div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                id={`settings-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 8, border: 'none',
                  background: activeTab === tab.id ? 'rgba(99,102,241,0.1)' : 'transparent',
                  color: activeTab === tab.id ? '#818cf8' : '#6b7280',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  textAlign: 'left', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                  borderLeft: `2px solid ${activeTab === tab.id ? '#6366f1' : 'transparent'}`,
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'profile' && (
            <div className="animate-fadeIn">
              <Section title="Profile Information">
                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ position: 'relative' }}>
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.username} style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid rgba(99,102,241,0.3)' }} />
                    ) : (
                      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={28} color="white" />
                      </div>
                    )}
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: 18, height: 18, borderRadius: '50%', background: '#10b981', border: '2px solid #0a0f1d' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{user?.username}</div>
                    <div style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <GitBranch size={12} /> Connected via GitHub
                    </div>
                  </div>
                </div>

                <Field label="Display Name" hint="This is how your name appears across the platform.">
                  <input className="input" value={displayName} onChange={e => setDisplayName(e.target.value)} id="settings-display-name" placeholder="Your display name" />
                </Field>

                <Field label="Email Address" hint="Used for notifications and security alerts.">
                  <input className="input" value={email} onChange={e => setEmail(e.target.value)} id="settings-email" placeholder="your@email.com" type="email" />
                </Field>

                <Field label="GitHub Username">
                  <input className="input" value={user?.username || ''} disabled id="settings-github-username"
                    style={{ opacity: 0.5, cursor: 'not-allowed' }} />
                </Field>

                <button onClick={handleSave} id="settings-save-profile" style={{ display: 'flex', alignItems: 'center', gap: 8, background: saved ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #1d4ed8, #2563eb)', border: 'none', padding: '10px 20px', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.3s' }}>
                  {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
                </button>
              </Section>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-fadeIn">
              <Section title="Security Settings">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Shield size={18} style={{ color: '#34d399' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#34d399', marginBottom: 2 }}>GitHub OAuth Active</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>Your account is secured with GitHub OAuth. No password required.</div>
                  </div>
                </div>

                <Field label="API Token" hint="Use this token to authenticate with the Bug Bounty AI API.">
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input className="input" type="password" value="••••••••••••••••••••••••••••••••" readOnly id="settings-api-token" style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: 2 }} />
                    <button style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#9ca3af', fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif' }}>
                      Reveal
                    </button>
                  </div>
                </Field>

                <div style={{ padding: 16, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f87171', marginBottom: 4 }}>Danger Zone</div>
                  <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 14, lineHeight: 1.5 }}>Revoking access will sign you out from all sessions. You will need to reconnect your GitHub account.</p>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '8px 16px', borderRadius: 8, color: '#f87171', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                    <Key size={13} /> Revoke All Sessions
                  </button>
                </div>
              </Section>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="animate-fadeIn">
              <Section title="Notification Preferences">
                <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20, lineHeight: 1.5 }}>Choose which notifications you want to receive about your security scans and account activity.</p>
                <Toggle label="Scan Complete" desc="Notify me when a repository scan finishes" checked={notifs.scanComplete} onChange={() => setNotifs(n => ({ ...n, scanComplete: !n.scanComplete }))} />
                <Toggle label="Critical Vulnerabilities" desc="Alert me immediately when critical vulnerabilities are found" checked={notifs.criticalVulns} onChange={() => setNotifs(n => ({ ...n, criticalVulns: !n.criticalVulns }))} />
                <Toggle label="Weekly Security Report" desc="Receive a weekly summary of your security posture" checked={notifs.weeklyReport} onChange={() => setNotifs(n => ({ ...n, weeklyReport: !n.weeklyReport }))} />
                <Toggle label="New Features & Updates" desc="Stay informed about Bug Bounty AI platform updates" checked={notifs.newFeatures} onChange={() => setNotifs(n => ({ ...n, newFeatures: !n.newFeatures }))} />
                <div style={{ marginTop: 20 }}>
                  <button onClick={handleSave} id="settings-save-notifs" style={{ display: 'flex', alignItems: 'center', gap: 8, background: saved ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #1d4ed8, #2563eb)', border: 'none', padding: '10px 20px', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.3s' }}>
                    {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Preferences</>}
                  </button>
                </div>
              </Section>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="animate-fadeIn">
              <Section title="Account Details">
                {[
                  { icon: <GitBranch size={14} />, label: 'GitHub Account', value: `@${user?.username}` },
                  { icon: <Mail size={14} />, label: 'Email', value: user?.email || 'Not provided' },
                  { icon: <Calendar size={14} />, label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—' },
                  { icon: <Shield size={14} />, label: 'Plan', value: 'Free' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6b7280', fontSize: 13 }}>
                      {item.icon} {item.label}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#f3f4f6' }}>{item.value}</span>
                  </div>
                ))}
              </Section>

              <Section title="Account Actions">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#f3f4f6', marginBottom: 2 }}>Sign Out</div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>Sign out from your current session</div>
                    </div>
                    <button onClick={logout} id="settings-logout-btn" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 8, color: '#9ca3af', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: 'rgba(239,68,68,0.04)', borderRadius: 10, border: '1px solid rgba(239,68,68,0.12)' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#f87171', marginBottom: 2 }}>Delete Account</div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>Permanently delete your account and all data</div>
                    </div>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', padding: '8px 16px', borderRadius: 8, color: '#f87171', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                      Delete Account
                    </button>
                  </div>
                </div>
              </Section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
