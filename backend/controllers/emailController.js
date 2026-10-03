const Email = require('../models/Email');
const { analyzeSecurity, analyzeImportance, generateEmailSummary } = require('../utils/aiEngine');

/**
 * Get all emails with optional folder / status filtering
 */
exports.getAllEmails = async (req, res, next) => {
  try {
    const { folder, isRead, isImportant, isSpam, spamCategory } = req.query;
    const filter = { isDeleted: false };

    if (folder) {
      if (folder === 'important') {
        filter.isImportant = true;
        filter.isArchived = false;
      } else if (folder === 'spam') {
        filter.folder = 'spam';
      } else if (folder === 'inbox') {
        filter.folder = 'inbox';
        filter.isArchived = false;
      } else if (folder === 'archive') {
        filter.isArchived = true;
      } else if (folder === 'all') {
        // no folder filter
      } else {
        filter.folder = folder;
      }
    }

    if (isRead !== undefined) filter.isRead = isRead === 'true';
    if (isImportant !== undefined) filter.isImportant = isImportant === 'true';
    if (isSpam !== undefined) filter.isSpam = isSpam === 'true';
    if (spamCategory) filter.spamCategory = spamCategory.toUpperCase();

    const emails = await Email.find(filter);
    res.json({
      success: true,
      count: emails.length,
      data: emails
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single email by ID
 */
exports.getEmailById = async (req, res, next) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({
        success: false,
        message: `Email not found with ID ${req.params.id}`
      });
    }

    // Auto-mark as read when opened if not already read
    if (!email.isRead) {
      await Email.findByIdAndUpdate(req.params.id, { isRead: true });
      email.isRead = true;
    }

    res.json({
      success: true,
      data: email
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create / Compose a new email with automated AI analysis
 */
exports.createEmail = async (req, res, next) => {
  try {
    const { senderName, senderEmail, recipientEmail, subject, content, folder = 'inbox' } = req.body;

    if (!senderName || !senderEmail || !subject || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide senderName, senderEmail, subject, and content'
      });
    }

    // Run AI analysis
    const security = analyzeSecurity({ subject, content, senderEmail });
    const summary = generateEmailSummary({ senderName, subject, content });
    const isImportant = analyzeImportance({ subject, content, senderEmail });

    const newEmail = await Email.create({
      senderName,
      senderEmail,
      recipientEmail: recipientEmail || 'user@example.com',
      subject,
      content,
      date: new Date(),
      isRead: false,
      isImportant,
      isSpam: security.category === 'SPAM' || security.category === 'PHISHING' || security.category === 'SUSPICIOUS',
      spamCategory: security.category,
      spamRisk: security.riskLevel,
      spamScore: security.score,
      spamReason: security.reasons,
      folder: security.category === 'SPAM' || security.category === 'PHISHING' ? 'spam' : folder,
      tags: ['Custom', security.category],
      aiAnalysis: {
        summary: summary.summary,
        mainTopic: summary.mainTopic,
        keyPoints: summary.keyPoints,
        actionItems: summary.actionItems,
        deadlines: summary.deadlines,
        sentiment: summary.sentiment,
        analyzedAt: new Date()
      }
    });

    res.status(201).json({
      success: true,
      message: 'Email created successfully',
      data: newEmail
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update email (read, important/star, archive, spam, folder)
 */
exports.updateEmail = async (req, res, next) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({
        success: false,
        message: `Email not found with ID ${req.params.id}`
      });
    }

    const updated = await Email.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json({
      success: true,
      message: 'Email updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete email (or soft delete)
 */
exports.deleteEmail = async (req, res, next) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({
        success: false,
        message: `Email not found with ID ${req.params.id}`
      });
    }

    // Permanently remove or mark deleted
    const deleted = await Email.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Email deleted successfully',
      data: deleted
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search emails by keyword
 */
exports.searchEmails = async (req, res, next) => {
  try {
    const { q } = req.query;
    const results = await Email.search(q || '');

    res.json({
      success: true,
      query: q || '',
      count: results.length,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get dashboard statistics
 */
exports.getStats = async (req, res, next) => {
  try {
    const stats = await Email.getMetrics();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset Demo Data to initial 14 sample emails
 */
exports.resetDemoData = async (req, res, next) => {
  try {
    const seed = await Email.seedData();
    res.json({
      success: true,
      message: `Reset complete. Loaded ${seed.length} realistic sample emails with AI analysis.`,
      count: seed.length
    });
  } catch (error) {
    next(error);
  }
};
