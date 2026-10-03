/**
 * API Service for Intelligent Email Assistant
 * Handles communication with the Node.js / Express backend
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Helper to handle fetch responses and error reporting
 */
async function handleResponse(response) {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const error = (data && data.message) || response.statusText || 'An error occurred';
    throw new Error(error);
  }

  return data;
}

export const api = {
  // --- Email Endpoints ---

  /**
   * Get list of emails with optional filters
   * @param {Object} params - { folder, isRead, isImportant, isSpam, spamCategory }
   */
  async getEmails(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}/emails${queryString}`);
    return handleResponse(res);
  },

  /**
   * Get single email by ID (marks as read automatically)
   * @param {string} id 
   */
  async getEmailById(id) {
    const res = await fetch(`${API_BASE}/emails/${id}`);
    return handleResponse(res);
  },

  /**
   * Create a new email (with automated AI analysis)
   * @param {Object} emailData - { senderName, senderEmail, recipientEmail, subject, content, folder }
   */
  async createEmail(emailData) {
    const res = await fetch(`${API_BASE}/emails`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData),
    });
    return handleResponse(res);
  },

  /**
   * Update email properties (isRead, isImportant, isArchived, folder, etc.)
   * @param {string} id 
   * @param {Object} updates 
   */
  async updateEmail(id, updates) {
    const res = await fetch(`${API_BASE}/emails/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse(res);
  },

  /**
   * Delete email by ID
   * @param {string} id 
   */
  async deleteEmail(id) {
    const res = await fetch(`${API_BASE}/emails/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  /**
   * Search emails by keyword across sender, subject, body, tags
   * @param {string} query 
   */
  async searchEmails(query) {
    const res = await fetch(`${API_BASE}/emails/search?q=${encodeURIComponent(query || '')}`);
    return handleResponse(res);
  },

  /**
   * Get dashboard statistics
   */
  async getStats() {
    const res = await fetch(`${API_BASE}/emails/stats`);
    return handleResponse(res);
  },

  /**
   * Reset backend demo data to 14 sample emails
   */
  async resetDemoData() {
    const res = await fetch(`${API_BASE}/emails/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(res);
  },

  // --- AI Specific Endpoints ---

  /**
   * Request AI analysis for an existing email or custom payload
   * @param {string} id 
   * @param {Object} customPayload 
   */
  async analyzeEmail(id, customPayload = null) {
    const endpoint = id && id !== 'custom' 
      ? `${API_BASE}/emails/${id}/analyze` 
      : `${API_BASE}/ai/analyze`;
      
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: customPayload ? JSON.stringify(customPayload) : JSON.stringify({}),
    });
    return handleResponse(res);
  },

  /**
   * Generate multi-tone AI smart reply
   * @param {string} id 
   * @param {string} tone - 'Professional' | 'Friendly' | 'Formal' | 'Concise' | 'Urgent'
   * @param {string} instruction - optional user instructions
   */
  async generateReply(id, tone = 'Professional', instruction = '') {
    const endpoint = id && id !== 'custom' 
      ? `${API_BASE}/emails/${id}/generate-reply` 
      : `${API_BASE}/ai/generate-reply`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tone, instruction }),
    });
    return handleResponse(res);
  },

  /**
   * Live Security & AI tone scanner for draft emails
   * @param {Object} draft - { subject, content, senderEmail, recipientEmail }
   */
  async scanDraft(draft) {
    const res = await fetch(`${API_BASE}/ai/scan-draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });
    return handleResponse(res);
  },

  /**
   * Health Check
   */
  async checkHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  }
};
