import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, repoAPI, vulnAPI } from '../services/api';
import {
  User, Shield, GitBranch, AlertTriangle, Activity,
  Calendar, Settings, ChevronRight
} from 'lucide-react';

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div style={{ background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div>
        <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>{value}</div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [recentVulns, setRecentVulns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
  const riskScore = critCount === 0 ? 95 : critCount < 5 ? 78 : critCount < 15 ? 55 : 32;
  const riskLabel = riskScore >= 80 ? 'Excellent' : riskScore >= 60 ? 'Good' : riskScore >= 40 ? 'Fair' : 'At Risk';
  const riskColor = riskScore >= 80 ? '#10b981' : riskScore >= 60 ? '#34d399' : riskScore >= 40 ? '#eab308' : '#ef4444';
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A';

  return (
    <div style={{ padding: '32px 40px', color: '#f3f4f6' }} className="animate-fadeIn">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: '#fff' }}>Profile</h1>
          <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>Your security activity and account overview</p>
        </div>
        <Link to="/settings" id="profile-settings-link" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#9ca3af', fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLAnchorElement).style.color = '#f3f4f6'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLAnchorElement).style.color = '#9ca3af'; }}>
          <Settings size={14} /> Edit Settings
        </Link>
      </div>

      {/* Profile Card */}
      <div style={{ background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 28, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.username} style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.4)' }} />
            ) : (
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={36} color="white" />
              </div>
            )}
            <div style={{ position: 'absolute', bottom: 3, right: 3, width: 18, height: 18, borderRadius: '50%', background: '#10b981', border: '2px solid #0a0f1d' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>{user?.username || 'User'}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280' }}>
                <GitBranch size={12} /> Connected via GitHub
              </div>
              {user?.email && (
                <div style={{ fontSize: 12, color: '#6b7280' }}>{user.email}</div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280' }}>
                <Calendar size={13} /> Member since {memberSince}
              </div>
            </div>
          </div>
          {/* Security Score Badge */}
          <div style={{ textAlign: 'center', padding: '16px 24px', background: `${riskColor}12`, border: `1px solid ${riskColor}30`, borderRadius: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Security Score</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: riskColor, fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1 }}>{riskScore}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: riskColor, marginTop: 4 }}>{riskLabel}</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '40px 0' }}>
          <div className="spinner" />
          <span style={{ color: '#9ca3af' }}>Loading profile data...</span>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            <StatCard icon={<GitBranch size={16} />} label="Repositories" value={totalRepos} color="#818cf8" />
            <StatCard icon={<Activity size={16} />} label="Total Scans" value={totalScans} color="#34d399" />
            <StatCard icon={<AlertTriangle size={16} />} label="Vulnerabilities" value={totalVulns} color="#f87171" />
            <StatCard icon={<Shield size={16} />} label="Critical Findings" value={critCount} color="#ef4444" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
            {/* Recent Repositories */}
            <div style={{ background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Connected Repositories</h3>
                <Link to="/repositories" style={{ fontSize: 11, color: '#818cf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  View all <ChevronRight size={12} />
                </Link>
              </div>
              {repos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: '#4b5563', fontSize: 13 }}>
                  <GitBranch size={32} style={{ display: 'block', margin: '0 auto 10px', opacity: 0.4 }} />
                  No repositories connected yet
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {repos.map((repo: any) => (
                    <Link key={repo.id} to={`/repositories/${repo.id}`} id={`profile-repo-${repo.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)', textDecoration: 'none', transition: 'all 0.2s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)'}
                      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.02)'}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
                        <GitBranch size={13} style={{ color: '#818cf8', flexShrink: 0 }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#f3f4f6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{repo.repositoryName}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <span style={{ fontSize: 11, color: '#4b5563' }}>{repo._count?.scans || 0} scans</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: repo.securityScore >= 70 ? '#10b981' : repo.securityScore >= 40 ? '#eab308' : '#ef4444' }}>{repo.securityScore}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Account Info & Activity */}
            <div>
              <div style={{ background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Account Information</h3>
                {[
                  { label: 'Plan', value: 'Free Tier', color: '#818cf8' },
                  { icon: <GitBranch size={14} />, label: 'GitHub Account', value: `@${user?.username}`, color: '#9ca3af' },
                  { label: 'Repositories', value: `${totalRepos} connected`, color: '#9ca3af' },
                  { label: 'Status', value: 'Active', color: '#10b981' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                    <span style={{ fontSize: 12, color: '#6b7280' }}>{item.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Upgrade CTA */}
              <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.06))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Upgrade to Pro</div>
                <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5, marginBottom: 14 }}>Unlock unlimited scans, custom security rules, priority support, and advanced AI analysis.</p>
                <Link to="/pricing" id="profile-upgrade-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '9px 16px', background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 700 }}>
                  View Pricing <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
