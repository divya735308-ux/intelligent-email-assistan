const Email = require('../models/Email');
const {
  analyzeSecurity,
  analyzeImportance,
  generateEmailSummary,
  generateSmartReply
} = require('../utils/aiEngine');

/**
 * Run or refresh AI analysis on a specific email
 * POST /api/emails/:id/analyze or POST /api/ai/analyze
 */
exports.analyzeEmail = async (req, res, next) => {
  try {
    const { id } = req.params;
    let emailData = null;

    if (id && id !== 'custom') {
      const found = await Email.findById(id);
      if (!found) {
        return res.status(404).json({ success: false, message: 'Email not found' });
      }
      emailData = found;
    } else {
      emailData = req.body;
    }

    const security = analyzeSecurity(emailData);
    const summaryData = generateEmailSummary(emailData);
    const isImportant = analyzeImportance(emailData);

    const aiAnalysis = {
      summary: summaryData.summary,
      mainTopic: summaryData.mainTopic,
      keyPoints: summaryData.keyPoints,
      actionItems: summaryData.actionItems,
      deadlines: summaryData.deadlines,
      sentiment: summaryData.sentiment,
      isImportant,
      security: {
        category: security.category,
        riskLevel: security.riskLevel,
        score: security.score,
        reasons: security.reasons
      },
      analyzedAt: new Date().toISOString()
    };

    // If existing email, update its saved analysis
    if (id && id !== 'custom') {
      await Email.findByIdAndUpdate(id, {
        aiAnalysis: {
          summary: summaryData.summary,
          mainTopic: summaryData.mainTopic,
          keyPoints: summaryData.keyPoints,
          actionItems: summaryData.actionItems,
          deadlines: summaryData.deadlines,
          sentiment: summaryData.sentiment,
          analyzedAt: new Date()
        },
        spamCategory: security.category,
        spamRisk: security.riskLevel,
        spamScore: security.score,
        spamReason: security.reasons
      });
    }

    res.json({
      success: true,
      data: aiAnalysis
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate multi-tone AI smart reply for an email
 * POST /api/emails/:id/generate-reply
 */
exports.generateReply = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tone = 'Professional', instruction = '' } = req.body;

    let email = null;
    if (id && id !== 'custom') {
      email = await Email.findById(id);
      if (!email) {
        return res.status(404).json({ success: false, message: 'Email not found' });
      }
    } else {
      email = req.body.email || {
        senderName: req.body.senderName || 'Sender',
        subject: req.body.subject || 'Follow Up',
        content: req.body.content || ''
      };
    }

    const result = generateSmartReply(email, tone, instruction);

    res.json({
      success: true,
      data: {
        tone: result.tone,
        reply: result.reply,
        generatedAt: result.generatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Live Security Scan for draft emails before sending
 * POST /api/ai/scan-draft
 */
exports.scanDraft = async (req, res, next) => {
  try {
    const { subject, content, senderEmail, recipientEmail } = req.body;

    const security = analyzeSecurity({ subject, content, senderEmail });
    const summary = generateEmailSummary({ subject, content, senderName: 'Draft' });

    res.json({
      success: true,
      data: {
        security,
        summary
      }
    });
  } catch (error) {
    next(error);
  }
};
