import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  RotateCw, 
  Sliders,
  CheckCircle2,
  Briefcase,
  Smile,
  Zap,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { api } from '../../services/api';
import { useEmailContext } from '../../context/EmailContext';

export const AISmartReply = ({ email, onReplySent }) => {
  const { addToast } = useEmailContext();
  const [selectedTone, setSelectedTone] = useState('Professional');
  const [customInstruction, setCustomInstruction] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const tones = [
    { id: 'Professional', label: '💼 Professional', icon: Briefcase },
    { id: 'Friendly', label: '😊 Friendly', icon: Smile },
    { id: 'Formal', label: '🎩 Formal', icon: Sliders },
    { id: 'Concise', label: '⚡ Concise', icon: Zap },
    { id: 'Urgent', label: '🚨 Urgent', icon: Clock }
  ];

  // Auto-generate initial professional reply when email loads
  useEffect(() => {
    if (email && !generatedReply) {
      handleGenerateReply('Professional', '');
    }
  }, [email]);

  const handleGenerateReply = async (tone = selectedTone, instruction = customInstruction) => {
    if (!email) return;

    const id = email._id || email.id;
    setIsGenerating(true);
    try {
      const res = await api.generateReply(id, tone, instruction);
      if (res && res.success) {
        setGeneratedReply(res.data.reply);
        setSelectedTone(tone);
      }
    } catch (err) {
      addToast('Failed to generate AI reply: ' + err.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedReply) return;
    navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    addToast('📋 Copied AI reply to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendSimulatedReply = () => {
    if (!generatedReply.trim()) {
      addToast('Please generate or write a reply message', 'warning');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      addToast('🚀 Reply sent to ' + email.senderEmail + ' successfully!', 'success');
      if (onReplySent) onReplySent(generatedReply);
    }, 800);
  };

  return (
    <div className="ai-card" style={{ marginTop: '20px' }}>
      {/* Header */}
      <div className="ai-card-header">
        <div className="ai-card-title">
          <Bot size={20} color="var(--accent-secondary)" />
          <span>AI Smart Reply Studio</span>
        </div>
        <button 
          type="button" 
          className="btn btn-ai"
          style={{ fontSize: '0.8rem', padding: '5px 12px' }}
          onClick={() => handleGenerateReply(selectedTone, customInstruction)}
          disabled={isGenerating}
        >
          {isGenerating ? <RotateCw size={13} className="spin-animation" /> : <Sparkles size={13} />}
          <span>{isGenerating ? 'Drafting...' : 'Regenerate'}</span>
        </button>
      </div>

      {/* Tone Selector Pills */}
      <div>
        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Select Response Persona & Tone:
        </label>
        <div className="tone-selector-group">
          {tones.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`tone-pill ${selectedTone === t.id ? 'active' : ''}`}
              onClick={() => handleGenerateReply(t.id, customInstruction)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Instruction Input */}
      <div style={{ marginTop: '10px' }}>
        <input 
          type="text" 
          className="form-input" 
          placeholder="Custom guidance (e.g. 'Decline politely', 'Ask for budget estimate')..."
          value={customInstruction}
          onChange={(e) => setCustomInstruction(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleGenerateReply(selectedTone, customInstruction);
            }
          }}
          style={{ fontSize: '0.84rem', padding: '8px 12px' }}
        />
      </div>

      {/* Editable Reply Body */}
      <div style={{ position: 'relative' }}>
        <textarea
          className="reply-textarea"
          value={generatedReply}
          onChange={(e) => setGeneratedReply(e.target.value)}
          placeholder="Generated AI response will appear here..."
          rows={6}
        />
        {isGenerating && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(11, 15, 25, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--accent-secondary)'
          }}>
            <RotateCw size={18} className="spin-animation" />
            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Crafting response in {selectedTone} tone...</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '14px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Word count: {generatedReply ? generatedReply.split(/\s+/).filter(Boolean).length : 0} words
        </span>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={handleCopy}
            disabled={!generatedReply}
            style={{ fontSize: '0.84rem' }}
          >
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button 
            type="button" 
            className="btn btn-primary"
            onClick={handleSendSimulatedReply}
            disabled={!generatedReply || isSending}
            style={{ fontSize: '0.84rem' }}
          >
            <Send size={14} />
            <span>{isSending ? 'Sending...' : 'Send AI Reply'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
