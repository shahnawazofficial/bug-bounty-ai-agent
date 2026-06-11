import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Bell, Lock, Key, Save, Check, LogOut, GitBranch, Mail, Calendar, CreditCard, Users, Link2, Eye, EyeOff } from 'lucide-react';

type Tab = 'profile' | 'account' | 'security' | 'notifications' | 'billing' | 'api' | 'team' | 'integrations';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card" style={{ background: 'var(--bg-card)', padding: 24, marginBottom: 16 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 20, fontFamily: 'var(--font-display)' }}>{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.45 }}>{hint}</p>}
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: () => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{desc}</div>
      </div>
      <button
        onClick={onChange}
        className={`toggle-track ${checked ? 'on' : ''}`}
      >
        <span className="toggle-thumb" />
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
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [notifs, setNotifs] = useState({
    scanComplete: true,
    criticalVulns: true,
    weeklyReport: false,
    newFeatures: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile Settings', icon: <User size={15} /> },
    { id: 'account', label: 'Account Details', icon: <Lock size={15} /> },
    { id: 'security', label: 'Shield & Security', icon: <Shield size={15} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
    { id: 'billing', label: 'Billing & Plan', icon: <CreditCard size={15} /> },
    { id: 'api', label: 'API Credentials', icon: <Key size={15} /> },
    { id: 'team', label: 'Team Members', icon: <Users size={15} /> },
    { id: 'integrations', label: 'Integrations', icon: <Link2 size={15} /> },
  ];

  return (
    <div className="page cyber-grid" style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">Platform Preferences</h1>
        <p className="page-subtitle">Configure developer workspace settings, notifications, teams and credential keys</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) 3fr', gap: 24 }}>
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
                  background: activeTab === tab.id ? 'rgba(0, 255, 157, 0.07)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-muted)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  textAlign: 'left', transition: 'all 0.15s', fontFamily: 'var(--font-sans)',
                  borderLeft: `2px solid ${activeTab === tab.id ? 'var(--accent)' : 'transparent'}`,
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
              <Section title="Profile Overview">
                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: 16, background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                  <div style={{ position: 'relative' }}>
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.username} style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid var(--accent)' }} />
                    ) : (
                      <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={24} style={{ color: 'var(--accent)' }} />
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{user?.username}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <GitBranch size={11} style={{ color: 'var(--accent)' }} /> Connected via GitHub
                    </div>
                  </div>
                </div>

                <Field label="Profile Display Name" hint="How you appear on dashboards and logs.">
                  <input className="input" value={displayName} onChange={e => setDisplayName(e.target.value)} id="settings-display-name" placeholder="E.g. Aryan Singh" />
                </Field>

                <Field label="Primary Contact Email" hint="Receives scan summaries, threat notices, and billing invoices.">
                  <input className="input" value={email} onChange={e => setEmail(e.target.value)} id="settings-email" placeholder="your@email.com" type="email" />
                </Field>

                <Field label="System Git Association">
                  <input className="input" value={user?.username || ''} disabled id="settings-github-username"
                    style={{ opacity: 0.5, cursor: 'not-allowed' }} />
                </Field>

                <button onClick={handleSave} className="btn btn-primary" id="settings-save-profile">
                  {saved ? <><Check size={14} /> Saved Settings</> : <><Save size={14} /> Commit Changes</>}
                </button>
              </Section>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="animate-fadeIn">
              <Section title="Account Identity Info">
                {[
                  { icon: <GitBranch size={14} />, label: 'GitHub Identity key', value: `@${user?.username}` },
                  { icon: <Mail size={14} />, label: 'Alert Mailbox', value: user?.email || 'N/A' },
                  { icon: <Calendar size={14} />, label: 'Activated On', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A' },
                  { icon: <Shield size={14} />, label: 'Active Plan', value: 'Free Developer Tier' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i < 3 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 13 }}>
                      {item.icon} {item.label}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</span>
                  </div>
                ))}
              </Section>

              <Section title="Danger Zone Operations">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#f3f4f6', marginBottom: 2 }}>Close Session</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Terminate session token</div>
                    </div>
                    <button onClick={logout} className="btn btn-secondary btn-sm" id="settings-logout-btn">
                      <LogOut size={13} /> Sign Out
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, background: 'var(--sev-critical-bg)', borderRadius: 10, border: '1px solid var(--sev-critical-border)' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--sev-critical)', marginBottom: 2 }}>Erase Dashboard Data</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Irreversibly delete scanning profiles</div>
                    </div>
                    <button className="btn btn-danger btn-sm" onClick={() => alert('Confirm account erasure?')}>
                      Erase Account
                    </button>
                  </div>
                </div>
              </Section>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-fadeIn">
              <Section title="Workspace Cryptography & Shields">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, background: 'rgba(0, 255, 157, 0.05)', border: '1px solid rgba(0, 255, 157, 0.25)', borderRadius: 10, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Shield size={16} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', marginBottom: 2 }}>GitHub OAuth Handshake Verified</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>You sign in through GitHub securely. No passwords are persisted.</div>
                  </div>
                </div>

                <div style={{ padding: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', borderRadius: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Access Scopes</div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Bug Bounty AI Agent has read-only integration to inspect workflow files, manifest dependencies and semgrep alerts.
                  </p>
                </div>
              </Section>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="animate-fadeIn">
              <Section title="Email Scan Notifications">
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.5 }}>Choose which notifications you want to receive about your security scans and account activity.</p>
                <Toggle label="Scan Operation Finished" desc="Notify me via email when Semgrep checks finish" checked={notifs.scanComplete} onChange={() => setNotifs(n => ({ ...n, scanComplete: !n.scanComplete }))} />
                <Toggle label="Critical Findings Exposed" desc="Alert immediately if hardcoded keys or critical issues are detected" checked={notifs.criticalVulns} onChange={() => setNotifs(n => ({ ...n, criticalVulns: !n.criticalVulns }))} />
                <Toggle label="Weekly Security Summary" desc="Receive consolidated vulnerability chart audits" checked={notifs.weeklyReport} onChange={() => setNotifs(n => ({ ...n, weeklyReport: !n.weeklyReport }))} />
                <Toggle label="Platform & Scanner Rules Updates" desc="Alert me when Semgrep or Trivy indexes update" checked={notifs.newFeatures} onChange={() => setNotifs(n => ({ ...n, newFeatures: !n.newFeatures }))} />
                <div style={{ marginTop: 20 }}>
                  <button onClick={handleSave} className="btn btn-primary">
                    {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Preferences</>}
                  </button>
                </div>
              </Section>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="animate-fadeIn">
              <Section title="Subscription Plan & Billing Profile">
                <div style={{ padding: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', borderRadius: 10, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Free Security Tier</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>5 Repositories limit • Standard Scanners</div>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('billing')}>
                    Upgrade Plan
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>Invoice History</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>No invoices found. Subscriptions will generate records here.</div>
                </div>
              </Section>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="animate-fadeIn">
              <Section title="Workspace API Credentials">
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>Use these keys to trigger scans from GitHub Actions or local CLI integrations.</p>
                <Field label="Bearer API Secret token">
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input className="input" type={apiKeyVisible ? 'text' : 'password'} value="bb_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4" readOnly style={{ fontFamily: 'var(--font-mono)' }} />
                    <button className="btn btn-ghost" onClick={() => setApiKeyVisible(!apiKeyVisible)}>
                      {apiKeyVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </Field>
                <button className="btn btn-ghost btn-sm" onClick={() => alert('Generating new workspace key...')}>
                  Generate New Token
                </button>
              </Section>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="animate-fadeIn">
              <Section title="Team Collaboration Members">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Invite developers to collaborate on vulnerability remediation audits.</p>
                  <button className="btn btn-primary btn-sm" onClick={() => alert('Invite member modal')}>
                    Add Member
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{user?.username || 'You'}</div>
                    <span className="badge badge-success">Workspace Owner</span>
                  </div>
                </div>
              </Section>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="animate-fadeIn">
              <Section title="Third-Party Integrations">
                {[
                  { name: 'GitHub Integration', desc: 'Read code paths and scan pull requests', active: true },
                  { name: 'Slack Alerts Hook', desc: 'Send alerts to channels when scans finish', active: false },
                  { name: 'Jira Cloud Sync', desc: 'Sync vulnerability tickets to boards', active: false },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.desc}</div>
                    </div>
                    <button className={`btn ${item.active ? 'btn-ghost' : 'btn-primary'} btn-sm`}>
                      {item.active ? 'Configured' : 'Integrate'}
                    </button>
                  </div>
                ))}
              </Section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
