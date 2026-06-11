import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { repoAPI, scanAPI } from '../services/api';
import {
  GitBranch, Search, RefreshCw, Play, Shield,
  ExternalLink, Clock, Loader2, Star, CheckCircle2
} from 'lucide-react';

function getScoreColor(score: number) {
  if (score >= 80) return 'var(--accent)';
  if (score >= 60) return 'var(--cyan)';
  if (score >= 40) return 'var(--sev-medium)';
  return 'var(--sev-critical)';
}

function ScoreRing({ score }: { score: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = getScoreColor(score);

  return (
    <svg width={48} height={48} viewBox="0 0 48 48" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={24} cy={24} r={r} fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth={3.5} />
      <circle
        cx={24}
        cy={24}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={3.5}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <text x={24} y={24} textAnchor="middle" dominantBaseline="central" fill={color}
        fontSize={11} fontWeight={700} style={{ transform: 'rotate(90deg)', transformOrigin: '24px 24px', fontFamily: 'var(--font-display)' }}>
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
    <div className="page cyber-grid">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Workspace Repositories</h1>
          <p className="page-subtitle">{repos.length} codebases connected under live tracking</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleSync}
          disabled={isSyncing}
          id="sync-repos-btn"
        >
          {isSyncing ? <div className="spinner" style={{ borderTopColor: '#000' }} /> : <RefreshCw size={14} />}
          {isSyncing ? 'Syncing...' : 'Sync GitHub Repos'}
        </button>
      </div>

      {/* Search & Statistics */}
      <div style={{ position: 'relative', marginBottom: 24, maxWidth: 400 }}>
        <Search size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          className="input"
          placeholder="Filter repositories..."
          value={search}
          onChange={handleSearch}
          id="repo-search-input"
          style={{ paddingLeft: 42 }}
        />
      </div>

      {/* Loading */}
      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '40px 0', justifyContent: 'center' }}>
          <div className="spinner" />
          <span style={{ color: 'var(--text-secondary)' }}>Indexing repository logs...</span>
        </div>
      ) : repos.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <GitBranch size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px', display: 'block' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 16 }}>No repositories connected to your space.</p>
          <button className="btn btn-primary" onClick={handleSync} id="sync-empty-btn">
            <RefreshCw size={14} /> Connect from GitHub
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {repos.map((repo) => {
            const lastScan = repo.scans?.[0];
            return (
              <div key={repo.id} className="card card-interactive" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ flex: 1, overflow: 'hidden', marginRight: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <GitBranch size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                      <span style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#fff', fontFamily: 'var(--font-display)' }}>
                        {repo.repositoryName}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{repo.fullName}</div>
                  </div>
                  <ScoreRing score={repo.securityScore} />
                </div>

                {/* Metadata details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} style={{ color: 'var(--accent)' }} />
                    {repo.lastScanDate ? `Scanned ${new Date(repo.lastScanDate).toLocaleDateString()}` : 'No active scans'}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {repo._count.scans} scan operation{repo._count.scans !== 1 ? 's' : ''}
                  </span>
                  {lastScan && (
                    <span className={`badge ${
                      lastScan.status === 'COMPLETED' ? 'status-completed' :
                      lastScan.status === 'RUNNING' ? 'status-running' :
                      lastScan.status === 'FAILED' ? 'status-failed' : 'status-pending'
                    }`} style={{ fontSize: 9 }}>{lastScan.status}</span>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleScan(repo.id)}
                    disabled={scanningRepoId === repo.id || lastScan?.status === 'RUNNING'}
                    id={`scan-btn-${repo.id}`}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    {scanningRepoId === repo.id ? (
                      <><div className="spinner" style={{ width: 12, height: 12, borderTopColor: '#000' }} /> starting...</>
                    ) : lastScan?.status === 'RUNNING' ? (
                      <><Loader2 size={12} className="animate-spin" /> auditing...</>
                    ) : (
                      <><Play size={12} /> Start Scan</>
                    )}
                  </button>
                  <Link
                    to={`/repositories/${repo.id}`}
                    id={`repo-detail-${repo.id}`}
                    className="btn btn-ghost btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Shield size={12} /> Details
                  </Link>
                  <a
                    href={repo.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '0 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <ExternalLink size={12} />
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
