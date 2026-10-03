import React, { useState } from 'react';
import { useEmailContext } from '../../context/EmailContext';
import { api } from '../../services/api';
import { 
  X, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Wand2, 
  Trash2,
  RefreshCw
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const EmailComposeModal = () => {
  const { isComposeOpen, setIsComposeOpen, sendEmail, addToast } = useEmailContext();

  const [to, setTo] = useState('team@enterprise.com');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [senderName, setSenderName] = useState('Alex Rivera');
  const [senderEmail, setSenderEmail] = useState('alex.rivera@innovatech.io');
  
  // AI Draft Generator State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  if (!isComposeOpen) return null;

  // AI Draft Generator Handler
  const handleGenerateAiDraft = async (presetPrompt = null) => {
    const promptToUse = presetPrompt || aiPrompt;
    if (!promptToUse.trim()) {
      addToast('Please enter an AI prompt or select a template', 'warning');
      return;
    }

    setIsAiGenerating(true);
    try {
      // Use AI smart reply engine with custom instructions
      const res = await api.generateReply('custom', 'Professional', `Generate complete email based on this requirement: ${promptToUse}`);
      if (res && res.success) {
        setContent(res.data.reply);
        if (!subject) {
          setSubject(promptToUse.length > 40 ? promptToUse.substring(0, 40) + '...' : promptToUse);
        }
        addToast('✨ AI generated your email draft successfully!', 'success');
        setIsAiDrawerOpen(false);
      }
    } catch (err) {
      addToast('AI generation error: ' + err.message, 'error');
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Real-time Threat & Tone Scanner
  const handleScanDraft = async () => {
    if (!content.trim()) {
      addToast('Please write some content before scanning', 'warning');
      return;
    }

    setIsScanning(true);
    try {
      const res = await api.scanDraft({
        subject: subject || 'Draft Subject',
        content,
        senderEmail,
        recipientEmail: to
      });
      if (res && res.success) {
        setScanResult(res.data);
        addToast('🛡️ Draft security and tone scan complete', 'info');
      }
    } catch (err) {
      addToast('Scan error: ' + err.message, 'error');
    } finally {
      setIsScanning(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) {
      addToast('Please provide both subject and message content', 'warning');
      return;
    }

    try {
      await sendEmail({
        senderName: senderName || 'User',
        senderEmail: senderEmail || 'user@example.com',
        recipientEmail: to || 'recipient@example.com',
        subject: subject.trim(),
        content: content.trim(),
        folder: 'inbox'
      });
      setIsComposeOpen(false);
    } catch (err) {
      // Error handled in context
    }
  };

  const sampleTemplates = [
    { label: 'Follow Up on Proposal', prompt: 'Write a polite follow-up email asking if they had a chance to review our project proposal sent last week.' },
    { label: 'Meeting Request', prompt: 'Request a 30-minute sync meeting next Tuesday to discuss Q3 roadmap milestones.' },
    { label: 'Project Update', prompt: 'Provide a concise project status update: Phase 1 complete, API integrated, testing underway.' },
    { label: 'Contract Inquiry', prompt: 'Inquire about the contract signature status and request the final countersigned PDF.' }
  ];

  return (
    <div className="modal-backdrop" onClick={() => setIsComposeOpen(false)}>
      <div className="compose-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Sparkles size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Smart Email Composer</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI-Assisted Writing & Security Shield</span>
            </div>
          </div>
          <button 
            className="btn-ghost btn-icon-only" 
            onClick={() => setIsComposeOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* AI Prompt Drawer / Helper */}
        <div style={{
          padding: '14px 24px',
          background: 'rgba(99, 102, 241, 0.08)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-secondary)' }}>
              <Wand2 size={16} />
              <span>AI Writing Assistant</span>
            </div>
            <button 
              type="button" 
              className="btn btn-ghost" 
              style={{ fontSize: '0.78rem', padding: '4px 8px' }}
              onClick={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
            >
              {isAiDrawerOpen ? 'Hide Presets ▲' : 'Show AI Presets ▼'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Write a friendly invitation to our product demo on Thursday at 2 PM..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleGenerateAiDraft();
                }
              }}
              style={{ flex: 1 }}
            />
            <button 
              type="button" 
              className="btn btn-ai"
              disabled={isAiGenerating}
              onClick={() => handleGenerateAiDraft()}
              style={{ whiteSpace: 'nowrap' }}
            >
              {isAiGenerating ? <RefreshCw size={14} className="spin-animation" /> : <Sparkles size={14} />}
              <span>Draft for Me</span>
            </button>
          </div>

          {isAiDrawerOpen && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', paddingTop: '4px' }}>
              {sampleTemplates.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="filter-tab"
                  onClick={() => {
                    setAiPrompt(t.prompt);
                    handleGenerateAiDraft(t.prompt);
                  }}
                  style={{ fontSize: '0.75rem' }}
                >
                  ⚡ {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} id="composeForm">
          <div className="modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>From (Sender Name & Email)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={senderName} 
                    onChange={(e) => setSenderName(e.target.value)} 
                    placeholder="Your Name"
                    required 
                  />
                  <input 
                    type="email" 
                    className="form-input" 
                    value={senderEmail} 
                    onChange={(e) => setSenderEmail(e.target.value)} 
                    placeholder="your@email.com"
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>To (Recipient Email)</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={to} 
                  onChange={(e) => setTo(e.target.value)} 
                  placeholder="recipient@example.com"
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input 
                type="text" 
                className="form-input" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                placeholder="Enter subject line..."
                required 
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Message Content</label>
                <button 
                  type="button" 
                  className="btn btn-ghost" 
                  onClick={handleScanDraft}
                  disabled={isScanning || !content}
                  style={{ fontSize: '0.78rem', color: 'var(--accent-secondary)', padding: '2px 8px' }}
                >
                  <ShieldCheck size={14} />
                  <span>{isScanning ? 'Scanning...' : 'Security Scan'}</span>
                </button>
              </div>
              <textarea 
                className="form-textarea" 
                rows="8"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your email message or use AI Writing Assistant to generate a polished draft..."
                required
              />
            </div>

            {/* Scan Results Preview if active */}
            {scanResult && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: scanResult.security.category === 'SAFE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${scanResult.security.category === 'SAFE' ? 'var(--status-safe-border)' : 'var(--status-danger-border)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.82rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Badge type={scanResult.security.category} text={scanResult.security.category} />
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Risk Level: <strong>{scanResult.security.riskLevel}</strong> (Threat Score: {scanResult.security.score}/100)
                  </span>
                </div>
                <span style={{ color: 'var(--text-muted)' }}>
                  Sentiment: {scanResult.summary.sentiment}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-ghost" 
              onClick={() => {
                setSubject('');
                setContent('');
                setScanResult(null);
              }}
            >
              <Trash2 size={16} />
              <span>Clear</span>
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setIsComposeOpen(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ padding: '9px 22px' }}
              >
                <Send size={16} />
                <span>Send & Analyze</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
