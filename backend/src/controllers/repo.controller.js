const axios = require('axios');
const prisma = require('../lib/prisma');

// Sync GitHub repos to DB for authenticated user
const syncRepositories = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user?.accessToken) {
      return res.status(401).json({ error: 'GitHub access token not found' });
    }

    // Fetch user's GitHub repos
    const reposResponse = await axios.get('https://api.github.com/user/repos', {
      headers: { Authorization: `token ${user.accessToken}` },
      params: { per_page: 100, sort: 'updated' },
    });

    const githubRepos = reposResponse.data;

    // Upsert all repos
    const upsertOps = githubRepos.map((repo) =>
      prisma.repository.upsert({
        where: {
          id: (async () => {
            const existing = await prisma.repository.findFirst({
              where: { userId: user.id, repositoryName: repo.name },
              select: { id: true },
            });
            return existing?.id ?? -1;
          })(),
        },
        update: {
          repositoryUrl: repo.html_url,
          fullName: repo.full_name,
        },
        create: {
          userId: user.id,
          repositoryName: repo.name,
          repositoryUrl: repo.html_url,
          fullName: repo.full_name,
        },
      })
    );

    // Simpler approach: bulk upsert via createMany with skipDuplicates
    await prisma.repository.createMany({
      data: githubRepos.map((repo) => ({
        userId: user.id,
        repositoryName: repo.name,
        repositoryUrl: repo.html_url,
        fullName: repo.full_name,
      })),
      skipDuplicates: true,
    });

    const repositories = await prisma.repository.findMany({
      where: { userId: user.id },
      include: {
        _count: { select: { scans: true } },
        scans: {
          orderBy: { scanDate: 'desc' },
          take: 1,
          select: { status: true, scanDate: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ repositories, total: repositories.length });
  } catch (error) {
    console.error('Sync repos error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get all user repositories from DB
const getRepositories = async (req, res) => {
  try {
    const { search } = req.query;
    const where = {
      userId: req.user.userId,
      ...(search && {
        repositoryName: { contains: search, mode: 'insensitive' },
      }),
    };

    const repositories = await prisma.repository.findMany({
      where,
      include: {
        _count: { select: { scans: true } },
        scans: {
          orderBy: { scanDate: 'desc' },
          take: 1,
          select: { status: true, scanDate: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ repositories, total: repositories.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single repository with full scan history
const getRepository = async (req, res) => {
  try {
    const repo = await prisma.repository.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.userId },
      include: {
        scans: {
          orderBy: { scanDate: 'desc' },
          include: {
            _count: { select: { vulnerabilities: true } },
            vulnerabilities: {
              select: { severity: true },
            },
          },
        },
      },
    });

    if (!repo) return res.status(404).json({ error: 'Repository not found' });
    res.json({ repository: repo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { syncRepositories, getRepositories, getRepository };
