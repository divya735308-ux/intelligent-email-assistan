import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmailContext } from '../../context/EmailContext';
import { 
  Star, 
  Trash2, 
  Archive, 
  Mail, 
  MailOpen, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const EmailCard = ({ email }) => {
  const navigate = useNavigate();
  const { toggleReadStatus, toggleImportantStatus, toggleArchiveStatus, deleteEmailById } = useEmailContext();

  const id = email._id || email.id;

  // Format date / time
  const formattedDate = new Date(email.date || email.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  const formattedTime = new Date(email.date || email.createdAt || Date.now()).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Generate background color for avatar from sender name
  const getAvatarGradient = (name = 'User') => {
    const colors = [
      'linear-gradient(135deg, #6366f1, #a855f7)',
      'linear-gradient(135deg, #06b6d4, #3b82f6)',
      'linear-gradient(135deg, #ec4899, #f43f5e)',
      'linear-gradient(135deg, #10b981, #059669)',
      'linear-gradient(135deg, #f59e0b, #d97706)',
      'linear-gradient(135deg, #8b5cf6, #6366f1)'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const initials = (email.senderName || 'U')
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleCardClick = (e) => {
    // If user clicked an action button, don't open email
    if (e.target.closest('button')) return;
    navigate(`/email/${id}`);
  };

  return (
    <div 
      className={`email-item ${!email.isRead ? 'unread' : ''}`}
      onClick={handleCardClick}
    >
      {/* Unread indicator */}
      {!email.isRead ? <div className="unread-dot" title="Unread" /> : <div style={{ width: '8px' }} />}

      {/* Star button */}
      <button 
        type="button" 
        className="btn-ghost btn-icon-only"
        style={{ width: '32px', height: '32px' }}
        onClick={(e) => {
          e.stopPropagation();
          toggleImportantStatus(id, email.isImportant);
        }}
        title={email.isImportant ? 'Unstar' : 'Star as important'}
      >
        <Star 
          size={18} 
          color={email.isImportant ? '#eab308' : 'var(--text-muted)'} 
          fill={email.isImportant ? '#eab308' : 'none'} 
        />
      </button>

      {/* Sender Avatar */}
      <div 
        className="email-sender-avatar"
        style={{ background: getAvatarGradient(email.senderName) }}
      >
        {initials}
      </div>

      {/* Main Email Content Preview */}
      <div className="email-content-preview">
        <div className="email-row-top">
          <div className="email-sender-info">
            <span className="email-sender">{email.senderName}</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              &lt;{email.senderEmail}&gt;
            </span>

            {/* Badges */}
            {email.spamCategory && email.spamCategory !== 'SAFE' ? (
              <Badge type={email.spamCategory} text={email.spamCategory} />
            ) : email.spamCategory === 'SAFE' ? (
              <Badge type="SAFE" text="Safe" />
            ) : null}

            {email.aiAnalysis?.summary && (
              <span style={{ 
                fontSize: '0.72rem', 
                color: 'var(--accent-secondary)', 
                background: 'rgba(6, 182, 212, 0.1)', 
                padding: '2px 6px', 
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}>
                <Sparkles size={10} /> AI Analyzed
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="email-time">{formattedDate}, {formattedTime}</span>
            
            {/* Action Buttons on Hover */}
            <div className="email-actions-hover">
              <button 
                type="button" 
                className="btn-ghost btn-icon-only" 
                style={{ width: '28px', height: '28px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleReadStatus(id, email.isRead);
                }}
                title={email.isRead ? 'Mark as unread' : 'Mark as read'}
              >
                {email.isRead ? <Mail size={15} /> : <MailOpen size={15} />}
              </button>

              <button 
                type="button" 
                className="btn-ghost btn-icon-only" 
                style={{ width: '28px', height: '28px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleArchiveStatus(id, email.isArchived);
                }}
                title={email.isArchived ? 'Move to Inbox' : 'Archive'}
              >
                <Archive size={15} />
              </button>

              <button 
                type="button" 
                className="btn-ghost btn-icon-only" 
                style={{ width: '28px', height: '28px', color: 'var(--status-danger)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteEmailById(id);
                }}
                title="Delete Email"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>

        <div className="email-row-bottom">
          <span className="email-subject">{email.subject}</span>
          <span style={{ color: 'var(--text-muted)' }}>—</span>
          <span className="email-snippet">{email.content}</span>
        </div>
      </div>
    </div>
  );
};
