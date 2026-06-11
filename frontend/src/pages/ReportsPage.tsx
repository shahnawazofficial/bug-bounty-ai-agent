import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { vulnAPI, repoAPI } from '../services/api';
import { FileText, ChevronRight, Search, FileJson, GitBranch, Loader2 } from 'lucide-react';

const SEV_COLOR: Record<string, string> = {
  CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#eab308', LOW: '#3b82f6', INFO: '#6b7280'
};
const SEV_BG: Record<string, string> = {
  CRITICAL: 'rgba(239,68,68,0.1)', HIGH: 'rgba(249,115,22,0.1)',
  MEDIUM: 'rgba(234,179,8,0.1)', LOW: 'rgba(59,130,246,0.1)', INFO: 'rgba(107,114,128,0.1)'
};

function exportJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename + '.json'; a.click();
  URL.revokeObjectURL(url);
}

function exportCSV(vulns: any[], filename: string) {
  const headers = ['Severity', 'Title', 'Repository', 'File', 'Line', 'Scanner', 'Description'];
  const rows = vulns.map(v => [
    v.severity, `"${(v.title || '').replace(/"/g, '""')}"`,
    v.scan?.repository?.repositoryName || '', v.filePath || '', v.lineNumber || '',
    v.scannerSource || '', `"${(v.description || '').replace(/"/g, '""')}"`
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename + '.csv'; a.click();
  URL.revokeObjectURL(url);
}

function SevBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ width: 60, fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>{label}</span>
      <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.04)', borderRadius: 3 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.8s ease' }} />
      </div>
      <span style={{ width: 28, fontSize: 12, fontWeight: 700, color: '#fff', textAlign: 'right' }}>{count}</span>
    </div>
  );
}

