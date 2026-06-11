import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { repoAPI, scanAPI } from '../services/api';
import { ArrowLeft, Play, Shield, AlertTriangle, Clock, ExternalLink, Loader2, CheckCircle2, Zap } from 'lucide-react';

function getScoreColor(score: number) {
  if (score >= 80) return 'var(--accent)';
  if (score >= 60) return 'var(--cyan)';
  if (score >= 40) return 'var(--sev-medium)';
  return 'var(--sev-critical)';
}

function ScoreGauge({ score }: { score: number }) {
  const r = 50, circ = 2 * Math.PI * r;
  const color = getScoreColor(score);
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Fair' : score >= 40 ? 'Risk Profile' : 'Critical Exposure';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={110} height={110} viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={60} cy={60} r={r} fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth={7} />
        <circle cx={60} cy={60} r={r} fill="none" stroke={color} strokeWidth={7}
          strokeDasharray={circ} strokeDashoffset={circ - (score / 100) * circ}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <text x={60} y={60} textAnchor="middle" dominantBaseline="central" fill={color}
          fontSize={20} fontWeight={800}
          style={{ transform: 'rotate(90deg)', transformOrigin: '60px 60px', fontFamily: 'var(--font-display)' }}>
          {score}
        </text>
      </svg>
      <span style={{ fontSize: 11, color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
    </div>
  );
}

const SCAN_STEPS = ['Cloning repository', 'Running Semgrep SAST', 'Detecting secrets (Gitleaks)', 'Scanning dependencies (Trivy)', 'Analyzing findings', 'Generating report'];

function ScanningProgress() {
  const [step, setStep] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const stepTimer = setInterval(() => setStep(s => Math.min(s + 1, SCAN_STEPS.length - 1)), 4000);
    const dotTimer = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => { clearInterval(stepTimer); clearInterval(dotTimer); };
  }, []);

  return (
    <div style={{ padding: '20px 10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div className="spinner spinner-lg" />
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>AI Security Operation running{dots}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Status dashboard updates dynamically</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SCAN_STEPS.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              background: i < step ? 'rgba(0, 255, 157, 0.1)' : i === step ? 'rgba(0, 217, 255, 0.1)' : 'rgba(255,255,255,0.02)',
              border: `1.5px solid ${i < step ? 'var(--accent)' : i === step ? 'var(--cyan)' : 'var(--border-default)'}`,
              transition: 'all 0.3s ease',
            }}>
              {i < step
                ? <CheckCircle2 size={11} color="var(--accent)" />
                : i === step
                  ? <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan)' }} />
                  : <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text-muted)' }} />
              }
            </div>
            <span style={{
              fontSize: 12,
              color: i < step ? 'var(--accent)' : i === step ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: i === step ? 700 : 400,
            }}>{s}{i === step ? dots : ''}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RepositoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [repo, setRepo] = useState<any>(null);
  const [scans, setScans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedScanId, setSelectedScanId] = useState<number | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasRunningScan = scans.some(s => s.status === 'RUNNING' || s.status === 'PENDING');

  const fetchData = async (silent = false) => {
    if (!id) return;
    if (!silent) setIsLoading(true);
    try {
      const [repoRes, scansRes] = await Promise.all([
        repoAPI.getOne(parseInt(id)),
        scanAPI.getByRepo(parseInt(id)),
      ]);
      setRepo(repoRes.data.repository);
      const fetchedScans = scansRes.data.scans;
      setScans(fetchedScans);
      if (!selectedScanId && fetchedScans.length > 0) {
        setSelectedScanId(fetchedScans[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasRunningScan) {
      if (!pollRef.current) {
        pollRef.current = setInterval(() => fetchData(true), 3000);
      }
    } else {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }
    return () => {
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    };
  }, [hasRunningScan]);

  useEffect(() => {
    fetchData();
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [id]);

  const handleScan = async () => {
    if (!id) return;
    setIsScanning(true);
    try {
      const res = await scanAPI.start(parseInt(id));
      const newScan = res.data.scan;
      setScans(prev => [newScan, ...prev]);
      setSelectedScanId(newScan.id);
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to start scan');
    } finally {
      setIsScanning(false);
    }
  };

  const selectedScan = scans.find(s => s.id === selectedScanId) || scans[0] || null;

  const getSeverityCounts = (scan: any) => {
    const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, INFO: 0 };
    (scan?.vulnerabilities || []).forEach((v: any) => {
      counts[v.severity as keyof typeof counts] = (counts[v.severity as keyof typeof counts] || 0) + 1;
    });
    return counts;
  };

  if (isLoading) {
    return (
      <div style={{ padding: 40, display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
        <div className="spinner" /><span style={{ color: 'var(--text-secondary)' }}>Loading security profiles...</span>
      </div>
    );
  }

  if (!repo) {
    return (
      <div style={{ padding: 40 }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>Repository details not found.</p>
        <Link to="/repositories" className="btn btn-secondary btn-sm">← Back</Link>
      </div>
    );
  }

  const selectedCounts = selectedScan ? getSeverityCounts(selectedScan) : null;
  const isSelectedRunning = selectedScan?.status === 'RUNNING' || selectedScan?.status === 'PENDING';

  return (
    <div className="page cyber-grid">
      <Link to="/repositories" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13, marginBottom: 20 }}>
        <ArrowLeft size={14} /> Back to Repositories
      </Link>

      {/* Header card */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <ScoreGauge score={repo.securityScore} />
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 4, color: '#fff' }}>{repo.repositoryName}</h1>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>{repo.fullName}</div>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} style={{ color: 'var(--accent)' }} />{repo.lastScanDate ? `Scanned ${new Date(repo.lastScanDate).toLocaleString()}` : 'No scan history'}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{scans.length} scan runs</span>
                {hasRunningScan && (
                  <span className="badge status-running" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <div className="spinner" style={{ width: 10, height: 10, borderWidth: 1.5 }} /> scanning...
                  </span>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href={repo.repositoryUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ExternalLink size={12} /> GitHub
            </a>
            <button className="btn btn-primary btn-sm" onClick={handleScan} disabled={isScanning || hasRunningScan} id="start-scan-btn">
              {isScanning || hasRunningScan
                ? <><Loader2 size={12} className="animate-spin" /> scanning...</>
                : <><Play size={12} /> Run Scan</>}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr)) 3fr', gap: 20 }}>
        {/* Scan History Panel */}
        <div className="card" style={{ padding: 16, alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={14} style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontWeight: 700, fontSize: 13, color: '#fff', fontFamily: 'var(--font-display)' }}>Historical Runs</h3>
          </div>
          {scans.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>No scan records. Trigger "Run Scan" to construct index.</p>
          ) : (
            scans.map((scan) => {
              const counts = getSeverityCounts(scan);
              const isActive = selectedScan?.id === scan.id;
              const isRunning = scan.status === 'RUNNING' || scan.status === 'PENDING';
              return (
                <div
                  key={scan.id}
                  onClick={() => setSelectedScanId(scan.id)}
                  style={{
                    padding: 12, borderRadius: 10, cursor: 'pointer',
                    background: isActive ? 'rgba(0, 255, 157, 0.06)' : 'var(--bg-secondary)',
                    border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border-subtle)'}`,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.borderColor = 'var(--border-default)';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{new Date(scan.scanDate).toLocaleDateString()}</span>
                    <span className={`badge ${
                      scan.status === 'COMPLETED' ? 'badge-success' :
                      scan.status === 'RUNNING' ? 'status-running' : 'badge-critical'
                    }`} style={{ fontSize: 9 }}>{scan.status}</span>
                  </div>
                  {isRunning ? (
                    <div style={{ fontSize: 11, color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Zap size={10} /> Operation active...
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {counts.CRITICAL > 0 && <span className="badge badge-critical" style={{ fontSize: 9, padding: '2px 5px' }}>{counts.CRITICAL}C</span>}
                      {counts.HIGH > 0 && <span className="badge badge-high" style={{ fontSize: 9, padding: '2px 5px' }}>{counts.HIGH}H</span>}
                      {counts.MEDIUM > 0 && <span className="badge badge-medium" style={{ fontSize: 9, padding: '2px 5px' }}>{counts.MEDIUM}M</span>}
                      {counts.LOW > 0 && <span className="badge badge-low" style={{ fontSize: 9, padding: '2px 5px' }}>{counts.LOW}L</span>}
                      {scan._count?.vulnerabilities === 0 && <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 700 }}>✓ SECURE</span>}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Findings Panel */}
        <div>
          {selectedScan ? (
            <div className="card" style={{ padding: 24 }}>
              {isSelectedRunning ? (
                <ScanningProgress />
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: 14, color: '#fff', fontFamily: 'var(--font-display)', marginBottom: 4 }}>
                        Findings Audit: {new Date(selectedScan.scanDate).toLocaleDateString()}
                      </h3>
                      <span className={`badge ${selectedScan.status === 'COMPLETED' ? 'badge-success' : 'badge-critical'}`}>{selectedScan.status}</span>
                    </div>
                    {selectedCounts && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {selectedCounts.CRITICAL > 0 && <span className="badge badge-critical">{selectedCounts.CRITICAL} Crit</span>}
                        {selectedCounts.HIGH > 0 && <span className="badge badge-high">{selectedCounts.HIGH} High</span>}
                        {selectedCounts.MEDIUM > 0 && <span className="badge badge-medium">{selectedCounts.MEDIUM} Med</span>}
                        {selectedCounts.LOW > 0 && <span className="badge badge-low">{selectedCounts.LOW} Low</span>}
                      </div>
                    )}
                  </div>

                  {selectedScan.vulnerabilities?.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <Shield size={40} style={{ margin: '0 auto 12px', color: 'var(--accent)' }} />
                      <p style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 14 }}>Zero vulnerabilities found</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>Codebase complies with all scanner safety thresholds.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {selectedScan.vulnerabilities?.map((v: any) => (
                        <div
                          key={v.id}
                          onClick={() => navigate(`/vulnerabilities/${v.id}`)}
                          id={`vuln-item-${v.id}`}
                          style={{
                            padding: 14, borderRadius: 10, cursor: 'pointer',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-subtle)',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'rgba(0, 255, 157, 0.2)';
                            e.currentTarget.style.background = 'var(--bg-card-hover)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'var(--border-subtle)';
                            e.currentTarget.style.background = 'var(--bg-secondary)';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span className={`badge badge-${v.severity.toLowerCase()}`} style={{ flexShrink: 0 }}>{v.severity}</span>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                              <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 2 }}>{v.title}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', gap: 12, flexWrap: 'wrap', fontFamily: 'var(--font-mono)' }}>
                                {v.filePath && <span>📄 {v.filePath}{v.lineNumber ? `:${v.lineNumber}` : ''}</span>}
                                <span style={{ color: 'var(--text-muted)' }}>scanner: {v.scannerSource}</span>
                              </div>
                            </div>
                            <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, whiteSpace: 'nowrap' }}>Inspect →</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="card" style={{ padding: 60, textAlign: 'center' }}>
              <AlertTriangle size={40} style={{ margin: '0 auto 12px', color: 'var(--text-muted)', display: 'block' }} />
              <p style={{ color: 'var(--text-secondary)' }}>Click "Run Scan" to extract repository metrics.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
