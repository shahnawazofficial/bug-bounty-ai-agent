import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { vulnAPI } from '../services/api';
import { AlertTriangle, Search, ChevronRight, FileCode, Terminal } from 'lucide-react';

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
    <div className="page cyber-grid">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Threat Audit Console</h1>
          <p className="page-subtitle">{total} vulnerability findings index under active tracking</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 360 }}>
          <Search size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input"
            placeholder="Filter security profiles..."
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
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'].map((sev) => (
          <button
            key={sev}
            className={`badge badge-${sev.toLowerCase()}`}
            onClick={() => { setSeverity(severity === sev ? '' : sev); setPage(1); }}
            id={`filter-${sev.toLowerCase()}`}
            style={{
              cursor: 'pointer', border: '1.5px solid transparent',
              borderColor: severity === sev ? 'var(--text-primary)' : 'transparent',
              opacity: severity && severity !== sev ? 0.45 : 1,
              transition: 'all 0.15s ease'
            }}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '60px 0', justifyContent: 'center' }}>
          <div className="spinner" />
          <span style={{ color: 'var(--text-secondary)' }}>Auditing vulnerability records...</span>
        </div>
      ) : vulns.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <AlertTriangle size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px', display: 'block' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No vulnerabilities matches current ruleset.</p>
        </div>
      ) : (
        <>
          <div className="card" style={{ overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Severity</th>
                  <th>Vulnerability Finding</th>
                  <th>Repository Scope</th>
                  <th>Vector File Path</th>
                  <th>Scanner Source</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {vulns.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <span className={`badge badge-${v.severity.toLowerCase()}`}>{v.severity}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{v.title}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{v.ruleId}</div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{v.scan.repository.repositoryName}</td>
                    <td style={{ maxWidth: 220 }}>
                      {v.filePath ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                          <FileCode size={12} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {v.filePath}{v.lineNumber ? `:${v.lineNumber}` : ''}
                          </span>
                        </div>
                      ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                        <Terminal size={12} style={{ color: 'var(--text-muted)' }} />
                        {v.scannerSource}
                      </div>
                    </td>
                    <td>
                      <Link
                        to={`/vulnerabilities/${v.id}`}
                        id={`vuln-detail-${v.id}`}
                        className="btn btn-ghost btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--accent)', fontWeight: 700 }}
                      >
                        Remediation <ChevronRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              <button
                className="btn btn-ghost btn-sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >← Prev</button>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '0 8px' }}>Page {page} of {totalPages}</span>
              <button
                className="btn btn-ghost btn-sm"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