export default function ReportsPage() {
  const [vulns, setVulns] = useState<any[]>([]);
  const [repos, setRepos] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('');
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const limit = 25;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [vRes, rRes] = await Promise.all([
        vulnAPI.getAll({ search, severity, page, limit }),
        repoAPI.getAll()
      ]);
      setVulns(vRes.data.vulnerabilities || []);
      setTotal(vRes.data.total || 0);
      setRepos(rRes.data.repositories || []);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, [search, severity, page]);

  const totalPages = Math.ceil(total / limit);
  const counts: Record<string, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, INFO: 0 };
  vulns.forEach(v => { if (counts[v.severity] !== undefined) counts[v.severity]++; });

  const handleExportJSON = async () => {
    setExporting(true);
    try {
      const all = await vulnAPI.getAll({ limit: 1000 });
      exportJSON({ generatedAt: new Date().toISOString(), total: all.data.total, vulnerabilities: all.data.vulnerabilities },
        `bugbounty-report-${new Date().toISOString().split('T')[0]}`);
    } finally { setExporting(false); }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const all = await vulnAPI.getAll({ limit: 1000 });
      exportCSV(all.data.vulnerabilities, `bugbounty-report-${new Date().toISOString().split('T')[0]}`);
    } finally { setExporting(false); }
  };

  return (
    <div style={{ padding: '32px 40px', color: '#f3f4f6' }} className="animate-fadeIn">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: '#ffffff' }}>Security Reports</h1>
          <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>Comprehensive findings across all repositories</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleExportCSV} disabled={exporting} id="export-csv-btn" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '9px 16px', borderRadius: 8, color: '#9ca3af', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            <FileText size={14} /> Export CSV
          </button>
          <button onClick={handleExportJSON} disabled={exporting} id="export-json-btn" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', border: '1px solid rgba(99,179,237,0.2)', padding: '9px 16px', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            {exporting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <FileJson size={14} />} Export JSON
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
        {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] as const).map(s => (
          <button key={s} onClick={() => setSeverity(severity === s ? '' : s)} style={{ background: severity === s ? SEV_BG[s] : '#0a0f1d', border: `1px solid ${severity === s ? SEV_COLOR[s] + '50' : 'rgba(255,255,255,0.06)'}`, borderRadius: 10, padding: '14px 16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: SEV_COLOR[s], textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s}</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>{counts[s]}</span>
          </button>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Severity Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] as const).map(s => (
              <SevBar key={s} label={s} count={counts[s]} total={total || 1} color={SEV_COLOR[s]} />
            ))}
          </div>
        </div>
        <div style={{ background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Report Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Total Findings', value: total.toString(), color: '#fff' },
              { label: 'Repositories', value: repos.length.toString(), color: '#818cf8' },
              { label: 'Critical + High', value: (counts.CRITICAL + counts.HIGH).toString(), color: '#ef4444' },
              { label: 'Risk Level', value: counts.CRITICAL > 5 ? 'HIGH RISK' : counts.CRITICAL > 0 ? 'MEDIUM RISK' : 'LOW RISK', color: counts.CRITICAL > 5 ? '#ef4444' : counts.CRITICAL > 0 ? '#eab308' : '#10b981' },
              { label: 'Generated', value: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }), color: '#9ca3af' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.03)' : 'none', paddingBottom: i < 4 ? 10 : 0 }}>
                <span style={{ fontSize: 12, color: '#6b7280' }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
          <input type="text" className="input" placeholder="Search vulnerabilities..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} id="report-search"
            style={{ paddingLeft: 36, fontSize: 13 }} />
        </div>
        <select className="input" value={severity} onChange={e => { setSeverity(e.target.value); setPage(1); }}
          id="report-severity" style={{ width: 160, cursor: 'pointer', fontSize: 13 }}>
          <option value="">All Severities</option>
          {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {(search || severity) && (
          <button onClick={() => { setSearch(''); setSeverity(''); setPage(1); }}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 14px', color: '#9ca3af', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '60px 0' }}>
          <div className="spinner" />
          <span style={{ color: '#9ca3af' }}>Loading report data...</span>
        </div>
      ) : vulns.length === 0 ? (
        <div style={{ background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 60, textAlign: 'center' }}>
          <FileText size={48} style={{ color: '#374151', margin: '0 auto 16px', display: 'block' }} />
          <p style={{ color: '#6b7280', fontSize: 15, fontWeight: 600 }}>No findings to report</p>
          <p style={{ color: '#4b5563', fontSize: 13, marginTop: 6 }}>Run a scan on a repository to see results here</p>
          <Link to="/repositories" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 20, padding: '10px 20px', background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            <GitBranch size={14} /> Go to Repositories
          </Link>
        </div>
      ) : (
        <>
          <div style={{ background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 140px 160px 110px 70px', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
              {['Severity', 'Vulnerability', 'Repository', 'File Path', 'Scanner', ''].map(h => (
                <span key={h} style={{ fontSize: 10, fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
              ))}
            </div>
            {vulns.map((v, i) => (
              <div key={v.id} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 140px 160px 110px 70px', padding: '12px 16px', alignItems: 'center', borderBottom: i < vulns.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', transition: 'background 0.15s', cursor: 'default' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                <div>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: SEV_BG[v.severity] || SEV_BG.INFO, color: SEV_COLOR[v.severity] || '#6b7280', border: `1px solid ${(SEV_COLOR[v.severity] || '#6b7280')}40` }}>{v.severity}</span>
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f3f4f6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.title}</div>
                  {v.ruleId && <div style={{ fontSize: 10, color: '#4b5563', marginTop: 2 }}>{v.ruleId}</div>}
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.scan?.repository?.repositoryName || '—'}</div>
                <div style={{ fontSize: 11, color: '#4b5563', fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.filePath ? `${v.filePath}${v.lineNumber ? `:${v.lineNumber}` : ''}` : '—'}</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>{v.scannerSource || '—'}</div>
                <Link to={`/vulnerabilities/${v.id}`} id={`report-vuln-${v.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>
                  View <ChevronRight size={12} />
                </Link>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              <button className="btn-ghost" disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '6px 14px', fontSize: 13 }}>← Prev</button>
              <span style={{ fontSize: 13, color: '#6b7280', padding: '0 8px' }}>Page {page} of {totalPages}</span>
              <button className="btn-ghost" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '6px 14px', fontSize: 13 }}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
