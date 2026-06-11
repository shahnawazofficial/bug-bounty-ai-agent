const express = require('express');
const router = express.Router();
const { getVulnerabilities, getVulnerability } = require('../controllers/vuln.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);
router.get('/', getVulnerabilities);
router.get('/:id', getVulnerability);

module.exports = router;
