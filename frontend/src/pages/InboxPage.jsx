import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useEmailContext } from '../context/EmailContext';
import { EmailList } from '../components/email/EmailList';

export const InboxPage = ({ folderType = 'inbox' }) => {
  const { emails, loadEmails, searchQuery, setActiveFolder } = useEmailContext();
  const location = useLocation();

  useEffect(() => {
    setActiveFolder(folderType);
    loadEmails(folderType, searchQuery);
  }, [folderType, location.pathname]);

  const getPageMeta = () => {
    switch (folderType) {
      case 'important':
        return {
          title: 'Important & Starred Messages',
          subtitle: 'Emails flagged as high priority by AI sentiment and urgency analysis'
        };
      case 'spam':
        return {
          title: 'Spam & Threat Interception',
          subtitle: 'Suspicious emails, phishing attacks, and fraudulent senders isolated by Aegis Shield'
        };
      case 'archive':
        return {
          title: 'Archived Messages',
          subtitle: 'Saved messages kept for reference'
        };
      case 'all':
        return {
          title: 'All Mailbox Messages',
          subtitle: 'Complete list of all received and analyzed emails'
        };
      default:
        return {
          title: 'Inbox',
          subtitle: 'Organized and AI-analyzed primary communication feed'
        };
    }
  };

  const { title, subtitle } = getPageMeta();

  return (
    <div>
      <EmailList 
        emails={emails} 
        title={searchQuery ? `Search Results for "${searchQuery}"` : title} 
        subtitle={subtitle}
      />
    </div>
  );
};
