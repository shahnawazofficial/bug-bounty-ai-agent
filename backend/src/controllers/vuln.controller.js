const prisma = require('../lib/prisma');
const { explainVulnerability, remediateVulnerability } = require('../services/gemini.service');

// Get all vulnerabilities for a user across all scans
const getVulnerabilities = async (req, res) => {
  try {
    const { severity, scanner, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      scan: {
        repository: { userId: req.user.userId },
      },
      ...(severity && { severity }),
      ...(scanner && { scannerSource: scanner }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { filePath: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [vulnerabilities, total] = await Promise.all([
      prisma.vulnerability.findMany({
        where,
        include: {
          scan: {
            select: {
              scanDate: true,
              repository: { select: { repositoryName: true, fullName: true } },
            },
          },
        },
        orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: parseInt(limit),
      }),
      prisma.vulnerability.count({ where }),
    ]);

    res.json({ vulnerabilities, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single vulnerability details
const getVulnerability = async (req, res) => {
  try {
    const vuln = await prisma.vulnerability.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        scan: {
          select: {
            scanDate: true,
            repository: {
              select: { repositoryName: true, fullName: true, userId: true },
            },
          },
        },
      },
    });

    if (!vuln) return res.status(404).json({ error: 'Vulnerability not found' });
    if (vuln.scan.repository.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json({ vulnerability: vuln });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /vulnerabilities/:id/explain — Gemini AI explanation
const getExplanation = async (req, res) => {
  try {
    const vuln = await prisma.vulnerability.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        scan: { select: { repository: { select: { userId: true } } } },
      },
    });
    if (!vuln) return res.status(404).json({ error: 'Vulnerability not found' });
    if (vuln.scan.repository.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const explanation = await explainVulnerability(vuln);
    res.json({ explanation });
  } catch (error) {
    console.error('Gemini explain error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// GET /vulnerabilities/:id/remediate — Gemini AI remediation
const getRemediation = async (req, res) => {
  try {
    const vuln = await prisma.vulnerability.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        scan: { select: { repository: { select: { userId: true } } } },
      },
    });
    if (!vuln) return res.status(404).json({ error: 'Vulnerability not found' });
    if (vuln.scan.repository.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const remediation = await remediateVulnerability(vuln);
    res.json({ remediation });
  } catch (error) {
    console.error('Gemini remediate error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getVulnerabilities, getVulnerability, getExplanation, getRemediation };
