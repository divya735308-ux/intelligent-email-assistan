const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/analyze', aiController.analyzeEmail);
router.post('/generate-reply', aiController.generateReply);
router.post('/scan-draft', aiController.scanDraft);

module.exports = router;
