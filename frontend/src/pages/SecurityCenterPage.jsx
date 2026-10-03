import React, { useState } from 'react';
import { useEmailContext } from '../context/EmailContext';
import { api } from '../services/api';
import { Badge } from '../components/common/Badge';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Flame, 
  AlertTriangle, 
  Search, 
  Sparkles, 
  Lock, 
  FileText,
  RotateCw,
  CheckCircle2,
  XCircle,
  ExternalLink
} from 'lucide-react';

export const SecurityCenterPage = () => {
  const { stats, emails, addToast } = useEmailContext();

  const [sandboxSubject, setSandboxSubject] = useState('');
  const [sandboxSender, setSandboxSender] = useState('');
  const [sandboxContent, setSandboxContent] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleScanSandbox = async (e) => {
    e.preventDefault();
    if (!sandboxContent.trim()) {
      addToast('Please paste email text into the sandbox to scan', 'warning');
      return;
    }

    setIsScanning(true);
    try {
      const res = await api.scanDraft({
        subject: sandboxSubject || 'Sandbox Inspection',
        content: sandboxContent,
        senderEmail: sandboxSender || 'test@external.com'
      });

      if (res && res.success) {
        setScanResult(res.data);
        addToast('🛡️ Deep security heuristic scan completed!', 'success');
      }
    } catch (err) {
      addToast('Scan error: ' + err.message, 'error');
    } finally {
      setIsScanning(false);
    }
  };

  const loadPhishingSample = () => {
    setSandboxSender('security-update@paypal-support-verify92.com');
    setSandboxSubject('URGENT: Your PayPal Account Has Been Suspended');
    setSandboxContent('Dear Customer,\n\nWe detected suspicious activity on your account. Your access will be permanently terminated within 24 hours unless you verify your identity immediately.\n\nClick here to confirm password and credit card numbers: http://paypal-secure-login-phish.biz/verify');
    setScanResult(null);
  };

  const loadSafeSample = () => {
    setSandboxSender('sarah.jenkins@designcraft.io');
    setSandboxSubject('Q3 Brand Design System Review');
    setSandboxContent('Hi Alex,\n\nI have updated the design tokens in Figma. Please review the color contrast ratios and typography scale when you get a chance.\n\nBest,\nSarah');
    setScanResult(null);
  };

  const phishingEmails = emails.filter(e => e.spamCategory === 'PHISHING' || e.spamCategory === 'SUSPICIOUS');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Page Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f43f5e, #ef4444)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 0 15px rgba(244, 63, 94, 0.4)'
            }}>
              <ShieldAlert size={22} />
            </div>
            <h1>Threat & Phishing Defense Sandbox</h1>
          </div>
          <p>Multi-layered heuristic analysis for spoofing, deceptive links, urgency triggers, and credential harvesting.</p>
        </div>
      </div>

      {/* Threat Summary Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-title">Phishing Intercepted</span>
          <div className="stat-value" style={{ color: '#f43f5e' }}>{stats.phishing || 0}</div>
          <span className="stat-footer">High-risk credential attacks</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Suspicious Inbound</span>
          <div className="stat-value" style={{ color: '#f59e0b' }}>{stats.suspicious || 0}</div>
          <span className="stat-footer">Flagged for manual review</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Spam Broadcasts</span>
          <div className="stat-value" style={{ color: '#ec4899' }}>{stats.spam || 0}</div>
          <span className="stat-footer">Isolated promotional junk</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Safe Mail Index</span>
          <div className="stat-value" style={{ color: '#10b981' }}>{stats.safe || 0}</div>
          <span className="stat-footer">Clean verified senders</span>
        </div>
      </div>

      {/* Live Sandbox Interactive Analyzer */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--accent-secondary)" />
            <h3 style={{ fontSize: '1.15rem' }}>Live Heuristic Email Scanner</h3>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={loadPhishingSample}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              ⚠️ Load Phishing Test Case
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={loadSafeSample}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              ✅ Load Safe Test Case
            </button>
          </div>
        </div>

        <form onSubmit={handleScanSandbox} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Sender Address</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. security-alert@suspicious-domain.com"
                value={sandboxSender}
                onChange={(e) => setSandboxSender(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Subject Line</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Action Required: Account Termination Notice"
                value={sandboxSubject}
                onChange={(e) => setSandboxSubject(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Raw Email Body / Header Text</label>
            <textarea 
              className="form-textarea"
              rows={5}
              placeholder="Paste raw email content, headers, or suspicious text here for real-time AI security audit..."
              value={sandboxContent}
              onChange={(e) => setSandboxContent(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isScanning}
              style={{ padding: '10px 24px' }}
            >
              {isScanning ? <RotateCw size={16} className="spin-animation" /> : <ShieldCheck size={16} />}
              <span>{isScanning ? 'Analyzing Heuristics...' : 'Run Security Scan'}</span>
            </button>
          </div>
        </form>

        {/* Scan Results Display */}
        {scanResult && (
          <div style={{
            marginTop: '24px',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            background: scanResult.security.category === 'SAFE' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
            border: `1px solid ${scanResult.security.category === 'SAFE' ? 'var(--status-safe-border)' : 'var(--status-danger-border)'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Badge 
                  type={scanResult.security.category} 
                  text={scanResult.security.category} 
                  score={scanResult.security.score} 
                />
                <strong style={{ fontSize: '1rem' }}>
                  Risk Classification: {scanResult.security.riskLevel}
                </strong>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Threat Score: <strong>{scanResult.security.score}/100</strong>
              </span>
            </div>

            {/* Reasons */}
            <div>
              <h4 style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Detected Attack Vectors & Red Flags:
              </h4>
              <ul className="ai-bullet-list">
                {scanResult.security.reasons.map((r, idx) => (
                  <li key={idx} className="ai-bullet-item" style={{ color: scanResult.security.category === 'SAFE' ? 'var(--status-safe)' : '#fca5a5' }}>
                    {scanResult.security.category === 'SAFE' ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Summary */}
            <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
              <strong>Topic & Sentiment:</strong> {scanResult.summary.mainTopic} ({scanResult.summary.sentiment})
            </div>
          </div>
        )}
      </div>

      {/* Intercepted Threats Table */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>Current Isolated Threats in Mailbox</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {phishingEmails.map(email => (
            <div 
              key={email._id || email.id}
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(244, 63, 94, 0.05)',
                border: '1px solid rgba(244, 63, 94, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Flame size={18} color="#f43f5e" />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-bright)' }}>
                    {email.subject}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    From: {email.senderName} &lt;{email.senderEmail}&gt;
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Badge type={email.spamCategory} text={email.spamCategory} />
                <span style={{ fontSize: '0.78rem', color: '#f87171', fontWeight: 700 }}>
                  Score: {email.spamScore || 90}/100
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
