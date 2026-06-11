const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const prisma = require('../lib/prisma');

// Security scoring weights
const SEVERITY_WEIGHTS = {
  CRITICAL: 20,
  HIGH: 10,
  MEDIUM: 5,
  LOW: 2,
  INFO: 0,
};

/**
 * Main scanner orchestrator
 */
async function runSecurityScan(scanId, repo, accessToken) {
  const tmpDir = path.join(os.tmpdir(), `scan_${scanId}_${Date.now()}`);

  try {
    console.log(`\n🔍 Starting scan ${scanId} for ${repo.fullName}`);

    // Update scan status to RUNNING
    await prisma.scan.update({
      where: { id: scanId },
      data: { status: 'RUNNING' },
    });

    // Clone repository
    await cloneRepository(repo.fullName, accessToken, tmpDir);
    console.log(`✅ Cloned ${repo.fullName}`);

    const allFindings = [];

    // Run all scanners
    try {
      const semgrepFindings = await runSemgrep(tmpDir);
      allFindings.push(...semgrepFindings);
      console.log(`✅ Semgrep: ${semgrepFindings.length} findings`);
    } catch (e) {
      console.warn('⚠️  Semgrep not available, using pattern scanner:', e.message);
      const patternFindings = await runPatternScanner(tmpDir);
      allFindings.push(...patternFindings);
    }

    try {
      const gitleaksFindings = await runGitleaks(tmpDir);
      allFindings.push(...gitleaksFindings);
      console.log(`✅ Gitleaks: ${gitleaksFindings.length} findings`);
    } catch (e) {
      console.warn('⚠️  Gitleaks not available, skipping secret scan:', e.message);
    }

    try {
      const trivyFindings = await runTrivy(tmpDir);
      allFindings.push(...trivyFindings);
      console.log(`✅ Trivy: ${trivyFindings.length} findings`);
    } catch (e) {
      console.warn('⚠️  Trivy not available, skipping dependency scan:', e.message);
    }

    // Store vulnerabilities
    if (allFindings.length > 0) {
      await prisma.vulnerability.createMany({
        data: allFindings.map((f) => ({ ...f, scanId })),
      });
    }

    // Calculate security score
    const score = calculateSecurityScore(allFindings);

    // Update scan and repo
    await Promise.all([
      prisma.scan.update({
        where: { id: scanId },
        data: { status: 'COMPLETED' },
      }),
      prisma.repository.update({
        where: { id: repo.id },
        data: { securityScore: score, lastScanDate: new Date() },
      }),
    ]);

    console.log(`✅ Scan ${scanId} completed. Score: ${score}, Findings: ${allFindings.length}`);
  } catch (error) {
    console.error(`❌ Scan ${scanId} failed:`, error.message);
    await prisma.scan.update({
      where: { id: scanId },
      data: { status: 'FAILED' },
    });
  } finally {
    // Cleanup temp dir
    try {
      if (fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    } catch (e) {
      console.warn('Cleanup warning:', e.message);
    }
  }
}

/**
 * Clone GitHub repository
 */
function cloneRepository(fullName, accessToken, targetDir) {
  return new Promise((resolve, reject) => {
    try {
      const cloneUrl = `https://${accessToken}@github.com/${fullName}.git`;
      execSync(`git clone --depth 1 "${cloneUrl}" "${targetDir}"`, {
        timeout: 120000,
        stdio: 'pipe',
      });
      resolve();
    } catch (error) {
      reject(new Error(`Clone failed: ${error.message}`));
    }
  });
}

/**
 * Run Semgrep scanner
 */
function runSemgrep(dir) {
  return new Promise((resolve, reject) => {
    try {
      const output = execSync(
        `semgrep --config=auto --json --quiet "${dir}"`,
        { timeout: 120000, stdio: 'pipe', maxBuffer: 10 * 1024 * 1024 }
      );
      const results = JSON.parse(output.toString());
      const findings = (results.results || []).map((r) => ({
        title: r.check_id || 'Security Issue',
        severity: mapSemgrepSeverity(r.extra?.severity),
        description: r.extra?.message || 'Security vulnerability detected',
        filePath: r.path?.replace(dir, '').replace(/^[/\\]/, '') || null,
        lineNumber: r.start?.line || null,
        scannerSource: 'Semgrep',
        ruleId: r.check_id || null,
        remediation: r.extra?.fix || generateRemediation(r.extra?.severity, 'Semgrep'),
      }));
      resolve(findings);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Run Gitleaks for secret detection
 */
function runGitleaks(dir) {
  return new Promise((resolve, reject) => {
    try {
      const reportPath = path.join(os.tmpdir(), `gitleaks_${Date.now()}.json`);
      try {
        execSync(
          `gitleaks detect --source "${dir}" --report-format json --report-path "${reportPath}" --no-git`,
          { timeout: 60000, stdio: 'pipe' }
        );
      } catch (e) {
        // Gitleaks exits with code 1 when leaks found
      }

      if (!fs.existsSync(reportPath)) {
        resolve([]);
        return;
      }

      const content = fs.readFileSync(reportPath, 'utf8');
      const leaks = JSON.parse(content) || [];
      fs.unlinkSync(reportPath);

      const findings = leaks.map((leak) => ({
        title: `Secret Detected: ${leak.RuleID || 'Unknown Secret'}`,
        severity: 'CRITICAL',
        description: `A secret was found in ${leak.File}. Rule: ${leak.RuleID}. Match: ${leak.Match?.slice(0, 50)}...`,
        filePath: leak.File?.replace(dir, '').replace(/^[/\\]/, '') || null,
        lineNumber: leak.StartLine || null,
        scannerSource: 'Gitleaks',
        ruleId: leak.RuleID || null,
        remediation: 'Immediately revoke this secret and rotate credentials. Remove from git history using BFG Repo Cleaner or git-filter-repo.',
      }));

      resolve(findings);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Run Trivy for dependency vulnerabilities
 */
function runTrivy(dir) {
  return new Promise((resolve, reject) => {
    try {
      const output = execSync(
        `trivy fs --format json --quiet "${dir}"`,
        { timeout: 120000, stdio: 'pipe', maxBuffer: 10 * 1024 * 1024 }
      );
      const results = JSON.parse(output.toString());
      const findings = [];

      for (const result of results.Results || []) {
        for (const vuln of result.Vulnerabilities || []) {
          findings.push({
            title: `${vuln.VulnerabilityID}: ${vuln.Title || vuln.PkgName}`,
            severity: mapTrivySeverity(vuln.Severity),
            description: vuln.Description || `Vulnerability in package ${vuln.PkgName} v${vuln.InstalledVersion}`,
            filePath: result.Target || null,
            lineNumber: null,
            scannerSource: 'Trivy',
            ruleId: vuln.VulnerabilityID || null,
            remediation: vuln.FixedVersion
              ? `Update ${vuln.PkgName} to version ${vuln.FixedVersion} or later.`
              : `No fix available yet. Monitor ${vuln.VulnerabilityID} for updates.`,
          });
        }
      }

      resolve(findings);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Fallback pattern-based scanner (when Semgrep not installed)
 * Scans for common security anti-patterns in code
 */
async function runPatternScanner(dir) {
  const findings = [];
  const patterns = [
    {
      regex: /eval\s*\(/g,
      title: 'Dangerous eval() Usage',
      severity: 'HIGH',
      description: 'eval() can execute arbitrary code and create XSS vulnerabilities.',
      remediation: 'Avoid using eval(). Use JSON.parse() for JSON data, or Function() with strict input validation.',
      scannerSource: 'PatternScanner',
    },
    {
      regex: /exec\s*\(\s*[`'"]/g,
      title: 'Command Injection Risk',
      severity: 'CRITICAL',
      description: 'Direct command execution with string concatenation can lead to command injection.',
      remediation: 'Use parameterized commands. Never concatenate user input into shell commands. Use execFile() with argument arrays.',
      scannerSource: 'PatternScanner',
    },
    {
      regex: /password\s*=\s*['"][^'"]{3,}/gi,
      title: 'Hardcoded Password',
      severity: 'CRITICAL',
      description: 'Hardcoded credentials found in source code.',
      remediation: 'Move credentials to environment variables (.env file). Never commit passwords to version control.',
      scannerSource: 'PatternScanner',
    },
    {
      regex: /api_key\s*=\s*['"][A-Za-z0-9]{10,}/gi,
      title: 'Hardcoded API Key',
      severity: 'CRITICAL',
      description: 'Hardcoded API key found in source code.',
      remediation: 'Store API keys in environment variables. Rotate exposed keys immediately.',
      scannerSource: 'PatternScanner',
    },
    {
      regex: /innerHTML\s*=\s*/g,
      title: 'Potential XSS via innerHTML',
      severity: 'HIGH',
      description: 'Setting innerHTML directly can lead to Cross-Site Scripting (XSS) attacks.',
      remediation: 'Use textContent or innerText for text, or DOMPurify to sanitize HTML before setting innerHTML.',
      scannerSource: 'PatternScanner',
    },
    {
      regex: /md5\s*\(/gi,
      title: 'Weak Hashing Algorithm (MD5)',
      severity: 'MEDIUM',
      description: 'MD5 is cryptographically broken and should not be used for passwords or sensitive data.',
      remediation: 'Use bcrypt, scrypt, or Argon2 for password hashing. Use SHA-256 or SHA-3 for checksums.',
      scannerSource: 'PatternScanner',
    },
    {
      regex: /verify\s*=\s*False/g,
      title: 'SSL Certificate Verification Disabled',
      severity: 'HIGH',
      description: 'Disabling SSL verification makes the application vulnerable to MITM attacks.',
      remediation: 'Enable SSL certificate verification. Use proper CA certificates.',
      scannerSource: 'PatternScanner',
    },
    {
      regex: /debug\s*=\s*true/gi,
      title: 'Debug Mode Enabled',
      severity: 'MEDIUM',
      description: 'Debug mode may expose sensitive information in production.',
      remediation: 'Disable debug mode in production. Use environment-based configuration.',
      scannerSource: 'PatternScanner',
    },
    {
      regex: /cors\s*\(\s*\{\s*origin\s*:\s*['"`]\*/g,
      title: 'Permissive CORS Policy',
      severity: 'MEDIUM',
      description: 'Wildcard CORS policy allows any origin to make cross-origin requests.',
      remediation: 'Restrict CORS to specific trusted origins instead of using wildcard *.',
      scannerSource: 'PatternScanner',
    },
    {
      regex: /SELECT\s+\*\s+FROM.*\+/gi,
      title: 'Potential SQL Injection',
      severity: 'CRITICAL',
      description: 'SQL query built with string concatenation may be vulnerable to SQL injection.',
      remediation: 'Use parameterized queries or prepared statements. Never concatenate user input into SQL queries.',
      scannerSource: 'PatternScanner',
    },
  ];

  const scanExtensions = ['.js', '.ts', '.py', '.java', '.php', '.rb', '.go', '.cs', '.jsx', '.tsx'];

  function scanDir(currentDir) {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'vendor') continue;

        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.isFile() && scanExtensions.includes(path.extname(entry.name))) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n');

            for (const pattern of patterns) {
              lines.forEach((line, idx) => {
                if (pattern.regex.test(line)) {
                  findings.push({
                    title: pattern.title,
                    severity: pattern.severity,
                    description: pattern.description,
                    filePath: fullPath.replace(dir, '').replace(/^[/\\]/, ''),
                    lineNumber: idx + 1,
                    scannerSource: pattern.scannerSource,
                    remediation: pattern.remediation,
                    ruleId: null,
                  });
                }
                pattern.regex.lastIndex = 0;
              });
            }
          } catch (e) {
            // Skip unreadable files
          }
        }
      }
    } catch (e) {
      // Skip inaccessible dirs
    }
  }

  scanDir(dir);
  return findings;
}

/**
 * Calculate security score from findings
 */
function calculateSecurityScore(findings) {
  let score = 100;
  for (const finding of findings) {
    score -= SEVERITY_WEIGHTS[finding.severity] || 0;
  }
  return Math.max(0, Math.min(100, score));
}

function mapSemgrepSeverity(sev) {
  const map = { ERROR: 'HIGH', WARNING: 'MEDIUM', INFO: 'LOW' };
  return map[sev?.toUpperCase()] || 'LOW';
}

function mapTrivySeverity(sev) {
  const map = { CRITICAL: 'CRITICAL', HIGH: 'HIGH', MEDIUM: 'MEDIUM', LOW: 'LOW' };
  return map[sev?.toUpperCase()] || 'INFO';
}

function generateRemediation(severity, scanner) {
  const remediations = {
    ERROR: 'Review and fix this critical security vulnerability immediately.',
    WARNING: 'Investigate and address this potential security issue.',
    INFO: 'Consider reviewing this code for potential security improvements.',
  };
  return remediations[severity] || 'Review this finding for potential security impact.';
}

module.exports = { runSecurityScan };
