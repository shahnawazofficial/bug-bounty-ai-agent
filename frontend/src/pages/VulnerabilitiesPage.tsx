import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { vulnAPI } from '../services/api';
import { AlertTriangle, Search, Filter, ChevronRight, FileCode, Terminal } from 'lucide-react';

const SEVERITIES = ['', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];
const SCANNERS = ['', 'Semgrep', 'Gitleaks', 'Trivy', 'PatternScanner'];

export default function VulnerabilitiesPage() {
  const [vulns, setVulns] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('');
  const [scanner, setScanner] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchVulns = (params = {}) => {
    setIsLoading(true);
    vulnAPI.getAll({ search, severity, scanner, page, limit, ...params })
      .then((res) => {
        setVulns(res.data.vulnerabilities);
        setTotal(res.data.total);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchVulns(); }, [search, severity, scanner, page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ padding: 32 }} className="animate-fadeIn">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>Vulnerabilities</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>{total} total findings across all repositories</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 360 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input"
            placeholder="Search vulnerabilities..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            id="vuln-search"
            style={{ paddingLeft: 42 }}
          />
        </div>

        <select
          className="input"
          value={severity}
          onChange={(e) => { setSeverity(e.target.value); setPage(1); }}
          id="severity-filter"
          style={{ width: 160, cursor: 'pointer' }}
        >
          <option value="">All Severities</option>
          {SEVERITIES.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          className="input"
          value={scanner}
          onChange={(e) => { setScanner(e.target.value); setPage(1); }}
          id="scanner-filter"
          style={{ width: 160, cursor: 'pointer' }}
        >
          <option value="">All Scanners</option>
          {SCANNERS.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Severity quick filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'].map((sev) => (
          <button
            key={sev}
            className={`badge badge-${sev.toLowerCase()}`}
            onClick={() => { setSeverity(severity === sev ? '' : sev); setPage(1); }}
            id={`filter-${sev.toLowerCase()}`}
            style={{
              cursor: 'pointer', border: 'none',
              opacity: severity && severity !== sev ? 0.4 : 1,
              transition: 'opacity 0.2s ease',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '40px 0' }}>
          <div className="spinner" />
          <span style={{ color: 'var(--text-secondary)' }}>Loading vulnerabilities...</span>
        </div>
      ) : vulns.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <AlertTriangle size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>No vulnerabilities found</p>
        </div>
      ) : (
        <>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                    {['Severity', 'Title', 'Repository', 'File', 'Scanner', ''].map((h) => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vulns.map((v, i) => (
                    <tr
                      key={v.id}
                      style={{
                        borderBottom: i < vulns.length - 1 ? '1px solid var(--border)' : 'none',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                    >
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span className={`badge badge-${v.severity.toLowerCase()}`}>{v.severity}</span>
                      </td>
                      <td style={{ padding: '12px 16px', maxWidth: 280 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{v.ruleId}</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        {v.scan.repository.repositoryName}
                      </td>
                      <td style={{ padding: '12px 16px', maxWidth: 200 }}>
                        {v.filePath ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>
                            <FileCode size={12} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {v.filePath}{v.lineNumber ? `:${v.lineNumber}` : ''}
                            </span>
                          </div>
                        ) : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>}
                      </td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                          <Terminal size={12} style={{ color: 'var(--text-muted)' }} />
                          {v.scannerSource}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Link
                          to={`/vulnerabilities/${v.id}`}
                          id={`vuln-detail-${v.id}`}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            fontSize: 12, color: 'var(--accent-blue)', textDecoration: 'none',
                          }}
                        >
                          Details <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              <button
                className="btn-ghost"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                style={{ padding: '6px 14px', fontSize: 13 }}
              >← Prev</button>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Page {page} of {totalPages}</span>
              <button
                className="btn-ghost"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                style={{ padding: '6px 14px', fontSize: 13 }}
              >Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
