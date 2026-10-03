/**
 * Seed data with 14 realistic sample emails spanning all required security categories:
 * - Normal Emails (Safe)
 * - Important Work & Client Deliverables (Safe & High Importance)
 * - Suspicious Emails (Medium Risk)
 * - Phishing Attacks (Credential harvesting, Urgent wire transfers, Fake security alerts)
 * - Commercial Spam Emails (Lottery, Marketing deals, Casino promotions)
 */

const { analyzeSecurity, analyzeImportance, generateEmailSummary } = require('../utils/aiEngine');

const rawEmails = [
  // 1. Important Executive Project Email (SAFE, IMPORTANT)
  {
    _id: '65e1f001a1b2c3d4e5f60001',
    senderName: 'Elena Rostova',
    senderEmail: 'elena.rostova@acmecorp.com',
    recipientEmail: 'alex.turner@company.io',
    subject: 'Q3 Product Strategy & AI Integration Roadmap - Action Required',
    content: `Hi Alex,\n\nFollowing our executive leadership review yesterday, I have finalized the Q3 Strategic Roadmap for the AI Assistant integration.\n\nPlease review Section 4 regarding API throughput and latency benchmarks. We need your team's feedback by this Friday at 5:00 PM EST before the board presentation next Monday.\n\nCould you also coordinate with Marcus on the frontend deliverable schedule? We want to ensure all core user workflows are complete ahead of the September 15th staging deployment.\n\nThanks,\nElena Rostova\nVP of Product Engineering\nAcme Corp`,
    date: new Date(Date.now() - 1000 * 60 * 35), // 35 mins ago
    isRead: false,
    isImportant: true,
    isSpam: false,
    isArchived: false,
    isDeleted: false,
    folder: 'inbox',
    tags: ['Strategy', 'Roadmap', 'Executive']
  },

  // 2. High-Severity Phishing Attack (PHISHING, HIGH RISK)
  {
    _id: '65e1f001a1b2c3d4e5f60002',
    senderName: 'IT Security Desk',
    senderEmail: 'support@security-corporate-auth.net',
    recipientEmail: 'alex.turner@company.io',
    subject: 'CRITICAL ALERT: Your Microsoft 365 Password Expires in 24 Hours - Verify Immediately',
    content: `Urgent Security Notification,\n\nYour corporate Microsoft 365 account credentials will expire within 24 hours. Failure to verify your password will result in immediate account termination and loss of all mailbox data.\n\nUnauthorized login detected from IP 185.220.101.5 (Kyiv, Ukraine).\n\nClick here to verify your identity and restore access: http://login-verify-m365-auth.xyz/portal/verify?id=98321\n\nPlease enter your current username and password on the portal to confirm your credentials.\n\nCorporate Security Incident Response Team`,
    date: new Date(Date.now() - 1000 * 60 * 95), // 1.5 hours ago
    isRead: false,
    isImportant: false,
    isSpam: true,
    isArchived: false,
    isDeleted: false,
    folder: 'spam',
    tags: ['Security Warning', 'High Risk']
  },

  // 3. Normal Collaboration Email (SAFE)
  {
    _id: '65e1f001a1b2c3d4e5f60003',
    senderName: 'David Chen',
    senderEmail: 'david.chen@designstudio.co',
    recipientEmail: 'alex.turner@company.io',
    subject: 'Updated UI Design Tokens and Figma Prototype for Email Dashboard',
    content: `Hey Alex,\n\nI just published the updated Figma design components for the dark mode color palette and glassmorphism cards.\n\nYou can inspect the design tokens in the shared Figma workspace. I made sure contrast ratios meet WCAG AAA standards for readability.\n\nLet me know if you want to hop on a quick 10-minute sync tomorrow afternoon to review the interactive animations.\n\nBest,\nDavid Chen\nSenior UX Designer`,
    date: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    isRead: true,
    isImportant: false,
    isSpam: false,
    isArchived: false,
    isDeleted: false,
    folder: 'inbox',
    tags: ['Design', 'Figma', 'UI/UX']
  },

  // 4. Financial / Invoice Email (SAFE, IMPORTANT)
  {
    _id: '65e1f001a1b2c3d4e5f60004',
    senderName: 'Cloud Infrastructure Billing',
    senderEmail: 'billing@aws-enterprise.amazon.com',
    recipientEmail: 'alex.turner@company.io',
    subject: 'AWS Enterprise Invoice #INV-2026-8842 - Payment Due August 30',
    content: `Dear Customer,\n\nYour monthly cloud compute and database cluster invoice for August 2026 is now available.\n\nInvoice Number: INV-2026-8842\nTotal Amount: $2,480.50 USD\nPayment Due Date: August 30, 2026\nPayment Method: Autopay on file\n\nYou can review the detailed PDF breakdown and usage report in your AWS Billing Console.\n\nThank you for choosing Amazon Web Services.`,
    date: new Date(Date.now() - 1000 * 60 * 360), // 6 hours ago
    isRead: true,
    isImportant: true,
    isSpam: false,
    isArchived: false,
    isDeleted: false,
    folder: 'inbox',
    tags: ['Finance', 'Invoice', 'Cloud']
  },

  // 5. Crypto Phishing Attack (PHISHING, HIGH RISK)
  {
    _id: '65e1f001a1b2c3d4e5f60005',
    senderName: 'MetaMask Security Notification',
    senderEmail: 'alert@wallet-connect-auth.site',
    recipientEmail: 'alex.turner@company.io',
    subject: 'Action Required: Your Web3 Wallet KYC Verification is Incomplete',
    content: `Dear Web3 User,\n\nDue to updated anti-money laundering regulations, your crypto wallet has been temporarily restricted. You have 12 hours to verify your wallet seed phrase and identity.\n\nIf you do not complete verification immediately, your funds will be permanently frozen on the blockchain.\n\nVerify your seed phrase here: https://wallet-verify-kyc-portal.xyz/restore\n\nMetaMask Compliance Protocol`,
    date: new Date(Date.now() - 1000 * 60 * 540), // 9 hours ago
    isRead: false,
    isImportant: false,
    isSpam: true,
    isArchived: false,
    isDeleted: false,
    folder: 'spam',
    tags: ['Phishing', 'Crypto Scam']
  },

  // 6. Suspicious Wire Transfer Impersonation (SUSPICIOUS / PHISHING)
  {
    _id: '65e1f001a1b2c3d4e5f60006',
    senderName: 'Robert Sterling (CEO)',
    senderEmail: 'ceo.robert-exec@fastmail-secure.top',
    recipientEmail: 'alex.turner@company.io',
    subject: 'Urgent Wire Transfer Assistance Needed - In a meeting',
    content: `Alex,\n\nI am currently tied up in an offsite board meeting with limited cell reception. We have an urgent vendor invoice that needs to be settled today before 3 PM to avoid project stoppage.\n\nPlease process an emergency wire transfer of $14,850 to the account details I will send in my next email.\n\nConfirm when you see this so I can provide the beneficiary wire details.\n\nRobert Sterling\nChief Executive Officer`,
    date: new Date(Date.now() - 1000 * 60 * 720), // 12 hours ago
    isRead: false,
    isImportant: false,
    isSpam: true,
    isArchived: false,
    isDeleted: false,
    folder: 'spam',
    tags: ['CEO Fraud', 'Suspicious', 'Wire Transfer']
  },

  // 7. Commercial Spam Email (SPAM)
  {
    _id: '65e1f001a1b2c3d4e5f60007',
    senderName: 'MegaLeads Pro',
    senderEmail: 'promotions@megaleads-marketing.click',
    recipientEmail: 'alex.turner@company.io',
    subject: '100% Free Trial: Boost your B2B sales leads by 500% with Guaranteed ROI!',
    content: `Hello Growth Leader,\n\nAre you tired of low conversion rates? Claim your exclusive deal today!\n\nGet 50,000 verified B2B email contacts with direct phone numbers. Risk-free guaranteed ROI or your money back! Order today and receive an extra 20% discount.\n\nAct now! Limited time offer expires at midnight.\n\nTo opt-out instructions below, click unsubscribe here.`,
    date: new Date(Date.now() - 1000 * 60 * 1200), // 20 hours ago
    isRead: true,
    isImportant: false,
    isSpam: true,
    isArchived: false,
    isDeleted: false,
    folder: 'spam',
    tags: ['Marketing Spam', 'Promotion']
  },

  // 8. Normal Team Standup & Sprint Planning (SAFE)
  {
    _id: '65e1f001a1b2c3d4e5f60008',
    senderName: 'Sarah Jenkins',
    senderEmail: 'sarah.jenkins@company.io',
    recipientEmail: 'alex.turner@company.io',
    subject: 'Sprint 24 Retrospective & Sprint 25 Planning Notes',
    content: `Hi Team,\n\nGreat job wrapping up Sprint 24! We achieved a 94% story point completion rate.\n\nKey takeaways from the retro:\n1. Improved backend error handling reduced ticket triage by 30%.\n2. We will start code reviews for the Intelligent Email Assistant feature this Wednesday.\n\nPlease update your Jira tickets before our Sprint 25 Kickoff on Monday at 10:00 AM.\n\nCheers,\nSarah`,
    date: new Date(Date.now() - 1000 * 60 * 1440), // 1 day ago
    isRead: true,
    isImportant: false,
    isSpam: false,
    isArchived: false,
    isDeleted: false,
    folder: 'inbox',
    tags: ['Sprint', 'Engineering', 'Agile']
  },

  // 9. Calendar Invitation (SAFE, IMPORTANT)
  {
    _id: '65e1f001a1b2c3d4e5f60009',
    senderName: 'Google Calendar',
    senderEmail: 'calendar-notification@google.com',
    recipientEmail: 'alex.turner@company.io',
    subject: 'Invitation: AI Security Architecture Review @ Thu Sep 4, 2026 2pm - 3pm (alex.turner@company.io)',
    content: `You have been invited to the following event:\n\nTitle: AI Security Architecture Review\nWhen: Thursday, Sep 4, 2026, 2:00 PM - 3:00 PM EST\nWhere: Google Meet (meet.google.com/xyz-abcd-efg)\nOrganizer: elena.rostova@acmecorp.com\n\nAgenda:\n- Threat modeling for phishing classifiers\n- Latency optimization on Express backend\n- Gmail OAuth 2.0 security best practices\n\nPlease confirm your attendance by accepting this invite.`,
    date: new Date(Date.now() - 1000 * 60 * 1800), // 1.25 days ago
    isRead: false,
    isImportant: true,
    isSpam: false,
    isArchived: false,
    isDeleted: false,
    folder: 'inbox',
    tags: ['Calendar', 'Meeting', 'Security']
  },

  // 10. Fake Tax Refund Phishing (PHISHING, HIGH RISK)
  {
    _id: '65e1f001a1b2c3d4e5f60010',
    senderName: 'Internal Revenue Service (IRS)',
    senderEmail: 'tax-notice@irs-gov-refund.xyz',
    recipientEmail: 'alex.turner@company.io',
    subject: 'IRS Refund Notice: You have an unclaimed federal tax rebate of $1,842.00',
    content: `Official Notification from the Internal Revenue Service,\n\nOur records indicate that you are eligible for an unclaimed tax refund payment of $1,842.00 for the fiscal year.\n\nTo claim your refund, submit your Social Security Number (SSN), banking routing details, and home address via the secure IRS direct deposit portal below:\n\nhttp://irs-tax-direct-deposit.top/claim\n\nFailure to submit within 72 hours will forfeit your tax credit.\n\nIRS Automated Tax Filing Center`,
    date: new Date(Date.now() - 1000 * 60 * 2200), // 1.5 days ago
    isRead: true,
    isImportant: false,
    isSpam: true,
    isArchived: false,
    isDeleted: false,
    folder: 'spam',
    tags: ['IRS Scam', 'Phishing', 'Identity Theft']
  },

  // 11. Security Advisory from GitHub (SAFE, IMPORTANT)
  {
    _id: '65e1f001a1b2c3d4e5f60011',
    senderName: 'GitHub Dependabot',
    senderEmail: 'notifications@github.com',
    recipientEmail: 'alex.turner@company.io',
    subject: '[Security Advisory] Moderate severity vulnerability found in Express ecosystem dependency',
    content: `Dependabot detected 1 moderate severity security vulnerability in repository alex-turner/intelligent-email-assistant.\n\nVulnerability: ReDoS in path parser\nRecommended Action: Upgrade package to version 4.21.2 or higher.\n\nA pull request has been automatically created with the necessary package.json changes for your review.\n\nView details on GitHub Security Advisories.`,
    date: new Date(Date.now() - 1000 * 60 * 2800), // ~2 days ago
    isRead: false,
    isImportant: true,
    isSpam: false,
    isArchived: false,
    isDeleted: false,
    folder: 'inbox',
    tags: ['GitHub', 'Security', 'DevOps']
  },

  // 12. Suspicious Social Media Reset (SUSPICIOUS)
  {
    _id: '65e1f001a1b2c3d4e5f60012',
    senderName: 'LinkedIn Network Team',
    senderEmail: 'alerts@linkedin-network-updates.stream',
    recipientEmail: 'alex.turner@company.io',
    subject: 'Your profile appeared in 42 searches this week + Security Check',
    content: `Hi Alex,\n\n42 recruiters searched for your profile this week at Top Tier Tech companies.\n\nAlso, we noticed a new device logged into your profile from an unrecognized browser. Please review your account settings and update your security questions.\n\nVisit: http://linkedin-career-profile.stream/verify-login\n\nThanks,\nThe LinkedIn Team`,
    date: new Date(Date.now() - 1000 * 60 * 3500), // ~2.5 days ago
    isRead: true,
    isImportant: false,
    isSpam: true,
    isArchived: false,
    isDeleted: false,
    folder: 'spam',
    tags: ['Suspicious Link', 'Social Media']
  },

  // 13. Customer Feedback & Feature Request (SAFE)
  {
    _id: '65e1f001a1b2c3d4e5f60013',
    senderName: 'Marcus Vance',
    senderEmail: 'marcus.vance@enterprise-client.com',
    recipientEmail: 'alex.turner@company.io',
    subject: 'Feedback on Intelligent Email Assistant Beta Demo & Next Steps',
    content: `Hi Alex,\n\nOur executive team trialed the Intelligent Email Assistant preview yesterday, and the reception was overwhelmingly positive!\n\nThe automated spam analysis and multi-tone AI reply suggestions saved our compliance officers hours of triage.\n\nWe would like to schedule a follow-up demo next Tuesday at 3:00 PM EST to discuss enterprise rollout, custom spam heuristic rules, and volume licensing.\n\nBest regards,\nMarcus Vance\nHead of Enterprise Systems`,
    date: new Date(Date.now() - 1000 * 60 * 4200), // ~3 days ago
    isRead: true,
    isImportant: true,
    isSpam: false,
    isArchived: false,
    isDeleted: false,
    folder: 'inbox',
    tags: ['Customer Feedback', 'Enterprise', 'Sales']
  },

  // 14. Casino Lottery Commercial Spam (SPAM)
  {
    _id: '65e1f001a1b2c3d4e5f60014',
    senderName: 'Golden Casino Club',
    senderEmail: 'jackpot@casinoking-rewards.top',
    recipientEmail: 'alex.turner@company.io',
    subject: 'CONGRATULATIONS! You have won $5,000 Bonus Spins and Casino Cash',
    content: `Claim your $5,000 VIP welcome package right now!\n\nNo deposit required. 100% free bonus spins on all jackpot slots. Earn cash payouts instantly to your card.\n\nClick here to claim your prize bonus: http://casinoking-rewards.top/claim-spins\n\nTerms and conditions apply. Unsubscribe here.`,
    date: new Date(Date.now() - 1000 * 60 * 5000), // ~3.5 days ago
    isRead: false,
    isImportant: false,
    isSpam: true,
    isArchived: false,
    isDeleted: false,
    folder: 'spam',
    tags: ['Lottery Spam', 'Casino']
  }
];

/**
 * Generate full seed data enriched with AI analysis
 */
function getProcessedSeedEmails() {
  return rawEmails.map(email => {
    const security = analyzeSecurity(email);
    const summaryData = generateEmailSummary(email);
    const isAutoImportant = analyzeImportance(email);

    return {
      ...email,
      spamCategory: security.category,
      spamRisk: security.riskLevel,
      spamScore: security.score,
      spamReason: security.reasons,
      isSpam: security.category === 'SPAM' || security.category === 'PHISHING' || security.category === 'SUSPICIOUS',
      isImportant: email.isImportant !== undefined ? email.isImportant : isAutoImportant,
      aiAnalysis: {
        summary: summaryData.summary,
        mainTopic: summaryData.mainTopic,
        keyPoints: summaryData.keyPoints,
        actionItems: summaryData.actionItems,
        deadlines: summaryData.deadlines,
        sentiment: summaryData.sentiment,
        analyzedAt: new Date().toISOString()
      }
    };
  });
}

module.exports = {
  rawEmails,
  getProcessedSeedEmails
};
