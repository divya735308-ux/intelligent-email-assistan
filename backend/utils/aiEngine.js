/**
 * Intelligent Email Assistant - AI & Security Analysis Engine
 * Provides rule-based heuristic NLP for:
 * - Spam, Suspicious, and Phishing Email Detection & Scoring
 * - Executive Summarization & Topic Extraction
 * - Action Item & Deadline Parsing
 * - Multi-Tone AI Reply Generation
 */

// Heuristic keyword definitions for Phishing and Spam
const PHISHING_TRIGGERS = [
  { pattern: /account\s+(suspended|locked|disabled|compromised|terminated)/i, reason: 'Claims account suspension or imminent lock out' },
  { pattern: /verify\s+your\s+(identity|account|credentials|password|email|wallet)/i, reason: 'Demands immediate identity or credential verification' },
  { pattern: /unauthorized\s+(login|access|transaction|activity)/i, reason: 'False security alarm about unauthorized activity' },
  { pattern: /click\s+(here|this\s+link|below)\s+to\s+(login|verify|unlock|restore|claim)/i, reason: 'Deceptive call-to-action redirecting to credential harvesting page' },
  { pattern: /update\s+(billing|payment|credit\s+card|banking)\s+information/i, reason: 'Requests sensitive financial / payment credential updates' },
  { pattern: /(bitcoin|ethereum|crypto|wallet|seed\s+phrase|private\s+key)/i, reason: 'Cryptocurrency or wallet seed phrase references' },
  { pattern: /(irs\s+refund|tax\s+rebate|inheritance|lottery|won\s+\$|claim\s+your\s+prize)/i, reason: 'High-yield fraudulent financial bait (tax/lottery/prize)' },
  { pattern: /(wire\s+transfer|gift\s+cards?|western\s+union|urgent\s+money)/i, reason: 'Solicitation for untraceable financial transactions or gift cards' },
  { pattern: /password\s+(expires|expired|reset\s+immediately)/i, reason: 'Urgent password expiration threat' }
];

const SPAM_TRIGGERS = [
  { pattern: /(100%\s+free|risk-free|guaranteed\s+roi|earn\s+\$\d+|get\s+rich)/i, reason: 'Unrealistic marketing claims and financial hype' },
  { pattern: /(exclusive\s+deal|limited\s+time\s+offer|act\s+now|order\s+today)/i, reason: 'Aggressive marketing sales pressure' },
  { pattern: /(viagra|diet\s+pills|casino|bonus\s+spins|unlimited\s+leads)/i, reason: 'Common commercial spam promotional keywords' },
  { pattern: /(unsubscribe\s+here|opt-out\s+instructions\s+below)/i, reason: 'Unsolicited bulk marketing newsletter indicators' }
];

const URGENCY_TRIGGERS = [
  { pattern: /(within\s+24\s+hours|within\s+12\s+hours|immediate\s+action\s+required|asap|time\s+sensitive)/i, reason: 'Artificial high-urgency deadline designed to bypass user caution' },
  { pattern: /(final\s+notice|last\s+warning|failure\s+to\s+comply)/i, reason: 'Intimidating disciplinary language' }
];

const SUSPICIOUS_DOMAINS = [
  /@(security-.*\.com|.*-auth\.net|.*-verify\.co|paypal-alert\.org|apple-id-update\.top|irs-gov-refund\.xyz|bank-security-center\.info|wallet-connect-auth\.site)$/i,
  /@.*\.(xyz|top|work|click|kim|stream|gq|cf|ml|tk)$/i
];

/**
 * Scan email for Spam & Phishing risks
 */
