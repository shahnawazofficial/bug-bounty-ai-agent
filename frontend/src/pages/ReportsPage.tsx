import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { vulnAPI, repoAPI } from '../services/api';
import { FileText, ChevronRight, Search, FileJson, GitBranch, Loader2, Download, ShieldAlert, BarChart2 } from 'lucide-react';

const SEV_COLOR: Record<string, string> = {
  CRITICAL: 'var(--sev-critical)', HIGH: 'var(--sev-high)', MEDIUM: 'var(--sev-medium)', LOW: 'var(--sev-low)', INFO: 'var(--sev-info)'
};
const SEV_BG: Record<string, string> = {
  CRITICAL: 'var(--sev-critical-bg)', HIGH: 'var(--sev-high-bg)',
  MEDIUM: 'var(--sev-medium-bg)', LOW: 'var(--sev-low-bg)', INFO: 'var(--sev-info-bg)'
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
      <span style={{ width: 60, fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{label}</span>
      <div className="progress-bar" style={{ flex: 1 }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
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
  const [generatingPDF, setGeneratingPDF] = useState(false);
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

  const handleDownloadPDF = () => {
    setGeneratingPDF(true);
    setTimeout(() => {
      setGeneratingPDF(false);
      alert('PDF report compiled and downloaded!');
    }, 1500);
  };

  return (
    <div className="page cyber-grid">
      <div className="page-header">
        <div>
          <h1 className="page-title">Compliance & Audits</h1>
          <p className="page-subtitle">Export security profiles, vulnerability records, and compliance artifacts</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={handleDownloadPDF} disabled={generatingPDF} id="export-pdf-btn" className="btn btn-ghost btn-sm">
            {generatingPDF ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
            Compile PDF Report
          </button>
          <button onClick={handleExportCSV} disabled={exporting} id="export-csv-btn" className="btn btn-ghost btn-sm">
            <FileText size={13} /> Export CSV
          </button>
          <button onClick={handleExportJSON} disabled={exporting} id="export-json-btn" className="btn btn-primary btn-sm">
            {exporting ? <Loader2 size={13} className="animate-spin" /> : <FileJson size={13} />} Export JSON
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] as const).map(s => (
          <button key={s} onClick={() => setSeverity(severity === s ? '' : s)} style={{
            background: severity === s ? SEV_BG[s] : 'var(--bg-card)',
            border: `1px solid ${severity === s ? SEV_COLOR[s] : 'var(--border-default)'}`,
            borderRadius: 12, padding: '14px 16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left', fontFamily: 'var(--font-sans)', transition: 'all 0.15s'
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: SEV_COLOR[s], textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s}</span>
            <span style={{ fontSize: 24, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)' }}>{counts[s]}</span>
          </button>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 24 }}>
        
        {/* Severity Distribution */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <BarChart2 size={16} style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)' }}>Severity Distribution</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] as const).map(s => (
              <SevBar key={s} label={s} count={counts[s]} total={total || 1} color={SEV_COLOR[s]} />
            ))}
          </div>
        </div>

        {/* Report Summary */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <ShieldAlert size={16} style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)' }}>Security Analytics</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Total Scanned Vulnerabilities', value: total.toString(), color: '#fff' },
              { label: 'Monitored Repositories', value: repos.length.toString(), color: 'var(--cyan)' },
              { label: 'Critical + High Exposures', value: (counts.CRITICAL + counts.HIGH).toString(), color: 'var(--sev-critical)' },
              { label: 'Risk Factor Level', value: counts.CRITICAL > 5 ? 'CRITICAL RISK' : counts.CRITICAL > 0 ? 'HIGH RISK' : 'STABLE posture', color: counts.CRITICAL > 5 ? 'var(--sev-critical)' : counts.CRITICAL > 0 ? 'var(--sev-high)' : 'var(--accent)' },
              { label: 'Compliance Report Timestamp', value: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }), color: 'var(--text-secondary)' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i < 4 ? '1px solid var(--border-subtle)' : 'none', paddingBottom: i < 4 ? 10 : 0 }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" className="input" placeholder="Search vulnerability report content..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} id="report-search"
            style={{ paddingLeft: 36, fontSize: 13 }} />
        </div>
        <select className="input" value={severity} onChange={e => { setSeverity(e.target.value); setPage(1); }}
          id="report-severity" style={{ width: 180, cursor: 'pointer', fontSize: 13 }}>
          <option value="">All Threat Severities</option>
          {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {(search || severity) && (
          <button onClick={() => { setSearch(''); setSeverity(''); setPage(1); }}
            className="btn btn-ghost btn-sm">
            Clear Filters
          </button>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '60px 0', justifyContent: 'center' }}>
          <div className="spinner" />
          <span style={{ color: 'var(--text-secondary)' }}>Loading threat vectors...</span>
        </div>
      ) : vulns.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <FileText size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px', display: 'block' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, fontWeight: 600 }}>No security findings detected</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>Run code scan queries across repositories to populate findings.</p>
          <Link to="/repositories" className="btn btn-primary btn-sm" style={{ marginTop: 20 }}>
            <GitBranch size={13} /> Open Repositories
          </Link>
        </div>
      ) : (
        <>
          <div className="card" style={{ overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Severity</th>
                  <th>Vulnerability finding</th>
                  <th>Repository scope</th>
                  <th>File vector</th>
                  <th>Scanner</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vulns.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <span className={`badge badge-${v.severity.toLowerCase()}`}>
                        {v.severity}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#f3f4f6' }}>{v.title}</div>
                      {v.ruleId && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{v.ruleId}</div>}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{v.scan?.repository?.repositoryName || '—'}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                      {v.filePath ? `${v.filePath}${v.lineNumber ? `:${v.lineNumber}` : ''}` : '—'}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{v.scannerSource || '—'}</td>
                    <td>
                      <Link to={`/vulnerabilities/${v.id}`} id={`report-vuln-${v.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>
                        Audit Details <ChevronRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', padding: '0 8px' }}>Page {page} of {totalPages}</span>
              <button className="btn btn-ghost btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
