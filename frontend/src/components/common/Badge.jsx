import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Flame, Star, Sparkles } from 'lucide-react';

export const Badge = ({ type, text, score, className = '' }) => {
  const normType = (type || '').toUpperCase();

  if (normType === 'SAFE') {
    return (
      <span className={`badge badge-safe ${className}`}>
        <ShieldCheck size={13} />
        {text || 'Safe'}
        {score !== undefined && ` (${score}%)`}
      </span>
    );
  }

  if (normType === 'PHISHING') {
    return (
      <span className={`badge badge-phishing ${className}`}>
        <Flame size={13} />
        {text || 'Phishing Attack'}
        {score !== undefined && ` (${score}%)`}
      </span>
    );
  }

  if (normType === 'SPAM') {
    return (
      <span className={`badge badge-spam ${className}`}>
        <ShieldAlert size={13} />
        {text || 'Spam'}
      </span>
    );
  }

  if (normType === 'SUSPICIOUS') {
    return (
      <span className={`badge badge-suspicious ${className}`}>
        <AlertTriangle size={13} />
        {text || 'Suspicious'}
      </span>
    );
  }

  if (normType === 'IMPORTANT') {
    return (
      <span className={`badge badge-important ${className}`}>
        <Star size={12} fill="#eab308" />
        {text || 'Important'}
      </span>
    );
  }

  if (normType === 'AI') {
    return (
      <span className={`badge badge-ai ${className}`}>
        <Sparkles size={12} />
        {text || 'AI Analyzed'}
      </span>
    );
  }

  return (
    <span className={`badge ${className}`}>
      {text || type}
    </span>
  );
};
