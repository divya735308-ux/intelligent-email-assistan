import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmailContext } from '../context/EmailContext';
import { EmailSecurityCard } from '../components/email/EmailSecurityCard';
import { AIAnalysisPanel } from '../components/email/AIAnalysisPanel';
import { AISmartReply } from '../components/email/AISmartReply';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Badge } from '../components/common/Badge';
import { 
  ArrowLeft, 
  Star, 
  Archive, 
  Trash2, 
  Mail, 
  MailOpen, 
  Calendar, 
  User, 
  ShieldAlert, 
  Sparkles,
  Share2
} from 'lucide-react';

export const EmailDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    currentEmail, 
    setCurrentEmail, 
    loadEmailById, 
    toggleReadStatus, 
    toggleImportantStatus, 
    toggleArchiveStatus, 
    deleteEmailById,
    loading 
  } = useEmailContext();

  const [email, setEmail] = useState(null);

  useEffect(() => {
    if (id) {
      loadEmailById(id).then(data => {
        if (data) setEmail(data);
      });
    }
  }, [id, loadEmailById]);

  if (loading && !email) {
    return <LoadingSpinner text="Decrypting & running deep AI analysis..." />;
  }

  if (!email) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h3 style={{ marginBottom: '10px' }}>Email not found</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>The requested email could not be retrieved.</p>
        <button className="btn btn-secondary" onClick={() => navigate('/inbox')}>
          <ArrowLeft size={16} />
          <span>Back to Inbox</span>
        </button>
      </div>
    );
  }

  const formattedDate = new Date(email.date || email.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedTime = new Date(email.date || email.createdAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this email?')) {
      await deleteEmailById(email._id || email.id);
      navigate('/inbox');
    }
  };

  const handleArchive = async () => {
    await toggleArchiveStatus(email._id || email.id, email.isArchived);
    navigate('/inbox');
  };

  return (
    <div>
      {/* Top Action Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
          style={{ gap: '6px' }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => toggleImportantStatus(email._id || email.id, email.isImportant)}
            title="Toggle Star Status"
          >
            <Star 
              size={16} 
              color={email.isImportant ? '#eab308' : 'var(--text-secondary)'} 
              fill={email.isImportant ? '#eab308' : 'none'} 
            />
            <span>{email.isImportant ? 'Starred' : 'Star'}</span>
          </button>

          <button 
            className="btn btn-secondary"
            onClick={() => toggleReadStatus(email._id || email.id, email.isRead)}
            title="Mark as Unread"
          >
            <Mail size={16} />
            <span>Mark Unread</span>
          </button>

          <button 
            className="btn btn-secondary"
            onClick={handleArchive}
            title={email.isArchived ? 'Unarchive' : 'Archive'}
          >
            <Archive size={16} />
            <span>{email.isArchived ? 'To Inbox' : 'Archive'}</span>
          </button>

          <button 
            className="btn btn-danger"
            onClick={handleDelete}
            title="Delete Email"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Two-Column Grid: Left Content + Right AI Panels */}
      <div className="email-detail-container">
        {/* Left Column: Full Email Content */}
        <div className="email-main-card">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Badge type={email.spamCategory} text={email.spamCategory} />
              {email.isImportant && <Badge type="IMPORTANT" text="Important" />}
              {email.folder && (
                <span className="sidebar-badge" style={{ textTransform: 'capitalize' }}>
                  {email.folder}
                </span>
              )}
            </div>

            <h1 className="email-detail-subject">{email.subject}</h1>

            <div className="email-sender-detail-card">
              <div className="sender-meta">
                <div 
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: 'white',
                    fontSize: '1.1rem'
                  }}
                >
                  {(email.senderName || 'U').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-bright)' }}>{email.senderName}</strong>
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>&lt;{email.senderEmail}&gt;</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    To: {email.recipientEmail || 'user@example.com'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <Calendar size={14} />
                <span>{formattedDate} at {formattedTime}</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="email-body-content">
            {email.content}
          </div>

          {/* Tags */}
          {email.tags && email.tags.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>AI Tags:</span>
              {email.tags.map((tag, idx) => (
                <span key={idx} className="filter-tab" style={{ fontSize: '0.75rem', padding: '3px 8px' }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Smart Reply Component in Bottom of Main Card */}
          <AISmartReply email={email} onReplySent={() => {}} />
        </div>

        {/* Right Column: AI Security Shield & AI Executive Intelligence Panel */}
        <div className="ai-panel-column">
          <EmailSecurityCard email={email} />
          <AIAnalysisPanel 
            email={email} 
            onAnalysisUpdated={(newAnalysis) => {
              setEmail(prev => ({ ...prev, aiAnalysis: newAnalysis }));
            }} 
          />
        </div>
      </div>
    </div>
  );
};
