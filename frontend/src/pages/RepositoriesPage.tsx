import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { repoAPI, scanAPI } from '../services/api';
import {
  GitBranch, Search, RefreshCw, Play, Shield,
  ExternalLink, Clock, CheckCircle2, XCircle, Loader2, Star,
} from 'lucide-react';

function getScoreColor(score: number) {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#eab308';
  if (score >= 40) return '#f97316';
  return '#ef4444';
}

function ScoreRing({ score }: { score: number }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = getScoreColor(score);

  return (
    <svg width={52} height={52} viewBox="0 0 52 52" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={26} cy={26} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={4} />
      <circle
        cx={26} cy={26} r={r}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        className="score-ring"
        strokeLinecap="round"
      />
      <text x={26} y={26} textAnchor="middle" dominantBaseline="central" fill={color}
        fontSize={12} fontWeight={700} style={{ transform: 'rotate(90deg)', transformOrigin: '26px 26px', fontFamily: 'Space Grotesk, sans-serif' }}>
        {score}
      </text>
    </svg>
  );
}

export default function RepositoriesPage() {
  const [repos, setRepos] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [scanningRepoId, setScanningRepoId] = useState<number | null>(null);

  const fetchRepos = (q = '') => {
    setIsLoading(true);
    repoAPI.getAll(q).then((res) => setRepos(res.data.repositories)).catch(console.error).finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchRepos(); }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await repoAPI.sync();
      await fetchRepos(search);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleScan = async (repoId: number) => {
    setScanningRepoId(repoId);
    try {
      await scanAPI.start(repoId);
      // Poll for update
      setTimeout(() => fetchRepos(search), 2000);
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to start scan');
    } finally {
      setScanningRepoId(null);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    fetchRepos(e.target.value);
  };

  return (
    <div style={{ padding: 32 }} className="animate-fadeIn">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>Repositories</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>{repos.length} repositories connected</p>
        </div>
        <button
          className="btn-primary"
          onClick={handleSync}
          disabled={isSyncing}
          id="sync-repos-btn"
        >
          {isSyncing ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <RefreshCw size={16} />}
          {isSyncing ? 'Syncing...' : 'Sync GitHub Repos'}
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 24, maxWidth: 400 }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          className="input"
          placeholder="Search repositories..."
          value={search}
          onChange={handleSearch}
          id="repo-search-input"
          style={{ paddingLeft: 42 }}
        />
      </div>

      {/* Loading */}
      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '40px 0' }}>
          <div className="spinner" />
          <span style={{ color: 'var(--text-secondary)' }}>Loading repositories...</span>
        </div>
      ) : repos.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <GitBranch size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 16 }}>No repositories found</p>
          <button className="btn-primary" onClick={handleSync} id="sync-empty-btn">
            <RefreshCw size={16} /> Sync from GitHub
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {repos.map((repo) => {
            const lastScan = repo.scans?.[0];
            return (
              <div key={repo.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ flex: 1, overflow: 'hidden', marginRight: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <GitBranch size={16} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {repo.repositoryName}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{repo.fullName}</div>
                  </div>
                  <ScoreRing score={repo.securityScore} />
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} />
                    {repo.lastScanDate ? `Last scanned ${new Date(repo.lastScanDate).toLocaleDateString()}` : 'Never scanned'}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {repo._count.scans} scan{repo._count.scans !== 1 ? 's' : ''}
                  </span>
                  {lastScan && (
                    <span className={`badge ${
                      lastScan.status === 'COMPLETED' ? 'status-completed' :
                      lastScan.status === 'RUNNING' ? 'status-running' :
                      lastScan.status === 'FAILED' ? 'status-failed' : 'status-pending'
                    }`}>{lastScan.status}</span>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn-primary"
                    onClick={() => handleScan(repo.id)}
                    disabled={scanningRepoId === repo.id || lastScan?.status === 'RUNNING'}
                    id={`scan-btn-${repo.id}`}
                    style={{ flex: 1, justifyContent: 'center', fontSize: 13, padding: '8px 12px' }}
                  >
                    {scanningRepoId === repo.id ? (
                      <><div className="spinner" style={{ width: 14, height: 14 }} /> Starting...</>
                    ) : lastScan?.status === 'RUNNING' ? (
                      <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Running...</>
                    ) : (
                      <><Play size={14} /> Scan Now</>
                    )}
                  </button>
                  <Link
                    to={`/repositories/${repo.id}`}
                    id={`repo-detail-${repo.id}`}
                    style={{
                      padding: '8px 12px', background: 'transparent',
                      border: '1px solid var(--border)', borderRadius: 8,
                      color: 'var(--text-secondary)', fontSize: 13,
                      display: 'flex', alignItems: 'center', gap: 6,
                      textDecoration: 'none', transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Shield size={14} /> Details
                  </Link>
                  <a
                    href={repo.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '8px 10px', background: 'transparent',
                      border: '1px solid var(--border)', borderRadius: 8,
                      color: 'var(--text-secondary)',
                      display: 'flex', alignItems: 'center',
                      textDecoration: 'none', transition: 'all 0.2s ease',
                    }}
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
