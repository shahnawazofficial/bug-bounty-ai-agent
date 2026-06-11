import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { repoAPI, scanAPI } from '../services/api';
import { ArrowLeft, Play, Shield, AlertTriangle, Clock, ExternalLink, Loader2, CheckCircle2, XCircle, Zap } from 'lucide-react';

function getScoreColor(score: number) {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#eab308';
  if (score >= 40) return '#f97316';
  return '#ef4444';
}

function ScoreGauge({ score }: { score: number }) {
  const r = 50, circ = 2 * Math.PI * r;
  const color = getScoreColor(score);
  const label = score >= 80 ? 'Secure' : score >= 60 ? 'Fair' : score >= 40 ? 'At Risk' : 'Critical';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={120} height={120} viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={60} cy={60} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
        <circle cx={60} cy={60} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={circ} strokeDashoffset={circ - (score / 100) * circ}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <text x={60} y={60} textAnchor="middle" dominantBaseline="central" fill={color}
          fontSize={22} fontWeight={800}
          style={{ transform: 'rotate(90deg)', transformOrigin: '60px 60px', fontFamily: 'Space Grotesk, sans-serif' }}>
          {score}
        </text>
      </svg>
      <span style={{ fontSize: 13, color, fontWeight: 600 }}>{label}</span>
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
    <div style={{ padding: '24px 20px' }}>
      {/* Animated scanner header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ position: 'relative', width: 40, height: 40 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid rgba(59,130,246,0.2)', borderTopColor: '#3b82f6', animation: 'spin 1s linear infinite' }} />
          <div style={{ position: 'absolute', inset: 6, borderRadius: '50%', border: '2px solid rgba(0,212,255,0.2)', borderTopColor: '#00d4ff', animation: 'spin 0.6s linear infinite reverse' }} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Security Scan Running{dots}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Auto-refreshing every 3 seconds</div>
        </div>
      </div>

      {/* Progress steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SCAN_STEPS.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              background: i < step ? 'rgba(16,185,129,0.15)' : i === step ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
              border: `2px solid ${i < step ? '#10b981' : i === step ? '#3b82f6' : 'rgba(255,255,255,0.08)'}`,
              transition: 'all 0.4s ease',
            }}>
              {i < step
                ? <CheckCircle2 size={12} color="#10b981" />
                : i === step
                  ? <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', animation: 'progress-pulse 1s ease-in-out infinite' }} />
                  : <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
              }
            </div>
            <span style={{
              fontSize: 13,
              color: i < step ? '#10b981' : i === step ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: i === step ? 600 : 400,
              transition: 'color 0.4s ease',
            }}>{s}{i === step ? dots : ''}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getScanStatusClass(status: string) {
  const map: Record<string, string> = { COMPLETED: 'status-completed', RUNNING: 'status-running', FAILED: 'status-failed', PENDING: 'status-pending' };
  return map[status] || 'status-pending';
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

  // Start/stop polling based on running scan
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
      <div style={{ padding: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="spinner" /><span style={{ color: 'var(--text-secondary)' }}>Loading repository...</span>
      </div>
    );
  }

  if (!repo) {
    return (
      <div style={{ padding: 40 }}>
        <p style={{ color: 'var(--text-secondary)' }}>Repository not found.</p>
        <Link to="/repositories" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>← Back</Link>
      </div>
    );
  }

  const selectedCounts = selectedScan ? getSeverityCounts(selectedScan) : null;
  const isSelectedRunning = selectedScan?.status === 'RUNNING' || selectedScan?.status === 'PENDING';

  return (
    <div style={{ padding: 32 }} className="animate-fadeIn">
      <Link to="/repositories" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, marginBottom: 24 }}>
        <ArrowLeft size={16} /> Back to Repositories
      </Link>

      {/* Header card */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <ScoreGauge score={repo.securityScore} />
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>{repo.repositoryName}</h1>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>{repo.fullName}</div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} />{repo.lastScanDate ? `Last scanned ${new Date(repo.lastScanDate).toLocaleString()}` : 'Never scanned'}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{scans.length} total scan{scans.length !== 1 ? 's' : ''}</span>
                {hasRunningScan && (
                  <span className="badge status-running" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div className="spinner" style={{ width: 10, height: 10, borderWidth: 1.5 }} /> Scanning…
                  </span>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href={repo.repositoryUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ textDecoration: 'none', fontSize: 13, padding: '8px 14px' }}>
              <ExternalLink size={14} /> GitHub
            </a>
            <button className="btn-primary" onClick={handleScan} disabled={isScanning || hasRunningScan} id="start-scan-btn" style={{ fontSize: 13, padding: '8px 16px' }}>
              {isScanning || hasRunningScan
                ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Scanning…</>
                : <><Play size={14} /> Run Scan</>}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
        {/* Scan History Panel */}
        <div className="card" style={{ padding: 16, alignSelf: 'start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Clock size={16} color="var(--accent-blue)" />
            <h3 style={{ fontWeight: 600, fontSize: 14 }}>Scan History</h3>
          </div>
          {scans.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No scans yet. Click "Run Scan" to start.</p>
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
                    padding: 12, borderRadius: 8, cursor: 'pointer', marginBottom: 8,
                    background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(59,130,246,0.3)' : 'transparent'}`,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(scan.scanDate).toLocaleDateString()}</span>
                    <span className={`badge ${getScanStatusClass(scan.status)}`} style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                      {isRunning && <div className="spinner" style={{ width: 8, height: 8, borderWidth: 1.5 }} />}
                      {scan.status}
                    </span>
                  </div>
                  {isRunning ? (
                    <div style={{ fontSize: 11, color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Zap size={10} /> Scanning in progress…
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {counts.CRITICAL > 0 && <span className="badge badge-critical" style={{ fontSize: 10 }}>{counts.CRITICAL}C</span>}
                      {counts.HIGH > 0 && <span className="badge badge-high" style={{ fontSize: 10 }}>{counts.HIGH}H</span>}
                      {counts.MEDIUM > 0 && <span className="badge badge-medium" style={{ fontSize: 10 }}>{counts.MEDIUM}M</span>}
                      {counts.LOW > 0 && <span className="badge badge-low" style={{ fontSize: 10 }}>{counts.LOW}L</span>}
                      {scan._count?.vulnerabilities === 0 && <span style={{ fontSize: 11, color: '#10b981' }}>✅ Clean</span>}
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
                      <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>
                        Scan from {new Date(selectedScan.scanDate).toLocaleString()}
                      </h3>
                      <span className={`badge ${getScanStatusClass(selectedScan.status)}`}>{selectedScan.status}</span>
                    </div>
                    {selectedCounts && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {selectedCounts.CRITICAL > 0 && <span className="badge badge-critical">{selectedCounts.CRITICAL} Critical</span>}
                        {selectedCounts.HIGH > 0 && <span className="badge badge-high">{selectedCounts.HIGH} High</span>}
                        {selectedCounts.MEDIUM > 0 && <span className="badge badge-medium">{selectedCounts.MEDIUM} Medium</span>}
                        {selectedCounts.LOW > 0 && <span className="badge badge-low">{selectedCounts.LOW} Low</span>}
                      </div>
                    )}
                  </div>

                  {selectedScan.vulnerabilities?.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <Shield size={40} style={{ margin: '0 auto 12px', color: '#10b981' }} />
                      <p style={{ color: '#10b981', fontWeight: 600 }}>No vulnerabilities found!</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>This repository is clean.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {selectedScan.vulnerabilities?.map((v: any) => (
                        <div
                          key={v.id}
                          onClick={() => navigate(`/vulnerabilities/${v.id}`)}
                          id={`vuln-item-${v.id}`}
                          style={{
                            padding: 14, borderRadius: 8, cursor: 'pointer',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid var(--border)',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-glow)';
                            (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.04)';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                            <span className={`badge badge-${v.severity.toLowerCase()}`} style={{ flexShrink: 0, marginTop: 1 }}>{v.severity}</span>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', marginBottom: 4 }}>{v.title}</div>
                              <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                {v.filePath && <span>📄 {v.filePath}{v.lineNumber ? `:${v.lineNumber}` : ''}</span>}
                                <span>🔍 {v.scannerSource}</span>
                              </div>
                            </div>
                            <span style={{ fontSize: 11, color: 'var(--accent-blue)', whiteSpace: 'nowrap', marginTop: 2 }}>View →</span>
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
              <AlertTriangle size={40} style={{ margin: '0 auto 12px', color: 'var(--text-muted)' }} />
              <p style={{ color: 'var(--text-muted)' }}>Run a scan to see findings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
