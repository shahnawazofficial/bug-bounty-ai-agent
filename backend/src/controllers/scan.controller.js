const prisma = require('../lib/prisma');
const { runSecurityScan } = require('../services/scanner.service');

// Start a new scan
const startScan = async (req, res) => {
  try {
    const repo = await prisma.repository.findFirst({
      where: { id: parseInt(req.params.repoId), userId: req.user.userId },
      include: { user: { select: { accessToken: true } } },
    });

    if (!repo) return res.status(404).json({ error: 'Repository not found' });

    // Check if scan already running
    const runningScan = await prisma.scan.findFirst({
      where: { repositoryId: repo.id, status: 'RUNNING' },
    });
    if (runningScan) {
      return res.status(409).json({ error: 'A scan is already in progress for this repository' });
    }

    // Create scan record
    const scan = await prisma.scan.create({
      data: { repositoryId: repo.id, status: 'RUNNING' },
    });

    // Run scan asynchronously
    res.json({ scan, message: 'Scan started successfully' });

    // Fire and forget
    runSecurityScan(scan.id, repo, repo.user.accessToken).catch((err) => {
      console.error('Scan error:', err.message);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get scan status and results
const getScan = async (req, res) => {
  try {
    const scan = await prisma.scan.findFirst({
      where: { id: parseInt(req.params.scanId) },
      include: {
        repository: {
          select: { userId: true, repositoryName: true, fullName: true },
        },
        vulnerabilities: {
          orderBy: [
            { severity: 'asc' },
            { createdAt: 'desc' },
          ],
        },
        _count: { select: { vulnerabilities: true } },
      },
    });

    if (!scan) return res.status(404).json({ error: 'Scan not found' });
    if (scan.repository.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json({ scan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all scans for a repository
const getRepoScans = async (req, res) => {
  try {
    const repo = await prisma.repository.findFirst({
      where: { id: parseInt(req.params.repoId), userId: req.user.userId },
    });
    if (!repo) return res.status(404).json({ error: 'Repository not found' });

    const scans = await prisma.scan.findMany({
      where: { repositoryId: repo.id },
      include: {
        _count: { select: { vulnerabilities: true } },
        vulnerabilities: { select: { severity: true } },
      },
      orderBy: { scanDate: 'desc' },
    });

    res.json({ scans });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { startScan, getScan, getRepoScans };