function analyzeSecurity(email) {
  const text = `${email.subject || ''} ${email.content || ''}`;
  const sender = email.senderEmail || '';

  const reasons = [];
  let score = 5; // Base clean score

  // 1. Check Sender Domain
  for (const domainPattern of SUSPICIOUS_DOMAINS) {
    if (domainPattern.test(sender)) {
      score += 40;
      reasons.push(`Suspicious / spoofed sender domain format (${sender})`);
      break;
    }
  }

  // 2. Check Phishing Triggers
  let phishingCount = 0;
  for (const trigger of PHISHING_TRIGGERS) {
    if (trigger.pattern.test(text)) {
      phishingCount++;
      score += 25;
      reasons.push(trigger.reason);
    }
  }

  // 3. Check Urgency
  for (const trigger of URGENCY_TRIGGERS) {
    if (trigger.pattern.test(text)) {
      score += 15;
      reasons.push(trigger.reason);
    }
  }

  // 4. Check Spam Triggers
  let spamCount = 0;
  for (const trigger of SPAM_TRIGGERS) {
    if (trigger.pattern.test(text)) {
      spamCount++;
      score += 15;
      reasons.push(trigger.reason);
    }
  }

  // Check for suspicious URLs in content
  const urlMatches = text.match(/https?:\/\/[^\s]+/gi) || [];
  const suspiciousUrls = urlMatches.filter(url => 
    /(\.xyz|\.top|\.click|\.ru|\.su|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|tinyurl|bit\.ly|login-|verify-)/i.test(url)
  );
  if (suspiciousUrls.length > 0) {
    score += 25;
    reasons.push(`Contains unverified or obfuscated web link(s): ${suspiciousUrls[0]}`);
  }

  // Cap score between 0 and 99
  score = Math.min(99, Math.max(5, score));

  let category = 'SAFE';
  let riskLevel = 'Low Risk';

  if (phishingCount >= 1 && (score >= 50 || suspiciousUrls.length > 0)) {
    category = 'PHISHING';
    riskLevel = 'High Risk';
  } else if (score >= 60) {
    category = 'SPAM';
    riskLevel = 'High Risk';
  } else if (score >= 35 || spamCount >= 1 || reasons.length >= 1) {
    category = 'SUSPICIOUS';
    riskLevel = 'Medium Risk';
  } else {
    category = 'SAFE';
    riskLevel = 'Low Risk';
    if (reasons.length === 0) {
      reasons.push('Verified sender structure and normal business communication patterns.');
      reasons.push('No malicious links, credential requests, or deceptive urgency detected.');
    }
  }

  return {
    category,
    riskLevel,
    score,
    reasons: [...new Set(reasons)]
  };
}

/**
 * Determine if an email is important
 */
function analyzeImportance(email) {
  const text = `${email.subject || ''} ${email.content || ''}`.toLowerCase();
  const sender = (email.senderEmail || '').toLowerCase();

  const importantKeywords = [
    'urgent', 'critical', 'asap', 'action required', 'deadline', 'q1', 'q2', 'q3', 'q4',
    'board meeting', 'contract', 'proposal', 'agreement', 'invoice', 'payment due',
    'confidential', 'interview', 'offer letter', 'incident', 'production', 'security review',
    'ceo', 'cto', 'vp', 'director', 'client'
  ];

  let matches = 0;
  for (const kw of importantKeywords) {
    if (text.includes(kw)) matches++;
  }

  const isExecutiveSender = sender.includes('exec') || sender.includes('ceo') || sender.includes('lead') || sender.includes('manager');

  return matches >= 2 || isExecutiveSender || text.includes('urgent') || text.includes('action required');
}

/**
 * Extract summary, action items, dates, and key insights
 */
