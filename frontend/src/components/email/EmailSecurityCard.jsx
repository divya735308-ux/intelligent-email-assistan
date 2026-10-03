import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  Lock,
  EyeOff
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const EmailSecurityCard = ({ email }) => {
  if (!email) return null;

  const category = (email.spamCategory || 'SAFE').toUpperCase();
  const risk = email.spamRisk || 'Low Risk';
  const score = email.spamScore !== undefined ? email.spamScore : (category === 'SAFE' ? 10 : 85);
  const reasons = email.spamReason || [];

  const isPhishing = category === 'PHISHING';
  const isSpam = category === 'SPAM';
  const isSuspicious = category === 'SUSPICIOUS';
  const isSafe = category === 'SAFE';

  // Determine threat color scheme
  const getThemeColors = () => {
    if (isPhishing) return { border: '#f43f5e', bg: 'rgba(244, 63, 94, 0.08)', text: '#fb7185' };
    if (isSuspicious || isSpam) return { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)', text: '#fbbf24' };
    return { border: '#10b981', bg: 'rgba(16, 185, 129, 0.08)', text: '#34d399' };
  };

  const colors = getThemeColors();

  return (
    <div 
      className="ai-card shield-card"
      style={{
        borderColor: colors.border,
        background: `linear-gradient(180deg, ${colors.bg} 0%, var(--bg-card) 100%)`
      }}
    >
      {/* Header */}
      <div className="ai-card-header">
        <div className="ai-card-title">
          {isSafe ? <ShieldCheck size={20} color="#10b981" /> : <ShieldAlert size={20} color={colors.text} />}
          <span>Security & Phishing Shield</span>
        </div>
        <Badge type={category} text={category} score={score} />
      </div>

      {/* Threat Gauge Meter */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Threat Vulnerability Score:</span>
          <span style={{ fontWeight: 700, color: colors.text }}>
            {score}/100 — {risk}
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${Math.min(100, Math.max(5, score))}%`,
            height: '100%',
            background: isSafe 
              ? 'linear-gradient(90deg, #10b981, #059669)' 
              : 'linear-gradient(90deg, #f59e0b, #ef4444)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.5s ease-out'
          }} />
        </div>
      </div>

      {/* Security Analysis Breakdown */}
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
          Detection Signals
        </h4>

        {reasons.length > 0 ? (
          <ul className="ai-bullet-list">
            {reasons.map((reason, idx) => (
              <li key={idx} className="ai-bullet-item" style={{ color: colors.text }}>
                <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--status-safe)' }}>
            <CheckCircle2 size={16} />
            <span>Clean Sender Reputation — No malicious links or deceptive cues detected.</span>
          </div>
        )}
      </div>

      {/* Defensive Recommendation */}
      <div style={{
        padding: '12px 14px',
        background: 'rgba(0, 0, 0, 0.25)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        fontSize: '0.82rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px'
      }}>
        <Lock size={16} style={{ color: 'var(--accent-secondary)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ color: 'var(--text-bright)' }}>AI Safety Advice: </strong>
          {isPhishing ? (
            <span style={{ color: '#fecaca' }}>
              CRITICAL: Do not click any links or enter credentials. This email mimics an official entity to harvest login info.
            </span>
          ) : isSpam ? (
            <span style={{ color: '#fde68a' }}>
              Promotional mass broadcast. Avoid unsubscribing through unverified external links.
            </span>
          ) : (
            <span style={{ color: 'var(--text-secondary)' }}>
              Verified authentic sender. Safe to reply and open shared attachments.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
