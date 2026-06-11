import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, repoAPI, vulnAPI } from '../services/api';
import {
  User, Shield, GitBranch, AlertTriangle, Activity,
  Calendar, Settings, ChevronRight, CheckCircle2, Lock, Sparkles, Upload
} from 'lucide-react';

function StatCard({ icon, label, value, color, bg }: { icon: React.ReactNode; label: string; value: string | number; color: string; bg: string }) {
  return (
    <div className="card" style={{ background: 'var(--bg-card)', padding: 18, border: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)' }}>{value}</div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [recentVulns, setRecentVulns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    Promise.all([
      dashboardAPI.getStats(),
      repoAPI.getAll(),
      vulnAPI.getAll({ limit: 5, severity: 'CRITICAL' }),
    ]).then(([statsRes, reposRes, vulnsRes]) => {
      setStats(statsRes.data.stats);
      setRepos(reposRes.data.repositories?.slice(0, 5) || []);
      setRecentVulns(vulnsRes.data.vulnerabilities || []);
    }).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  const totalVulns = stats?.totalVulnerabilities ?? 0;
  const totalRepos = stats?.totalRepos ?? 0;
  const totalScans = stats?.totalScans ?? 0;
  const critCount = stats?.criticalCount ?? 0;
  
  // Security score
  const riskScore = critCount === 0 ? 95 : critCount < 5 ? 78 : critCount < 15 ? 55 : 32;
  const riskLabel = riskScore >= 80 ? 'Excellent' : riskScore >= 60 ? 'Good' : riskScore >= 40 ? 'Fair' : 'At Risk';
  const riskColor = riskScore >= 80 ? 'var(--accent)' : riskScore >= 60 ? 'var(--cyan)' : riskScore >= 40 ? 'var(--sev-medium)' : 'var(--sev-critical)';
  const riskBg = riskScore >= 80 ? 'var(--accent-dim)' : riskScore >= 60 ? 'var(--cyan-dim)' : riskScore >= 40 ? 'rgba(255, 215, 0, 0.08)' : 'var(--sev-critical-bg)';

  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A';

  const handleAvatarUpload = () => {
    setAvatarUploading(true);
    // Simulate image upload
    setTimeout(() => {
      setAvatarUploading(false);
      alert('Avatar updated successfully!');
    }, 1500);
  };

  return (
    <div className="page cyber-grid">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">User Security Profile</h1>
          <p className="page-subtitle">Personal dashboard & connected repository health overview</p>
        </div>
        <Link to="/settings" className="btn btn-secondary btn-sm" id="profile-settings-link">
          <Settings size={13} /> Edit Settings
        </Link>
      </div>

      {/* Profile Overview Card */}
      <div className="card" style={{ background: 'var(--bg-card)', padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          
          {/* Avatar Area with Simulated Upload */}
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={handleAvatarUpload}>
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.username} style={{ width: 72, height: 72, borderRadius: '50%', border: '2.5px solid var(--accent)' }} />
            ) : (
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--bg-secondary)', border: '2px dashed var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={30} style={{ color: 'var(--accent)' }} />
              </div>
            )}
            <div style={{
              position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: '50%',
              background: 'var(--accent)', border: '2px solid var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {avatarUploading ? (
                <div className="spinner" style={{ width: 10, height: 10, borderTopColor: '#000' }} />
              ) : (
                <Upload size={10} color="#000" strokeWidth={3} />
              )}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)', marginBottom: 4 }}>
              {user?.username || 'Security Engineer'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                <GitBranch size={12} style={{ color: 'var(--accent)' }} /> Connected via GitHub
              </div>
              {user?.email && (
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{user.email}</div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                <Calendar size={13} style={{ color: 'var(--accent)' }} /> Active since {memberSince}
              </div>
            </div>
          </div>

          {/* Security Score Badge */}
          <div style={{ textAlign: 'center', padding: '16px 24px', background: riskBg, border: `1px solid ${riskColor}40`, borderRadius: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Security Rating</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: riskColor, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{riskScore}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: riskColor, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{riskLabel}</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '40px 0' }}>
          <div className="spinner" />
          <span style={{ color: 'var(--text-secondary)' }}>Loading security posture...</span>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            <StatCard icon={<GitBranch size={16} />} label="Tracked Repositories" value={totalRepos} color="var(--cyan)" bg="var(--cyan-dim)" />
            <StatCard icon={<Activity size={16} />} label="Total Run Scans" value={totalScans} color="var(--accent)" bg="var(--accent-dim)" />
            <StatCard icon={<AlertTriangle size={16} />} label="Total Vulnerabilities" value={totalVulns} color="var(--sev-high)" bg="var(--sev-high-bg)" />
            <StatCard icon={<Shield size={16} />} label="Critical Severity Finding" value={critCount} color="var(--sev-critical)" bg="var(--sev-critical-bg)" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {/* Connected Repositories List */}
            <div className="card" style={{ background: 'var(--bg-card)', padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)' }}>Connected Repositories Health</h3>
                <Link to="/repositories" style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  View all <ChevronRight size={12} />
                </Link>
              </div>
              {repos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: 13 }}>
                  <GitBranch size={32} style={{ display: 'block', margin: '0 auto 10px', opacity: 0.4 }} />
                  No repositories connected yet
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {repos.map((repo: any) => (
                    <Link key={repo.id} to={`/repositories/${repo.id}`} id={`profile-repo-${repo.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-subtle)', textDecoration: 'none', transition: 'all 0.15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-strong)'}
                      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-subtle)'}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
                        <GitBranch size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#f3f4f6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{repo.repositoryName}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{repo._count?.scans || 0} scans</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: repo.securityScore >= 70 ? 'var(--accent)' : repo.securityScore >= 40 ? 'var(--sev-medium)' : 'var(--sev-critical)' }}>
                          Score: {repo.securityScore}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Account Details & Quick Upgrade */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card" style={{ background: 'var(--bg-card)', padding: 20 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 16, fontFamily: 'var(--font-display)' }}>Security Clearance Details</h3>
                {[
                  { label: 'Authorized Plan', value: 'Free Security Tier', color: 'var(--cyan)' },
                  { icon: <GitBranch size={14} />, label: 'GitHub Identity ID', value: `@${user?.username}`, color: 'var(--text-secondary)' },
                  { label: 'Platform Scope', value: `${totalRepos} repos active`, color: 'var(--text-secondary)' },
                  { label: 'Threat Monitoring', value: 'Active Live shield', color: 'var(--accent)' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Upgrade CTA */}
              <div style={{ background: 'linear-gradient(135deg, rgba(0, 255, 157, 0.08), rgba(0, 217, 255, 0.04))', border: '1px solid rgba(0, 255, 157, 0.2)', borderRadius: 12, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Sparkles size={13} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Unlock Professional Audits</span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                  Connect unlimited private repositories, enforce custom Semgrep rules, configure webhook alerts, and auto-mitigate with AI.
                </p>
                <Link to="/pricing" id="profile-upgrade-btn" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '9px 16px', background: 'var(--accent)', color: '#000', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 700,
                  boxShadow: '0 0 16px rgba(0, 255, 157, 0.2)'
                }}>
                  View Pricing Plans <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