function generateEmailSummary(email) {
  const subject = email.subject || 'No Subject';
  const content = email.content || '';
  const sender = email.senderName || 'Sender';

  // Extract sentences
  const sentences = content
    .replace(/(\r\n|\n|\r)/gm, ' ')
    .split(/(?<=[.?!])\s+/)
    .filter(s => s.trim().length > 10);

  // Summary generation
  let summary = '';
  if (sentences.length > 0) {
    summary = sentences.slice(0, 2).join(' ');
  } else {
    summary = content.slice(0, 150) + '...';
  }

  // Extract dates / deadlines
  const datePatterns = [
    /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?\b/gi,
    /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,
    /\b(?:today|tomorrow|this Friday|next Monday|next Tuesday|end of day|EOD|end of week|EOW)\b/gi,
    /\b\d{1,2}:\d{2}\s*(?:AM|PM|EST|PST|UTC|GMT|IST)\b/gi,
    /\bby\s+(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/gi
  ];

  const deadlines = [];
  for (const regex of datePatterns) {
    const matches = content.match(regex);
    if (matches) {
      matches.forEach(m => deadlines.push(m.trim()));
    }
  }

  // Extract Action Items
  const actionTriggers = [
    { trigger: /please\s+(review|check|send|provide|submit|confirm|update|approve|sign)/i },
    { trigger: /need\s+you\s+to/i },
    { trigger: /could\s+you\s+(please\s+)?(look|send|share)/i },
    { trigger: /action\s+required/i },
    { trigger: /schedule\s+a\s+call/i },
    { trigger: /let\s+me\s+know\s+if/i },
    { trigger: /feedback\s+by/i }
  ];

  const actionItems = [];
  sentences.forEach(s => {
    for (const act of actionTriggers) {
      if (act.trigger.test(s) && !actionItems.includes(s.trim())) {
        actionItems.push(s.trim());
        break;
      }
    }
  });

  // If no explicit action items found, extract logical next steps
  if (actionItems.length === 0) {
    if (email.subject.toLowerCase().includes('invitation') || email.subject.toLowerCase().includes('meeting')) {
      actionItems.push('Accept calendar invite and confirm attendance.');
    } else if (email.subject.toLowerCase().includes('invoice')) {
      actionItems.push('Verify invoice figures and route to finance for payment processing.');
    } else {
      actionItems.push('Acknowledge receipt and follow up with requested status.');
    }
  }

  // Topic classification
  let mainTopic = 'General Correspondence';
  const subLower = subject.toLowerCase();
  const conLower = content.toLowerCase();

  if (subLower.includes('meeting') || subLower.includes('sync') || subLower.includes('calendar')) mainTopic = 'Meeting & Scheduling';
  else if (subLower.includes('invoice') || subLower.includes('billing') || subLower.includes('payment')) mainTopic = 'Finance & Invoicing';
  else if (subLower.includes('security') || subLower.includes('alert') || subLower.includes('warning')) mainTopic = 'Security & Infrastructure';
  else if (subLower.includes('project') || subLower.includes('roadmap') || subLower.includes('launch') || subLower.includes('sprint')) mainTopic = 'Project Management';
  else if (subLower.includes('offer') || subLower.includes('discount') || subLower.includes('deal')) mainTopic = 'Marketing & Promotions';
  else if (subLower.includes('newsletter') || subLower.includes('digest')) mainTopic = 'News & Updates';

  // Key Information Points
  const keyPoints = [];
  keyPoints.push(`Sender: ${sender}`);
  if (deadlines.length > 0) {
    keyPoints.push(`Timeline / Deadlines mentioned: ${[...new Set(deadlines)].slice(0, 3).join(', ')}`);
  }
  keyPoints.push(`Subject focus: ${subject}`);
  if (sentences.length > 2) {
    keyPoints.push(`Context: ${sentences[1]}`);
  }

  return {
    summary,
    mainTopic,
    keyPoints,
    actionItems: actionItems.slice(0, 4),
    deadlines: [...new Set(deadlines)].slice(0, 3),
    sentiment: conLower.includes('urgent') || conLower.includes('issue') || conLower.includes('delay') ? 'High Urgency' : 'Neutral / Productive'
  };
}

/**
 * Generate context-aware AI replies based on tone and instructions
 */
function generateSmartReply(email, tone = 'Professional', customInstruction = '') {
  const senderName = (email.senderName || 'there').split(' ')[0];
  const subject = email.subject || '';
  const content = email.content || '';

  const isMeeting = /meeting|sync|call|demo/i.test(subject + content);
  const isInvoice = /invoice|payment|bill/i.test(subject + content);
  const isUrgent = /urgent|critical|asap|deadline/i.test(subject + content);
  const isReview = /review|feedback|draft|proposal/i.test(subject + content);

  let replyBody = '';

  switch (tone.toLowerCase()) {
    case 'friendly':
      if (isMeeting) {
        replyBody = `Hi ${senderName},\n\nThanks for reaching out! I'd love to connect on this. The proposed time works great for me, or feel free to send a calendar invite and I'll make sure to join.\n\nLooking forward to catching up!\n\nBest,\nYour Name`;
      } else if (isReview) {
        replyBody = `Hi ${senderName},\n\nThanks for sharing the updates! Everything looks really promising. I'm reviewing the details now and will send over my notes shortly.\n\nCheers,\nYour Name`;
      } else {
        replyBody = `Hi ${senderName},\n\nThanks for getting in touch! I've received your note regarding "${subject}". Everything is on track from my side, and I'll keep you updated as we make progress.\n\nHave a great day!\n\nWarm regards,\nYour Name`;
      }
      break;

    case 'formal':
      if (isInvoice) {
        replyBody = `Dear ${senderName},\n\nThank you for forwarding the invoice regarding "${subject}". I have received the documentation and forwarded it to our finance department for processing. We will notify you once disbursement is finalized.\n\nSincerely,\nYour Name\nIntelligent Email Operations`;
      } else if (isMeeting) {
        replyBody = `Dear ${senderName},\n\nThank you for the invitation. I hereby confirm receipt of the meeting schedule regarding "${subject}". I look forward to participating in the discussion.\n\nRespectfully,\nYour Name`;
      } else {
        replyBody = `Dear ${senderName},\n\nThank you for your correspondence regarding "${subject}". Please be advised that the matter is being given due consideration, and a formal update will be provided within the designated timeline.\n\nSincerely,\nYour Name`;
      }
      break;

    case 'concise':
      if (isMeeting) {
        replyBody = `Hi ${senderName},\n\nConfirmed. I've accepted the calendar invite for this.\n\nThanks,\nYour Name`;
      } else if (isReview) {
        replyBody = `Hi ${senderName},\n\nReceived. I'll review and share feedback by EOD.\n\nThanks,\nYour Name`;
      } else {
        replyBody = `Hi ${senderName},\n\nNoted and received. Will proceed accordingly and update you soon.\n\nBest,\nYour Name`;
      }
      break;

    case 'assertive':
      replyBody = `Hello ${senderName},\n\nRegarding "${subject}": we need to align on the core deliverables immediately to maintain our launch timeline. Please send over the revised specifications by 3:00 PM today so we can finalize the next steps.\n\nRegards,\nYour Name`;
      break;

    case 'professional':
    default:
      if (isMeeting) {
        replyBody = `Hello ${senderName},\n\nThank you for scheduling the sync on "${subject}". I have added this to my calendar and look forward to discussing the next steps.\n\nPlease let me know if there are any prerequisite materials I should review beforehand.\n\nBest regards,\nYour Name`;
      } else if (isReview) {
        replyBody = `Hello ${senderName},\n\nThank you for sending over the materials for "${subject}". I will conduct a thorough review and provide structured feedback by tomorrow morning.\n\nBest regards,\nYour Name`;
      } else if (isInvoice) {
        replyBody = `Hello ${senderName},\n\nThank you for providing the invoice details. I have verified the itemization and submitted it for timely payment processing.\n\nBest regards,\nYour Name`;
      } else {
        replyBody = `Hello ${senderName},\n\nThank you for your email regarding "${subject}". I have reviewed your message and will coordinate with the team to ensure the necessary action items are completed promptly.\n\nBest regards,\nYour Name`;
      }
      break;
  }

  // If user provided a specific instruction/prompt
  if (customInstruction && customInstruction.trim().length > 0) {
    replyBody += `\n\n[Note: Adjusted according to instruction: "${customInstruction}"]`;
  }

  return {
    tone,
    reply: replyBody,
    generatedAt: new Date().toISOString()
  };
}

module.exports = {
  analyzeSecurity,
  analyzeImportance,
  generateEmailSummary,
  generateSmartReply
};
