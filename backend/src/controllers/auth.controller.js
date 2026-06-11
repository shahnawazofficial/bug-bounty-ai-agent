const axios = require('axios');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

// Step 1: Redirect to GitHub OAuth
const githubLogin = (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.GITHUB_CALLBACK_URL,
    scope: 'user:email,repo,read:org',
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
};

// Step 2: Handle GitHub OAuth Callback
const githubCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_code`);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: 'application/json' } }
    );

    const { access_token } = tokenResponse.data;
    if (!access_token) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=token_failed`);
    }

    // Fetch GitHub user profile
    const [userResponse, emailsResponse] = await Promise.all([
      axios.get('https://api.github.com/user', {
        headers: { Authorization: `token ${access_token}` },
      }),
      axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `token ${access_token}` },
      }),
    ]);

    const githubUser = userResponse.data;
    const primaryEmail = emailsResponse.data.find((e) => e.primary)?.email || null;

    // Upsert user in DB
    const user = await prisma.user.upsert({
      where: { githubId: String(githubUser.id) },
      update: {
        username: githubUser.login,
        email: primaryEmail,
        avatarUrl: githubUser.avatar_url,
        accessToken: access_token,
      },
      create: {
        githubId: String(githubUser.id),
        username: githubUser.login,
        email: primaryEmail,
        avatarUrl: githubUser.avatar_url,
        accessToken: access_token,
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username, githubId: user.githubId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error('=== GitHub OAuth Error ===');
    console.error('Message:', error.message);
    console.error('Status:', error?.response?.status);
    console.error('Response data:', JSON.stringify(error?.response?.data));
    console.error('Stack:', error.stack);
    const errorCode = error?.response?.data?.error || error?.code || 'oauth_failed';
    res.redirect(`${process.env.FRONTEND_URL}/login?error=${errorCode}`);
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        githubId: true,
        username: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
        _count: { select: { repositories: true } },
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { githubLogin, githubCallback, getProfile };
