const express = require('express');
const router = express.Router();
const { getVulnerabilities, getVulnerability, getExplanation, getRemediation } = require('../controllers/vuln.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);
router.get('/', getVulnerabilities);
router.get('/:id', getVulnerability);
router.get('/:id/explain', getExplanation);
router.get('/:id/remediate', getRemediation);

module.exports = router;
