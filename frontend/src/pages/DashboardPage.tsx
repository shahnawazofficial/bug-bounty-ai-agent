import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  GitBranch, AlertTriangle, Shield, Zap,
  TrendingUp, Clock, ChevronRight, Activity,
} from 'lucide-react';

interface Stats {
  totalRepos: number;
  totalScans: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  totalVulnerabilities: number;
}

function SeverityBar({ label, count, color, max }: { label: string; count: number; color: string; max: number }) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
      <div style={{ width: 60, fontSize: 12, color: 'var(--text-secondary)' }}>{label}</div>
      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 1s ease' }} />
      </div>
      <div style={{ width: 36, fontSize: 13, fontWeight: 600, textAlign: 'right', color: 'var(--text-primary)' }}>{count}</div>
    </div>
  );
}

function StatCard({ icon, label, value, color, sublabel }: { icon: React.ReactNode; label: string; value: number | string; color: string; sublabel?: string }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>{label}</div>
      {sublabel && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{sublabel}</div>}
    </div>
  );
}

function getSeverityColor(sev: string) {
  const map: Record<string, string> = {
    CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#eab308', LOW: '#3b82f6', INFO: '#6b7280',
  };
  return map[sev] || '#6b7280';
}

function getScanStatusClass(status: string) {
  const map: Record<string, string> = {
    COMPLETED: 'status-completed', RUNNING: 'status-running', FAILED: 'status-failed', PENDING: 'status-pending',
  };
  return map[status] || 'status-pending';
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [recentVulns, setRecentVulns] = useState<any[]>([]);
  const [topRepos, setTopRepos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.getStats().then((res) => {
      setStats(res.data.stats);
      setRecentScans(res.data.recentScans);
      setRecentVulns(res.data.recentVulns);
      setTopRepos(res.data.topRepos);
    }).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  if (isLoading) {
    return (
      <div style={{ padding: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="spinner" />
        <span style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</span>
      </div>
    );
  }

  const maxVuln = Math.max(stats?.criticalCount || 0, stats?.highCount || 0, stats?.mediumCount || 0, stats?.lowCount || 0, 1);

  return (
    <div style={{ padding: 32 }} className="animate-fadeIn">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          {user?.avatarUrl && <img src={user.avatarUrl} alt={user.username} style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--border)' }} />}
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
              {greeting}, {user?.username} 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Here's your security overview</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard icon={<GitBranch size={20} />} label="Repositories" value={stats?.totalRepos || 0} color="#3b82f6" />
        <StatCard icon={<Activity size={20} />} label="Total Scans" value={stats?.totalScans || 0} color="#8b5cf6" />
        <StatCard icon={<AlertTriangle size={20} />} label="Critical Issues" value={stats?.criticalCount || 0} color="#ef4444" />
        <StatCard icon={<Shield size={20} />} label="Total Findings" value={stats?.totalVulnerabilities || 0} color="#10b981" />
      </div>

      {/* Middle Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Severity breakdown */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <TrendingUp size={18} color="var(--accent-blue)" />
            <h3 style={{ fontWeight: 600, fontSize: 15 }}>Vulnerability Breakdown</h3>
          </div>
          <SeverityBar label="Critical" count={stats?.criticalCount || 0} color="#ef4444" max={maxVuln} />
          <SeverityBar label="High" count={stats?.highCount || 0} color="#f97316" max={maxVuln} />
          <SeverityBar label="Medium" count={stats?.mediumCount || 0} color="#eab308" max={maxVuln} />
          <SeverityBar label="Low" count={stats?.lowCount || 0} color="#3b82f6" max={maxVuln} />
        </div>

        {/* Top repos by score */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Shield size={18} color="var(--accent-blue)" />
            <h3 style={{ fontWeight: 600, fontSize: 15 }}>Repositories by Score</h3>
          </div>
          {topRepos.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>No repos scanned yet</div>
          ) : (
            topRepos.map((repo) => (
              <div key={repo.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: repo.securityScore >= 80 ? 'rgba(16,185,129,0.1)' : repo.securityScore >= 50 ? 'rgba(234,179,8,0.1)' : 'rgba(239,68,68,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                  color: repo.securityScore >= 80 ? '#10b981' : repo.securityScore >= 50 ? '#eab308' : '#ef4444',
                }}>
                  {repo.securityScore}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{repo.repositoryName}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {repo.lastScanDate ? new Date(repo.lastScanDate).toLocaleDateString() : 'Never scanned'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent Scans */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={18} color="var(--accent-blue)" />
              <h3 style={{ fontWeight: 600, fontSize: 15 }}>Recent Scans</h3>
            </div>
            <Link to="/repositories" style={{ fontSize: 12, color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
              View all <ChevronRight size={14} />
            </Link>
          </div>
          {recentScans.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>No scans run yet</div>
          ) : (
            recentScans.map((scan) => {
              const criticals = scan.vulnerabilities.filter((v: any) => v.severity === 'CRITICAL').length;
              return (
                <div key={scan.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {scan.repository.repositoryName}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(scan.scanDate).toLocaleString()}</div>
                  </div>
                  <span className={`badge ${getScanStatusClass(scan.status)}`}>{scan.status}</span>
                  {criticals > 0 && <span className="badge badge-critical">{criticals} crit</span>}
                </div>
              );
            })
          )}
        </div>

        {/* Recent Critical/High Vulns */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={18} color="#ef4444" />
              <h3 style={{ fontWeight: 600, fontSize: 15 }}>Critical Findings</h3>
            </div>
            <Link to="/vulnerabilities" style={{ fontSize: 12, color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
              View all <ChevronRight size={14} />
            </Link>
          </div>
          {recentVulns.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>
              🎉 No critical findings!
            </div>
          ) : (
            recentVulns.map((v) => (
              <div key={v.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span className={`badge badge-${v.severity.toLowerCase()}`}>{v.severity}</span>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{v.scan.repository.repositoryName}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
