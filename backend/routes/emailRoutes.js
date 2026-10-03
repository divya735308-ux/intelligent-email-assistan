const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const aiController = require('../controllers/aiController');

// Metrics & Special Operations
router.get('/stats', emailController.getStats);
router.get('/search', emailController.searchEmails);
router.post('/reset', emailController.resetDemoData);

// Core CRUD Operations
router.route('/')
  .get(emailController.getAllEmails)
  .post(emailController.createEmail);

router.route('/:id')
  .get(emailController.getEmailById)
  .put(emailController.updateEmail)
  .delete(emailController.deleteEmail);

// AI Sub-endpoints on Email Resource
router.post('/:id/analyze', aiController.analyzeEmail);
router.post('/:id/generate-reply', aiController.generateReply);

module.exports = router;
