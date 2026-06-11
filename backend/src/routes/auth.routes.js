const express = require('express');
const router = express.Router();
const { githubLogin, githubCallback, getProfile } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/github', githubLogin);
router.get('/github/callback', githubCallback);
router.get('/profile', authenticate, getProfile);

module.exports = router;
