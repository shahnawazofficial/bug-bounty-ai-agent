const express = require('express');
const router = express.Router();
const { syncRepositories, getRepositories, getRepository } = require('../controllers/repo.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);
router.post('/sync', syncRepositories);
router.get('/', getRepositories);
router.get('/:id', getRepository);

module.exports = router;
