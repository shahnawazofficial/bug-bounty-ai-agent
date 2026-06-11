const express = require('express');
const router = express.Router();
const { startScan, getScan, getRepoScans } = require('../controllers/scan.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);
router.post('/repos/:repoId/start', startScan);
router.get('/repos/:repoId', getRepoScans);
router.get('/:scanId', getScan);

module.exports = router;
