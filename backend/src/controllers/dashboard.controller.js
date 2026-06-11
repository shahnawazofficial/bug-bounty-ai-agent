const prisma = require('../lib/prisma');

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [
      totalRepos,
      totalScans,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      recentScans,
      recentVulns,
    ] = await Promise.all([
      prisma.repository.count({ where: { userId } }),
      prisma.scan.count({ where: { repository: { userId } } }),
      prisma.vulnerability.count({
        where: { severity: 'CRITICAL', scan: { repository: { userId } } },
      }),
      prisma.vulnerability.count({
        where: { severity: 'HIGH', scan: { repository: { userId } } },
      }),
      prisma.vulnerability.count({
        where: { severity: 'MEDIUM', scan: { repository: { userId } } },
      }),
      prisma.vulnerability.count({
        where: { severity: 'LOW', scan: { repository: { userId } } },
      }),
      prisma.scan.findMany({
        where: { repository: { userId } },
        include: {
          repository: { select: { repositoryName: true, fullName: true } },
          _count: { select: { vulnerabilities: true } },
          vulnerabilities: { select: { severity: true } },
        },
        orderBy: { scanDate: 'desc' },
        take: 5,
      }),
      prisma.vulnerability.findMany({
        where: {
          severity: { in: ['CRITICAL', 'HIGH'] },
          scan: { repository: { userId } },
        },
        include: {
          scan: {
            select: {
              repository: { select: { repositoryName: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    const topRepos = await prisma.repository.findMany({
      where: { userId },
      orderBy: { securityScore: 'asc' },
      take: 5,
      select: {
        id: true,
        repositoryName: true,
        securityScore: true,
        lastScanDate: true,
      },
    });

    res.json({
      stats: {
        totalRepos,
        totalScans,
        criticalCount,
        highCount,
        mediumCount,
        lowCount,
        totalVulnerabilities: criticalCount + highCount + mediumCount + lowCount,
      },
      recentScans,
      recentVulns,
      topRepos,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDashboardStats };
